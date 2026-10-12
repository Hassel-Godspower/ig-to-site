"use client";

import { useEffect, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  points: string[];
};

/** Platform functions — rotates in the hero text area only */
const SLIDES: Slide[] = [
  {
    eyebrow: "Instagram → website",
    title: "Your Instagram, as a",
    titleAccent: "real website",
    description:
      "Start with your handle for a simple edit path, or upload an Instagram export for the full visual editor. Publish once when you are ready — not another link-in-bio.",
    points: [
      "Free to generate & edit",
      "Simple path for owners · full editor for power users",
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
      "Upload your Instagram export and open the visual editor — structure tree, components, templates, media, and responsive views. Built for designers and power users.",
    points: [
      "Export → multi-section site",
      "Components, templates & media library",
      "Desktop · tablet · mobile preview",
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
  {
    eyebrow: "Built for Africa",
    title: "WhatsApp-first.",
    titleAccent: "Paystack-native.",
    description:
      "CTAs that open chat with your number, niches for spas, boutiques, coaches, clinics, and more — tuned for Instagram-native businesses in Nigeria and across Africa.",
    points: [
      "WhatsApp-ready contact & booking CTAs",
      "30+ business niche blueprints",
      "Shop & booking blocks on generated sites",
    ],
  },
];

const INTERVAL_MS = 5200;

export function HeroRotator() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = SLIDES[active];

  useEffect(() => {
    if (paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="gk-hero-rotator"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="gk-hero-dots" role="tablist" aria-label="Hero messages">
        {SLIDES.map((s, i) => (
          <button
            key={s.eyebrow}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={s.eyebrow}
            className={`gk-hero-dot${i === active ? " is-active" : ""}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>

      <div key={active} className="gk-hero-slide">
        <p className="gk-kicker">{slide.eyebrow}</p>
        <h1>
          {slide.title} <em>{slide.titleAccent}</em>
        </h1>
        <p className="gk-hero-lead">{slide.description}</p>
        <ul className="gk-hero-points">
          {slide.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <p className="gk-hero-demo">
        Prefer proof first? <a href="#live-examples">See live gòke sites</a>
        {" · "}
        <a href="#demo">See the transformation</a>
      </p>
    </div>
  );
}
