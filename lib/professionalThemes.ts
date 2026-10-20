/**
 * Professional site themes + layout modes.
 * Inspired by public portfolio craft patterns (sticky identity rail,
 * project tables, work-first grids, long single-page). Not copies of
 * any specific author's site.
 */

export type ProLayoutMode =
  | "split_sticky" // engineer: sticky left identity + scroll proof
  | "long_single" // creator/minimal: one HTML, anchor nav
  | "multipage_editorial" // consultant/coach: multi HTML
  | "work_grid"; // designer: work-first

export type ProThemeId =
  | "editorial_coach"
  | "expert_clean"
  | "creator_bold"
  | "consultant_ink"
  | "engineer_halcyon"; // dark + one accent (craft engineer family)

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
  heroStyle: "split_portrait" | "message_first" | "name_focus" | "cinematic" | "sticky_rail";
  ctaPrimary: string;
  ctaSecondary: string;
  layout: ProLayoutMode;
};

export const PRO_THEMES: Record<ProThemeId, ProTheme> = {
  engineer_halcyon: {
    id: "engineer_halcyon",
    label: "Engineer craft",
    bg: "#0a192f",
    surface: "#112240",
    text: "#e6f1ff",
    muted: "#8892b0",
    accent: "#64ffda",
    accentSoft: "rgba(100, 255, 218, 0.12)",
    displayFont: "system-ui, -apple-system, \"Segoe UI\", sans-serif",
    bodyFont: "system-ui, -apple-system, \"Segoe UI\", sans-serif",
    heroStyle: "sticky_rail",
    ctaPrimary: "Get in touch",
    ctaSecondary: "View work",
    layout: "split_sticky",
  },
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
    layout: "multipage_editorial",
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
    layout: "multipage_editorial",
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
    layout: "long_single",
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
    ctaPrimary: "Start a conversation",
    ctaSecondary: "Experience",
    layout: "multipage_editorial",
  },
};

export function themeForPersona(persona?: string | null): ProTheme {
  switch (persona) {
    case "engineer":
      return PRO_THEMES.engineer_halcyon;
    case "designer":
      return {
        ...PRO_THEMES.expert_clean,
        layout: "work_grid",
        heroStyle: "split_portrait",
      };
    case "creator":
    case "marketer":
      return PRO_THEMES.creator_bold;
    case "founder":
      return {
        ...PRO_THEMES.engineer_halcyon,
        accent: "#64ffda",
        layout: "split_sticky",
      };
    case "consultant":
    case "general":
      return PRO_THEMES.editorial_coach;
    case "lawyer":
      return PRO_THEMES.consultant_ink;
    default:
      return PRO_THEMES.consultant_ink;
  }
}

/** Prefer fewer pages when profile content is thin */
export function resolveLayout(
  theme: ProTheme,
  contentScore: number
): ProLayoutMode {
  if (contentScore < 2 && theme.layout === "multipage_editorial") {
    return "long_single";
  }
  return theme.layout;
}

export function contentScore(profile: {
  experience?: unknown[];
  projects?: unknown[];
  skills?: unknown[];
  about?: string;
}): number {
  let s = 0;
  if ((profile.experience?.length || 0) > 0) s += 2;
  if ((profile.projects?.length || 0) > 0) s += 2;
  if ((profile.skills?.length || 0) > 3) s += 1;
  if ((profile.about || "").length > 80) s += 1;
  return s;
}
