/**
 * Personal-brand design families (inspired by high-end portfolio / coach / expert sites).
 * Not LinkedIn clones — multipage editorial sites.
 */

export type ProThemeId =
  | "editorial_coach" // Nadejiah-like: warm, serif accents, programs
  | "expert_clean" // Jisan / Neil-like: white, bold name, stats
  | "creator_bold" // Pete-like: large type over photo energy
  | "consultant_ink"; // deep, restrained authority

export type ProTheme = {
  id: ProThemeId;
  label: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  displayFont: string;
  bodyFont: string;
  heroStyle: "split_portrait" | "message_first" | "name_focus" | "cinematic";
  ctaPrimary: string;
  ctaSecondary: string;
};

export const PRO_THEMES: Record<ProThemeId, ProTheme> = {
  editorial_coach: {
    id: "editorial_coach",
    label: "Editorial coach",
    bg: "#f7f1ea",
    surface: "#ffffff",
    text: "#1c1917",
    muted: "#78716c",
    accent: "#1a4d3e",
    accentSoft: "#e8efe9",
    displayFont: '"Cormorant Garamond", Georgia, serif',
    bodyFont: "system-ui, -apple-system, \"Segoe UI\", sans-serif",
    heroStyle: "message_first",
    ctaPrimary: "Work with me",
    ctaSecondary: "About",
  },
  expert_clean: {
    id: "expert_clean",
    label: "Expert clean",
    bg: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#6d28d9",
    accentSoft: "#ede9fe",
    displayFont: "Syne, system-ui, sans-serif",
    bodyFont: "system-ui, -apple-system, \"Segoe UI\", sans-serif",
    heroStyle: "split_portrait",
    ctaPrimary: "Let's talk",
    ctaSecondary: "View work",
  },
  creator_bold: {
    id: "creator_bold",
    label: "Creator bold",
    bg: "#0c0c0c",
    surface: "#171717",
    text: "#fafafa",
    muted: "#a3a3a3",
    accent: "#f59e0b",
    accentSoft: "#292524",
    displayFont: "Syne, system-ui, sans-serif",
    bodyFont: "system-ui, -apple-system, sans-serif",
    heroStyle: "cinematic",
    ctaPrimary: "Read the story",
    ctaSecondary: "Contact",
  },
  consultant_ink: {
    id: "consultant_ink",
    label: "Consultant ink",
    bg: "#fafafa",
    surface: "#ffffff",
    text: "#111827",
    muted: "#6b7280",
    accent: "#ea580c",
    accentSoft: "#fff7ed",
    displayFont: "Syne, system-ui, sans-serif",
    bodyFont: "system-ui, -apple-system, sans-serif",
    heroStyle: "name_focus",
    ctaPrimary: "Start analysis",
    ctaSecondary: "Services",
  },
};

export function themeForPersona(persona?: string | null): ProTheme {
  switch (persona) {
    case "designer":
    case "consultant":
    case "general":
      return PRO_THEMES.editorial_coach;
    case "creator":
    case "marketer":
      return PRO_THEMES.creator_bold;
    case "engineer":
    case "founder":
      return PRO_THEMES.expert_clean;
    case "lawyer":
      return PRO_THEMES.consultant_ink;
    default:
      return PRO_THEMES.consultant_ink;
  }
}
