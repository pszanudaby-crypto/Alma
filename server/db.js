import pg from 'pg';

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })
  : null;

export function assertDb() {
  if (!pool) {
    const err = new Error('DATABASE_URL is not configured');
    err.status = 503;
    throw err;
  }
  return pool;
}

export async function query(text, params = []) {
  return assertDb().query(text, params);
}

export async function transaction(callback) {
  const client = await assertDb().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
