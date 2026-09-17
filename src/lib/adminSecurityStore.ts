import { prisma } from "@/lib/prisma";
import {
  getAdminUsername,
  getAdminPassword,
  getDefaultMasterPin,
  timingSafeCompare,
} from "./adminSession";

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

function getOwnerMasterKey(): string | null {
  const key = process.env.OWNER_MASTER_KEY;
  if (!key || key.trim().length < 12) return null;
  return key.trim();
}

export function verifyOwnerKey(key?: string | null): boolean {
  const expected = getOwnerMasterKey();
  if (!expected || !key) return false;
  const clean = key.trim();
  return timingSafeCompare(clean, expected);
}

interface IpRateRecord {
  failedAttempts: number;
  lockedUntil: number;
  lastAttemptAt: number;
}
const rateLimitStore = new Map<string, IpRateRecord>();

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  ip: string;
  location?: string;
  username: string;
  action:
    | "LOGIN_SUCCESS"
    | "FAILED_CREDENTIALS"
    | "FAILED_PIN"
    | "IP_LOCKED_OUT"
    | "EMERGENCY_LOCKDOWN_REJECT"
    | "PIN_CHANGED"
    | "LOCKDOWN_TOGGLED"
    | "CODE_SHIELD_AUTH"
    | "INTRUSION_ALERT";
  details: string;
  attemptedPassword?: string;
  attemptedPin?: string;
  userAgent?: string;
}

const inMemoryAuditLogs: SecurityAuditLog[] = [];

export interface SecurityConfig {
  masterPin: string;
  emergencyLockdown: boolean;
  lockdownReason?: string;
  failedAttemptLimit: number;
  lockoutMinutes: number;
  codeShieldLocked: boolean;
}

export async function getSecurityConfig(): Promise<SecurityConfig> {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "admin_security_config" },
    });
    if (record && record.value) {
      const parsed = JSON.parse(record.value);
      return {
        masterPin: parsed.masterPin || getDefaultMasterPin(),
        emergencyLockdown: !!parsed.emergencyLockdown,
        lockdownReason: parsed.lockdownReason || "Executive emergency lockdown activated.",
        failedAttemptLimit: parsed.failedAttemptLimit || MAX_FAILED_ATTEMPTS,
        lockoutMinutes: parsed.lockoutMinutes || 30,
        codeShieldLocked: parsed.codeShieldLocked !== false,
      };
    }
  } catch (err) {
    console.error("Failed to read security config from DB, using defaults:", err);
  }

  return {
    masterPin: getDefaultMasterPin(),
    emergencyLockdown: false,
    lockdownReason: "Executive emergency lockdown activated.",
    failedAttemptLimit: MAX_FAILED_ATTEMPTS,
    lockoutMinutes: 30,
    codeShieldLocked: true,
  };
}

export async function updateSecurityConfig(patch: Partial<SecurityConfig>): Promise<SecurityConfig> {
  const current = await getSecurityConfig();
  const updated: SecurityConfig = { ...current, ...patch };

  try {
    await prisma.setting.upsert({
      where: { key: "admin_security_config" },
      update: { value: JSON.stringify(updated) },
      create: {
        key: "admin_security_config",
        value: JSON.stringify(updated),
        description: "Tauheed Textile Fortress Security and Master PIN Configuration",
      },
    });
  } catch (err) {
    console.error("Failed to persist security config:", err);
  }

  return updated;
}

export function checkIpLockout(ip: string): {
  locked: boolean;
  minutesRemaining: number;
  remainingAttempts: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    return { locked: false, minutesRemaining: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  if (record.lockedUntil > now) {
    const minutesRemaining = Math.ceil((record.lockedUntil - now) / 60000);
    return { locked: true, minutesRemaining, remainingAttempts: 0 };
  }

  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    rateLimitStore.delete(ip);
    return { locked: false, minutesRemaining: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  if (now - record.lastAttemptAt > ATTEMPT_WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { locked: false, minutesRemaining: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  return { locked: false, minutesRemaining: 0, remainingAttempts };
}

export function recordFailedAttempt(ip: string): {
  locked: boolean;
  minutesRemaining: number;
  remainingAttempts: number;
} {
  const now = Date.now();
  let record = rateLimitStore.get(ip);

  if (!record || (now - record.lastAttemptAt > ATTEMPT_WINDOW_MS && record.lockedUntil <= now)) {
    record = { failedAttempts: 1, lockedUntil: 0, lastAttemptAt: now };
  } else {
    record.failedAttempts += 1;
    record.lastAttemptAt = now;
  }

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    rateLimitStore.set(ip, record);
    return { locked: true, minutesRemaining: 30, remainingAttempts: 0 };
  }

  rateLimitStore.set(ip, record);
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  return { locked: false, minutesRemaining: 0, remainingAttempts: remaining };
}

export function recordSuccessfulLogin(ip: string) {
  rateLimitStore.delete(ip);
}

export function clearAllLockouts() {
  rateLimitStore.clear();
}

export async function logSecurityEvent(
  ip: string,
  username: string,
  action: SecurityAuditLog["action"],
  details: string,
  options?:
    | string
    | {
        userAgent?: string;
        location?: string;
        attemptedPassword?: string;
        attemptedPin?: string;
      }
) {
  let userAgent: string | undefined;
  let location: string | undefined;

  if (typeof options === "string") {
    userAgent = options;
  } else if (options) {
    userAgent = options.userAgent;
    location = options.location;
  }

  const log: SecurityAuditLog = {
    id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ip,
    location: location || "Pakistan (Local Network)",
    username: username || "unknown",
    action,
    details,
    userAgent: userAgent ? userAgent.substring(0, 150) : undefined,
  };

  inMemoryAuditLogs.unshift(log);
  if (inMemoryAuditLogs.length > 100) {
    inMemoryAuditLogs.pop();
  }

  try {
    await prisma.setting.upsert({
      where: { key: "admin_security_audit_logs" },
      update: { value: JSON.stringify(inMemoryAuditLogs.slice(0, 50)) },
      create: {
        key: "admin_security_audit_logs",
        value: JSON.stringify(inMemoryAuditLogs.slice(0, 50)),
        description: "Tauheed Fortress Security Audit Trail",
      },
    });
  } catch (err) {
    console.error("Failed to persist security audit log:", err);
  }
}

export async function getSecurityAuditLogs(): Promise<SecurityAuditLog[]> {
  if (inMemoryAuditLogs.length > 0) {
    return inMemoryAuditLogs;
  }

  try {
    const record = await prisma.setting.findUnique({
      where: { key: "admin_security_audit_logs" },
    });
    if (record && record.value) {
      const parsed = JSON.parse(record.value);
      if (Array.isArray(parsed)) {
        inMemoryAuditLogs.push(...parsed);
        return inMemoryAuditLogs;
      }
    }
  } catch (err) {
    console.error("Failed to load audit logs from DB:", err);
  }

  return inMemoryAuditLogs;
}

export async function validateAdminCredentialsWithPin(
  username: string,
  passcode: string,
  pin: string
): Promise<{
  valid: boolean;
  isOwner?: boolean;
  reason?: "INVALID_CREDENTIALS" | "INVALID_PIN" | "LOCKED_OUT" | "EMERGENCY_LOCKDOWN";
}> {
  const config = await getSecurityConfig();

  const cleanUser = (username || "").trim().toLowerCase();
  const cleanPass = passcode || "";
  const cleanPin = (pin || "").trim();

  let expectedUser = "";
  let expectedPass = "";
  try {
    expectedUser = getAdminUsername().toLowerCase();
    expectedPass = getAdminPassword();
  } catch {
    return { valid: false, reason: "INVALID_CREDENTIALS" };
  }

  const isUserValid = timingSafeCompare(cleanUser, expectedUser);
  const isPassValid = timingSafeCompare(cleanPass, expectedPass);
  const isPinValid = timingSafeCompare(cleanPin, config.masterPin);

  if (config.emergencyLockdown) {
    return { valid: false, reason: "EMERGENCY_LOCKDOWN" };
  }

  if (!isUserValid || !isPassValid) {
    return { valid: false, reason: "INVALID_CREDENTIALS" };
  }

  if (!isPinValid) {
    return { valid: false, reason: "INVALID_PIN" };
  }

  return { valid: true };
}

export async function getLatestIntrusionAlert(): Promise<SecurityAuditLog | null> {
  const logs = await getSecurityAuditLogs();
  const threat = logs.find(
    (l) =>
      l.action === "FAILED_CREDENTIALS" || l.action === "FAILED_PIN" || l.action === "IP_LOCKED_OUT"
  );
  return threat || null;
}
