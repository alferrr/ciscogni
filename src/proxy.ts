import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  let payload: Record<string, unknown>;
  try {
    ({ payload } = await jwtVerify(token, secret));
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/admin") && payload.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/register",
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/practice/:path*",
    "/competitive/:path*",
    "/daily/:path*",
    "/leaderboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
