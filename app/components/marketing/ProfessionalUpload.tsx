"use client";

import { useState } from "react";
import GeneratingIndicator from "@/app/components/GeneratingIndicator";

function normalizeLinkedInUrl(input: string): string | null {
  let s = (input || "").trim().replace(/^['"]|['"]$/g, "");
  if (!s) return null;
  if (s.startsWith("/in/")) s = `www.linkedin.com${s}`;
  if (!/^https?:\/\//i.test(s)) s = `https://${s.replace(/^\/\//, "")}`;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    if (host !== "linkedin.com") return null;
    const m = u.pathname.match(/\/in\/([A-Za-z0-9\-_%]+)/i);
    if (!m?.[1]) return null;
    return `https://www.linkedin.com/in/${m[1].replace(/\/$/, "")}`;
  } catch {
    return null;
  }
}

export function ProfessionalUpload() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showPaste, setShowPaste] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setWarnings([]);

    const raw = linkedinUrl.trim();
    const normalized = raw ? normalizeLinkedInUrl(raw) : null;

    if (raw && !normalized) {
      setError(
        "That doesn’t look like a LinkedIn profile link. Example: www.linkedin.com/in/your-name"
      );
      return;
    }
    if (!normalized && !file && pasteText.trim().length < 40) {
      setError(
        "Add a LinkedIn URL, a PDF CV, or paste your About / experience text."
      );
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      if (normalized) fd.set("linkedinUrl", normalized);
      if (file) fd.set("cv", file);
      if (pasteText.trim().length >= 40) fd.set("pasteText", pasteText.trim());

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
          margin: "0 0 1rem",
          fontSize: 14,
          color: "var(--gk-muted, #9ca3af)",
          lineHeight: 1.55,
        }}
      >
        Free path: LinkedIn URL opens a starter site you edit, or upload a{" "}
        <strong>text-based PDF CV</strong> for richer content. No paid LinkedIn API required.
      </p>

      <form onSubmit={onSubmit} className="gk-handle-form" noValidate>
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
            type="text"
            inputMode="url"
            autoCapitalize="off"
            spellCheck={false}
            className="gk-input"
            placeholder="www.linkedin.com/in/your-name"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            disabled={loading}
            style={{ width: "100%", display: "block" }}
          />
        </div>

        <div className="gk-field" style={{ marginBottom: 14 }}>
          <label
            htmlFor="goke-cv-file"
            className="gk-label"
            style={{ display: "block", marginBottom: 6, fontSize: 13 }}
          >
            CV (PDF) — best free results
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
            <span style={{ display: "block", marginTop: 6, fontSize: 12, color: "var(--gk-muted)" }}>
              Selected: {file.name}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="gk-btn gk-btn-ghost"
          style={{ marginBottom: 12, fontSize: 13 }}
          onClick={() => setShowPaste((v) => !v)}
        >
          {showPaste ? "Hide" : "Or paste"} About / experience text
        </button>

        {showPaste ? (
          <div className="gk-field" style={{ marginBottom: 14 }}>
            <label
              htmlFor="goke-paste"
              className="gk-label"
              style={{ display: "block", marginBottom: 6, fontSize: 13 }}
            >
              Paste profile text
            </label>
            <textarea
              id="goke-paste"
              className="gk-input"
              rows={5}
              placeholder="Name&#10;Headline&#10;About…&#10;Experience bullets…"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              disabled={loading}
              style={{ width: "100%", display: "block", resize: "vertical" }}
            />
          </div>
        ) : null}

        {error ? <p className="gk-upload-error">{error}</p> : null}
        {warnings.length > 0 ? (
          <ul style={{ fontSize: 12, color: "var(--gk-muted)", margin: "8px 0 0", paddingLeft: 18 }}>
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
