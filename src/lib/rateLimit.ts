import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryRateLimitStore = new Map<string, RateLimitRecord>();
const MAX_STORE_KEYS = 8000;

function pruneExpired(now: number) {
  if (memoryRateLimitStore.size < MAX_STORE_KEYS) return;
  memoryRateLimitStore.forEach((record, key) => {
    if (now > record.resetTime) {
      memoryRateLimitStore.delete(key);
    }
  });
  if (memoryRateLimitStore.size >= MAX_STORE_KEYS) {
    const oldest = memoryRateLimitStore.keys().next().value;
    if (oldest) memoryRateLimitStore.delete(oldest);
  }
}

/**
 * Extracts client IP. Spoofed X-Forwarded-For is ignored unless TRUST_PROXY is enabled
 * (default in production / typical Vercel + Cloudflare deployments).
 */
export function getClientIp(request: NextRequest | Request): string {
  const trustProxy =
    process.env.TRUST_PROXY === "true" ||
    (process.env.NODE_ENV === "production" && process.env.TRUST_PROXY !== "false");

  if (trustProxy) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim() || "0.0.0.0";
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    const cfIp = request.headers.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();
  }

  return "127.0.0.1";
}

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const now = Date.now();
  pruneExpired(now);
  const key = `ratelimit_${identifier}`;
  const record = memoryRateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    memoryRateLimitStore.set(key, { count: 1, resetTime });
    return { success: true, limit, remaining: limit - 1, resetTime };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, resetTime: record.resetTime };
  }

  record.count += 1;
  memoryRateLimitStore.set(key, record);
  return { success: true, limit, remaining: limit - record.count, resetTime: record.resetTime };
}

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

export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    return process.env.NODE_ENV !== "production";
  }

  if (!token || typeof token !== "string") {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) formData.append("remoteip", ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return false;
  }
}
