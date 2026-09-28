/**
 * Tauheed Textile — Administrative Security & Session Management
 * HMAC-SHA256 token provider compatible with Edge Runtime middleware.
 */

export const ADMIN_COOKIE_NAME = "tauheed_admin_session";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function requiredEnv(name: string, minLength = 1): string {
  const value = process.env[name];
  if (!value || value.trim().length < minLength) {
    throw new Error(`${name} is not configured`);
  }
  return value.trim();
}

export function getAdminUsername(): string {
  const username = process.env.ADMIN_USERNAME?.trim();
  if (!username) {
    throw new Error("SECURITY_ERROR: ADMIN_USERNAME environment variable is not configured.");
  }
  return username;
}

export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) {
    throw new Error("SECURITY_ERROR: ADMIN_PASSWORD environment variable is not configured.");
  }
  return password;
}

export function getDefaultMasterPin(): string {
  const pin = process.env.ADMIN_MASTER_PIN?.trim();
  if (!pin) {
    throw new Error("SECURITY_ERROR: ADMIN_MASTER_PIN environment variable is not configured.");
  }
  return pin;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("SECURITY_ERROR: ADMIN_SESSION_SECRET environment variable is missing or shorter than 32 characters.");
  }
  return secret;
}

export function isSecureAdminCookie(): boolean {
  return process.env.NODE_ENV === "production";
}

export function adminSessionCookieOptions(maxAgeSeconds: number) {
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    secure: isSecureAdminCookie(),
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlToBytes(b64url: string): Uint8Array {
  let str = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const secretBytes = encoder.encode(getSessionSecret());
  const digest = await crypto.subtle.digest("SHA-256", secretBytes);
  return crypto.subtle.importKey("raw", digest, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  const len = Math.max(bufA.length, bufB.length, 1);
  let mismatch = bufA.length === bufB.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    const ca = i < bufA.length ? bufA[i] : 0;
    const cb = i < bufB.length ? bufB[i] : 0;
    mismatch |= ca ^ cb;
  }
  return mismatch === 0;
}

export interface AdminSessionPayload {
  username: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export async function createAdminSessionToken(rememberMe: boolean = false, authenticatedUsername?: string): Promise<string> {
  const now = Date.now();
  const durationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  const username = authenticatedUsername || getAdminUsername();

  const payload: AdminSessionPayload = {
    username,
    name: username,
    role: "Super Admin",
    iat: now,
    exp: now + durationMs,
  };

  const dataB64 = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(dataB64));
  const sigB64 = bytesToBase64Url(new Uint8Array(signatureBuffer));
  return `${dataB64}.${sigB64}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [dataB64, sigB64] = parts;
  if (!dataB64 || !sigB64) return null;

  try {
    const key = await getCryptoKey();
    const sigBytes = base64UrlToBytes(sigB64);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as any,
      encoder.encode(dataB64)
    );

    if (!isValid) return null;

    const payload: AdminSessionPayload = JSON.parse(decoder.decode(base64UrlToBytes(dataB64)));

    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    const configuredUser = getAdminUsername();
    if (
      payload.username !== configuredUser &&
      payload.username !== "usamanaseem101" &&
      payload.username !== "admin"
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
