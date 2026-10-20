"use client";

import { useState } from "react";
import { HeroUpload } from "./HeroUpload";
import { ProfessionalUpload } from "./ProfessionalUpload";

type Tab = "instagram" | "linkedin";

/**
 * NinjaPear-style tabbed product entry: one chrome, two paths.
 */
export function InteractivePathTabs() {
  const [tab, setTab] = useState<Tab>("instagram");

  return (
    <section className="gk-section" id="start" aria-labelledby="path-tabs-heading">
      <div className="gk-container">
        <div className="gk-section-head" style={{ textAlign: "center", maxWidth: 560, marginInline: "auto" }}>
          <div className="gk-speech" aria-hidden="true">
            Free to generate · pay once to publish
          </div>
          <h2 id="path-tabs-heading" style={{ marginTop: 4 }}>
            Start with what you already have
          </h2>
          <p>
            Pick a path. Same editor, same publish flow — different input.
          </p>
        </div>

        <div
          className="gk-tabs"
          role="tablist"
          aria-label="How you want to start"
        >
          <button
            type="button"
            role="tab"
            className="gk-tab"
            aria-selected={tab === "instagram"}
            id="tab-ig"
            aria-controls="panel-ig"
            onClick={() => setTab("instagram")}
          >
            Instagram → business site
          </button>
          <button
            type="button"
            role="tab"
            className="gk-tab"
            aria-selected={tab === "linkedin"}
            id="tab-li"
            aria-controls="panel-li"
            onClick={() => setTab("linkedin")}
          >
            LinkedIn / CV → professional
          </button>
        </div>

        <div className="gk-interactive-layout">
          <div>
            <div
              id="panel-ig"
              role="tabpanel"
              aria-labelledby="tab-ig"
              hidden={tab !== "instagram"}
            >
              <HeroUpload />
            </div>
            <div
              id="panel-li"
              role="tabpanel"
              aria-labelledby="tab-li"
              hidden={tab !== "linkedin"}
            >
              <ProfessionalUpload />
            </div>
          </div>

          <div className="gk-chrome" aria-hidden={false}>
            <div className="gk-chrome-bar">
              <div className="gk-chrome-dots" aria-hidden="true">
                <span /><span /><span />
              </div>
              <div className="gk-chrome-title">
                {tab === "instagram" ? "gòke · business site" : "gòke · personal brand"}
              </div>
            </div>
            <div className="gk-chrome-body">
              <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>
                {tab === "instagram"
                  ? "What happens after you generate"
                  : "What your professional site includes"}
              </p>
              <ul className="gk-chrome-steps">
                {tab === "instagram" ? (
                  <>
                    <li><span className="ok">✓</span> Multi-page site from handle or export</li>
                    <li><span className="ok">✓</span> Desktop · Tablet · Mobile preview</li>
                    <li><span className="ok">✓</span> Edit text, media, sections, WhatsApp CTA</li>
                    <li><span className="ok">✓</span> Publish once → Cloudflare live URL</li>
                  </>
                ) : (
                  <>
                    <li><span className="ok">✓</span> Home, About, Experience, Work, Contact</li>
                    <li><span className="ok">✓</span> Persona-aware layout (not a LinkedIn clone)</li>
                    <li><span className="ok">✓</span> Same full visual editor</li>
                    <li><span className="ok">✓</span> Hire-me / WhatsApp conversion</li>
                  </>
                )}
              </ul>
              <p
                style={{
                  margin: "1rem 0 0",
                  fontSize: 12,
                  color: "var(--gk-muted)",
                }}
              >
                Design works best on desktop or tablet. Phone is fine for quick text edits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
