import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/practice/:path*",
    "/competitive/:path*",
    "/daily/:path*",
    "/leaderboard/:path*",
    "/progress/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
