/**
 * Persona-driven design systems for professional sites.
 * Keeps themeForProfile + googleFontsLink (main API) and adds layout modes
 * for craft portfolio patterns (sticky rail, long single, work grid).
 */

import type { ProfessionalProfile } from "./professionalProfile";

export type ProLayoutMode =
  | "split_sticky"
  | "long_single"
  | "work_grid"
  | "multipage_editorial";

export type ProfessionalTheme = {
  id: string;
  label: string;
  ink: string;
  surface: string;
  surface2: string;
  line: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  displayFont: string;
  bodyFont: string;
  heroStyle: "split" | "centered" | "editorial";
  radius: string;
  /** Preferred structure for first generate */
  layout: ProLayoutMode;
  ctaPrimary: string;
};

const THEMES: Record<string, ProfessionalTheme> = {
  consultant: {
    id: "consultant",
    label: "Consultant",
    ink: "#0c0f14",
    surface: "#151a22",
    surface2: "#1c2330",
    line: "rgba(255,255,255,0.08)",
    text: "#f4f1ea",
    muted: "#a8a29e",
    accent: "#c4a574",
    onAccent: "#0c0f14",
    displayFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: "system-ui, -apple-system, sans-serif",
    heroStyle: "editorial",
    radius: "10px",
    layout: "multipage_editorial",
    ctaPrimary: "Start a conversation",
  },
  engineer: {
    id: "engineer",
    label: "Engineer",
    /* Halcyon-adjacent craft tokens (original, not a site clone) */
    ink: "#0a192f",
    surface: "#112240",
    surface2: "#1a2f4a",
    line: "rgba(136,146,176,0.25)",
    text: "#e6f1ff",
    muted: "#8892b0",
    accent: "#64ffda",
    onAccent: "#0a192f",
    displayFont: "system-ui, -apple-system, \"Segoe UI\", sans-serif",
    bodyFont: "system-ui, -apple-system, \"Segoe UI\", sans-serif",
    heroStyle: "split",
    radius: "4px",
    layout: "split_sticky",
    ctaPrimary: "Get in touch",
  },
  designer: {
    id: "designer",
    label: "Designer",
    ink: "#0d0d0f",
    surface: "#16161a",
    surface2: "#1f1f24",
    line: "rgba(255,255,255,0.1)",
    text: "#fafafa",
    muted: "#a1a1aa",
    accent: "#f472b6",
    onAccent: "#0d0d0f",
    displayFont: '"Syne", system-ui, sans-serif',
    bodyFont: "system-ui, sans-serif",
    heroStyle: "centered",
    radius: "16px",
    layout: "work_grid",
    ctaPrimary: "View work",
  },
  founder: {
    id: "founder",
    label: "Founder",
    ink: "#0a192f",
    surface: "#112240",
    surface2: "#1a2f4a",
    line: "rgba(136,146,176,0.25)",
    text: "#e6f1ff",
    muted: "#8892b0",
    accent: "#64ffda",
    onAccent: "#0a192f",
    displayFont: '"Syne", system-ui, sans-serif',
    bodyFont: "system-ui, sans-serif",
    heroStyle: "split",
    radius: "8px",
    layout: "split_sticky",
    ctaPrimary: "Let's talk",
  },
  lawyer: {
    id: "lawyer",
    label: "Legal",
    ink: "#0b1220",
    surface: "#121a2b",
    surface2: "#1a2438",
    line: "rgba(255,255,255,0.08)",
    text: "#f1f5f9",
    muted: "#94a3b8",
    accent: "#d4af37",
    onAccent: "#0b1220",
    displayFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: "system-ui, sans-serif",
    heroStyle: "editorial",
    radius: "8px",
    layout: "multipage_editorial",
    ctaPrimary: "Contact",
  },
  marketer: {
    id: "marketer",
    label: "Marketer",
    ink: "#0f0a12",
    surface: "#1a1220",
    surface2: "#24182c",
    line: "rgba(255,255,255,0.09)",
    text: "#faf5ff",
    muted: "#c4b5fd",
    accent: "#e879f9",
    onAccent: "#0f0a12",
    displayFont: '"Syne", system-ui, sans-serif',
    bodyFont: "system-ui, sans-serif",
    heroStyle: "centered",
    radius: "14px",
    layout: "long_single",
    ctaPrimary: "Work with me",
  },
  creator: {
    id: "creator",
    label: "Creator",
    ink: "#0a0a0a",
    surface: "#141414",
    surface2: "#1f1f1f",
    line: "rgba(255,255,255,0.1)",
    text: "#fafafa",
    muted: "#a3a3a3",
    accent: "#fb923c",
    onAccent: "#0a0a0a",
    displayFont: '"Syne", system-ui, sans-serif',
    bodyFont: "system-ui, sans-serif",
    heroStyle: "centered",
    radius: "12px",
    layout: "long_single",
    ctaPrimary: "Say hello",
  },
  general: {
    id: "general",
    label: "Professional",
    ink: "#0b0d12",
    surface: "#141820",
    surface2: "#1c2330",
    line: "rgba(255,255,255,0.08)",
    text: "#f3f4f6",
    muted: "#9ca3af",
    accent: "#a78bfa",
    onAccent: "#0b0d12",
    displayFont: '"Syne", system-ui, sans-serif',
    bodyFont: "system-ui, -apple-system, sans-serif",
    heroStyle: "split",
    radius: "12px",
    layout: "multipage_editorial",
    ctaPrimary: "Get in touch",
  },
};

export function themeForProfile(p: ProfessionalProfile): ProfessionalTheme {
  const id = p.persona || "general";
  return THEMES[id] || THEMES.general;
}

export function googleFontsLink(theme: ProfessionalTheme): string {
  if (theme.displayFont.includes("Cormorant")) {
    return "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap";
  }
  return "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap";
}

/** How much structured content we have (thin → fewer pages) */
export function contentScore(p: ProfessionalProfile): number {
  let s = 0;
  if ((p.experience || []).length > 0) s += 2;
  if ((p.projects || []).length > 0) s += 2;
  if ((p.skills || []).length > 3) s += 1;
  if ((p.about || "").length > 80) s += 1;
  return s;
}

export function resolveLayout(
  theme: ProfessionalTheme,
  score: number
): ProLayoutMode {
  if (score < 2 && theme.layout === "multipage_editorial") {
    return "long_single";
  }
  if (score < 2 && theme.layout === "work_grid") {
    return "long_single";
  }
  return theme.layout;
}
