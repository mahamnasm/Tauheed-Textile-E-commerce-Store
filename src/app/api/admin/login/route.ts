import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createAdminSessionToken,
  adminSessionCookieOptions,
  getAdminUsername,
} from "@/lib/adminSession";
import {
  validateAdminCredentialsWithPin,
  checkIpLockout,
  recordFailedAttempt,
  recordSuccessfulLogin,
  logSecurityEvent,
} from "@/lib/adminSecurityStore";
import { adminLoginSchema } from "@/lib/validation";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { firstZodMessage, internalError } from "@/lib/http";

const GENERIC_AUTH_ERROR = "Invalid username, password, or PIN.";

function getClientLocation(request: NextRequest, ip: string): string {
  const city = request.headers.get("x-vercel-ip-city") || request.headers.get("cf-ipcity");
  const country = request.headers.get("x-vercel-ip-country-region") || request.headers.get("cf-ipcountry");

  if (city && country) return `${city}, ${country}`;
  if (country) return country === "PK" ? "Pakistan" : country;
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return "Local network";
  }
  return "Unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const location = getClientLocation(request, ip);
  const userAgent = request.headers.get("user-agent") || undefined;

  const burst = checkRateLimit(`admin_login_${ip}`, 8, 15 * 60 * 1000);
  if (!burst.success) {
    return rateLimitResponse(burst.resetTime, GENERIC_AUTH_ERROR);
  }

  try {
    const lockoutStatus = checkIpLockout(ip);
    if (lockoutStatus.locked) {
      await logSecurityEvent(ip, "unknown", "IP_LOCKED_OUT", "Rejected attempt from locked IP.", {
        userAgent,
        location,
      });
      return NextResponse.json({ error: GENERIC_AUTH_ERROR }, { status: 401 });
    }

    const body = await request.json();
    const validation = adminLoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: firstZodMessage(validation.error) }, { status: 400 });
    }

    const { username, password, pin, rememberMe } = validation.data;
    const authResult = await validateAdminCredentialsWithPin(username, password, pin);

    if (!authResult.valid) {
      recordFailedAttempt(ip);

      if (authResult.reason === "EMERGENCY_LOCKDOWN") {
        await logSecurityEvent(
          ip,
          username,
          "EMERGENCY_LOCKDOWN_REJECT",
          "Login attempt rejected due to active lockdown.",
          { userAgent, location }
        );
        return NextResponse.json({ error: GENERIC_AUTH_ERROR }, { status: 401 });
      }

      await logSecurityEvent(
        ip,
        username,
        authResult.reason === "INVALID_PIN" ? "FAILED_PIN" : "FAILED_CREDENTIALS",
        "Authentication failed.",
        { userAgent, location }
      );

      return NextResponse.json({ error: GENERIC_AUTH_ERROR }, { status: 401 });
    }

    recordSuccessfulLogin(ip);
    await logSecurityEvent(ip, username, "LOGIN_SUCCESS", "Admin access granted.", {
      userAgent,
      location,
    });

    const token = await createAdminSessionToken(!!rememberMe);
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
    const adminUser = getAdminUsername();

    const response = NextResponse.json({
      success: true,
      message: "Access granted.",
      user: {
        username: adminUser,
        name: adminUser,
        role: "Super Admin",
      },
    });

    response.cookies.set({
      ...adminSessionCookieOptions(maxAge),
      value: token,
    });

    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  } catch (error: unknown) {
    return internalError("Admin login error:", error);
  }
}
