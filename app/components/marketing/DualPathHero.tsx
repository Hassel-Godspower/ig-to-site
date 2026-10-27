"use client";

import { useEffect, useState, useCallback } from "react";
import { HeroUpload } from "./HeroUpload";
import { ProfessionalUpload } from "./ProfessionalUpload";
import { HeroRotator } from "./HeroRotator";
import { ProfessionalRotator } from "./ProfessionalRotator";

export type PathTab = "instagram" | "linkedin";

function tabFromHash(): PathTab {
  if (typeof window === "undefined") return "instagram";
  const h = (window.location.hash || "").toLowerCase();
  if (h === "#professional" || h === "#linkedin" || h === "#career") {
    return "linkedin";
  }
  return "instagram";
}

/**
 * Moniepoint-style dual mode with critical CSS inlined
 * so tabs never render unstyled if path-switch.css was not imported.
 */
export function DualPathHero() {
  const [tab, setTab] = useState<PathTab>("instagram");

  const select = useCallback((next: PathTab, pushHash = true) => {
    setTab(next);
    if (!pushHash || typeof window === "undefined") return;
    const hash = next === "linkedin" ? "#professional" : "#start";
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }, []);

  useEffect(() => {
    select(tabFromHash(), false);
    const onHash = () => select(tabFromHash(), false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [select]);

  return (
    <section
      className="gk-hero gk-dual-path"
      id="start"
      aria-labelledby="dual-path-heading"
    >
      {/* Critical styles — always present (no external CSS dependency) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.gk-dual-path { position: relative; padding-top: 1.25rem; }
.gk-dual-path-anchor {
  position: absolute; top: 0; left: 0; width: 1px; height: 1px;
  pointer-events: none; opacity: 0;
}
.gk-mode-switch {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 0 !important;
  max-width: 420px;
  width: 100%;
  margin: 0 auto 1.75rem !important;
  padding: 4px !important;
  border-radius: 14px !important;
  background: var(--gk-surface, #12151c) !important;
  border: 1px solid var(--gk-border, rgba(255,255,255,0.1)) !important;
  box-shadow: 0 8px 28px rgba(0,0,0,0.18);
  box-sizing: border-box;
}
.gk-mode-switch-btn {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 2px !important;
  min-height: 52px;
  padding: 0.55rem 0.75rem !important;
  border: none !important;
  border-radius: 11px !important;
  background: transparent !important;
  color: var(--gk-muted, #9ca3af) !important;
  cursor: pointer;
  font-family: inherit;
  line-height: 1.2;
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}
.gk-mode-switch-btn:hover { color: var(--gk-text, #f3f4f6) !important; }
.gk-mode-switch-btn.is-active {
  background: var(--gk-bg, #0b0d12) !important;
  color: var(--gk-text, #f3f4f6) !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.25);
}
.gk-mode-switch-label {
  display: block !important;
  font-size: 0.95rem !important;
  font-weight: 700 !important;
  letter-spacing: -0.01em;
  line-height: 1.25 !important;
}
.gk-mode-switch-sub {
  display: block !important;
  font-size: 0.7rem !important;
  font-weight: 500 !important;
  opacity: 0.8;
  line-height: 1.2 !important;
  margin-top: 2px;
}
.gk-mode-switch-btn.is-active .gk-mode-switch-sub {
  color: var(--gk-accent, #a78bfa) !important;
  opacity: 1;
}
html[data-theme="light"] .gk-mode-switch,
html.light .gk-mode-switch {
  background: #eef0f4 !important;
  border-color: rgba(0,0,0,0.08) !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
html[data-theme="light"] .gk-mode-switch-btn.is-active,
html.light .gk-mode-switch-btn.is-active {
  background: #fff !important;
  color: #0f172a !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
html[data-theme="light"] .gk-mode-switch-btn.is-active .gk-mode-switch-sub,
html.light .gk-mode-switch-btn.is-active .gk-mode-switch-sub {
  color: #6d28d9 !important;
}
.gk-dual-path-panel { animation: gk-path-fade 0.28s ease; }
@keyframes gk-path-fade {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.gk-sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
@media (max-width: 640px) {
  .gk-mode-switch { max-width: 100%; margin-bottom: 1.25rem !important; }
  .gk-mode-switch-btn { min-height: 48px; padding: 0.5rem 0.4rem !important; }
  .gk-mode-switch-label { font-size: 0.88rem !important; }
  .gk-mode-switch-sub { font-size: 0.65rem !important; }
}
`,
        }}
      />

      <div id="professional" className="gk-dual-path-anchor" aria-hidden="true" />

      <div className="gk-container">
        <div className="gk-mode-switch" role="tablist" aria-label="Site type">
          <button
            type="button"
            role="tab"
            id="tab-instagram"
            aria-selected={tab === "instagram"}
            aria-controls="panel-instagram"
            className={
              tab === "instagram"
                ? "gk-mode-switch-btn is-active"
                : "gk-mode-switch-btn"
            }
            onClick={() => select("instagram")}
          >
            <span className="gk-mode-switch-label">Instagram</span>
            <span className="gk-mode-switch-sub">Business site</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-linkedin"
            aria-selected={tab === "linkedin"}
            aria-controls="panel-linkedin"
            className={
              tab === "linkedin"
                ? "gk-mode-switch-btn is-active"
                : "gk-mode-switch-btn"
            }
            onClick={() => select("linkedin")}
          >
            <span className="gk-mode-switch-label">LinkedIn / CV</span>
            <span className="gk-mode-switch-sub">Professional site</span>
          </button>
        </div>

        <h2 id="dual-path-heading" className="gk-sr-only">
          {tab === "instagram"
            ? "Instagram to business website"
            : "LinkedIn or CV to professional website"}
        </h2>

        <div
          id="panel-instagram"
          role="tabpanel"
          aria-labelledby="tab-instagram"
          hidden={tab !== "instagram"}
          className="gk-dual-path-panel"
        >
          <div className="gk-hero-grid">
            <div>
              <HeroRotator />
            </div>
            <HeroUpload />
          </div>
        </div>

        <div
          id="panel-linkedin"
          role="tabpanel"
          aria-labelledby="tab-linkedin"
          hidden={tab !== "linkedin"}
          className="gk-dual-path-panel"
        >
          <div className="gk-hero-grid">
            <div>
              <ProfessionalRotator />
            </div>
            <ProfessionalUpload />
          </div>
        </div>
      </div>
    </section>
  );
}
