import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import { createEditToken, verifyEditToken } from "@/lib/editAuth";
import { verifyDashboardToken } from "@/lib/dashboardAuth";

export const runtime = "nodejs";

/**
 * POST /api/site/[jobId]/edit-token
 * Issues a short-lived edit token for the visual editor.
 *
 * Allowed when:
 * - Job exists and is not a locked "done" site without ownership proof, OR
 * - Valid dashboard access token for the job's email, OR
 * - Client already holds a still-valid edit token (refresh)
 *
 * Pre-publish jobs (draft / pending_payment / failed / deploying) may claim
 * with only jobId (link secrecy). Published jobs require dashboard access.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    if (!jobId || /[^a-zA-Z0-9_-]/.test(jobId)) {
      return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
    }

    const job = await getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    let body: { access?: string; edit?: string } = {};
    try {
      body = await req.json();
    } catch {
      /* empty body ok */
    }

    const access =
      String(body.access || req.headers.get("x-goke-access") || "").trim();
    const existingEdit = String(
      body.edit || req.headers.get("x-goke-edit-token") || ""
    ).trim();

    if (existingEdit && verifyEditToken(existingEdit, jobId)) {
      const token = createEditToken(jobId);
      return NextResponse.json({ token, expiresInDays: 14 });
    }

    if (access) {
      const v = verifyDashboardToken(access);
      if (!v) {
        return NextResponse.json(
          { error: "Access link invalid or expired" },
          { status: 401 }
        );
      }
      if (!job.email || job.email.toLowerCase() !== v.email) {
        return NextResponse.json(
          { error: "This access link does not own this site" },
          { status: 403 }
        );
      }
      const token = createEditToken(jobId);
      return NextResponse.json({ token, expiresInDays: 14 });
    }

    // Link secrecy for unpublished / in-progress jobs
    if (job.status === "done" && job.siteUrl) {
      return NextResponse.json(
        {
          error:
            "This site is live. Open your dashboard access link to edit, or use x-goke-access.",
        },
        { status: 401 }
      );
    }

    const token = createEditToken(jobId);
    return NextResponse.json({ token, expiresInDays: 14 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
