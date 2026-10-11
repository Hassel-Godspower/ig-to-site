import { NextRequest, NextResponse } from "next/server";
import { getJob, type Job } from "@/lib/jobStore";
import { verifyDashboardToken } from "@/lib/dashboardAuth";

export function corsHeaders(req?: NextRequest): Record<string, string> {
  const origin = req?.headers.get("origin") || "*";
  // Static merchant sites on *.pages.dev / custom domains call these APIs
  return {
    "Access-Control-Allow-Origin": origin === "null" ? "*" : origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-goke-access",
    "Access-Control-Max-Age": "86400",
  };
}

export function json(
  body: unknown,
  status = 200,
  req?: NextRequest
): NextResponse {
  return NextResponse.json(body, { status, headers: corsHeaders(req) });
}

export async function requirePublishedJob(jobId: string): Promise<Job> {
  const job = await getJob(jobId);
  if (!job) throw Object.assign(new Error("Job not found"), { status: 404 });
  if (job.status !== "done") {
    throw Object.assign(new Error("Site must be published (go live) first"), {
      status: 400,
    });
  }
  return job;
}

export async function requireCommercePro(jobId: string): Promise<Job> {
  const job = await requirePublishedJob(jobId);
  if ((job.commerceTier || "lite") !== "pro") {
    throw Object.assign(new Error("Unlock Gòke Commerce Pro first"), {
      status: 403,
    });
  }
  return job;
}

export async function requireBookingPro(jobId: string): Promise<Job> {
  const job = await requirePublishedJob(jobId);
  if ((job.bookingTier || "lite") !== "pro") {
    throw Object.assign(new Error("Unlock Gòke Booking Pro first"), {
      status: 403,
    });
  }
  return job;
}

/** Owner routes: require valid dashboard access token matching job email */
export function requireOwnerAccess(req: NextRequest, job: Job): void {
  const token =
    req.headers.get("x-goke-access") ||
    req.nextUrl.searchParams.get("access") ||
    "";
  if (!token) {
    throw Object.assign(
      new Error("Missing access token — open dashboard link first"),
      { status: 401 }
    );
  }
  const verified = verifyDashboardToken(token);
  if (!verified) {
    throw Object.assign(new Error("Invalid or expired access link"), {
      status: 401,
    });
  }
  const jobEmail = (job.email || "").trim().toLowerCase();
  if (!jobEmail || verified.email !== jobEmail) {
    throw Object.assign(new Error("Access email does not own this site"), {
      status: 403,
    });
  }
}

export function errJson(err: unknown, req?: NextRequest): NextResponse {
  const message = err instanceof Error ? err.message : String(err);
  const status =
    typeof err === "object" &&
    err &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number"
      ? (err as { status: number }).status
      : 500;
  return json({ error: message }, status, req);
}
