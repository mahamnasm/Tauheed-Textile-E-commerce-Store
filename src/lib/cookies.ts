import { NextResponse } from "next/server";
import { signToken } from "./auth";

export const ACCESS_TOKEN_COOKIE = "tauheed_access_token";
export const REFRESH_TOKEN_COOKIE = "tauheed_refresh_token";

/**
 * Sets secure HttpOnly, SameSite=Lax cookies on the Next.js response for JWT tokens.
 */
export function setAuthCookies(
  response: NextResponse,
  payload: { id: string; email: string; role: string; name: string }
): NextResponse {
  const isProduction = process.env.NODE_ENV === "production";

  // Sign short-lived access token (7 days)
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
 * Clears auth cookies upon logout.
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
  return response;
}
