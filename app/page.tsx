"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Upload your Instagram data export first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Generation failed");
      router.push(`/preview/${data.jobId}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Turn your Instagram into a website</h1>
        <p style={styles.sub}>
          Upload your Instagram data export. We&apos;ll build your site
          instantly — free to preview and edit. You only pay when you&apos;re
          ready to go live.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Instagram data export (.zip or .json)
            <input
              type="file"
              accept=".zip,.json"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={styles.input}
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Building your site..." : "Build my site"}
          </button>
        </form>

        <Link href="/how-to-export" style={styles.link}>
          How do I download my Instagram data?
        </Link>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d0d0d",
    padding: "24px",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "#171717",
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    padding: 32,
  },
  heading: { color: "#f5f5f5", fontSize: 24, fontWeight: 500, margin: "0 0 8px" },
  sub: { color: "#a3a3a3", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  label: { display: "flex", flexDirection: "column", gap: 6, color: "#d4d4d4", fontSize: 13 },
  input: {
    background: "#0d0d0d",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#f5f5f5",
    fontSize: 14,
  },
  error: { color: "#f87171", fontSize: 13, margin: 0 },
  button: {
    background: "#f5f5f5",
    color: "#0d0d0d",
    border: "none",
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  link: { display: "block", marginTop: 16, color: "#60a5fa", fontSize: 13, textAlign: "center" },
};
