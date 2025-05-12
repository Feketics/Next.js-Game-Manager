import { query } from '../../../lib/db.js';
import { checkPwd } from '../../../lib/auth.js';

export async function POST(req) {
  const { username, password } = await req.json();
  // 1) Verify credentials
  const res = await query(
    'SELECT id,username,password,role_id FROM users WHERE username=$1',
    [username]
  );
  if (res.rowCount === 0) return new Response('Invalid credentials', { status: 401 });

  const user = res.rows[0];
  if (!await checkPwd(password, user.password)) {
    return new Response('Invalid credentials', { status: 401 });
  }

  // 2) Generate a 6‑digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Remove any existing OTPs for this user
  await query('DELETE FROM user_otps WHERE user_id=$1', [user.id]);
  // Insert new OTP
  await query(
    'INSERT INTO user_otps(user_id,code,expires_at) VALUES($1,$2,$3)',
    [user.id, code, expiresAt]
  );

  // 3) Return requires2fa + OTP (for dev; in prod you’d email/SMS this instead)
  return new Response(
    JSON.stringify({ requires2fa: true, userId: user.id, otp: code }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}