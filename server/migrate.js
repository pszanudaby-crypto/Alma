import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { pool, query, transaction } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

async function ensureMigrationTable() {
  await query(`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `);
}

async function run() {
  if (!pool) {
    throw new Error('DATABASE_URL is required to run migrations');
  }

  await ensureMigrationTable();
  const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    const { rows } = await query('select id from schema_migrations where id = $1', [file]);
    if (rows.length > 0) {
      console.log(`skip ${file}`);
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    await transaction(async (client) => {
      await client.query(sql);
      await client.query('insert into schema_migrations (id) values ($1)', [file]);
    });
    console.log(`applied ${file}`);
  }

  await seedAdminAndContent();
}

function firstAdminEmail() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .find(Boolean);
}

function adminUsername() {
  return (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
}

async function seedAdminAndContent() {
  const email = firstAdminEmail();
  const password = process.env.ADMIN_PASSWORD;
  const username = adminUsername();

  if (!email || !password) {
    console.log('skip seed: ADMIN_EMAILS or ADMIN_PASSWORD is not configured');
    return;
  }

  await transaction(async (client) => {
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await client.query(
      `insert into users (email, username, password_hash, display_name, role)
       values ($1, $2, $3, $4, 'admin')
       on conflict (email) do update
         set role = 'admin',
             username = excluded.username,
             password_hash = excluded.password_hash,
             display_name = excluded.display_name
       returning id`,
      [email, username, passwordHash, 'admin'],
    );

    const adminId = rows[0].id;
    const { rows: existingPosts } = await client.query('select id from posts limit 1');
    if (existingPosts.length > 0) {
      console.log('skip seed posts: posts already exist');
      return;
    }

    await client.query(
      `insert into posts (title, content, category, author_id)
       values
         ($1, $2, $3, $4),
         ($5, $6, $7, $4)`,
      [
        'Старт подготовки участка',
        'Провели первичное обследование территории, обозначили зону под будущие барнхаусы и общие пространства. Погода держится — можно планировать выезд инженеров на съёмку рельефа.',
        'Стройка',
        adminId,
        'Логистика и согласования',
        'Сверяем поставки древесины и график подъезда техники. Параллельно согласуем временные въезды с местными службами, чтобы не мешать жителям поселка.',
        'Благоустройство',
      ],
    );
    console.log('seeded admin user and starter posts');
  });
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool?.end();
  });
