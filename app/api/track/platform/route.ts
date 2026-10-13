import { NextRequest, NextResponse } from "next/server";
import { recordHeartbeat } from "@/lib/visitorTrack";

export const runtime = "nodejs";

/** Fixed tenant key for highvaluesolutions.net / gòke marketing site */
export const PLATFORM_SITE_ID = "platform";

/**
 * POST /api/track/platform
 * Anonymous pageview + heartbeat from the gòke marketing site itself.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const sid = String(body.sid || "").slice(0, 64);
    if (!sid || sid.length < 8) {
      return NextResponse.json({ error: "sid required" }, { status: 400 });
    }

    const path = body.path ? String(body.path).slice(0, 500) : undefined;
    const referrer = body.referrer
      ? String(body.referrer).slice(0, 500)
      : undefined;
    const type = body.type === "pageview" ? "pageview" : "ping";
    const ua = req.headers.get("user-agent")?.slice(0, 300) || undefined;
    const country =
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-vercel-ip-country") ||
      undefined;

    await recordHeartbeat({
      jobId: PLATFORM_SITE_ID,
      sessionId: sid,
      path,
      referrer,
      userAgent: ua,
      country: country || undefined,
      isPageview: type === "pageview",
    });

    return NextResponse.json({ ok: true }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
