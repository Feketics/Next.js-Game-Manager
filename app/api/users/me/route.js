import { query } from '../../../lib/db.js';
import { verifyToken } from '../../../lib/auth.js';

export async function GET(req) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/token=([^;]+)/);
  const token = match?.[1];
  const payload = verifyToken(token);
  if (!payload) return new Response('Unauthorized', { status: 401 });

  const res = await query(
    `SELECT id,username,role_id FROM users WHERE id=$1`,
    [payload.sub]
  );
  const user = res.rows[0];
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function PUT(req) {
  const cookie = req.headers.get('cookie') || '';
  const token  = (cookie.match(/token=([^;]+)/)||[])[1];
  const payload = verifyToken(token);
  if (!payload) return new Response('Unauthorized', { status: 401 });

  const { username, password } = await req.json();
  const updates = [];
  const params = [];
  if (username) {
    params.push(username);
    updates.push(`username=$${params.length}`);
  }
  if (password) {
    // hash password
    const { hashPwd } = await import('../../../lib/auth');
    const passHash = await hashPwd(password);
    params.push(passHash);
    updates.push(`password=$${params.length}`);
  }
  if (!updates.length) {
    return new Response('Nothing to update', { status: 400 });
  }
  params.push(payload.sub);
  const sql = `UPDATE users SET ${updates.join(',')} WHERE id=$${params.length}`;
  await query(sql, params);
  return new Response(null, { status: 204 });
}

export async function DELETE(req) {
  const cookie = req.headers.get('cookie') || '';
  const token  = (cookie.match(/token=([^;]+)/)||[])[1];
  const payload = verifyToken(token);
  if (!payload) return new Response('Unauthorized', { status: 401 });

  await query('DELETE FROM users WHERE id=$1', [payload.sub]);
  // clear cookie
  return new Response(null, {
    status: 204,
    headers: {
      'Set-Cookie': 'token=deleted; Path=/; Max-Age=0'
    }
  });
}
