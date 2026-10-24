"use client";

/**
 * LinkedIn / CV → full gòke editor (/preview) with Desktop · Tablet · Mobile.
 */

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

const DESKTOP_NOTE =
  "Design and edit best on a desktop or tablet — phone is fine for small text changes.";

/** Paste / about limits (client + server align). */
const PASTE_MIN = 40;
const PASTE_MAX = 8000;
const ABOUT_HINT_MAX = 1200;
const NAME_MAX = 80;

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
    if (!normalized && !file && pasteText.trim().length < PASTE_MIN) {
      setError(
        "Add a LinkedIn URL, a CV file, or paste your About / experience text."
      );
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      if (normalized) fd.set("linkedinUrl", normalized);
      if (file) fd.set("cv", file);
      if (pasteText.trim().length >= PASTE_MIN) fd.set("pasteText", pasteText.trim());

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
        // Full editor: Desktop / Tablet / Mobile + structure + components
        window.location.href =
          data.previewPath || `/preview/${data.jobId}`;
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
          margin: "0 0 0.75rem",
          fontSize: 14,
          color: "var(--gk-muted, #9ca3af)",
          lineHeight: 1.55,
        }}
      >
        Upload your <strong>CV first</strong> (PDF, Word, or photo). LinkedIn and paste only fill missing fields.
      </p>
      <p
        className="gk-desktop-note"
        style={{
          margin: "0 0 1rem",
          fontSize: 12,
          lineHeight: 1.45,
          color: "var(--gk-muted, #9ca3af)",
          padding: "8px 10px",
          borderRadius: 8,
          background: "var(--gk-surface-2, rgba(167,139,250,0.08))",
          border: "1px solid var(--gk-border, rgba(255,255,255,0.08))",
        }}
      >
        {DESKTOP_NOTE}
      </p>

      <form onSubmit={onSubmit} className="gk-handle-form" noValidate>
        <p
          style={{
            fontSize: 12,
            color: "var(--gk-muted)",
            margin: "0 0 14px",
            lineHeight: 1.45,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid var(--gk-border, rgba(255,255,255,0.08))",
            background: "var(--gk-surface-2, rgba(255,255,255,0.03))",
          }}
        >
          <strong style={{ color: "var(--gk-text)" }}>Source order:</strong>{" "}
          <strong>1) CV file</strong> (PDF, Word, or photo) is the source of
          truth → <strong>2) LinkedIn URL</strong> fills missing fields →{" "}
          <strong>3) Paste</strong> fills any remaining gaps. Nothing later
          overwrites a non-empty CV field.
        </p>

        <div className="gk-field" style={{ marginBottom: 14 }}>
          <label
            htmlFor="goke-cv-file"
            className="gk-label"
            style={{ display: "block", marginBottom: 6, fontSize: 13 }}
          >
            1. CV file (primary) — PDF, Word, or photo
          </label>
          <input
            id="goke-cv-file"
            type="file"
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
            disabled={loading}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "block", width: "100%", fontSize: 13 }}
          />
          <span
            style={{
              display: "block",
              marginTop: 6,
              fontSize: 12,
              color: "var(--gk-muted)",
            }}
          >
            Source of truth for name, roles, skills, and bio
          </span>
          {file ? (
            <span
              style={{
                display: "block",
                marginTop: 4,
                fontSize: 12,
                color: "var(--gk-muted)",
              }}
            >
              Selected: {file.name}
            </span>
          ) : null}
        </div>

        <div className="gk-field" style={{ marginBottom: 14 }}>
          <label
            htmlFor="goke-linkedin-url"
            className="gk-label"
            style={{ display: "block", marginBottom: 6, fontSize: 13 }}
          >
            2. LinkedIn profile URL (optional — fills gaps)
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

        <button
          type="button"
          className="gk-btn gk-btn-ghost"
          style={{ marginBottom: 12, fontSize: 13 }}
          onClick={() => setShowPaste((v) => !v)}
        >
          {showPaste ? "Hide" : "Optional:"} paste About / experience
        </button>

        {showPaste ? (
          <div className="gk-field" style={{ marginBottom: 14 }}>
            <label
              htmlFor="goke-paste"
              className="gk-label"
              style={{ display: "block", marginBottom: 6, fontSize: 13 }}
            >
              About / experience text
              <span style={{ fontWeight: 400, color: "var(--gk-muted)" }}>
                {" "}
                (fills gaps only — CV stays primary)
              </span>
            </label>
            <p
              style={{
                fontSize: 12,
                color: "var(--gk-muted)",
                margin: "0 0 8px",
                lineHeight: 1.45,
              }}
            >
              Use this if the CV is thin or to add detail. Include:
            </p>
            <ul
              style={{
                fontSize: 12,
                color: "var(--gk-muted)",
                margin: "0 0 8px",
                paddingLeft: 18,
                lineHeight: 1.5,
              }}
            >
              <li>
                <strong>Name</strong> — up to {NAME_MAX} characters (first line)
              </li>
              <li>
                <strong>Headline / title</strong> — e.g. IT Professional · Digital
                Marketer
              </li>
              <li>
                <strong>About / summary</strong> — {PASTE_MIN}–{ABOUT_HINT_MAX}{" "}
                characters recommended (server keeps up to {ABOUT_HINT_MAX} in
                the bio)
              </li>
              <li>
                <strong>Experience</strong> — role, company, dates, then bullets
                (• or -)
              </li>
              <li>
                <strong>Skills</strong> — one per line or comma-separated
              </li>
              <li>
                Optional: email, phone, city, LinkedIn URL
              </li>
            </ul>
            <textarea
              id="goke-paste"
              className="gk-input"
              rows={7}
              maxLength={PASTE_MAX}
              placeholder={
                "Hassel Godspower\nIT Professional | Digital Marketer\n\nAbout (40–1200 characters)…\n\nEXPERIENCE\n08/2022 - 10/2025\nIT Professional/Brand Manager\nZikel Cosmetics\n• Designed & managed brand websites\n• Led digital marketing\n\nSKILLS\nWordPress, SEO, Social media…"
              }
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value.slice(0, PASTE_MAX))}
              disabled={loading}
              style={{ width: "100%", display: "block", resize: "vertical" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                fontSize: 11,
                color: "var(--gk-muted)",
              }}
            >
              <span>
                Min {PASTE_MIN} characters if used without a CV
              </span>
              <span>
                {pasteText.length} / {PASTE_MAX}
              </span>
            </div>
          </div>
        ) : null}

        {error ? <p className="gk-upload-error">{error}</p> : null}
        {warnings.length > 0 ? (
          <ul
            style={{
              fontSize: 12,
              color: "var(--gk-muted)",
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
