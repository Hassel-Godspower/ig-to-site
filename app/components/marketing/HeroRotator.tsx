"use client";

import { useEffect, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  points: string[];
};

/** Instagram / business path rotator */
const SLIDES: Slide[] = [
  {
    eyebrow: "Instagram → website",
    title: "Your Instagram, as a",
    titleAccent: "real website",
    description:
      "Start with your handle for a simple path, or upload an Instagram export for the full visual editor. A multi-page site you own — not another link-in-bio.",
    points: [
      "Free to generate & edit",
      "Business niches · WhatsApp-ready CTAs",
      "Pay only to publish · ₦20,000 once via Paystack",
    ],
  },
  {
    eyebrow: "Quick start",
    title: "Type your handle.",
    titleAccent: "Get a site.",
    description:
      "Business owners: no data export required. We build a premium multi-page site from your Instagram handle and niche — then you edit text, logo, colors, and WhatsApp.",
    points: [
      "Handle + niche → generated site",
      "Edit text, logo, colors, WhatsApp",
      "Go live when you are ready",
    ],
  },
  {
    eyebrow: "Full editor",
    title: "Drag, drop,",
    titleAccent: "design freely",
    description:
      "Upload your Instagram export and open the visual editor — structure, components, templates, media, and responsive views. For designers and power users.",
    points: [
      "Export → multi-section site",
      "Components, templates & media library",
      "Desktop · tablet · mobile preview",
    ],
  },
  {
    eyebrow: "Also for professionals",
    title: "Career presence",
    titleAccent: "below",
    description:
      "Consultants and job seekers: use the LinkedIn / CV section further down the page for a personal brand site from your profile or résumé.",
    points: [
      "LinkedIn URL and/or PDF CV",
      "Experience · skills · projects",
      "Same editor and publish flow",
    ],
  },
  {
    eyebrow: "Publish once",
    title: "Pay once.",
    titleAccent: "Own your presence.",
    description:
      "When the site is right, pay ₦20,000 via Paystack. We deploy to Cloudflare Pages, email your live link, and you keep editing from your dashboard.",
    points: [
      "Paystack checkout (cards, bank, USSD)",
      "Live URL on Cloudflare Pages + HTTPS",
      "Dashboard access to manage your site",
    ],
  },
];

export function HeroRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const s = SLIDES[index];

  return (
    <div className="gk-hero-copy" aria-live="polite">
      <p className="gk-kicker">{s.eyebrow}</p>
      <h1 key={`t-${index}`} className="gk-hero-title">
        {s.title} <em>{s.titleAccent}</em>
      </h1>
      <p key={`d-${index}`} className="gk-hero-lead">
        {s.description}
      </p>
      <ul className="gk-hero-points">
        {s.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div
        className="gk-rotator-dots"
        role="tablist"
        aria-label="Instagram path highlights"
        style={{ display: "flex", gap: 8, marginTop: 20 }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 22 : 8,
              height: 8,
              borderRadius: 99,
              border: "none",
              cursor: "pointer",
              background:
                i === index
                  ? "var(--gk-accent, #a78bfa)"
                  : "rgba(167, 139, 250, 0.35)",
              transition: "width 0.2s ease, background 0.2s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
