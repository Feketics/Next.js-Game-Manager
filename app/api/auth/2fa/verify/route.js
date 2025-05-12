import { query } from '../../../../lib/db.js';
import { signToken } from '../../../../lib/auth.js';

export async function POST(req) {
  const { userId, code } = await req.json();

  // 1) Validate OTP exists and not expired
  const res = await query(
    'SELECT 1 FROM user_otps WHERE user_id=$1 AND code=$2 AND expires_at > NOW()',
    [userId, code]
  );
  if (res.rowCount === 0) {
    return new Response('Invalid or expired code', { status: 400 });
  }

  // 2) Clean up used OTP
  await query('DELETE FROM user_otps WHERE user_id=$1', [userId]);

  // 3) Issue JWT cookie
  const userRes = await query(
    'SELECT id,username,role_id FROM users WHERE id=$1', [userId]
  );
  const user = userRes.rows[0];
  const token = signToken(user);

  return new Response(
    null,
    {
      status: 204,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=${7*24*3600}`
      }
    }
  );
}