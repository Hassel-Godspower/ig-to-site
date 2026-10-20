"use client";

import { useEffect, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  points: string[];
};

/** Career / LinkedIn path — separate rotator from Instagram hero */
const SLIDES: Slide[] = [
  {
    eyebrow: "LinkedIn / CV → website",
    title: "Your career, as a",
    titleAccent: "real website",
    description:
      "Paste a LinkedIn profile, upload a PDF CV, or both. gòke builds a personal brand site — experience, skills, projects, contact — not a screenshot of LinkedIn.",
    points: [
      "Free to generate & edit",
      "Timeline, skills, projects, hire-me CTAs",
      "Same publish path · ₦20,000 once via Paystack",
    ],
  },
  {
    eyebrow: "Consultants & freelancers",
    title: "Look hire-ready",
    titleAccent: "in minutes",
    description:
      "Clients should not need a LinkedIn login to understand what you do. Put your story, proof, and WhatsApp on a page you control.",
    points: [
      "Clear headline and about",
      "Impact-focused experience cards",
      "WhatsApp or email contact",
    ],
  },
  {
    eyebrow: "Job seekers",
    title: "Beyond the",
    titleAccent: "PDF attachment",
    description:
      "A living portfolio URL beats a buried CV. Share one link in applications and interviews — then update it when your story grows.",
    points: [
      "CV PDF structured into pages",
      "Skills and projects on the open web",
      "Edit anytime from your dashboard",
    ],
  },
  {
    eyebrow: "Founders & operators",
    title: "Personal brand,",
    titleAccent: "not a bio link",
    description:
      "You already wrote the roles and results. We turn that into a multi-page presence that matches how serious professionals show up offline.",
    points: [
      "Persona-aware layout and tone",
      "Projects and awards when present",
      "Publish once — own the URL",
    ],
  },
];

export function ProfessionalRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5200);
    return () => clearInterval(id);
  }, []);

  const s = SLIDES[index];

  return (
    <div className="gk-hero-copy gk-professional-rotator" aria-live="polite">
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
        aria-label="Professional path highlights"
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
