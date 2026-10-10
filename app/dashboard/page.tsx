"use client";

import { useCallback, useEffect, useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type SiteRow = {
  jobId: string;
  status: string;
  username: string | null;
  customerName: string | null;
  siteUrl: string | null;
  editorUrl: string;
  canEdit: boolean;
  canPushLive: boolean;
  isLive: boolean;
  editorMode: string;
};

const page: CSSProperties = {
  minHeight: "100dvh",
  background: "#0b0d12",
  color: "#f3f4f6",
  fontFamily: "system-ui, sans-serif",
  padding: "24px 16px 48px",
};
const wrap: CSSProperties = { maxWidth: 720, margin: "0 auto" };
const formRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: 16,
};
const inputStyle: CSSProperties = {
  flex: "1 1 220px",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(167,139,250,0.35)",
  background: "#12151c",
  color: "#f3f4f6",
  fontSize: 15,
};
const btnPrimary: CSSProperties = {
  padding: "12px 20px",
  borderRadius: 10,
  border: "none",
  background: "#a78bfa",
  color: "#0b0d12",
  fontWeight: 700,
  cursor: "pointer",
};
const btnGhost: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid rgba(167,139,250,0.35)",
  background: "transparent",
  color: "#ede9fe",
  fontWeight: 600,
  cursor: "pointer",
};
const list: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
const card: CSSProperties = {
  background: "#12151c",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 16,
};
const cardHead: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  alignItems: "center",
};
const actions: CSSProperties = {
  marginTop: 12,
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};
const btnEdit: CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: 8,
  background: "rgba(167,139,250,0.2)",
  color: "#ede9fe",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};
const btnLive: CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: 8,
  background: "#a78bfa",
  color: "#0b0d12",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

function badgeStyle(isLive: boolean): CSSProperties {
  return {
    fontSize: 12,
    padding: "2px 8px",
    borderRadius: 999,
    background: isLive ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.12)",
    color: isLive ? "#6ee7b7" : "#fbbf24",
  };
}

export default function DashboardPage() {
  const search = useSearchParams();
  const accessFromUrl = search.get("access") || "";

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pushing, setPushing] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  const loadWithAccess = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/dashboard/sites?access=${encodeURIComponent(token)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Access failed");
      setSites(data.sites || []);
      setDisplayName(data.displayName || null);
      setEmail(data.email || "");
      setAuthed(true);
      try {
        sessionStorage.setItem("goke_dash_access", token);
      } catch {
        /* ignore */
      }
    } catch (err: unknown) {
      setSites([]);
      setAuthed(false);
      setError(err instanceof Error ? err.message : "Access failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessFromUrl) {
      void loadWithAccess(accessFromUrl);
      return;
    }
    try {
      const saved = sessionStorage.getItem("goke_dash_access");
      if (saved) void loadWithAccess(saved);
    } catch {
      /* ignore */
    }
  }, [accessFromUrl, loadWithAccess]);

  async function requestAccess(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      if (data.accessLink) {
        // Dev mode without Resend
        setInfo("Dev link ready — opening…");
        window.location.href = data.accessLink;
        return;
      }
      setInfo(data.message || "Check your email for the access link.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function pushLive(jobId: string) {
    setPushing(jobId);
    setError(null);
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, force: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deploy failed");
      setInfo(
        data.siteUrl
          ? `Live updated: ${data.siteUrl}`
          : "Deploy finished."
      );
      // refresh list
      const token =
        accessFromUrl ||
        (typeof sessionStorage !== "undefined"
          ? sessionStorage.getItem("goke_dash_access")
          : null);
      if (token) await loadWithAccess(token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Deploy failed");
    } finally {
      setPushing(null);
    }
  }

  function logout() {
    try {
      sessionStorage.removeItem("goke_dash_access");
    } catch {
      /* ignore */
    }
    setAuthed(false);
    setSites([]);
    setDisplayName(null);
    setInfo(null);
  }

  return (
    <div style={page}>
      <div style={wrap}>
        <p style={{ margin: "0 0 8px" }}>
          <Link
            href="/"
            style={{ color: "#c4b5fd", textDecoration: "none", fontWeight: 700 }}
          >
            gòke
          </Link>
        </p>
        <h1 style={{ fontSize: 28, margin: "0 0 8px" }}>
          {displayName ? `Hi, ${displayName}` : "Your sites"}
        </h1>
        <p style={{ color: "#9ca3af", margin: "0 0 24px", lineHeight: 1.5 }}>
          Sign in with the email from your Paystack receipt. We email a private
          link so only you can open and edit your sites.
        </p>

        {!authed && (
          <form onSubmit={requestAccess} style={formRow}>
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              style={inputStyle}
            />
            <button type="submit" disabled={loading} style={btnPrimary}>
              {loading ? "Sending…" : "Email me access link"}
            </button>
          </form>
        )}

        {authed && (
          <div style={{ ...formRow, marginBottom: 24 }}>
            <span style={{ color: "#9ca3af", fontSize: 14, alignSelf: "center" }}>
              {email}
            </span>
            <button type="button" onClick={logout} style={btnGhost}>
              Sign out
            </button>
          </div>
        )}

        {error && (
          <p style={{ color: "#fca5a5", marginBottom: 16 }}>{error}</p>
        )}
        {info && (
          <p style={{ color: "#6ee7b7", marginBottom: 16 }}>{info}</p>
        )}

        {loading && !sites.length && (
          <p style={{ color: "#9ca3af" }}>Loading…</p>
        )}

        <ul style={list}>
          {sites.map((s) => (
            <li key={s.jobId} style={card}>
              <div style={cardHead}>
                <strong style={{ fontSize: 16 }}>
                  {s.username ? `@${s.username}` : s.jobId.slice(0, 10)}
                </strong>
                <span style={badgeStyle(s.isLive)}>{s.status}</span>
              </div>
              <div style={actions}>
                {s.canEdit && (
                  <a href={s.editorUrl} style={btnEdit}>
                    Edit site
                  </a>
                )}
                {s.siteUrl && (
                  <a
                    href={s.siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={btnLive}
                  >
                    Open live site
                  </a>
                )}
                {s.canPushLive && (
                  <button
                    type="button"
                    style={btnEdit}
                    disabled={pushing === s.jobId}
                    onClick={() => void pushLive(s.jobId)}
                  >
                    {pushing === s.jobId ? "Publishing…" : "Push live updates"}
                  </button>
                )}
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 11, color: "#6b7280" }}>
                Job {s.jobId} · {s.editorMode} editor
                {s.customerName ? ` · ${s.customerName}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
