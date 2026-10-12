"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main style={s.main}>
      <form onSubmit={submit} style={s.card}>
        <p style={s.kicker}>gòke</p>
        <h1 style={s.heading}>Platform admin</h1>
        <p style={s.sub}>Published sites, customers, WhatsApp &amp; country</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          autoFocus
          style={s.input}
        />
        {error && <p style={s.error}>{error}</p>}
        <button type="submit" disabled={loading} style={s.button}>
          {loading ? "Checking…" : "Log in"}
        </button>
      </form>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100dvh",
    background: "#0b0d12",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
    padding: 16,
  },
  card: {
    background: "#12151c",
    border: "1px solid rgba(167,139,250,0.25)",
    borderRadius: 16,
    padding: 28,
    width: "100%",
    maxWidth: 360,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  kicker: {
    margin: 0,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#a78bfa",
  },
  heading: { color: "#f3f4f6", fontSize: 22, fontWeight: 800, margin: 0 },
  sub: { margin: 0, fontSize: 13, color: "#9ca3af" },
  input: {
    background: "#0b0d12",
    border: "1px solid rgba(167,139,250,0.35)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#f3f4f6",
    fontSize: 15,
    outline: "none",
  },
  button: {
    background: "#a78bfa",
    color: "#0b0d12",
    border: "none",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  error: { color: "#f87171", fontSize: 13, margin: 0 },
};
