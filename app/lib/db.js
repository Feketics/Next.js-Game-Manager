import { Pool } from 'pg';

const pool = new Pool(
{
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT, 10),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

export async function query(text, params = [])
{
  const res = await pool.query(text, params);
  return res;
}