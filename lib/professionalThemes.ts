/**
 * Persona-driven design systems for professional sites.
 * Inspired by JSON Resume theme tokens + premium agency personal brands.
 */

import type { ProfessionalProfile } from "./professionalProfile";

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
  },
  engineer: {
    id: "engineer",
    label: "Engineer",
    ink: "#0a0c10",
    surface: "#12151c",
    surface2: "#1a1f2a",
    line: "rgba(255,255,255,0.09)",
    text: "#e8eaef",
    muted: "#94a3b8",
    accent: "#38bdf8",
    onAccent: "#0a0c10",
    displayFont: '"Syne", system-ui, sans-serif',
    bodyFont: "ui-sans-serif, system-ui, sans-serif",
    heroStyle: "split",
    radius: "12px",
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
  },
  founder: {
    id: "founder",
    label: "Founder",
    ink: "#09090b",
    surface: "#141416",
    surface2: "#1c1c20",
    line: "rgba(255,255,255,0.08)",
    text: "#fafafa",
    muted: "#a1a1aa",
    accent: "#a78bfa",
    onAccent: "#09090b",
    displayFont: '"Syne", system-ui, sans-serif',
    bodyFont: "system-ui, sans-serif",
    heroStyle: "split",
    radius: "12px",
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
