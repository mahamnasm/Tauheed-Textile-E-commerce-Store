import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'tauheed-textile-secret-key-2026';

export function signToken(payload: { id: string; email: string; role: string; name: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; name: string };
  } catch {
    return null;
  }
}

export async function hashPassword(pass: string) {
  return bcrypt.hash(pass, 10);
}

export async function comparePassword(pass: string, hash: string) {
  return bcrypt.compare(pass, hash);
}
