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
  verifyOwnerKey,
  getLatestIntrusionAlert,
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
    const latestThreat = await getLatestIntrusionAlert();

    return NextResponse.json({
      success: true,
      config: {
        emergencyLockdown: config.emergencyLockdown,
        lockdownReason: config.lockdownReason,
        failedAttemptLimit: config.failedAttemptLimit,
        lockoutMinutes: config.lockoutMinutes,
        codeShieldLocked: config.codeShieldLocked,
        masterPinMasked: "••••" + config.masterPin.slice(-2),
      },
      latestThreat,
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

    // Verify Owner Master Key ("maham0345")
    if (action === "VERIFY_OWNER_KEY") {
      const { ownerKey } = body;
      const isValid = verifyOwnerKey(ownerKey);

      if (!isValid) {
        await logSecurityEvent(
          ip,
          session.username,
          "FAILED_PIN",
          `Unauthorized attempt to unlock Owner Code Shield with key: "${ownerKey}".`,
          userAgent
        );
        return NextResponse.json(
          { error: "Incorrect Owner Master Password. Access to code modification is blocked." },
          { status: 403 }
        );
      }

      await logSecurityEvent(
        ip,
        session.username,
        "CODE_SHIELD_AUTH",
        "Owner Master Password 'maham0345' verified. System code and configuration modification authorized.",
        userAgent
      );

      return NextResponse.json({
        success: true,
        authorized: true,
        message: "Owner identity verified successfully. System code modification authorized.",
      });
    }

    // Toggle Code Shield Lock
    if (action === "TOGGLE_CODE_SHIELD") {
      const { ownerKey } = body;
      if (!verifyOwnerKey(ownerKey)) {
        return NextResponse.json(
          { error: "Owner authorization password 'maham0345' is required to modify Code Shield settings." },
          { status: 403 }
        );
      }

      const config = await getSecurityConfig();
      const updated = await updateSecurityConfig({ codeShieldLocked: !config.codeShieldLocked });

      await logSecurityEvent(
        ip,
        session.username,
        "CODE_SHIELD_AUTH",
        `Owner Code Shield set to: ${updated.codeShieldLocked ? "ENCRYPTED & LOCKED" : "UNLOCKED"}`,
        userAgent
      );

      return NextResponse.json({
        success: true,
        codeShieldLocked: updated.codeShieldLocked,
        message: updated.codeShieldLocked
          ? "Owner Code Shield is now ENCRYPTED & LOCKED. All alterations require password 'maham0345'."
          : "Owner Code Shield unlocked for maintenance.",
      });
    }

    if (action === "TOGGLE_LOCKDOWN") {
      const { ownerKey } = body;
      const config = await getSecurityConfig();

      // If portal is currently locked down, releasing it requires owner key or current pin
      if (config.emergencyLockdown && ownerKey && !verifyOwnerKey(ownerKey)) {
        return NextResponse.json(
          { error: "Incorrect Owner Password to release emergency lockdown." },
          { status: 403 }
        );
      }

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
      const isOwnerOverride = verifyOwnerKey(currentPin);
      if (!isOwnerOverride && currentPin !== config.masterPin) {
        return NextResponse.json(
          { error: "Current Master PIN or Owner Password 'maham0345' is required." },
          { status: 400 }
        );
      }

      await updateSecurityConfig({ masterPin: newPin.trim() });
      await logSecurityEvent(
        ip,
        session.username,
        "PIN_CHANGED",
        "Master Security PIN successfully updated.",
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
