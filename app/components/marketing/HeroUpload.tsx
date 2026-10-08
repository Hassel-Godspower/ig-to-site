"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GeneratingIndicator from "@/app/components/GeneratingIndicator";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

const NICHES: { id: string; label: string; group: string }[] = [
  // Food & hospitality
  { id: "restaurant_dining", label: "Restaurant / Dining", group: "Food & hospitality" },
  { id: "fast_food_qsr", label: "Fast food / QSR / Cloud kitchen", group: "Food & hospitality" },
  { id: "cafe_coffee", label: "Café / Coffee / Juice bar", group: "Food & hospitality" },
  { id: "bakery_pastry", label: "Bakery / Pastry / Cake studio", group: "Food & hospitality" },
  { id: "bar_lounge", label: "Bar / Lounge / Nightlife", group: "Food & hospitality" },
  // Travel & stay
  { id: "hotel_stay", label: "Hotel / Lodge", group: "Travel & stay" },
  { id: "event_centre", label: "Event centre / Hall", group: "Travel & stay" },
  { id: "short_let", label: "Short-let / Airbnb host", group: "Travel & stay" },
  // Commerce & style
  { id: "fashion_boutique", label: "Fashion boutique / RTW", group: "Commerce & style" },
  { id: "african_wear", label: "Ankara / African wear / Tailoring", group: "Commerce & style" },
  { id: "jewelry", label: "Jewelry / Beads / Accessories", group: "Commerce & style" },
  // Beauty & wellness
  { id: "hair_salon", label: "Hair salon / Glam studio", group: "Beauty & wellness" },
  { id: "barber_shop", label: "Barber shop", group: "Beauty & wellness" },
  { id: "spa_wellness", label: "Spa / Wellness / Massage", group: "Beauty & wellness" },
  { id: "fitness_gym", label: "Gym / Fitness / PT", group: "Beauty & wellness" },
  // Health & professional
  { id: "healthcare_clinic", label: "Clinic / Healthcare", group: "Health & professional" },
  { id: "dental_clinic", label: "Dental clinic", group: "Health & professional" },
  { id: "pharmacy", label: "Pharmacy", group: "Health & professional" },
  { id: "law_firm", label: "Law firm", group: "Health & professional" },
  { id: "accounting", label: "Accounting / Tax / Audit", group: "Health & professional" },
  // Property & auto
  { id: "real_estate", label: "Real estate agency", group: "Property & auto" },
  { id: "auto_dealership", label: "Car dealership", group: "Property & auto" },
  { id: "auto_mechanic", label: "Auto mechanic / Workshop", group: "Property & auto" },
  // Services & ops
  { id: "logistics", label: "Logistics / Courier / Dispatch", group: "Services & ops" },
  { id: "tech_saas", label: "Tech / Software / SaaS", group: "Services & ops" },
  // Creative & brand
  { id: "creative_agency", label: "Marketing / Creative agency", group: "Creative & brand" },
  { id: "photography", label: "Photography / Videography", group: "Creative & brand" },
  { id: "coach_consultant", label: "Coach / Consultant / Personal brand", group: "Creative & brand" },
  // Community
  { id: "school_education", label: "School / Lesson centre", group: "Community & learning" },
  { id: "church_faith", label: "Church / Ministry", group: "Community & learning" },
  // General
  { id: "general_business", label: "Other business", group: "General" },
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
                {Array.from(new Set(NICHES.map((n) => n.group))).map((group) => (
                  <optgroup key={group} label={group}>
                    {NICHES.filter((n) => n.group === group).map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            {error && <p className="gk-upload-error">{error}</p>}
            <button
              type="submit"
              className="gk-btn gk-btn-primary gk-btn-block"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <GeneratingIndicator
                  phrases={[
                    "Generating your website",
                    "Reading your Instagram",
                    "Matching your niche",
                    "Writing your pages",
                    "Almost ready",
                  ]}
                />
              ) : (
                "Generate my site"
              )}
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
