import { Pool } from 'pg';

const pool = new Pool(
{
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT, 10) || 5432,
  database: process.env.PGDATABASE || 'gamemanager',
  user: process.env.PGUSER || 'gameadmin',
  password: process.env.PGPASSWORD || 'alma1',
});

export async function query(text, params = [])
{
  const res = await pool.query(text, params);
  return res;
}

export async function closePool()
{
  await pool.end();
}