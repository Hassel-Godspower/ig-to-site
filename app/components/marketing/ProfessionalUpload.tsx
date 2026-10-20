"use client";

/**
 * LinkedIn / CV upload card — lives in #professional section with ProfessionalRotator.
 */

import { useState } from "react";
import GeneratingIndicator from "@/app/components/GeneratingIndicator";

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
        setLoading(false);
        return;
      }
      setWarnings(data.warnings || []);
      if (data.jobId) {
        window.location.href =
          data.previewPath || `/preview-simple/${data.jobId}`;
        return;
      }
      setError("Generated but no jobId returned");
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  }

  return (
    <div className="gk-upload-card gk-professional-card">
      <p className="gk-kicker" style={{ marginBottom: "0.35rem" }}>
        LinkedIn / CV
      </p>
      <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>Build from your career data</h2>
      <p
        style={{
          margin: "0 0 1.15rem",
          fontSize: 14,
          color: "var(--gk-muted, #9ca3af)",
          lineHeight: 1.55,
        }}
      >
        Profile link, PDF CV, or both. Text-based PDFs work best.
      </p>

      <form onSubmit={onSubmit} className="gk-handle-form">
        <div className="gk-field" style={{ marginBottom: 14 }}>
          <label
            htmlFor="goke-linkedin-url"
            className="gk-label"
            style={{ display: "block", marginBottom: 6, fontSize: 13 }}
          >
            LinkedIn profile URL
          </label>
          <input
            id="goke-linkedin-url"
            type="url"
            className="gk-input"
            placeholder="https://www.linkedin.com/in/your-name"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            disabled={loading}
            autoComplete="url"
            style={{ width: "100%", display: "block" }}
          />
        </div>

        <div className="gk-field" style={{ marginBottom: 14 }}>
          <label
            htmlFor="goke-cv-file"
            className="gk-label"
            style={{ display: "block", marginBottom: 6, fontSize: 13 }}
          >
            CV (PDF) — recommended
          </label>
          <input
            id="goke-cv-file"
            type="file"
            accept="application/pdf,.pdf"
            disabled={loading}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "block", width: "100%", fontSize: 13 }}
          />
          {file ? (
            <span
              style={{
                display: "block",
                marginTop: 6,
                fontSize: 12,
                color: "var(--gk-muted, #9ca3af)",
              }}
            >
              Selected: {file.name}
            </span>
          ) : null}
        </div>

        {error ? <p className="gk-upload-error">{error}</p> : null}
        {warnings.length > 0 ? (
          <ul
            style={{
              fontSize: 12,
              color: "var(--gk-muted, #9ca3af)",
              margin: "8px 0 0",
              paddingLeft: 18,
            }}
          >
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        ) : null}

        <button
          type="submit"
          className="gk-btn gk-btn-primary"
          disabled={loading}
          style={{ marginTop: 8, width: "100%" }}
        >
          {loading ? (
            <GeneratingIndicator
              phrases={[
                "Reading your profile",
                "Structuring experience",
                "Building your site",
                "Polishing",
              ]}
            />
          ) : (
            "Generate professional site"
          )}
        </button>
      </form>
    </div>
  );
}
