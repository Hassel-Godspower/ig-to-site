/**
 * Distinct theme tokens per shell — not just accent swaps.
 */
import type { ShellTheme } from "./types";
import type { ShellId } from "./registry";

const FONT_SERIF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap";
const FONT_ATHLETIC =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap";
const FONT_AUTHORITY =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap";
const FONT_EDITORIAL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap";

export function themeForShell(shellId: ShellId, brandPrimary?: string): ShellTheme {
  const accentOk =
    brandPrimary && /^#[0-9a-fA-F]{6}$/.test(brandPrimary) ? brandPrimary : null;

  const base = SHELL_THEMES[shellId];
  const accent = accentOk || base.accent;
  return {
    ...base,
    accent,
    accentDim: `${accent}26`,
    accentGlow: `${accent}59`,
  };
}

const SHELL_THEMES: Record<ShellId, ShellTheme> = {
  sanctuary: {
    ink: "#0b1210",
    ink2: "#101816",
    surface: "#15201c",
    line: "rgba(201,168,108,0.18)",
    text: "#f3eee4",
    muted: "#a39e93",
    accent: "#c9a86c",
    accentDim: "rgba(201,168,108,0.16)",
    accentGlow: "rgba(201,168,108,0.35)",
    onAccent: "#0b1210",
    mode: "dark",
    fontDisplay: '"Cormorant Garamond", Georgia, serif',
    fontBody: '"Outfit", system-ui, sans-serif',
    googleFontsHref: FONT_SERIF,
    radius: "2px",
    radiusLg: "6px",
  },
  sensorial: {
    ink: "#0c0a09",
    ink2: "#141210",
    surface: "#1a1714",
    line: "rgba(201,162,39,0.22)",
    text: "#f5f0e6",
    muted: "#a89f8f",
    accent: "#c9a227",
    accentDim: "rgba(201,162,39,0.18)",
    accentGlow: "rgba(201,162,39,0.3)",
    onAccent: "#0c0a09",
    mode: "dark",
    fontDisplay: '"Cormorant Garamond", Georgia, serif',
    fontBody: '"Outfit", system-ui, sans-serif',
    googleFontsHref: FONT_SERIF,
    radius: "2px",
    radiusLg: "4px",
  },
  athletic: {
    ink: "#07090f",
    ink2: "#0e121b",
    surface: "#131824",
    line: "rgba(255,255,255,0.08)",
    text: "#f2f4f8",
    muted: "#8b93a7",
    accent: "#c8ff3d",
    accentDim: "rgba(200,255,61,0.14)",
    accentGlow: "rgba(200,255,61,0.35)",
    onAccent: "#07090f",
    mode: "dark",
    fontDisplay: '"Syne", system-ui, sans-serif',
    fontBody: '"Plus Jakarta Sans", system-ui, sans-serif',
    googleFontsHref: FONT_ATHLETIC,
    radius: "14px",
    radiusLg: "24px",
  },
  authority: {
    ink: "#0a0f18",
    ink2: "#111827",
    surface: "#1a2332",
    line: "rgba(148,163,184,0.15)",
    text: "#f1f5f9",
    muted: "#94a3b8",
    accent: "#c9a86c",
    accentDim: "rgba(201,168,108,0.14)",
    accentGlow: "rgba(201,168,108,0.3)",
    onAccent: "#0a0f18",
    mode: "dark",
    fontDisplay: '"Instrument Serif", Georgia, serif',
    fontBody: '"DM Sans", system-ui, sans-serif',
    googleFontsHref: FONT_AUTHORITY,
    radius: "4px",
    radiusLg: "8px",
  },
  editorial: {
    ink: "#0a0a0a",
    ink2: "#141414",
    surface: "#1c1c1c",
    line: "rgba(255,255,255,0.1)",
    text: "#fafafa",
    muted: "#a3a3a3",
    accent: "#e8d5b5",
    accentDim: "rgba(232,213,181,0.12)",
    accentGlow: "rgba(232,213,181,0.28)",
    onAccent: "#0a0a0a",
    mode: "dark",
    fontDisplay: '"Cormorant Garamond", Georgia, serif',
    fontBody: '"Manrope", system-ui, sans-serif',
    googleFontsHref: FONT_EDITORIAL,
    radius: "0px",
    radiusLg: "0px",
  },
  hospitality: {
    ink: "#12100e",
    ink2: "#1a1714",
    surface: "#221e1a",
    line: "rgba(212,175,106,0.2)",
    text: "#f5f0e6",
    muted: "#b0a594",
    accent: "#d4af6a",
    accentDim: "rgba(212,175,106,0.15)",
    accentGlow: "rgba(212,175,106,0.32)",
    onAccent: "#12100e",
    mode: "dark",
    fontDisplay: '"Cormorant Garamond", Georgia, serif',
    fontBody: '"Outfit", system-ui, sans-serif',
    googleFontsHref: FONT_SERIF,
    radius: "6px",
    radiusLg: "12px",
  },
  trade: {
    ink: "#0c0e12",
    ink2: "#141820",
    surface: "#1a1f2a",
    line: "rgba(255,255,255,0.09)",
    text: "#eef1f6",
    muted: "#9aa3b5",
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.14)",
    accentGlow: "rgba(59,130,246,0.3)",
    onAccent: "#ffffff",
    mode: "dark",
    fontDisplay: '"Syne", system-ui, sans-serif',
    fontBody: '"Plus Jakarta Sans", system-ui, sans-serif',
    googleFontsHref: FONT_ATHLETIC,
    radius: "10px",
    radiusLg: "16px",
  },
  clarity: {
    ink: "#0f0f12",
    ink2: "#16161c",
    surface: "#1e1e26",
    line: "rgba(167,139,250,0.18)",
    text: "#f5f3ff",
    muted: "#a09cb0",
    accent: "#a78bfa",
    accentDim: "rgba(167,139,250,0.14)",
    accentGlow: "rgba(167,139,250,0.32)",
    onAccent: "#0f0f12",
    mode: "dark",
    fontDisplay: '"Syne", system-ui, sans-serif',
    fontBody: '"Plus Jakarta Sans", system-ui, sans-serif',
    googleFontsHref: FONT_ATHLETIC,
    radius: "12px",
    radiusLg: "20px",
  },
};
