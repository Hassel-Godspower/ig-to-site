"use client";

/**
 * Second door under Instagram on the homepage:
 * LinkedIn URL +/or CV PDF → professional personal site.
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
    <div
      className="gk-upload-card gk-professional-card"
      id="professional"
      style={{ marginTop: "1.25rem" }}
    >
      <p className="gk-kicker" style={{ marginBottom: "0.35rem" }}>
        Or start from LinkedIn / CV
      </p>
      <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>
        Your career, as a real website
      </h2>
      <p
        style={{
          margin: "0 0 1rem",
          fontSize: 14,
          color: "var(--gk-muted, #9ca3af)",
          lineHeight: 1.55,
        }}
      >
        For consultants, job seekers, and professionals. Paste a LinkedIn profile
        link, upload a PDF CV, or both — we build a personal brand site (experience,
        skills, projects), not a screenshot of LinkedIn.
      </p>

      <form onSubmit={onSubmit} className="gk-handle-form">
        <label className="gk-label">
          LinkedIn profile URL
          <input
            type="url"
            className="gk-input"
            placeholder="https://www.linkedin.com/in/your-name"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            disabled={loading}
            autoComplete="url"
          />
        </label>

        <label className="gk-label" style={{ marginTop: 10 }}>
          CV (PDF) — recommended for best results
          <input
            type="file"
            accept="application/pdf,.pdf"
            disabled={loading}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ marginTop: 6, fontSize: 13 }}
          />
          {file && (
            <span
              style={{
                display: "block",
                marginTop: 4,
                fontSize: 12,
                color: "var(--gk-muted, #9ca3af)",
              }}
            >
              Selected: {file.name}
            </span>
          )}
        </label>

        {error && <p className="gk-upload-error">{error}</p>}
        {warnings.length > 0 && (
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
        )}

        <button
          type="submit"
          className="gk-btn gk-btn-primary"
          disabled={loading}
          style={{ marginTop: 14, width: "100%" }}
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
