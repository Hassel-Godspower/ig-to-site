/**
 * Notify customer when site is live.
 * Email: Resend (RESEND_API_KEY) or optional SMTP-style via RESEND
 * WhatsApp: Meta Cloud API (WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID)
 *           or Twilio (TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_WHATSAPP_FROM)
 *
 * Never throws to caller — logs and returns results.
 */

export interface NotifyInput {
  siteUrl: string;
  username: string;
  email?: string | null;
  phone?: string | null;
  businessName?: string | null;
}

export interface NotifyResult {
  emailSent: boolean;
  whatsappSent: boolean;
  errors: string[];
}

function digitsPhone(phone: string): string | null {
  const d = phone.replace(/\D/g, "");
  if (d.length < 10) return null;
  // Nigeria local 0xxxxxxxxxx → 234
  if (d.startsWith("0") && d.length === 11) return `234${d.slice(1)}`;
  return d;
}

function messageBody(input: NotifyInput): string {
  const name = input.businessName || input.username;
  return (
    `Your website is live!\n\n` +
    `${name}\n` +
    `${input.siteUrl}\n\n` +
    `Share this link with customers. Powered by gòke.`
  );
}

async function sendEmailResend(to: string, input: NotifyInput): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("RESEND_API_KEY not set");

  const from =
    process.env.RESEND_FROM?.trim() ||
    process.env.NOTIFY_FROM_EMAIL?.trim() ||
    "gòke <onboarding@resend.dev>";

  const name = input.businessName || input.username;
  const html = `
  <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
    <h1 style="font-size:22px;margin:0 0 12px">Your website is live</h1>
    <p style="color:#444;line-height:1.5">Hi — <strong>${escapeHtml(name)}</strong> is published and ready to share.</p>
    <p style="margin:24px 0">
      <a href="${escapeHtml(input.siteUrl)}"
         style="display:inline-block;background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
        Open your site
      </a>
    </p>
    <p style="font-size:14px;color:#666;word-break:break-all">${escapeHtml(input.siteUrl)}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
    <p style="font-size:12px;color:#999">Sent by gòke after your publish payment.</p>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Your site is live — ${name}`,
      html,
      text: messageBody(input),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Resend failed (${res.status}): ${JSON.stringify(data)}`
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Meta WhatsApp Cloud API */
async function sendWhatsAppMeta(toDigits: string, text: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN?.trim();
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (!token || !phoneId) throw new Error("WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID not set");

  const res = await fetch(
    `https://graph.facebook.com/v18.0/${phoneId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toDigits,
        type: "text",
        text: { body: text },
      }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`WhatsApp Meta failed (${res.status}): ${JSON.stringify(data)}`);
  }
}

/** Twilio WhatsApp */
async function sendWhatsAppTwilio(toDigits: string, text: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const auth = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_WHATSAPP_FROM?.trim(); // e.g. whatsapp:+14155238886
  if (!sid || !auth || !from) {
    throw new Error("TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM not set");
  }

  const body = new URLSearchParams({
    From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
    To: `whatsapp:+${toDigits}`,
    Body: text,
  });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${sid}:${auth}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Twilio WhatsApp failed (${res.status}): ${JSON.stringify(data)}`);
  }
}

export async function notifySiteReady(
  input: NotifyInput
): Promise<NotifyResult> {
  const result: NotifyResult = {
    emailSent: false,
    whatsappSent: false,
    errors: [],
  };
  const text = messageBody(input);

  if (input.email && input.email.includes("@")) {
    try {
      if (process.env.RESEND_API_KEY) {
        await sendEmailResend(input.email, input);
        result.emailSent = true;
      } else {
        result.errors.push("RESEND_API_KEY not set — skipped email");
      }
    } catch (e: unknown) {
      result.errors.push(e instanceof Error ? e.message : String(e));
    }
  }

  const phone = input.phone ? digitsPhone(input.phone) : null;
  if (phone) {
    try {
      if (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
        await sendWhatsAppMeta(phone, text);
        result.whatsappSent = true;
      } else if (
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_WHATSAPP_FROM
      ) {
        await sendWhatsAppTwilio(phone, text);
        result.whatsappSent = true;
      } else {
        result.errors.push(
          "No WhatsApp provider configured (Meta or Twilio) — skipped WhatsApp"
        );
      }
    } catch (e: unknown) {
      result.errors.push(e instanceof Error ? e.message : String(e));
    }
  }

  // Optional: also notify operator
  const adminEmail = process.env.NOTIFY_ADMIN_EMAIL?.trim();
  if (adminEmail && process.env.RESEND_API_KEY) {
    try {
      await sendEmailResend(adminEmail, {
        ...input,
        businessName: `[admin] ${input.businessName || input.username}`,
      });
    } catch {
      /* ignore */
    }
  }

  return result;
}

/** Public wa.me link the user can open (not a server push) */
export function waMeShareLink(phone: string, siteUrl: string): string | null {
  const d = digitsPhone(phone);
  if (!d) return null;
  const text = encodeURIComponent(`My new website: ${siteUrl}`);
  return `https://wa.me/${d}?text=${text}`;
}
