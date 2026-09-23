import { NextRequest, NextResponse } from "next/server";

// Lightweight cookie-presence check. Full JWT verification happens again in
// each server component/action via getAdminSession() — this just keeps
// logged-out visitors from loading the admin shell at all.
export function middleware(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const hasSession = req.cookies.has("unau_admin_session");

  if (!isLoginPage && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
