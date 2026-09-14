import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyAdminSessionToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/adminSession";
import {
  getSecurityConfig,
  updateSecurityConfig,
  getSecurityAuditLogs,
  logSecurityEvent,
  clearAllLockouts,
} from "@/lib/adminSecurityStore";

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return await verifyAdminSessionToken(token);
}

export async function GET(request: NextRequest) {
  const session = await verifyAuth(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const config = await getSecurityConfig();
    const logs = await getSecurityAuditLogs();

    return NextResponse.json({
      success: true,
      config: {
        emergencyLockdown: config.emergencyLockdown,
        lockdownReason: config.lockdownReason,
        failedAttemptLimit: config.failedAttemptLimit,
        lockoutMinutes: config.lockoutMinutes,
        masterPinMasked: "••••" + config.masterPin.slice(-2),
      },
      logs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyAuth(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || undefined;

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "TOGGLE_LOCKDOWN") {
      const config = await getSecurityConfig();
      const newStatus = !config.emergencyLockdown;
      const updated = await updateSecurityConfig({ emergencyLockdown: newStatus });

      await logSecurityEvent(
        ip,
        session.username,
        "LOCKDOWN_TOGGLED",
        `Executive Master Lockdown set to: ${newStatus ? "ACTIVATED (ALL LOGINS BLOCKED)" : "DEACTIVATED (NORMAL ACCESS)"}`,
        userAgent
      );

      return NextResponse.json({
        success: true,
        emergencyLockdown: updated.emergencyLockdown,
        message: newStatus
          ? "🚨 Emergency Master Lockdown has been ACTIVATED. All logins are blocked."
          : "✅ Master Lockdown deactivated. Normal logins are now permitted.",
      });
    }

    if (action === "CHANGE_PIN") {
      const { newPin, currentPin } = body;
      if (!newPin || typeof newPin !== "string" || newPin.trim().length < 4) {
        return NextResponse.json(
          { error: "New PIN must be at least 4 digits." },
          { status: 400 }
        );
      }

      const config = await getSecurityConfig();
      if (currentPin !== config.masterPin) {
        return NextResponse.json(
          { error: "Current Master PIN is incorrect." },
          { status: 400 }
        );
      }

      await updateSecurityConfig({ masterPin: newPin.trim() });
      await logSecurityEvent(
        ip,
        session.username,
        "PIN_CHANGED",
        "Master Security PIN successfully updated by Super Admin.",
        userAgent
      );

      return NextResponse.json({
        success: true,
        message: "Master Security PIN updated successfully.",
      });
    }

    if (action === "CLEAR_LOCKOUTS") {
      clearAllLockouts();
      return NextResponse.json({
        success: true,
        message: "All IP address lockouts have been reset.",
      });
    }

    return NextResponse.json({ error: "Unknown security action." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
