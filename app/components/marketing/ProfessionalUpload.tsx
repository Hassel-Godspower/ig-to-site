"use client";

/**
 * Homepage door: LinkedIn URL + optional CV PDF → professional site.
 */

import { useState } from "react";

export function ProfessionalUpload() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setWarnings([]);
    if (!linkedinUrl.trim() && !file) {
      setError("Paste a LinkedIn profile URL and/or upload a CV PDF.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      if (linkedinUrl.trim()) fd.set("linkedinUrl", linkedinUrl.trim());
      if (file) fd.set("cv", file);

      const res = await fetch("/api/generate-professional", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        setWarnings(data.warnings || []);
        return;
      }
      setWarnings(data.warnings || []);
      if (data.jobId) {
        window.location.href = data.previewPath || `/preview-simple/${data.jobId}`;
        return;
      }
      setError("Generated but no jobId returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="professional" className="gk-professional-upload" style={{ marginTop: "2rem" }}>
      <p className="gk-kicker" style={{ marginBottom: 8 }}>
        LinkedIn / CV
      </p>
      <h2 style={{ marginTop: 0 }}>Your career, as a real website</h2>
      <p style={{ opacity: 0.85, maxWidth: 520 }}>
        Paste your LinkedIn profile, upload a PDF CV, or both. We build a personal brand site —
        experience timeline, skills, projects — not a copy of LinkedIn.
      </p>
      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gap: 12,
          maxWidth: 480,
          marginTop: 16,
        }}
      >
        <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
          LinkedIn profile URL
          <input
            type="url"
            placeholder="https://www.linkedin.com/in/your-name"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.25)",
              color: "inherit",
            }}
          />
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: 14 }}>
          CV (PDF) — recommended
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="gk-btn gk-btn-primary"
          style={{ justifySelf: "start", marginTop: 4 }}
        >
          {loading ? "Building your site…" : "Generate professional site"}
        </button>
      </form>
      {error && (
        <p role="alert" style={{ color: "#f87171", marginTop: 12 }}>
          {error}
        </p>
      )}
      {warnings.length > 0 && (
        <ul style={{ fontSize: 13, opacity: 0.8, marginTop: 8 }}>
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
