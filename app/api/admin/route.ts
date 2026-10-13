import { NextRequest, NextResponse } from "next/server";
import { listLiveVisitors, listRecentSessions } from "@/lib/visitorTrack";

export const runtime = "nodejs";

const PLATFORM_SITE_ID = "platform";

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")?.value;
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected || !cookie) return false;
  return cookie === expected;
}

/**
 * GET /api/admin/visitors
 * Platform owner: who is on highvaluesolutions.net right now.
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { live, count } = await listLiveVisitors(PLATFORM_SITE_ID);
    const recent = await listRecentSessions(PLATFORM_SITE_ID, 40);
    return NextResponse.json({
      site: "gòke platform",
      liveCount: count,
      live,
      recent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
