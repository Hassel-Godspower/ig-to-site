import { NextRequest, NextResponse } from "next/server";
import { listJobs } from "@/lib/jobStore";

export const runtime = "nodejs";

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")?.value;
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected || !cookie) return false;
  return cookie === expected;
}

/**
 * GET /api/admin/jobs
 * Platform admin: all jobs with customer + WhatsApp + country + live URLs.
 */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const jobs = await listJobs(500);
    const rows = jobs.map((j) => {
      const phoneDigits = (j.phone || "").replace(/\D/g, "");
      const wa =
        phoneDigits.length >= 8
          ? `https://wa.me/${phoneDigits.replace(/^0/, "234")}`
          : null;
      // Heuristic: if already has country code 234 keep as-is
      const waLink = phoneDigits
        ? `https://wa.me/${phoneDigits.startsWith("0") && phoneDigits.length === 11 ? "234" + phoneDigits.slice(1) : phoneDigits}`
        : null;

      return {
        jobId: j.id,
        status: j.status,
        username: j.username || j.parsedUsername || null,
        customerName: j.customerName || null,
        email: j.email || null,
        phone: j.phone || null,
        whatsappUrl: waLink,
        country: j.country || null,
        siteUrl: j.siteUrl || null,
        repoUrl: j.repoUrl || null,
        editorMode: j.editorMode || null,
        commerceTier: j.commerceTier || "lite",
        bookingTier: j.bookingTier || "lite",
        isLive: j.status === "done" && Boolean(j.siteUrl),
        error: j.error || null,
        createdAt: j.createdAt || null,
      };
    });

    const stats = {
      total: rows.length,
      live: rows.filter((r) => r.isLive).length,
      pendingPayment: rows.filter((r) => r.status === "pending_payment").length,
      deploying: rows.filter((r) => r.status === "deploying").length,
      failed: rows.filter((r) => r.status === "failed").length,
      draft: rows.filter((r) => r.status === "draft").length,
    };

    return NextResponse.json({ stats, jobs: rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
