"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type Phase = "editing" | "modal" | "verifying" | "polling" | "live" | "failed" | "payment_failed";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PreviewPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const searchParams = useSearchParams();
  const paid = searchParams.get("paid");
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(true);
  const [phase, setPhase] = useState<Phase>(paid ? "verifying" : "editing");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewSrc = `/api/site/${jobId}/index.html`;

  // Runs once, right after landing back on this page from Paystack.
  // Paystack's callback_url fires regardless of whether the payment
  // succeeded, failed, or was abandoned, so this is what actually tells
  // those outcomes apart -- otherwise a failed payment would leave the
  // customer staring at "Creating live website..." forever.
  useEffect(() => {
    if (phase !== "verifying") return;

    if (!reference) {
      // No reference to check (shouldn't normally happen) -- fall back to
      // just waiting on the webhook, same as before.
      setPhase("polling");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, reference }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          setPhase("failed");
        } else if (data.status === "payment_failed") {
          setError(data.reason || "The payment wasn't completed.");
          setPhase("payment_failed");
        } else if (data.status === "done") {
          setSiteUrl(data.siteUrl);
          setPhase("live");
        } else if (data.status === "failed") {
          setError(data.error);
          setPhase("failed");
        } else {
          // "deploying" -- payment confirmed, repo created, now waiting on
          // you to import it into Vercel. Hand off to the existing poll.
          setPhase("polling");
        }
      } catch (err: any) {
        setError(String(err?.message ?? err));
        setPhase("failed");
      }
    })();
  }, [phase, jobId, reference]);

  // Poll job status while waiting for you to import the repo into Vercel.
  useEffect(() => {
    if (phase !== "polling") return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/status/${jobId}`);
      const data = await res.json();
      if (data.status === "done") {
        setSiteUrl(data.siteUrl);
        setPhase("live");
        clearInterval(interval);
      } else if (data.status === "failed") {
        setError(data.error);
        setPhase("failed");
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [phase, jobId]);

  function toggleEdit() {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const next = !editing;
    doc.designMode = next ? "on" : "off";
    setEditing(next);
    setSaved(true);
  }

  async function saveEdits() {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const html = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
    await fetch(`/api/site/${jobId}/index.html`, { method: "PUT", body: html });
    setSaved(true);
  }

  async function goLive() {
    setError(null);
    setPhase("modal");
  }

  async function confirmPayment() {
    setError(null);
    if (!username.trim()) {
      setError("Choose a subdomain first.");
      return;
    }
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email — Paystack sends your receipt there.");
      return;
    }
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, username: username.trim(), email: email.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    window.location.href = data.checkoutUrl;
  }

  async function retryDeploy() {
    setError(null);
    setPhase("polling");
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      setPhase("failed");
    }
  }

  return (
    <main style={s.main}>
      <header style={s.toolbar}>
        <div style={s.toolbarLeft}>
          <button
            onClick={toggleEdit}
            style={editing ? s.buttonActive : s.button}
            disabled={phase !== "editing"}
          >
            {editing ? "Editing (click to stop)" : "Edit content"}
          </button>
          {editing && (
            <button onClick={saveEdits} style={s.button} disabled={saved}>
              Save changes
            </button>
          )}
        </div>
        {phase === "editing" && (
          <button onClick={goLive} style={s.primaryButton}>
            Go live
          </button>
        )}
        {phase === "live" && siteUrl && (
          <a href={siteUrl} target="_blank" rel="noreferrer" style={s.liveLink}>
            Live at {siteUrl}
          </a>
        )}
      </header>

      <div style={s.iframeWrap}>
        <iframe
          ref={iframeRef}
          src={previewSrc}
          style={s.iframe}
          title="Site preview"
          onLoad={() => {
            if (editing && iframeRef.current?.contentDocument) {
              iframeRef.current.contentDocument.designMode = "on";
            }
          }}
        />
      </div>

      {phase === "modal" && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={s.modalHeading}>Ready to go live?</h2>
            <p style={s.modalSub}>Support the platform with $9 to publish your site.</p>

            <label style={s.fieldLabel}>Email (for your Paystack receipt)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={s.emailInput}
              autoComplete="email"
            />

            <label style={s.fieldLabel}>Subdomain</label>
            <div style={s.usernameRow}>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                style={s.usernameInput}
              />
              <span style={s.usernameSuffix}>.vercel.app</span>
            </div>

            {error && <p style={s.error}>{error}</p>}
            <div style={s.modalActions}>
              <button onClick={() => setPhase("editing")} style={s.button}>
                Cancel
              </button>
              <button onClick={confirmPayment} style={s.primaryButton}>
                Pay $9 and go live
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "verifying" && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={s.modalHeading}>Confirming your payment…</h2>
            <p style={s.modalSub}>One moment while we check with Paystack.</p>
          </div>
        </div>
      )}

      {phase === "polling" && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={s.modalHeading}>Creating live website…</h2>
            <p style={s.modalSub}>Payment confirmed — your site will be live shortly.</p>
          </div>
        </div>
      )}

      {phase === "payment_failed" && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={{ ...s.modalHeading, color: "#f87171" }}>Payment wasn't completed</h2>
            <p style={s.modalSub}>{error || "The payment was cancelled or didn't go through."}</p>
            <div style={s.modalActions}>
              <button onClick={() => setPhase("editing")} style={s.button}>
                Keep editing
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setPhase("modal");
                }}
                style={s.primaryButton}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "failed" && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={{ ...s.modalHeading, color: "#f87171" }}>Deploy failed</h2>
            <p style={s.modalSub}>{error}</p>
            <div style={s.modalActions}>
              <button onClick={retryDeploy} style={s.primaryButton}>
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  main: { minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" },
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #2a2a2a" },
  toolbarLeft: { display: "flex", gap: 8 },
  iframeWrap: { flex: 1, padding: 16 },
  iframe: { width: "100%", height: "calc(100vh - 100px)", border: "1px solid #2a2a2a", borderRadius: 8, background: "#fff" },
  button: { background: "transparent", color: "#d4d4d4", border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" },
  buttonActive: { background: "#f5f5f5", color: "#0d0d0d", border: "1px solid #f5f5f5", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" },
  primaryButton: { background: "#22c55e", color: "#052e12", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  liveLink: { color: "#4ade80", fontSize: 13 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#171717", border: "1px solid #2a2a2a", borderRadius: 12, padding: 28, width: 360 },
  modalHeading: { color: "#f5f5f5", fontSize: 18, fontWeight: 500, margin: "0 0 8px" },
  modalSub: { color: "#a3a3a3", fontSize: 13, margin: "0 0 16px" },
  fieldLabel: { display: "block", color: "#a3a3a3", fontSize: 12, marginBottom: 6 },
  emailInput: { width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#f5f5f5", fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box" },
  usernameRow: { display: "flex", alignItems: "center", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" },
  usernameInput: { flex: 1, background: "#0d0d0d", border: "none", padding: "10px 12px", color: "#f5f5f5", fontSize: 14, outline: "none" },
  usernameSuffix: { color: "#6b6b6b", fontSize: 13, padding: "0 12px" },
  error: { color: "#f87171", fontSize: 13, margin: "8px 0 0" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 },
};
