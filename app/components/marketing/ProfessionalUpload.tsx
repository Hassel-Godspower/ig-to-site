"use client";

/**
 * Homepage second door: LinkedIn URL + optional CV PDF.
 * Wire onSubmit to POST /api/generate-professional then router.push(`/preview/${jobId}`).
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
      // TODO: after jobStore wiring:
      // router.push(`/preview/${data.jobId}`);
      if (data.jobId) {
        const path = data.previewPath || `/preview-simple/${data.jobId}`;
        window.location.href = path;
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
    <section id="professional" className="gk-professional-upload">
      <h2>LinkedIn / CV → website</h2>
      <p>
        Paste your LinkedIn profile link, upload your CV PDF, or both. gòke builds a
        professional personal site you can edit and publish — not a screenshot of LinkedIn.
      </p>
      <form onSubmit={onSubmit}>
        <label>
          LinkedIn profile URL
          <input
            type="url"
            placeholder="https://www.linkedin.com/in/your-name"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
        </label>
        <label>
          CV (PDF)
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Building your site…" : "Generate professional site"}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {warnings.length > 0 && (
        <ul>
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
