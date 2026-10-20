"use client";

import { useState } from "react";

type SetupTab = "ig-handle" | "ig-export" | "linkedin";

const COPY: Record<SetupTab, { title: string; steps: { h: string; p: string; code?: string }[] }> = {
  "ig-handle": {
    title: "Quick start with Instagram handle",
    steps: [
      {
        h: "Enter your @handle and niche",
        p: "No data export required. We build a multi-page starter from public-style signals and your niche.",
      },
      {
        h: "Open the full editor",
        p: "Switch Desktop · Tablet · Mobile. Edit copy, logo, colors, and WhatsApp.",
      },
      {
        h: "Go live when ready",
        p: "Preview is free. Pay once (₦20,000 via Paystack) for hosting on Cloudflare Pages.",
      },
    ],
  },
  "ig-export": {
    title: "Richer site from Instagram export",
    steps: [
      {
        h: "Download your data from Instagram",
        p: "Use Instagram’s official export. Prefer JSON / small zip (profile + posts).",
        code: "Instagram app → Settings → Your activity → Download your information",
      },
      {
        h: "Upload on gòke",
        p: "Drop the .zip or .json on the homepage. We map bio, posts, and structure into pages.",
      },
      {
        h: "Design in the visual editor",
        p: "Full structure tree, components, templates, media — same power as the IG advanced path.",
      },
    ],
  },
  linkedin: {
    title: "Professional site from LinkedIn / CV",
    steps: [
      {
        h: "Paste your profile URL and/or upload a PDF CV",
        p: "https is optional. Text-based PDFs give the best free results.",
        code: "www.linkedin.com/in/your-name",
      },
      {
        h: "We build a multipage personal brand site",
        p: "Home, About, Experience, Work, Services, Contact — not a screenshot of LinkedIn.",
      },
      {
        h: "Edit and publish",
        p: "Same full editor and one-time publish as business sites.",
      },
    ],
  },
};

export function InteractiveSetup() {
  const [tab, setTab] = useState<SetupTab>("ig-handle");
  const [copied, setCopied] = useState(false);
  const data = COPY[tab];

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="gk-section gk-section-alt" id="how" aria-labelledby="setup-heading">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2 id="setup-heading">
            Set up in <span style={{ color: "var(--gk-accent, #a78bfa)" }}>minutes</span>
          </h2>
          <p>
            Interactive guide — same idea as product docs with tabs, without leaving the page.
          </p>
        </div>

        <div className="gk-tabs" role="tablist" aria-label="Setup path">
          {(
            [
              ["ig-handle", "Handle"],
              ["ig-export", "Export"],
              ["linkedin", "LinkedIn / CV"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              className="gk-tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <h3 style={{ margin: "0 0 1rem", fontSize: "1.15rem" }}>{data.title}</h3>
        <ol className="gk-setup-steps">
          {data.steps.map((s, i) => (
            <li key={s.h}>
              <span className="gk-setup-n">{i + 1}</span>
              <div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
                {s.code ? (
                  <div className="gk-copy-block" style={{ marginTop: 10 }}>
                    <pre>{s.code}</pre>
                    <button
                      type="button"
                      className="gk-copy-btn"
                      onClick={() => copyText(s.code!)}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a href="#start" className="gk-btn gk-btn-primary">
            Open generator
          </a>
          <a href="/how-to-export" className="gk-btn gk-btn-ghost">
            Full Instagram export guide
          </a>
        </div>
      </div>
    </section>
  );
}
