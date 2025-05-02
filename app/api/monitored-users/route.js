import { query } from '../../lib/db.js';
import { verifyToken } from '../../lib/auth.js';

export async function GET(req) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.match(/token=([^;]+)/)?.[1];
  const user = token && verifyToken(token);

  if (!user || user.role !== 1) {
    return new Response('Forbidden', { status: 403 });
  }

  const res = await query(
    `SELECT u.id, u.username, mu.detected_at
     FROM monitored_users mu
     JOIN users u ON mu.user_id = u.id
     ORDER BY mu.detected_at DESC`
  );

  return new Response(JSON.stringify(res.rows), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
