import jwt from 'jsonwebtoken';
import { query } from './db.js';

export const AUTH_COOKIE = 'alma_session';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me';
const isProduction = process.env.NODE_ENV === 'production';

export function signSession(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '30d' },
  );
}

export function setSessionCookie(res, token) {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    path: '/',
  });
}

export async function optionalAuth(req, _res, next) {
  const token = req.cookies?.[AUTH_COOKIE] ?? req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    req.user = null;
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { rows } = await query(
      'select id, email, username, display_name, role, created_at from users where id = $1 limit 1',
      [payload.sub],
    );
    req.user = rows[0] ?? null;
  } catch {
    req.user = null;
  }
  next();
}

export function requireAuth(req, _res, next) {
  if (!req.user) {
    const err = new Error('Требуется вход в аккаунт');
    err.status = 401;
    next(err);
    return;
  }
  next();
}

export function requireAdmin(req, _res, next) {
  if (!req.user) {
    const err = new Error('Требуется вход в аккаунт');
    err.status = 401;
    next(err);
    return;
  }
  if (req.user.role !== 'admin') {
    const err = new Error('Недостаточно прав');
    err.status = 403;
    next(err);
    return;
  }
  next();
}

export function serializeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    display_name: user.display_name,
    user_metadata: {
      display_name: user.display_name,
    },
  };
}
