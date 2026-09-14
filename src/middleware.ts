import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "./lib/adminSession";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow login endpoints to bypass protection
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isLogoutApi = pathname === "/api/admin/logout";

  if (isLogoutApi) {
    return NextResponse.next();
  }

  // 2. Inspect session cookie
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(token);
  const isAuthenticated = !!session;

  // 3. If accessing /admin/login while already authenticated, redirect to /admin
  if (isLoginPage) {
    if (isAuthenticated) {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
    return NextResponse.next();
  }

  if (isLoginApi) {
    return NextResponse.next();
  }

  // 4. Protect all other /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 5. Protect all other /api/admin/* endpoints
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized access to executive administration API." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
