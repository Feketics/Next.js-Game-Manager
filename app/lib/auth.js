import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME';

// Hash a plain password
export async function hashPwd(pw) {
  return await bcrypt.hash(pw, 10);
}

// Compare plain vs. hash
export async function checkPwd(pw, hash) {
  return await bcrypt.compare(pw, hash);
}

// Sign a JWT (user id + role)
export function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify from cookie
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}