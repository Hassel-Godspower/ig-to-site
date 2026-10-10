import { createHmac, timingSafeEqual } from "crypto";

/**
 * Lightweight signed access tokens for the customer dashboard.
 * No password required — user proves email ownership via link sent by Resend.
 *
 * Token payload: email|expUnix
 * Secret: DASHBOARD_SECRET or PAYSTACK_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY
 */

function secret(): string {
  const s =
    process.env.DASHBOARD_SECRET?.trim() ||
    process.env.PAYSTACK_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    "";
  if (!s) throw new Error("No secret for dashboard tokens (set DASHBOARD_SECRET)");
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

export function createDashboardToken(email: string, ttlSec = 60 * 60 * 24 * 7): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const payload = `${email.trim().toLowerCase()}|${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest();
  return `${b64url(payload)}.${b64url(sig)}`;
}

export function verifyDashboardToken(token: string): { email: string } | null {
  try {
    const [p, s] = token.split(".");
    if (!p || !s) return null;
    const payload = fromB64url(p).toString("utf8");
    const expected = createHmac("sha256", secret()).update(payload).digest();
    const got = fromB64url(s);
    if (got.length !== expected.length || !timingSafeEqual(got, expected)) {
      return null;
    }
    const [email, expStr] = payload.split("|");
    const exp = Number(expStr);
    if (!email?.includes("@") || !exp || Date.now() / 1000 > exp) return null;
    return { email: email.toLowerCase() };
  } catch {
    return null;
  }
}
