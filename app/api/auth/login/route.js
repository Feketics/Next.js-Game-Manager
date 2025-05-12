import { query } from '../../../lib/db.js';
import { checkPwd } from '../../../lib/auth.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function POST(req) {
  const { username, password } = await req.json();
  const res = await query(
    'SELECT id,email,password,role_id FROM users WHERE username=$1',
    [username]
  );
  if (res.rowCount === 0) return new Response('Invalid credentials', { status: 401 });

  const user = res.rows[0];
  if (!await checkPwd(password, user.password)) {
    return new Response('Invalid credentials', { status: 401 });
  }

  // Generate OTP
  const code = Math.floor(100000 + Math.random()*900000).toString();
  const expiresAt = new Date(Date.now() + 5*60*1000);
  await query('DELETE FROM user_otps WHERE user_id=$1', [user.id]);
  await query('INSERT INTO user_otps(user_id,code,expires_at) VALUES($1,$2,$3)', [user.id, code, expiresAt]);

  // Email OTP
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Your login code',
    text: `Your login code is ${code}. It expires in 5 minutes.`
  });

  // Prompt for OTP
  return new Response(JSON.stringify({ requires2fa: true, userId: user.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}