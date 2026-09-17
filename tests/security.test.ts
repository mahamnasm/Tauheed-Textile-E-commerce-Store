import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../src/lib/rateLimit';
import { loginSchema, signupSchema } from '../src/lib/validation';

describe('Rate Limiter', () => {
  it('should allow requests within limit and block when exceeded', () => {
    const testIp = '127.0.0.99';

    // First 5 requests should pass
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(testIp, 5, 60000);
      expect(res.success).toBe(true);
    }

    // 6th request should fail with rate limit exceeded
    const res = checkRateLimit(testIp, 5, 60000);
    expect(res.success).toBe(false);
    expect(res.remaining).toBe(0);
  });
});

describe('Auth Validation Schemas', () => {
  it('should validate login schema correctly', () => {
    const valid = loginSchema.parse({
      email: 'user@tauheedtextile.com',
      password: 'securepassword123',
    });
    expect(valid.email).toBe('user@tauheedtextile.com');
  });

  it('should reject invalid signup email/password', () => {
    expect(() =>
      signupSchema.parse({
        name: 'A',
        email: 'invalid-email',
        password: '123',
      })
    ).toThrow();
  });
});
