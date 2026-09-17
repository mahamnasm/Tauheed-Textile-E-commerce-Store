import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "./lib/adminSession";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/api/admin/login", "/api/admin/logout"]);

const PROTECTED_PUBLIC_APIS = [
  "/api/orders/csv",
  "/api/products/csv",
  "/api/ai/config",
  "/api/ai/caption",
  "/api/ai/copywriter",
  "/api/ai/nano-banana",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    if (pathname === "/admin/login") {
      const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
      const session = await verifyAdminSessionToken(token);
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  const needsAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    PROTECTED_PUBLIC_APIS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!needsAdmin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/orders/csv",
    "/api/products/csv",
    "/api/ai/config",
    "/api/ai/caption",
    "/api/ai/copywriter",
    "/api/ai/nano-banana",
  ],
};
