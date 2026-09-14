import { prisma } from "@/lib/prisma";
import {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  DEFAULT_MASTER_PIN,
  timingSafeCompare,
} from "./adminSession";

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 Minutes
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 Minutes

// In-Memory Rate Limiting Tracker
interface IpRateRecord {
  failedAttempts: number;
  lockedUntil: number;
  lastAttemptAt: number;
}
const rateLimitStore = new Map<string, IpRateRecord>();

// Security Audit Log Entry
export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  ip: string;
  username: string;
  action: "LOGIN_SUCCESS" | "FAILED_CREDENTIALS" | "FAILED_PIN" | "IP_LOCKED_OUT" | "EMERGENCY_LOCKDOWN_REJECT" | "PIN_CHANGED" | "LOCKDOWN_TOGGLED";
  details: string;
  userAgent?: string;
}

const inMemoryAuditLogs: SecurityAuditLog[] = [];

// Get or initialize security config from DB
export interface SecurityConfig {
  masterPin: string;
  emergencyLockdown: boolean;
  lockdownReason?: string;
  failedAttemptLimit: number;
  lockoutMinutes: number;
}

export async function getSecurityConfig(): Promise<SecurityConfig> {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "admin_security_config" },
    });
    if (record && record.value) {
      const parsed = JSON.parse(record.value);
      return {
        masterPin: parsed.masterPin || DEFAULT_MASTER_PIN,
        emergencyLockdown: !!parsed.emergencyLockdown,
        lockdownReason: parsed.lockdownReason || "Executive emergency lockdown activated.",
        failedAttemptLimit: parsed.failedAttemptLimit || MAX_FAILED_ATTEMPTS,
        lockoutMinutes: parsed.lockoutMinutes || 30,
      };
    }
  } catch (err) {
    console.error("Failed to read security config from DB, using defaults:", err);
  }

  return {
    masterPin: DEFAULT_MASTER_PIN,
    emergencyLockdown: false,
    lockdownReason: "Executive emergency lockdown activated.",
    failedAttemptLimit: MAX_FAILED_ATTEMPTS,
    lockoutMinutes: 30,
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

// Rate Limiting Logic
export function checkIpLockout(ip: string): { locked: boolean; minutesRemaining: number; remainingAttempts: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    return { locked: false, minutesRemaining: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check if locked
  if (record.lockedUntil > now) {
    const minutesRemaining = Math.ceil((record.lockedUntil - now) / 60000);
    return { locked: true, minutesRemaining, remainingAttempts: 0 };
  }

  // If lockout expired, reset
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    rateLimitStore.delete(ip);
    return { locked: false, minutesRemaining: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // If previous attempt was outside the sliding window, reset
  if (now - record.lastAttemptAt > ATTEMPT_WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { locked: false, minutesRemaining: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  return { locked: false, minutesRemaining: 0, remainingAttempts };
}

export function recordFailedAttempt(ip: string): { locked: boolean; minutesRemaining: number; remainingAttempts: number } {
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

// Audit Logging
export async function logSecurityEvent(
  ip: string,
  username: string,
  action: SecurityAuditLog["action"],
  details: string,
  userAgent?: string
) {
  const log: SecurityAuditLog = {
    id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ip,
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

// Validate credentials with constant-time check & 2FA Master PIN
export async function validateAdminCredentialsWithPin(
  username: string,
  passcode: string,
  pin: string
): Promise<{ valid: boolean; reason?: "INVALID_CREDENTIALS" | "INVALID_PIN" | "LOCKED_OUT" | "EMERGENCY_LOCKDOWN" }> {
  const config = await getSecurityConfig();

  if (config.emergencyLockdown) {
    return { valid: false, reason: "EMERGENCY_LOCKDOWN" };
  }

  if (!username || !passcode || !pin) {
    return { valid: false, reason: "INVALID_CREDENTIALS" };
  }

  const cleanUser = username.trim().toLowerCase();
  const cleanPass = passcode.trim();
  const cleanPin = pin.trim();

  const isUserValid = timingSafeCompare(cleanUser, ADMIN_USERNAME.toLowerCase());
  const isPassValid = timingSafeCompare(cleanPass, ADMIN_PASSWORD);

  if (!isUserValid || !isPassValid) {
    return { valid: false, reason: "INVALID_CREDENTIALS" };
  }

  const isPinValid = timingSafeCompare(cleanPin, config.masterPin);
  if (!isPinValid) {
    return { valid: false, reason: "INVALID_PIN" };
  }

  return { valid: true };
}
