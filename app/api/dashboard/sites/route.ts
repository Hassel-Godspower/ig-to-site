import { NextRequest, NextResponse } from "next/server";
import { listJobsByEmail } from "@/lib/jobStore";
import { verifyDashboardToken } from "@/lib/dashboardAuth";

export const runtime = "nodejs";

/**
 * GET /api/dashboard/sites?access=TOKEN
 * Token-only. Email query alone is rejected.
 */
export async function GET(req: NextRequest) {
  try {
    const access = String(req.nextUrl.searchParams.get("access") || "").trim();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Access token required. Request a dashboard link from your email.",
        },
        { status: 401 }
      );
    }

    const verified = verifyDashboardToken(access);
    if (!verified) {
      return NextResponse.json(
        { error: "Access link invalid or expired. Request a new one." },
        { status: 401 }
      );
    }

    const email = verified.email;
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid token email" }, { status: 400 });
    }

    const jobs = await listJobsByEmail(email);
    const displayName =
      jobs.find((j) => j.customerName)?.customerName || null;

    const sites = jobs.map((j) => {
      const live = j.status === "done" && Boolean(j.siteUrl);
      const editorPath =
        j.editorMode === "simple"
          ? "/preview-simple/" + j.id
          : "/preview/" + j.id;
      const commerceTier = j.commerceTier || "lite";
      const bookingTier = j.bookingTier || "lite";
      const isPro = commerceTier === "pro" || bookingTier === "pro";
      const accessQ = encodeURIComponent(access);

      return {
        jobId: j.id,
        status: j.status,
        username: j.username || j.parsedUsername || null,
        customerName: j.customerName || null,
        email: j.email || null,
        siteUrl: j.siteUrl || null,
        repoUrl: j.repoUrl || null,
        editorMode: j.editorMode || "full",
        editorUrl: editorPath + "?access=" + accessQ,
        canEdit: true,
        canPushLive: j.status === "done" || j.status === "failed",
        isLive: live,
        canDownloadZip: true,
        commerceTier,
        bookingTier,
        isPro,
        manageUrl: isPro ? "/manage/" + j.id + "?access=" + accessQ : null,
        canUnlockCommerce: live && commerceTier !== "pro",
        canUnlockBooking: live && bookingTier !== "pro",
      };
    });

    return NextResponse.json({
      email,
      displayName,
      sites,
      authenticated: true,
      access,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
