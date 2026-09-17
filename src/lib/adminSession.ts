/**
 * Tauheed Textile — Administrative Security & Session Management
 * Universal Web Crypto API HMAC-SHA256 Token Provider
 * Compatible with Edge Runtime (Middleware) and Node.js Server Runtime
 */

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "usamanaseem101";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "0345usama00";
export const DEFAULT_MASTER_PIN = process.env.ADMIN_MASTER_PIN || "786000";
export const ADMIN_COOKIE_NAME = "tauheed_admin_session";

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  "tauheed-textile-admin-fortress-master-secret-key-2026-lahore-secure";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
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
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Universal Timing-Safe String Comparison (Zero Timing Leakage)
export function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  if (bufA.length !== bufB.length) return false;
  let mismatch = 0;
  for (let i = 0; i < bufA.length; i++) {
    mismatch |= bufA[i] ^ bufB[i];
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

export async function createAdminSessionToken(rememberMe: boolean = false): Promise<string> {
  const now = Date.now();
  const durationMs = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000; // 7 days

  const payload: AdminSessionPayload = {
    username: ADMIN_USERNAME,
    name: "Usama Naseem",
    role: "Super Admin",
    iat: now,
    exp: now + durationMs,
  };

  const payloadJson = JSON.stringify(payload);
  const dataB64 = bytesToBase64Url(encoder.encode(payloadJson));
  try {
    const key = await getCryptoKey();
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(dataB64) as any);
    const sigB64 = bytesToBase64Url(new Uint8Array(signatureBuffer));

    return `${dataB64}.${sigB64}`;
  } catch (e) {
    throw e;
  }
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
      encoder.encode(dataB64) as any
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlToBytes(dataB64);
    const payload: AdminSessionPayload = JSON.parse(decoder.decode(payloadBytes));

    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    if (payload.username !== ADMIN_USERNAME) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
