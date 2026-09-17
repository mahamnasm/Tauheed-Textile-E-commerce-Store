import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { signToken, verifyToken } from '../src/lib/auth';
import { timingSafeCompare } from '../src/lib/adminSession';

describe('Authentication & Helper Utilities', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, JWT_SECRET: 'test-secret-key-12345' };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should sign and verify JWT tokens correctly', () => {
    const payload = {
      id: 'user_123',
      email: 'test@tauheedtextile.com',
      role: 'ADMIN',
      name: 'Test Admin',
    };

    const token = signToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe(payload.id);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe(payload.role);
  });

  it('should throw an error when JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    expect(() => signToken({ id: '1', email: 'a@b.com', role: 'USER', name: 'A' })).toThrow(
      'JWT_SECRET environment variable is missing'
    );
  });

  it('should safely compare strings in constant time', () => {
    expect(timingSafeCompare('secret_passcode', 'secret_passcode')).toBe(true);
    expect(timingSafeCompare('secret_passcode', 'wrong_passcode')).toBe(false);
  });
});
