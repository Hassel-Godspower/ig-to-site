"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type Phase = "editing" | "modal" | "polling" | "live" | "failed";

export default function PreviewPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const paid = useSearchParams().get("paid");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(true);
  const [phase, setPhase] = useState<Phase>(paid ? "polling" : "editing");
  const [username, setUsername] = useState("");
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewSrc = `/api/site/${jobId}/index.html`;

  // Poll job status after returning from Stripe.
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
    setPhase("modal");
  }

  async function confirmPayment() {
    setError(null);
    if (!username.trim()) {
      setError("Choose a subdomain first.");
      return;
    }
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, username: username.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    window.location.href = data.checkoutUrl;
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
            <p style={s.modalSub}>Your site will publish at:</p>
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
                Pay and go live
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "polling" && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={s.modalHeading}>Publishing your site</h2>
            <p style={s.modalSub}>Payment confirmed — deploying to Vercel now.</p>
          </div>
        </div>
      )}

      {phase === "failed" && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={{ ...s.modalHeading, color: "#f87171" }}>Deploy failed</h2>
            <p style={s.modalSub}>{error}</p>
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
  usernameRow: { display: "flex", alignItems: "center", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" },
  usernameInput: { flex: 1, background: "#0d0d0d", border: "none", padding: "10px 12px", color: "#f5f5f5", fontSize: 14, outline: "none" },
  usernameSuffix: { color: "#6b6b6b", fontSize: 13, padding: "0 12px" },
  error: { color: "#f87171", fontSize: 13, margin: "8px 0 0" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 },
};
