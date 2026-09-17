import { NextResponse } from "next/server";
import { signToken } from "./auth";

export const ACCESS_TOKEN_COOKIE = "tauheed_access_token";

/**
 * Sets secure HttpOnly, SameSite=Lax, Secure cookies for customer sessions.
 */
export function setAuthCookies(
  response: NextResponse,
  payload: { id: string; email: string; role: string; name: string }
): NextResponse {
  const isProduction = process.env.NODE_ENV === "production";
  const accessToken = signToken(payload);

  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });

  return response;
}

/**
 * Securely deletes customer auth cookies upon logout.
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  return response;
}
