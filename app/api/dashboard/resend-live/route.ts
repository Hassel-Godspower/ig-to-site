import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import { verifyDashboardToken } from "@/lib/dashboardAuth";
import { notifySiteReady } from "@/lib/notifySiteReady";

export const runtime = "nodejs";

/**
 * POST { jobId, access }
 * Resend "your site is live" email for a job the token owns.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const jobId = String(body.jobId || "").trim();
    const access = String(body.access || "").trim();

    if (!jobId || !access) {
      return NextResponse.json(
        { error: "jobId and access token required" },
        { status: 400 }
      );
    }

    const verified = verifyDashboardToken(access);
    if (!verified) {
      return NextResponse.json(
        { error: "Access link invalid or expired. Request a new one." },
        { status: 401 }
      );
    }

    const job = await getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const jobEmail = (job.email || "").trim().toLowerCase();
    if (!jobEmail || jobEmail !== verified.email.toLowerCase()) {
      return NextResponse.json(
        { error: "This site is not on your account." },
        { status: 403 }
      );
    }

    if (!job.siteUrl || job.status !== "done") {
      return NextResponse.json(
        {
          error:
            "Site is not live yet. Complete payment or use Push live updates first.",
        },
        { status: 400 }
      );
    }

    const notify = await notifySiteReady({
      siteUrl: job.siteUrl,
      username: job.username || job.parsedUsername || jobId,
      email: job.email,
      phone: job.phone,
      businessName: job.customerName || job.username || job.parsedUsername,
    });

    if (!notify.emailSent) {
      return NextResponse.json(
        {
          error:
            notify.errors.join("; ") ||
            "Could not send email. Check RESEND_API_KEY or contact support.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      emailSent: true,
      siteUrl: job.siteUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
