"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GeneratingIndicator from "@/app/components/GeneratingIndicator";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

const NICHES = [
  { id: "spa_wellness", label: "Spa / Wellness" },
  { id: "fitness_gym", label: "Fitness / Coaching" },
  { id: "beauty_salon", label: "Beauty / Hair" },
  { id: "ecommerce_retail", label: "Shop / Retail" },
  { id: "restaurant_food", label: "Food / Restaurant" },
  { id: "creative_portfolio", label: "Creative / Portfolio" },
  { id: "real_estate", label: "Real estate" },
  { id: "general_business", label: "Other business" },
];

type Path = "handle" | "export";

export function HeroUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState<Path>("handle");
  const [handle, setHandle] = useState("");
  const [niche, setNiche] = useState("general_business");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = useCallback((f: File | null) => {
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    const name = f.name.toLowerCase();
    if (!name.endsWith(".zip") && !name.endsWith(".json")) {
      setError("Please upload a .zip or .json Instagram data export.");
      setFile(null);
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError(
        `That file is ${(f.size / 1024 / 1024).toFixed(1)} MB (max 4 MB). Export profile + posts only.`
      );
      setFile(null);
      return;
    }
    setFile(f);
  }, []);

  async function submitHandle(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const h = handle.trim().replace(/^@+/, "");
    if (h.length < 2) {
      setError("Enter your Instagram handle (without @).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate-handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: h, niche }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      router.push(`/preview/${data.jobId}?mode=simple`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function submitExport(e: React.FormEvent) {
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
      if (res.status === 413) {
        throw new Error("File too large. Export profile + posts only (under 4 MB).");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      router.push(`/preview/${data.jobId}?mode=advanced`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="gk-upload-card" id="start">
      <div className="gk-path-tabs" role="tablist" aria-label="How to start">
        <button
          type="button"
          role="tab"
          aria-selected={path === "handle"}
          className={path === "handle" ? "active" : ""}
          onClick={() => {
            setPath("handle");
            setError(null);
          }}
        >
          Quick start
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={path === "export"}
          className={path === "export" ? "active" : ""}
          onClick={() => {
            setPath("export");
            setError(null);
          }}
        >
          Full editor
        </button>
      </div>

      {path === "handle" ? (
        <>
          <h2>Start with your Instagram handle</h2>
          <p className="gk-card-sub">
            For business owners. We build a premium site from your handle and niche. Edit text,
            logo, colors, and WhatsApp — then go live. No data export needed.
          </p>
          <form onSubmit={submitHandle}>
            <label className="gk-field-label">
              Instagram handle
              <div className="gk-handle-row">
                <span className="gk-handle-at">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="yourbrand"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={loading}
                />
              </div>
            </label>
            <label className="gk-field-label">
              Business type
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                disabled={loading}
              >
                {NICHES.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </label>
            {error && <p className="gk-upload-error">{error}</p>}
            <button
              type="submit"
              className="gk-btn gk-btn-primary gk-btn-block"
              disabled={loading}
            >
              {loading ? "Building your site…" : "Generate my site"}
            </button>
          </form>
          <p className="gk-card-footnote">
            Want drag-and-drop and Instagram captions in the design? Use{" "}
            <button type="button" className="gk-text-btn" onClick={() => setPath("export")}>
              Full editor
            </button>{" "}
            with a data export.
          </p>
        </>
      ) : (
        <>
          <h2>Start from Instagram export</h2>
          <p className="gk-card-sub">
            For designers &amp; power users. Upload .zip / .json for a full visual editor —
            structure, widgets, templates, media.
          </p>
          <form onSubmit={submitExport}>
            <div
              className={`gk-dropzone${drag ? " is-drag" : ""}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                onFile(e.dataTransfer.files?.[0] ?? null);
              }}
            >
              <span className="gk-drop-icon">↑</span>
              <strong>
                {file ? file.name : "Drop export here, or click to browse"}
              </strong>
              <span className="gk-drop-hint">.zip or .json · under 4 MB</span>
              <input
                ref={inputRef}
                type="file"
                accept=".zip,.json,application/json,application/zip"
                hidden
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <p className="gk-sample-row">
              Try a sample:{" "}
              <a href="/samples/demo-spa.json" download>
                Spa demo JSON
              </a>
              {" · "}
              <a href="/samples/demo-fitness.json" download>
                Fitness demo JSON
              </a>
            </p>
            {error && <p className="gk-upload-error">{error}</p>}
            <button
              type="submit"
              className="gk-btn gk-btn-primary gk-btn-block"
              disabled={loading || !file}
              aria-busy={loading}
            >
              {loading ? (
                <GeneratingIndicator
                  phrases={[
                    "Generating your website",
                    "Parsing your export",
                    "Structuring the site",
                    "Loading the editor",
                    "Almost ready",
                  ]}
                />
              ) : (
                "Generate with full editor"
              )}
            </button>
          </form>
          <p className="gk-card-footnote">
            <Link href="/how-to-export">How to download Instagram data</Link>
          </p>
        </>
      )}
    </div>
  );
}
