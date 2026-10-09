"use client";

import { useState } from "react";
import Link from "next/link";

type SiteRow = {
  jobId: string;
  status: string;
  username: string | null;
  siteUrl: string | null;
  repoUrl: string | null;
  editorUrl: string;
  canEdit: boolean;
  isLive: boolean;
  editorMode: string;
};

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lookedUp, setLookedUp] = useState(false);

  async function load(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    setLookedUp(true);
    try {
      const res = await fetch(
        `/api/dashboard/sites?email=${encodeURIComponent(email.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setSites(data.sites || []);
    } catch (err: unknown) {
      setSites([]);
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0b0d12",
        color: "#f3f4f6",
        fontFamily: "system-ui, sans-serif",
        padding: "24px 16px 48px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p style={{ margin: "0 0 8px" }}>
          <Link href="/" style={{ color: "#c4b5fd", textDecoration: "none", fontWeight: 700 }}>
            gòke
          </Link>
        </p>
        <h1 style={{ fontSize: 28, margin: "0 0 8px" }}>Your sites</h1>
        <p style={{ color: "#9ca3af", margin: "0 0 24px", lineHeight: 1.5 }}>
          Enter the email you used at checkout to open your published site or continue editing
          in the visual editor.
        </p>

        <form
          onSubmit={load}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 28,
          }}
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            style={{
              flex: "1 1 220px",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid rgba(167,139,250,0.35)",
              background: "#12151c",
              color: "#f3f4f6",
              fontSize: 15,
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "none",
              background: "#a78bfa",
              color: "#0b0d12",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Loading…" : "Find my sites"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#fca5a5", marginBottom: 16 }}>{error}</p>
        )}

        {lookedUp && !loading && sites.length === 0 && !error && (
          <p style={{ color: "#9ca3af" }}>
            No sites found for this email. Use the same address from your Paystack receipt.
          </p>
        )}

        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: 12 }}>
          {sites.map((s) => (
            <li
              key={s.jobId}
              style={{
                background: "#12151c",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 16,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <strong style={{ fontSize: 16 }}>
                  {s.username ? `@${s.username}` : s.jobId.slice(0, 10)}
                </strong>
                <span
                  style={{
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: s.isLive
                      ? "rgba(52,211,153,0.15)"
                      : "rgba(251,191,36,0.12)",
                    color: s.isLive ? "#6ee7b7" : "#fbbf24",
                  }}
                >
                  {s.status}
                </span>
              </div>
              <div style={{ marginTop: 12, display: 8, displayWrap: "wrap" }}>
                {s.canEdit && (
                  <a
                    href={s.editorUrl}
                    style={{
                      display: "inline-block",
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "rgba(167,139,250,0.2)",
                      color: "#ede9fe",
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Edit site
                  </a>
                )}
                {s.siteUrl && (
                  <a
                    href={s.siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "#a78bfa",
                      color: "#0b0d12",
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Open live site
                  </a>
                )}
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 11, color: "#6b7280" }}>
                Job {s.jobId} · {s.editorMode} editor
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
