import { query } from '../../../lib/db.js';
import { hashPwd, signToken } from '../../../lib/auth.js';

export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return new Response('Missing fields', { status: 400 });
  }

  // ensure unique
  const dup = await query('SELECT 1 FROM users WHERE username=$1', [username]);
  if (dup.rowCount) {
    return new Response('Username taken', { status: 409 });
  }

  const passHash = await hashPwd(password);
  const res = await query(
    `INSERT INTO users (username,password,role_id)
     VALUES ($1,$2,2) RETURNING id,username,role_id`,
    [username, passHash]
  );
  const user = res.rows[0];
  const token = signToken(user);

  // Set cookie
  return new Response(
    JSON.stringify({ id: user.id, username: user.username, role: user.role_id }),
    {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${7*24*3600}`
      }
    }
  );
}
