import { query } from '../../../lib/db.js';
import { checkPwd, signToken } from '../../../lib/auth.js';

export async function POST(req) {
  const { username, password } = await req.json();
  const res = await query('SELECT id,username,password,role_id FROM users WHERE username=$1', [username]);
  if (res.rowCount === 0) {
    return new Response('Invalid credentials', { status: 401 });
  }
  const user = res.rows[0];
  if (!await checkPwd(password, user.password)) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const token = signToken(user);
  return new Response(
    JSON.stringify({ id: user.id, username: user.username, role: user.role_id }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${7*24*3600}`
      }
    }
  );
}
