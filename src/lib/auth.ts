import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('SECURITY CONFIGURATION ERROR: JWT_SECRET environment variable must be set in production.');
  }
  return secret || 'tauheed-textile-secret-key-2026';
}

export function signToken(payload: { id: string; email: string; role: string; name: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as { id: string; email: string; role: string; name: string };
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
