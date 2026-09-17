import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
  type AdminSessionPayload,
} from "./adminSession";
import { unauthorized } from "./http";

function readCookie(cookieHeader: string, name: string): string | undefined {
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === name) {
      return rest.join("=");
    }
  }
  return undefined;
}

export async function getAdminSession(
  request: Request | NextRequest
): Promise<AdminSessionPayload | null> {
  const fromNext =
    "cookies" in request && typeof request.cookies?.get === "function"
      ? request.cookies.get(ADMIN_COOKIE_NAME)?.value
      : undefined;
  const token = fromNext || readCookie(request.headers.get("cookie") || "", ADMIN_COOKIE_NAME);
  return verifyAdminSessionToken(token);
}

export async function requireAdmin(request: Request | NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return { ok: false as const, session: null, response: unauthorized() };
  }
  return { ok: true as const, session, response: null };
}
