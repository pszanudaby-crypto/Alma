import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import {
  clearSessionCookie,
  optionalAuth,
  requireAdmin,
  requireAuth,
  serializeUser,
  setSessionCookie,
  signSession,
} from './auth.js';
import { pool, query, transaction } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const mediaDir = process.env.MEDIA_DIR || (process.env.NODE_ENV === 'production' ? '/data/uploads' : path.join(rootDir, 'server', 'uploads'));
const port = Number(process.env.PORT || process.env.AMVERA_PORT || 8080);

fs.mkdirSync(mediaDir, { recursive: true });

const app = express();
const corsOrigin = process.env.CORS_ORIGIN?.split(',').map((item) => item.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || !corsOrigin?.length || corsOrigin.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(mediaDir, { maxAge: '7d' }));
app.use(optionalAuth);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, mediaDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^\w.-]+/g, '_').slice(0, 80) || 'media';
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MEDIA_MAX_BYTES || 25 * 1024 * 1024) },
  fileFilter: (_req, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Можно загружать только изображения и видео'));
  },
});

function publicMediaUrl(req, filename) {
  const baseUrl = process.env.PUBLIC_APP_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl.replace(/\/$/, '')}/uploads/${filename}`;
}

function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function adminEmails() {
  return new Set((process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean));
}

async function getUserByEmail(email) {
  const { rows } = await query(
    'select id, email, password_hash, display_name, role, created_at from users where lower(email) = lower($1) limit 1',
    [email],
  );
  return rows[0] ?? null;
}

async function serializePosts() {
  const { rows: posts } = await query(`
    select
      p.id,
      p.title,
      p.content,
      p.category,
      p.media_url,
      p.created_at,
      p.author_id,
      u.display_name as author_display_name
    from posts p
    left join users u on u.id = p.author_id
    order by p.created_at desc
  `);

  if (posts.length === 0) return [];

  const postIds = posts.map((post) => post.id);
  const { rows: comments } = await query(`
    select
      c.id,
      c.post_id,
      c.user_id,
      c.content,
      c.created_at,
      u.display_name as user_display_name
    from comments c
    left join users u on u.id = c.user_id
    where c.post_id = any($1::uuid[])
    order by c.created_at asc
  `, [postIds]);

  const commentsByPost = new Map();
  for (const comment of comments) {
    const normalized = {
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      users: {
        id: comment.user_id,
        display_name: comment.user_display_name,
      },
    };
    if (!commentsByPost.has(comment.post_id)) commentsByPost.set(comment.post_id, []);
    commentsByPost.get(comment.post_id).push(normalized);
  }

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    media_url: post.media_url,
    created_at: post.created_at,
    author_id: post.author_id,
    users: {
      id: post.author_id,
      display_name: post.author_display_name,
    },
    comments: commentsByPost.get(post.id) ?? [],
  }));
}

app.get('/api/health', async (_req, res) => {
  let db = 'not_configured';
  if (pool) {
    await query('select 1');
    db = 'ok';
  }
  res.json({ ok: true, db });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

app.post('/api/auth/register', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  const displayName = String(req.body?.displayName ?? '').trim();

  if (!validateEmail(email)) {
    res.status(400).json({ message: 'Введите корректный email.' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: 'Пароль должен быть не короче 6 символов.' });
    return;
  }
  if (!displayName) {
    res.status(400).json({ message: 'Укажите имя.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await transaction(async (client) => {
    const existing = await client.query('select id from users where lower(email) = lower($1) limit 1', [email]);
    if (existing.rows.length > 0) {
      const err = new Error('Этот email уже зарегистрирован.');
      err.status = 409;
      throw err;
    }

    const count = await client.query('select count(*)::int as count from users');
    const role = count.rows[0].count === 0 || adminEmails().has(email) ? 'admin' : 'user';
    const inserted = await client.query(
      `insert into users (email, password_hash, display_name, role)
       values ($1, $2, $3, $4)
       returning id, email, display_name, role, created_at`,
      [email, passwordHash, displayName, role],
    );
    return inserted.rows[0];
  });

  setSessionCookie(res, signSession(user));
  res.status(201).json({ user: serializeUser(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  const user = await getUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401).json({ message: 'Неверный email или пароль.' });
    return;
  }

  setSessionCookie(res, signSession(user));
  res.json({ user: serializeUser(user) });
});

app.post('/api/auth/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/posts', async (_req, res) => {
  res.json(await serializePosts());
});

app.post('/api/posts', requireAdmin, async (req, res) => {
  const title = String(req.body?.title ?? '').trim();
  const content = String(req.body?.content ?? '').trim();
  const category = String(req.body?.category ?? '').trim() || null;
  const mediaUrl = String(req.body?.media_url ?? '').trim() || null;

  if (!title || !content) {
    res.status(400).json({ message: 'Заполните заголовок и текст записи.' });
    return;
  }

  const { rows } = await query(
    `insert into posts (title, content, category, media_url, author_id)
     values ($1, $2, $3, $4, $5)
     returning id`,
    [title, content, category, mediaUrl, req.user.id],
  );
  res.status(201).json({ id: rows[0].id });
});

app.patch('/api/posts/:id', requireAdmin, async (req, res) => {
  const title = String(req.body?.title ?? '').trim();
  const content = String(req.body?.content ?? '').trim();
  const category = String(req.body?.category ?? '').trim() || null;
  const mediaUrl = String(req.body?.media_url ?? '').trim() || null;

  if (!title || !content) {
    res.status(400).json({ message: 'Заполните заголовок и текст записи.' });
    return;
  }

  const { rowCount } = await query(
    `update posts
     set title = $1, content = $2, category = $3, media_url = $4, updated_at = now()
     where id = $5`,
    [title, content, category, mediaUrl, req.params.id],
  );
  if (!rowCount) {
    res.status(404).json({ message: 'Запись не найдена.' });
    return;
  }
  res.json({ ok: true });
});

app.delete('/api/posts/:id', requireAdmin, async (req, res) => {
  const { rowCount } = await query('delete from posts where id = $1', [req.params.id]);
  if (!rowCount) {
    res.status(404).json({ message: 'Запись не найдена.' });
    return;
  }
  res.json({ ok: true });
});

app.post('/api/posts/:id/comments', requireAuth, async (req, res) => {
  const content = String(req.body?.content ?? '').trim();
  if (!content) {
    res.status(400).json({ message: 'Комментарий не может быть пустым.' });
    return;
  }

  const { rows } = await query(
    `insert into comments (post_id, user_id, content)
     values ($1, $2, $3)
     returning id, post_id, user_id, content, created_at`,
    [req.params.id, req.user.id, content],
  );

  res.status(201).json({
    ...rows[0],
    users: {
      id: req.user.id,
      display_name: req.user.display_name,
    },
  });
});

app.delete('/api/comments/:id', requireAuth, async (req, res) => {
  const { rows } = await query('select user_id from comments where id = $1', [req.params.id]);
  const comment = rows[0];
  if (!comment) {
    res.status(404).json({ message: 'Комментарий не найден.' });
    return;
  }
  if (req.user.role !== 'admin' && comment.user_id !== req.user.id) {
    res.status(403).json({ message: 'Недостаточно прав.' });
    return;
  }

  await query('delete from comments where id = $1', [req.params.id]);
  res.json({ ok: true });
});

app.post('/api/media', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'Файл не передан.' });
    return;
  }
  res.status(201).json({ url: publicMediaUrl(req, req.file.filename) });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Внутренняя ошибка сервера' });
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: '1h' }));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

const server = app.listen(port, () => {
  console.log(`Alma server listening on ${port}`);
});
server.ref();
const keepAlive = setInterval(() => {}, 60 * 60 * 1000);

process.on('SIGTERM', () => {
  clearInterval(keepAlive);
  server.close(() => {
    process.exit(0);
  });
});
