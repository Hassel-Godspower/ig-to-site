"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  status: "draft" | "pending_payment" | "deploying" | "done" | "failed";
  username?: string;
  email?: string;
  siteUrl?: string;
  repoUrl?: string;
  error?: string;
  createdAt?: string;
}

const STATUS_COLORS: Record<Job["status"], string> = {
  draft: "#6b6b6b",
  pending_payment: "#eab308",
  deploying: "#3b82f6",
  done: "#22c55e",
  failed: "#ef4444",
};

export default function AdminPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);

  async function loadJobs() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/jobs");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load jobs.");
    } else {
      setJobs(data.jobs);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function retry(jobId: string) {
    setRetrying(jobId);
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    setRetrying(null);
    if (!res.ok) {
      const data = await res.json();
      alert(`Retry failed: ${data.error}`);
    }
    loadJobs();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const counts = jobs.reduce<Record<string, number>>((acc, j) => {
    acc[j.status] = (acc[j.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main style={s.main}>
      <header style={s.header}>
        <h1 style={s.heading}>Jobs</h1>
        <div style={s.headerActions}>
          <button onClick={loadJobs} style={s.button}>
            Refresh
          </button>
          <button onClick={logout} style={s.button}>
            Log out
          </button>
        </div>
      </header>

      <div style={s.summary}>
        {(["pending_payment", "deploying", "done", "failed", "draft"] as const).map((status) => (
          <span key={status} style={{ ...s.pill, borderColor: STATUS_COLORS[status] }}>
            <span style={{ ...s.dot, background: STATUS_COLORS[status] }} />
            {status}: {counts[status] ?? 0}
          </span>
        ))}
      </div>

      {loading && <p style={s.muted}>Loading…</p>}
      {error && <p style={s.errorText}>{error}</p>}

      {!loading && !error && (
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Created</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Username</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Links</th>
              <th style={s.th}>Error</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} style={s.tr}>
                <td style={s.td}>
                  {job.createdAt ? new Date(job.createdAt).toLocaleString() : "—"}
                </td>
                <td style={s.td}>
                  <span style={{ ...s.badge, color: STATUS_COLORS[job.status] }}>
                    {job.status}
                  </span>
                </td>
                <td style={s.td}>{job.username || "—"}</td>
                <td style={s.td}>{job.email || "—"}</td>
                <td style={s.td}>
                  <div style={s.links}>
                    {job.siteUrl && (
                      <a href={job.siteUrl} target="_blank" rel="noreferrer" style={s.link}>
                        site
                      </a>
                    )}
                    {job.repoUrl && (
                      <a href={job.repoUrl} target="_blank" rel="noreferrer" style={s.link}>
                        repo
                      </a>
                    )}
                  </div>
                </td>
                <td style={{ ...s.td, ...s.errorCell }}>{job.error || ""}</td>
                <td style={s.td}>
                  {job.status === "failed" && (
                    <button
                      onClick={() => retry(job.id)}
                      disabled={retrying === job.id}
                      style={s.retryButton}
                    >
                      {retrying === job.id ? "Retrying…" : "Retry"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td style={s.td} colSpan={7}>
                  No jobs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  main: { minHeight: "100vh", background: "#0d0d0d", padding: 28, fontFamily: "system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerActions: { display: "flex", gap: 8 },
  heading: { color: "#f5f5f5", fontSize: 20, fontWeight: 500, margin: 0 },
  button: { background: "transparent", color: "#d4d4d4", border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" },
  summary: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 },
  pill: { display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid", borderRadius: 999, padding: "4px 10px", fontSize: 12, color: "#d4d4d4" },
  dot: { width: 6, height: 6, borderRadius: "50%" },
  muted: { color: "#a3a3a3", fontSize: 13 },
  errorText: { color: "#f87171", fontSize: 13 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", color: "#a3a3a3", fontWeight: 500, padding: "8px 10px", borderBottom: "1px solid #2a2a2a" },
  tr: { borderBottom: "1px solid #1f1f1f" },
  td: { padding: "10px", color: "#e5e5e5", verticalAlign: "top" },
  badge: { fontWeight: 500 },
  links: { display: "flex", gap: 8 },
  link: { color: "#60a5fa" },
  errorCell: { color: "#f87171", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  retryButton: { background: "transparent", color: "#eab308", border: "1px solid #eab308", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" },
};
