import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing. Please set JWT_SECRET in your environment configuration.');
  }
  return secret;
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
