"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type JobRow = {
  jobId: string;
  status: string;
  username: string | null;
  customerName: string | null;
  email: string | null;
  phone: string | null;
  whatsappUrl: string | null;
  country: string | null;
  siteUrl: string | null;
  repoUrl: string | null;
  editorMode: string | null;
  commerceTier: string;
  bookingTier: string;
  isLive: boolean;
  error: string | null;
  createdAt: string | null;
};

type Stats = {
  total: number;
  live: number;
  pendingPayment: number;
  deploying: number;
  failed: number;
  draft: number;
};

type Filter = "all" | "live" | "pending_payment" | "deploying" | "failed" | "draft";

function statusColor(status: string): string {
  switch (status) {
    case "done":
      return "#34d399";
    case "pending_payment":
      return "#fbbf24";
    case "deploying":
      return "#60a5fa";
    case "failed":
      return "#f87171";
    default:
      return "#9ca3af";
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function AdminConsolePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/jobs", { credentials: "include" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setJobs(data.jobs || []);
      setStats(data.stats || null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function logout() {
    await fetch("/api/admin", { method: "POST" });
    router.push("/admin/login");
  }

  async function retryDeploy(jobId: string) {
    setError(null);
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, force: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deploy failed");
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const filtered = useMemo(() => {
    let list = jobs;
    if (filter === "live") list = list.filter((j) => j.isLive);
    else if (filter !== "all") list = list.filter((j) => j.status === filter);

    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter((j) => {
        const blob = [
          j.jobId,
          j.username,
          j.customerName,
          j.email,
          j.phone,
          j.country,
          j.siteUrl,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return blob.includes(needle);
      });
    }
    return list;
  }, [jobs, filter, q]);

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div>
          <p style={styles.kicker}>gòke · platform</p>
          <h1 style={styles.title}>Admin console</h1>
        </div>
        <div style={styles.headerActions}>
          <button type="button" style={styles.btnGhost} onClick={() => void load()}>
            Refresh
          </button>
          <button type="button" style={styles.btnGhost} onClick={() => void logout()}>
            Log out
          </button>
        </div>
      </header>

      {stats && (
        <div style={styles.stats}>
          <Stat label="Total jobs" value={stats.total} />
          <Stat label="Live sites" value={stats.live} accent="#34d399" />
          <Stat label="Awaiting pay" value={stats.pendingPayment} accent="#fbbf24" />
          <Stat label="Deploying" value={stats.deploying} accent="#60a5fa" />
          <Stat label="Failed" value={stats.failed} accent="#f87171" />
        </div>
      )}

      <div style={styles.toolbar}>
        <input
          style={styles.search}
          placeholder="Search name, email, phone, @handle, country, URL…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={styles.filters}>
          {(
            [
              ["all", "All"],
              ["live", "Live"],
              ["pending_payment", "Payment"],
              ["deploying", "Deploying"],
              ["failed", "Failed"],
              ["draft", "Draft"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              style={{
                ...styles.chip,
                ...(filter === id ? styles.chipActive : {}),
              }}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.muted}>Loading jobs…</p>}

      <div style={styles.grid}>
        {!loading && filtered.length === 0 && (
          <p style={styles.muted}>No jobs match this filter.</p>
        )}
        {filtered.map((j) => (
          <article key={j.jobId} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <h2 style={styles.cardTitle}>
                  {j.username ? `@${j.username}` : j.customerName || j.jobId.slice(0, 10)}
                </h2>
                <p style={styles.meta}>
                  <span style={{ color: statusColor(j.status), fontWeight: 700 }}>
                    {j.status}
                  </span>
                  {j.isLive ? " · live" : ""}
                  {j.editorMode ? ` · ${j.editorMode} editor` : ""}
                  {` · shop ${j.commerceTier} · book ${j.bookingTier}`}
                </p>
              </div>
              <span style={styles.date}>{formatDate(j.createdAt)}</span>
            </div>

            <div style={styles.details}>
              <Detail label="Customer" value={j.customerName || "—"} />
              <Detail label="Email" value={j.email || "—"} href={j.email ? `mailto:${j.email}` : undefined} />
              <Detail
                label="WhatsApp"
                value={j.phone || "—"}
                href={j.whatsappUrl || undefined}
                external
              />
              <Detail label="Country" value={j.country || "—"} />
            </div>

            {j.siteUrl && (
              <p style={styles.url}>
                <a href={j.siteUrl} target="_blank" rel="noreferrer" style={styles.link}>
                  {j.siteUrl.replace(/^https?:\/\//, "")}
                </a>
              </p>
            )}

            {j.error && <p style={styles.jobError}>{j.error}</p>}

            <div style={styles.actions}>
              {j.siteUrl && (
                <a href={j.siteUrl} target="_blank" rel="noreferrer" style={styles.btnPrimary}>
                  Open site
                </a>
              )}
              {j.whatsappUrl && (
                <a href={j.whatsappUrl} target="_blank" rel="noreferrer" style={styles.btnWa}>
                  WhatsApp
                </a>
              )}
              {j.repoUrl && (
                <a href={j.repoUrl} target="_blank" rel="noreferrer" style={styles.btnGhost}>
                  Repo
                </a>
              )}
              <Link href={`/preview/${j.jobId}`} style={styles.btnGhost}>
                Editor
              </Link>
              {(j.status === "failed" || j.status === "pending_payment") && (
                <button
                  type="button"
                  style={styles.btnGhost}
                  onClick={() => void retryDeploy(j.jobId)}
                >
                  Retry deploy
                </button>
              )}
            </div>
            <p style={styles.jobId}>Job {j.jobId}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div style={styles.stat}>
      <p style={{ ...styles.statValue, color: accent || "#f3f4f6" }}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  );
}

function Detail({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div style={styles.detail}>
      <span style={styles.detailLabel}>{label}</span>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          style={styles.detailValueLink}
        >
          {value}
        </a>
      ) : (
        <span style={styles.detailValue}>{value}</span>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100dvh",
    background: "#0b0d12",
    color: "#f3f4f6",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "20px 16px 48px",
  },
  header: {
    maxWidth: 1100,
    margin: "0 auto 20px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-end",
  },
  kicker: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#a78bfa",
  },
  title: { margin: "4px 0 0", fontSize: 24, fontWeight: 800 },
  headerActions: { display: "flex", gap: 8 },
  stats: {
    maxWidth: 1100,
    margin: "0 auto 16px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10,
  },
  stat: {
    background: "#12151c",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "12px 14px",
  },
  statValue: { margin: 0, fontSize: 22, fontWeight: 800 },
  statLabel: { margin: "4px 0 0", fontSize: 11, color: "#9ca3af" },
  toolbar: {
    maxWidth: 1100,
    margin: "0 auto 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  search: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(167,139,250,0.35)",
    background: "#12151c",
    color: "#f3f4f6",
    fontSize: 15,
  },
  filters: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: {
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  chipActive: {
    background: "rgba(167,139,250,0.2)",
    borderColor: "#a78bfa",
    color: "#ede9fe",
  },
  grid: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gap: 12,
  },
  card: {
    background: "#12151c",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 16,
  },
  cardTop: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: { margin: 0, fontSize: 17, fontWeight: 700 },
  meta: { margin: "4px 0 0", fontSize: 12, color: "#9ca3af" },
  date: { fontSize: 11, color: "#6b7280" },
  details: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 10,
    marginBottom: 10,
  },
  detail: { display: "flex", flexDirection: "column", gap: 2 },
  detailLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280" },
  detailValue: { fontSize: 13, color: "#e5e7eb" },
  detailValueLink: { fontSize: 13, color: "#c4b5fd", textDecoration: "none" },
  url: { margin: "0 0 8px", fontSize: 13 },
  link: { color: "#a78bfa" },
  jobError: {
    margin: "0 0 8px",
    fontSize: 12,
    color: "#fca5a5",
    background: "#450a0a",
    padding: "8px 10px",
    borderRadius: 8,
  },
  actions: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 },
  btnPrimary: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 8,
    background: "#a78bfa",
    color: "#0b0d12",
    fontWeight: 700,
    fontSize: 13,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  },
  btnWa: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 8,
    background: "rgba(37, 211, 102, 0.2)",
    color: "#86efac",
    fontWeight: 700,
    fontSize: 13,
    textDecoration: "none",
    border: "1px solid rgba(37, 211, 102, 0.4)",
  },
  btnGhost: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 8,
    background: "transparent",
    color: "#ede9fe",
    fontWeight: 600,
    fontSize: 13,
    textDecoration: "none",
    border: "1px solid rgba(167,139,250,0.35)",
    cursor: "pointer",
  },
  jobId: { margin: "10px 0 0", fontSize: 11, color: "#4b5563" },
  muted: { color: "#9ca3af", maxWidth: 1100, margin: "0 auto" },
  error: {
    maxWidth: 1100,
    margin: "0 auto 12px",
    color: "#fca5a5",
    background: "#450a0a",
    padding: "10px 14px",
    borderRadius: 10,
  },
};
