import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
}

run()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool?.end();
  });
