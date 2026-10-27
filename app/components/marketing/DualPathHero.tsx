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
 * Moniepoint-style dual mode:
 * Instagram → business site  |  LinkedIn / CV → professional site
 * Same page chrome (header + footer outside this component).
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
      {/* Hidden anchor so #professional still scrolls here */}
      <div id="professional" className="gk-dual-path-anchor" aria-hidden="true" />

      <div className="gk-container">
        {/* Segmented control — Moniepoint Business | Personal */}
        <div
          className="gk-mode-switch"
          role="tablist"
          aria-label="Site type"
        >
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

        {/* Instagram panel */}
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

        {/* LinkedIn / CV panel */}
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
