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
      const data = await res.json();
      setError(data.error || "Login failed.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main style={s.main}>
      <form onSubmit={submit} style={s.card}>
        <h1 style={s.heading}>Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
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
  main: { minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" },
  card: { background: "#171717", border: "1px solid #2a2a2a", borderRadius: 12, padding: 32, width: 320, display: "flex", flexDirection: "column", gap: 12 },
  heading: { color: "#f5f5f5", fontSize: 18, fontWeight: 500, margin: "0 0 8px" },
  input: { background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 12px", color: "#f5f5f5", fontSize: 14, outline: "none" },
  button: { background: "#22c55e", color: "#052e12", border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontWeight: 500, cursor: "pointer" },
  error: { color: "#f87171", fontSize: 13, margin: 0 },
};
