import { NextRequest, NextResponse } from "next/server";
import { listJobsByEmail } from "@/lib/jobStore";
import { verifyDashboardToken } from "@/lib/dashboardAuth";

export const runtime = "nodejs";

/**
 * GET /api/dashboard/sites?access=TOKEN
 * Returns sites + commerce/booking tiers + manage URL for pro admin.
 */
export async function GET(req: NextRequest) {
  try {
    const access = String(req.nextUrl.searchParams.get("access") || "").trim();
    let email = String(req.nextUrl.searchParams.get("email") || "")
      .trim()
      .toLowerCase();

    if (access) {
      const verified = verifyDashboardToken(access);
      if (!verified) {
        return NextResponse.json(
          { error: "Access link invalid or expired. Request a new one." },
          { status: 401 }
        );
      }
      email = verified.email;
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email or access token required" },
        { status: 400 }
      );
    }

    const jobs = await listJobsByEmail(email);
    const displayName =
      jobs.find((j) => j.customerName)?.customerName || null;

    const sites = jobs.map((j) => {
      const live = j.status === "done" && Boolean(j.siteUrl);
      const editorPath =
        j.editorMode === "simple"
          ? `/preview-simple/${j.id}`
          : `/preview/${j.id}`;
      const commerceTier = j.commerceTier || "lite";
      const bookingTier = j.bookingTier || "lite";
      const isPro = commerceTier === "pro" || bookingTier === "pro";
      return {
        jobId: j.id,
        status: j.status,
        username: j.username || j.parsedUsername || null,
        customerName: j.customerName || null,
        email: j.email || null,
        siteUrl: j.siteUrl || null,
        repoUrl: j.repoUrl || null,
        editorMode: j.editorMode || "full",
        editorUrl: editorPath,
        canEdit: true,
        canPushLive: j.status === "done" || j.status === "failed",
        isLive: live,
        commerceTier,
        bookingTier,
        isPro,
        /** Merchant backend (orders, products, bookings) */
        manageUrl: isPro
          ? `/manage/${j.id}?access=${encodeURIComponent(access || "")}`
          : null,
        canUnlockCommerce: live && commerceTier !== "pro",
        canUnlockBooking: live && bookingTier !== "pro",
      };
    });

    return NextResponse.json({
      email,
      displayName,
      sites,
      authenticated: Boolean(access),
      access: access || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
