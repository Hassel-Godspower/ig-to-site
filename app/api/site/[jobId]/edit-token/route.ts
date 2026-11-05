import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/jobStore";
import {
  createEditToken,
  verifyEditToken,
} from "@/lib/editAuth";
import { verifyDashboardToken } from "@/lib/dashboardAuth";

export const runtime = "nodejs";

/**
 * POST /api/site/[jobId]/edit-token
 * Body optional: { edit?: string, access?: string }
 *
 * Issues a job-scoped edit token for preview / upload / PUT.
 * Allowed when:
 * - existing valid edit token is refreshed, or
 * - dashboard access token matches job.email, or
 * - job exists and is still in free-edit window (preview before/after pay)
 *
 * Preview pages call this once on mount via ensureEditToken().
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId || /[^a-zA-Z0-9_-]/.test(jobId)) {
    return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
  }

  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  let body: { edit?: string; access?: string } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const existing =
    String(body.edit || "").trim() ||
    req.headers.get("x-goke-edit-token")?.trim() ||
    "";
  if (existing && verifyEditToken(existing, jobId)) {
    const token = createEditToken(jobId);
    return NextResponse.json({ token, refreshed: true });
  }

  const access =
    String(body.access || "").trim() ||
    req.headers.get("x-goke-access")?.trim() ||
    req.nextUrl.searchParams.get("access")?.trim() ||
    "";
  if (access) {
    const verified = verifyDashboardToken(access);
    if (
      verified &&
      job.email &&
      job.email.toLowerCase() === verified.email
    ) {
      const token = createEditToken(jobId);
      return NextResponse.json({ token, via: "dashboard" });
    }
  }

  // Preview path: anyone who knows the jobId can claim while the site is
  // still a draft/preview. After publish you still need the same job link
  // (security is "unlisted URL" + token after first claim in session).
  // Tighten later with ownership email if you require login before edit.
  const status = String(job.status || "");
  const allowPreviewClaim = [
    "pending_payment",
    "generating",
    "ready",
    "preview",
    "deploying",
    "done",
    "failed",
  ].includes(status);

  if (allowPreviewClaim) {
    const token = createEditToken(jobId);
    return NextResponse.json({ token, via: "preview" });
  }

  return NextResponse.json(
    { error: "Cannot issue edit token for this job" },
    { status: 403 }
  );
}
