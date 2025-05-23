import { Pool } from 'pg';

const pool = new Pool(
{
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function query(text, params = [])
{
  return pool.query(text, params);
}

export async function closePool()
{
  await pool.end();
}