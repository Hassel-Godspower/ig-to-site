/**
 * gòke Design DNA — Stage 5 quality floor
 * Maps niche → visual system inspired by studio references
 * (soft product, editorial collage, kinetic agency, future tech, cinematic luxury).
 */

export type DesignDnaId =
  | "soft_product"
  | "editorial_collage"
  | "kinetic_agency"
  | "future_tech"
  | "cinematic_luxury"
  | "performance_edge"
  | "quiet_authority"
  | "sensorial_wellness"
  | "portrait_studio";

export type HeroVariant =
  | "split_soft"
  | "collage_portrait"
  | "kinetic_type"
  | "tech_glow"
  | "cinematic_fullbleed"
  | "centered_metrics";

export type DesignDna = {
  id: DesignDnaId;
  label: string;
  mode: "dark" | "light";
  ink: string;
  ink2: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  fontDisplay: string;
  fontBody: string;
  googleFontsHref: string;
  radius: string;
  radiusLg: string;
  heroVariant: HeroVariant;
  motion: "soft" | "crisp" | "cinematic";
  spacingScale: "tight" | "studio" | "editorial";
  imageMood: string;
  headlineStyle: string;
  avoid: string;
};

const DNA: Record<DesignDnaId, DesignDna> = {
  soft_product: {
    id: "soft_product",
    label: "Soft product",
    mode: "light",
    ink: "#f3f1ec",
    ink2: "#e8f0e4",
    surface: "#ffffff",
    text: "#1a1c19",
    muted: "#5c635a",
    accent: "#2f6f4e",
    onAccent: "#ffffff",
    fontDisplay: '"Syne", system-ui, sans-serif',
    fontBody: "system-ui, -apple-system, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&display=swap",
    radius: "20px",
    radiusLg: "28px",
    heroVariant: "split_soft",
    motion: "soft",
    spacingScale: "studio",
    imageMood: "lifestyle product, soft daylight, clean props",
    headlineStyle: "Clear product benefit, short lines",
    avoid: "Neon cyberpunk, dense text walls, tiny radius",
  },
  editorial_collage: {
    id: "editorial_collage",
    label: "Editorial collage",
    mode: "light",
    ink: "#f5f0e8",
    ink2: "#ebe4d8",
    surface: "#fffdf9",
    text: "#141414",
    muted: "#6b6560",
    accent: "#141414",
    onAccent: "#f5f0e8",
    fontDisplay: '"Cormorant Garamond", Georgia, serif',
    fontBody: "system-ui, -apple-system, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap",
    radius: "4px",
    radiusLg: "8px",
    heroVariant: "collage_portrait",
    motion: "cinematic",
    spacingScale: "editorial",
    imageMood: "fashion editorial, strong portrait, cream studio",
    headlineStyle: "Name or brand as oversized type behind image",
    avoid: "Busy gradients, startup purple, cheap stock smiles",
  },
  kinetic_agency: {
    id: "kinetic_agency",
    label: "Kinetic agency",
    mode: "light",
    ink: "#ffffff",
    ink2: "#f4f4f4",
    surface: "#ffffff",
    text: "#0a0a0a",
    muted: "#555555",
    accent: "#00f0c8",
    onAccent: "#0a0a0a",
    fontDisplay: '"Syne", "Arial Black", system-ui, sans-serif',
    fontBody: "system-ui, -apple-system, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap",
    radius: "0px",
    radiusLg: "0px",
    heroVariant: "kinetic_type",
    motion: "crisp",
    spacingScale: "tight",
    imageMood: "abstract or none; type is the hero",
    headlineStyle: "Massive multi-line statement, split accent color",
    avoid: "Soft pastel cards, long paragraphs in hero",
  },
  future_tech: {
    id: "future_tech",
    label: "Future tech",
    mode: "dark",
    ink: "#0b0618",
    ink2: "#160b2e",
    surface: "#1a1035",
    text: "#f3eefc",
    muted: "#a89bc4",
    accent: "#a855f7",
    onAccent: "#0b0618",
    fontDisplay: '"Syne", system-ui, sans-serif',
    fontBody: "system-ui, -apple-system, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap",
    radius: "16px",
    radiusLg: "24px",
    heroVariant: "tech_glow",
    motion: "soft",
    spacingScale: "studio",
    imageMood: "abstract glass, luminous gradients, no clipart",
    headlineStyle: "Efficiency / intelligence benefit + metrics row",
    avoid: "Flat gray Bootstrap, stock handshake photos",
  },
  cinematic_luxury: {
    id: "cinematic_luxury",
    label: "Cinematic luxury",
    mode: "dark",
    ink: "#0a0c10",
    ink2: "#12151c",
    surface: "#161a22",
    text: "#f4f1ea",
    muted: "#a8a29e",
    accent: "#c4a574",
    onAccent: "#0a0c10",
    fontDisplay: '"Cormorant Garamond", Georgia, serif',
    fontBody: "system-ui, -apple-system, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap",
    radius: "2px",
    radiusLg: "6px",
    heroVariant: "cinematic_fullbleed",
    motion: "cinematic",
    spacingScale: "editorial",
    imageMood: "cinematic wide, golden hour, high-end environment",
    headlineStyle: "Two short lines, maximum gravity",
    avoid: "Emoji, busy grids, bright primary blue",
  },
  performance_edge: {
    id: "performance_edge",
    label: "Performance edge",
    mode: "dark",
    ink: "#07090f",
    ink2: "#0e1219",
    surface: "#141a24",
    text: "#f3f4f6",
    muted: "#9ca3af",
    accent: "#22d3ee",
    onAccent: "#07090f",
    fontDisplay: '"Syne", system-ui, sans-serif',
    fontBody: "system-ui, -apple-system, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap",
    radius: "12px",
    radiusLg: "18px",
    heroVariant: "centered_metrics",
    motion: "crisp",
    spacingScale: "studio",
    imageMood: "training, motion, high contrast athletic",
    headlineStyle: "Imperative, results-led",
    avoid: "Floral wellness pastels",
  },
  quiet_authority: {
    id: "quiet_authority",
    label: "Quiet authority",
    mode: "dark",
    ink: "#0c0f14",
    ink2: "#151a22",
    surface: "#1c2330",
    text: "#f4f1ea",
    muted: "#a8a29e",
    accent: "#c4a574",
    onAccent: "#0c0f14",
    fontDisplay: '"Cormorant Garamond", Georgia, serif',
    fontBody: "system-ui, -apple-system, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap",
    radius: "10px",
    radiusLg: "14px",
    heroVariant: "split_soft",
    motion: "soft",
    spacingScale: "editorial",
    imageMood: "professional portrait, calm interior",
    headlineStyle: "Credibility over hype",
    avoid: "Salesy exclamation, neon",
  },
  portrait_studio: {
    id: "portrait_studio",
    label: "Portrait studio",
    mode: "dark",
    ink: "#1a1816",
    ink2: "#24201c",
    surface: "#2a2622",
    text: "#f4f0e8",
    muted: "#b5a99a",
    accent: "#c4a574",
    onAccent: "#1a1816",
    fontDisplay: '"Cormorant Garamond", Georgia, serif',
    fontBody: "system-ui, -apple-system, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&display=swap",
    radius: "4px",
    radiusLg: "10px",
    heroVariant: "split_soft", // portrait right, copy left — SABIEGAL frame 1–2
    motion: "cinematic",
    spacingScale: "editorial",
    imageMood:
      "warm studio key light, rich skin tones, director chair / camera props, editorial portrait",
    headlineStyle:
      "Short gold serif lines: reintroduce / name / what we shoot — never hype startup speak",
    avoid:
      "Neon mint, white SaaS grids, kinetic agency type, purple tech glow, dense card walls",
  },
  sensorial_wellness: {
    id: "sensorial_wellness",
    label: "Sensorial wellness",
    mode: "dark",
    ink: "#0f1410",
    ink2: "#171c18",
    surface: "#1c241e",
    text: "#f3f6f1",
    muted: "#9ca89a",
    accent: "#c4b59a",
    onAccent: "#0f1410",
    fontDisplay: '"Cormorant Garamond", Georgia, serif',
    fontBody: "system-ui, -apple-system, sans-serif",
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap",
    radius: "14px",
    radiusLg: "22px",
    heroVariant: "cinematic_fullbleed",
    motion: "cinematic",
    spacingScale: "editorial",
    imageMood: "spa hands, linen, soft light, dignity",
    headlineStyle: "Slow, sensory, few words",
    avoid: "Clinic-sterile blue, coupon language",
  },
};

/** Niche id (from your classifier) → DNA */
const NICHE_TO_DNA: Record<string, DesignDnaId> = {
  // wellness / beauty
  spa: "sensorial_wellness",
  wellness: "sensorial_wellness",
  massage: "sensorial_wellness",
  beauty: "editorial_collage",
  fashion: "editorial_collage",
  salon: "editorial_collage",
  hair: "editorial_collage",
  cosmetics: "editorial_collage",
  fragrance: "editorial_collage",
  // performance
  fitness: "performance_edge",
  gym: "performance_edge",
  coaching: "performance_edge",
  sports: "performance_edge",
  // luxury / hospitality
  restaurant: "cinematic_luxury",
  hotel: "cinematic_luxury",
  real_estate: "cinematic_luxury",
  estate: "cinematic_luxury",
  auto: "cinematic_luxury",
  events: "cinematic_luxury",
  // tech
  tech: "future_tech",
  saas: "future_tech",
  electronics: "future_tech",
  gadgets: "future_tech",
  // creative / portrait (SABIEGAL-class)
  photography: "portrait_studio",
  photographer: "portrait_studio",
  photo: "portrait_studio",
  portfolio: "portrait_studio",
  videography: "portrait_studio",
  videographer: "portrait_studio",
  content_creator: "portrait_studio",
  creator: "portrait_studio",
  // agencies stay kinetic
  agency: "kinetic_agency",
  creative_agency: "kinetic_agency",
  design_agency: "kinetic_agency",
  design: "editorial_collage", // product/fashion design ≠ mint kinetic
  creative: "portrait_studio",
  // retail / product
  ecommerce: "soft_product",
  retail: "soft_product",
  supermarket: "soft_product",
  pharmacy: "soft_product",
  furniture: "soft_product",
  building: "soft_product",
  materials: "soft_product",
  farm: "soft_product",
  produce: "soft_product",
  logistics: "soft_product",
  delivery: "soft_product",
  // professional
  professional: "quiet_authority",
  legal: "quiet_authority",
  lawyer: "quiet_authority",
  consultant: "quiet_authority",
  finance: "quiet_authority",
  clinic: "quiet_authority",
  healthcare: "quiet_authority",
  education: "quiet_authority",
  school: "quiet_authority",
  general_business: "soft_product",
  general: "soft_product",
};

export function resolveDesignDna(nicheId: string): DesignDna {
  const key = String(nicheId || "general_business")
    .toLowerCase()
    .replace(/\s+/g, "_");
  const id = NICHE_TO_DNA[key] || NICHE_TO_DNA[key.split("_")[0]] || "soft_product";
  return DNA[id] || DNA.soft_product;
}

export function designDnaPromptBlock(nicheId: string, brand: string): string {
  const d = resolveDesignDna(nicheId);
  return `
=== DESIGN DNA (mandatory visual system) ===
DNA: ${d.id} — ${d.label}
Mode: ${d.mode}
Hero variant: ${d.heroVariant}
Headline style: ${d.headlineStyle}
Image mood: ${d.imageMood}
Spacing: ${d.spacingScale} · Motion: ${d.motion}
Avoid: ${d.avoid}
Brand: ${brand}
The site must feel like a commissioned studio build, not a theme demo.
`.trim();
}

export function dnaToShellTheme(d: DesignDna, brandPrimary?: string) {
  const accent =
    brandPrimary && /^#[0-9a-fA-F]{6}$/.test(brandPrimary)
      ? brandPrimary
      : d.accent;
  return {
    ink: d.ink,
    ink2: d.ink2,
    surface: d.surface,
    line: d.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(20,20,20,0.1)",
    text: d.text,
    muted: d.muted,
    accent,
    accentDim: accent + "26",
    accentGlow: accent + "59",
    onAccent: d.onAccent,
    mode: d.mode as "dark" | "light",
    fontDisplay: d.fontDisplay,
    fontBody: d.fontBody,
    googleFontsHref: d.googleFontsHref,
    radius: d.radius,
    radiusLg: d.radiusLg,
    heroVariant: d.heroVariant,
    motion: d.motion,
  };
}

import type { HeroBlockId } from "./sitePlan";

/** Map DNA hero language → assembler block id */
export function heroBlockFromDna(
  variant: HeroVariant | string | undefined
): HeroBlockId {
  switch (variant) {
    case "collage_portrait":
      return "hero_collage";
    case "kinetic_type":
      return "hero_kinetic";
    case "tech_glow":
      return "hero_tech";
    case "split_soft":
      return "hero_soft_split";
    case "centered_metrics":
      return "hero_asymmetric";
    case "cinematic_fullbleed":
    default:
      return "hero_fullbleed";
  }
}

export function heroBlockForNiche(nicheId: string): HeroBlockId {
  return heroBlockFromDna(resolveDesignDna(nicheId).heroVariant);
}

import type { SectionBlockId, CardStyle } from "./sitePlan";

/** Ordered home sections per DNA — studio composition, not random */
export function sectionsForDna(dnaId: DesignDnaId): SectionBlockId[] {
  switch (dnaId) {
    case "sensorial_wellness":
      return ["marquee", "services_bento", "about_split", "gallery_mosaic", "quotes", "cta_band"];
    case "portrait_studio":
      return [
        "metrics_row",
        "about_split",
        "services_list",
        "gallery_mosaic",
        "quotes",
        "cta_panel",
      ];
    case "editorial_collage":
      return ["offerings_editorial", "about_split", "gallery_mosaic", "quotes", "cta_panel"];
    case "kinetic_agency":
      return ["marquee", "services_grid", "metrics_row", "about_split", "cta_band"];
    case "future_tech":
      return ["metrics_row", "services_bento", "about_split", "gallery_mosaic", "cta_band"];
    case "cinematic_luxury":
      return ["marquee", "services_grid", "about_split", "gallery_mosaic", "quotes", "cta_panel"];
    case "performance_edge":
      return ["metrics_row", "services_bento", "about_split", "gallery_mosaic", "cta_band"];
    case "quiet_authority":
      return ["about_split", "services_list", "metrics_row", "quotes", "cta_panel"];
    case "soft_product":
    default:
      return ["marquee", "services_grid", "about_split", "gallery_mosaic", "cta_band"];
  }
}

export function cardStyleForDna(dnaId: DesignDnaId): CardStyle {
  switch (dnaId) {
    case "performance_edge":
    case "future_tech":
      return "bento";
    case "quiet_authority":
    case "editorial_collage":
      return "editorial";
    default:
      return "grid";
  }
}
export function spacingPad(scale: DesignDna["spacingScale"]): {
  section: string;
  sectionY: string;
} {
  if (scale === "tight") return { section: "3.25rem", sectionY: "2.75rem" };
  if (scale === "editorial") return { section: "5.5rem", sectionY: "4.75rem" };
  return { section: "4.5rem", sectionY: "3.75rem" }; // studio
}
