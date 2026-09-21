import { NextRequest, NextResponse } from "next/server";

// Single-admin gate: the whole /admin area (and its API routes) requires a
// cookie whose value matches ADMIN_PASSWORD exactly. There's no session
// database and no per-user accounts -- this is meant for one operator (you)
// checking on job status, not a multi-admin system. The cookie is
// httpOnly + secure, so it's never readable from browser JS and only ever
// sent over HTTPS to this same origin.
const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("admin_session")?.value;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || cookie !== expected) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
