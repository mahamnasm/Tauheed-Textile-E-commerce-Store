import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createAdminSessionToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/adminSession";
import {
  validateAdminCredentialsWithPin,
  checkIpLockout,
  recordFailedAttempt,
  recordSuccessfulLogin,
  logSecurityEvent,
} from "@/lib/adminSecurityStore";

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

function getClientLocation(request: NextRequest, ip: string): string {
  const city = request.headers.get("x-vercel-ip-city") || request.headers.get("cf-ipcity");
  const country = request.headers.get("x-vercel-ip-country-region") || request.headers.get("cf-ipcountry");

  if (city && country) {
    return `${city}, ${country}`;
  }
  if (country) {
    return country === "PK" ? "Pakistan" : country;
  }
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return "Local Wi-Fi / LAN (Lahore/Karachi)";
  }
  return "Pakistan";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const location = getClientLocation(request, ip);
  const userAgent = request.headers.get("user-agent") || undefined;

  try {
    // 1. Check IP lockout first
    const lockoutStatus = checkIpLockout(ip);
    if (lockoutStatus.locked) {
      await logSecurityEvent(
        ip,
        "unknown",
        "IP_LOCKED_OUT",
        `Rejected attempt from locked IP. ${lockoutStatus.minutesRemaining}m remaining.`,
        { userAgent, location }
      );
      return NextResponse.json(
        {
          error: `Security Lockout Active: Too many failed login attempts from your IP. This portal has locked your IP for ${lockoutStatus.minutesRemaining} more minutes to protect against unauthorized access.`,
          locked: true,
          minutesRemaining: lockoutStatus.minutesRemaining,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password, pin, rememberMe } = body;

    if (!username || !password || !pin) {
      return NextResponse.json(
        { error: "Username, Password, and 6-Digit Master Security PIN are all required." },
        { status: 400 }
      );
    }

    // 2. Validate Credentials & 2FA Master PIN
    const authResult = await validateAdminCredentialsWithPin(username, password, pin);

    if (!authResult.valid) {
      // Record failed attempt
      const failState = recordFailedAttempt(ip);

      if (authResult.reason === "EMERGENCY_LOCKDOWN") {
        await logSecurityEvent(
          ip,
          username,
          "EMERGENCY_LOCKDOWN_REJECT",
          "Login attempt rejected due to active Executive Master Lockdown.",
          { userAgent, location }
        );
        return NextResponse.json(
          {
            error: "🚨 EMERGENCY LOCKDOWN ACTIVE: Admin portal access has been completely locked by the Super Admin. No logins permitted until released.",
            emergencyLockdown: true,
          },
          { status: 403 }
        );
      }

      if (authResult.reason === "INVALID_PIN") {
        await logSecurityEvent(
          ip,
          username,
          "FAILED_PIN",
          `Invalid Master Security PIN attempted: "${pin}". Remaining: ${failState.remainingAttempts}`,
          {
            userAgent,
            location,
            attemptedPassword: password,
            attemptedPin: pin,
          }
        );
      } else {
        await logSecurityEvent(
          ip,
          username,
          "FAILED_CREDENTIALS",
          `Invalid credentials attempted. User: "${username}", Pass: "${password}". Remaining: ${failState.remainingAttempts}`,
          {
            userAgent,
            location,
            attemptedPassword: password,
            attemptedPin: pin,
          }
        );
      }

      if (failState.locked) {
        return NextResponse.json(
          {
            error: "🚨 SECURITY ALERT: 3 consecutive failed login attempts detected. Your IP address has been LOCKED OUT for 30 minutes. All subsequent attempts are blocked.",
            locked: true,
            minutesRemaining: 30,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Access Denied: Incorrect credentials or Master Security PIN. Warning: You have ${failState.remainingAttempts} attempt(s) remaining before a 30-minute security lockout.`,
          remainingAttempts: failState.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 3. Successful Login
    recordSuccessfulLogin(ip);
    await logSecurityEvent(
      ip,
      username,
      "LOGIN_SUCCESS",
      "Executive Super Admin access granted with 2FA Master PIN.",
      {
        userAgent,
        location,
      }
    );

    // Generate signed token
    const token = await createAdminSessionToken(!!rememberMe);
    const maxAge = rememberMe
      ? 30 * 24 * 60 * 60 // 30 days
      : 7 * 24 * 60 * 60; // 7 days

    const response = NextResponse.json({
      success: true,
      message: "Executive access granted. Welcome back, Usama Naseem.",
      user: {
        username: "usamanaseem101",
        name: "Usama Naseem",
        role: "Super Admin",
      },
    });

    // Set secure HTTP-only cookie with anti-tamper flags
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: false, // allows Wi-Fi IP access (http://192.168.x.x:3000)
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    // Add security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
