import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryRateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Extracts real client IP address safely from request headers
 */
export function getClientIp(request: NextRequest | Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }
  return "127.0.0.1";
}

/**
 * In-memory sliding window rate limiter.
 * @param identifier Client IP address, user ID, or combined identifier
 * @param limit Max requests allowed in the given window
 * @param windowMs Window duration in milliseconds (default: 15 minutes)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `ratelimit_${identifier}`;
  const record = memoryRateLimitStore.get(key);

  // Clean expired record or start fresh
  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    memoryRateLimitStore.set(key, { count: 1, resetTime });
    return { success: true, limit, remaining: limit - 1, resetTime };
  }

  // Check if limit exceeded
  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, resetTime: record.resetTime };
  }

  // Increment counter
  record.count += 1;
  memoryRateLimitStore.set(key, record);
  return { success: true, limit, remaining: limit - record.count, resetTime: record.resetTime };
}

/**
 * Returns a standardized 429 Too Many Requests response with RateLimit headers
 */
export function rateLimitResponse(resetTime: number, customMessage?: string): NextResponse {
  const retryAfterSeconds = Math.ceil(Math.max(1, (resetTime - Date.now()) / 1000));
  return NextResponse.json(
    {
      error: customMessage || "Too many requests. Please wait a moment before trying again.",
      retryAfter: retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfterSeconds.toString(),
        "X-RateLimit-Reset": new Date(resetTime).toISOString(),
      },
    }
  );
}
