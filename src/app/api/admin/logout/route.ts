import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminSessionCookieOptions } from "@/lib/adminSession";

function clearAdminCookie(response: NextResponse) {
  response.cookies.set({
    ...adminSessionCookieOptions(0),
    name: ADMIN_COOKIE_NAME,
    value: "",
    expires: new Date(0),
  });
  return response;
}

export async function POST() {
  return clearAdminCookie(
    NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    })
  );
}

export async function GET(request: Request) {
  const url = new URL("/admin/login", request.url);
  return clearAdminCookie(NextResponse.redirect(url));
}
