import { NextRequest, NextResponse } from "next/server";
import { createDashboardToken } from "@/lib/dashboardAuth";
import { listJobsByEmail } from "@/lib/jobStore";

export const runtime = "nodejs";

/**
 * POST { email }
 * Emails a signed dashboard link (7 days). Uses Resend when configured.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const jobs = await listJobsByEmail(email);
    if (jobs.length === 0) {
      // Do not reveal whether email exists in a harsh way — still generic message
      return NextResponse.json({
        ok: true,
        message:
          "If we have sites for this email, an access link will arrive shortly.",
      });
    }

    const token = createDashboardToken(email);
    const base = (process.env.BASE_URL || "").replace(/\/$/, "");
    if (!base) {
      return NextResponse.json({ error: "BASE_URL not configured" }, { status: 500 });
    }
    const link = `${base}/dashboard?access=${encodeURIComponent(token)}`;

    const name =
      jobs.find((j) => j.customerName)?.customerName ||
      jobs.find((j) => j.username)?.username ||
      "there";

    const key = process.env.RESEND_API_KEY?.trim();
    if (key) {
      const from =
        process.env.RESEND_FROM?.trim() ||
        process.env.NOTIFY_FROM_EMAIL?.trim() ||
        "gòke <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: "Your gòke dashboard access link",
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
              <h1 style="font-size:20px">Hi ${escapeHtml(name)}</h1>
              <p style="color:#444;line-height:1.5">Use this link to view and edit your published gòke sites. It expires in 7 days.</p>
              <p style="margin:24px 0">
                <a href="${escapeHtml(link)}"
                   style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
                  Open my dashboard
                </a>
              </p>
              <p style="font-size:12px;color:#999;word-break:break-all">${escapeHtml(link)}</p>
            </div>`,
          text: `Hi ${name},\n\nOpen your gòke dashboard:\n${link}\n\nLink expires in 7 days.`,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        return NextResponse.json(
          { error: `Email failed: ${t.slice(0, 200)}` },
          { status: 502 }
        );
      }
    } else {
      // Dev fallback: return link in response when Resend not configured
      return NextResponse.json({
        ok: true,
        message: "RESEND_API_KEY not set — use this link (dev only).",
        accessLink: link,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Check your email for the dashboard access link.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
