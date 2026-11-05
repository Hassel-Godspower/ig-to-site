import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { getJob } from "./jobStore";
import { verifyDashboardToken } from "./dashboardAuth";

/**
 * Job-scoped edit tokens for site write APIs (PUT / upload / delete / seed).
 * Preview pages store the token in sessionStorage after /edit-token claim.
 */

function secret(): string {
  const s =
    process.env.EDIT_TOKEN_SECRET?.trim() ||
    process.env.DASHBOARD_SECRET?.trim() ||
    process.env.PAYSTACK_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "";
  if (!s) {
    throw new Error(
      "No secret for edit tokens (set EDIT_TOKEN_SECRET or DASHBOARD_SECRET)"
    );
  }
  return s;
}

function b64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

/** Default: 14 days — covers free preview → pay window */
export function createEditToken(jobId: string, ttlSec = 60 * 60 * 24 * 14): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const payload = `edit|${jobId}|${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest();
  return `${b64url(payload)}.${b64url(sig)}`;
}

export function verifyEditToken(token: string, jobId: string): boolean {
  try {
    const [p, s] = token.split(".");
    if (!p || !s) return false;
    const payload = fromB64url(p).toString("utf8");
    const expected = createHmac("sha256", secret()).update(payload).digest();
    const got = fromB64url(s);
    if (got.length !== expected.length || !timingSafeEqual(got, expected)) {
      return false;
    }
    const [kind, id, expStr] = payload.split("|");
    if (kind !== "edit" || id !== jobId) return false;
    const exp = Number(expStr);
    if (!exp || Date.now() / 1000 > exp) return false;
    return true;
  } catch {
    return false;
  }
}

function adminPasswordOk(headerVal: string | null): boolean {
  const admin = process.env.ADMIN_PASSWORD?.trim();
  if (!admin || !headerVal) return false;
  try {
    const a = Buffer.from(admin, "utf8");
    const b = Buffer.from(headerVal, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export type WriteAuthResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

/**
 * Authorize site mutations for a job.
 * Accepts:
 * - x-goke-edit-token (or ?edit=) job-scoped edit token
 * - x-goke-access dashboard token matching job.email
 * - x-goke-admin === ADMIN_PASSWORD
 */
export async function assertSiteWriteAccess(
  req: NextRequest,
  jobId: string
): Promise<WriteAuthResult> {
  if (!jobId || /[^a-zA-Z0-9_-]/.test(jobId)) {
    return { ok: false, status: 400, error: "Invalid jobId" };
  }

  if (adminPasswordOk(req.headers.get("x-goke-admin"))) {
    return { ok: true };
  }

  const editTok =
    req.headers.get("x-goke-edit-token")?.trim() ||
    req.nextUrl.searchParams.get("edit")?.trim() ||
    "";
  if (editTok && verifyEditToken(editTok, jobId)) {
    return { ok: true };
  }

  const dash =
    req.headers.get("x-goke-access")?.trim() ||
    req.nextUrl.searchParams.get("access")?.trim() ||
    "";
  if (dash) {
    const verified = verifyDashboardToken(dash);
    if (verified) {
      const job = await getJob(jobId);
      if (!job) return { ok: false, status: 404, error: "Job not found" };
      if (job.email && job.email.toLowerCase() === verified.email) {
        return { ok: true };
      }
      return {
        ok: false,
        status: 403,
        error: "Dashboard token does not own this job",
      };
    }
  }

  return {
    ok: false,
    status: 401,
    error:
      "Edit authorization required. Open the editor from your generate link or dashboard.",
  };
}

/** Admin-only force deploy / override */
export function assertAdminForce(req: NextRequest): boolean {
  return adminPasswordOk(req.headers.get("x-goke-admin"));
}
