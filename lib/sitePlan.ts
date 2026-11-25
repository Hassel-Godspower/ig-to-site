/**
 * Site plan — AI chooses composition; engine assembles blocks.
 * Unique arrangement per job/niche without free-form HTML.
 */

import { resolveTemplateFamily, sitePlanFromFamily } from "./templateFamilies";
import {
  heroBlockForNiche,
  resolveDesignDna,
  sectionsForDna,
  cardStyleForDna,
} from "./designDna";

/** Hero patterns available on the block menu */
export type HeroBlockId =
  | "hero_fullbleed"
  | "hero_asymmetric"
  | "hero_authority"
  | "hero_minimal"
  | "hero_collage"
  | "hero_kinetic"
  | "hero_tech"
  | "hero_soft_split";

/** Section blocks the assembler knows how to render */
export type SectionBlockId =
  | "marquee"
  | "services_bento"
  | "services_grid"
  | "services_list"
  | "about_split"
  | "metrics_row"
  | "gallery_mosaic"
  | "quotes"
  | "cta_band"
  | "cta_panel"
  | "offerings_editorial";

export type CardStyle = "bento" | "grid" | "list" | "editorial";

export type SitePlan = {
  hero: HeroBlockId;
  sections: SectionBlockId[];
  cardStyle: CardStyle;
  nav: { href: string; label: string }[];
  pageTitles?: {
    about?: string;
    services?: string;
    gallery?: string;
    contact?: string;
  };
  density?: "sparse" | "balanced" | "rich";
};

const DEFAULT_NAV: SitePlan["nav"] = [
  { href: "index.html", label: "Home" },
  { href: "about.html", label: "About" },
  { href: "services.html", label: "Services" },
  { href: "gallery.html", label: "Gallery" },
  { href: "contact.html", label: "Contact" },
];

const HERO_SET = new Set<string>([
  "hero_fullbleed",
  "hero_asymmetric",
  "hero_authority",
  "hero_minimal",
  "hero_collage",
  "hero_kinetic",
  "hero_tech",
  "hero_soft_split",
]);

const SECTION_SET = new Set<string>([
  "marquee",
  "services_bento",
  "services_grid",
  "services_list",
  "about_split",
  "metrics_row",
  "gallery_mosaic",
  "quotes",
  "cta_band",
  "cta_panel",
  "offerings_editorial",
]);

const CARD_SET = new Set<string>(["bento", "grid", "list", "editorial"]);

/**
 * Deterministic default plan from niche —
 * family IA + DNA hero / sections / cardStyle.
 */
export function defaultPlanForNiche(nicheId: string): SitePlan {
  const family = resolveTemplateFamily(nicheId);
  const fromFamily = sitePlanFromFamily(family);
  const dna = resolveDesignDna(nicheId);

  const density: SitePlan["density"] =
    dna.spacingScale === "editorial"
      ? "sparse"
      : dna.spacingScale === "compact"
        ? "rich"
        : "balanced";

  return {
    ...fromFamily,
    hero: heroBlockForNiche(nicheId),
    sections: sectionsForDna(dna.id),
    cardStyle: cardStyleForDna(dna.id),
    density,
  };
}

/** Merge AI plan with niche defaults; drop unknown block ids */
export function normalizeSitePlan(
  raw: Partial<SitePlan> | null | undefined,
  nicheId: string
): SitePlan {
  const base = defaultPlanForNiche(nicheId);
  if (!raw || typeof raw !== "object") return base;

  const hero =
    raw.hero && HERO_SET.has(raw.hero) ? (raw.hero as HeroBlockId) : base.hero;

  let sections: SectionBlockId[] =
    Array.isArray(raw.sections) && raw.sections.length
      ? (raw.sections.filter((s) => SECTION_SET.has(s)) as SectionBlockId[])
      : base.sections;
  if (!sections.length) sections = base.sections;
  sections = sections.slice(0, 8);

  const cardStyle =
    raw.cardStyle && CARD_SET.has(raw.cardStyle)
      ? (raw.cardStyle as CardStyle)
      : base.cardStyle;

  let nav = base.nav;
  if (Array.isArray(raw.nav) && raw.nav.length >= 3) {
    const cleaned = raw.nav
      .map((n) => ({
        href: String(n.href || "").trim() || "index.html",
        label: String(n.label || "").trim().slice(0, 24),
      }))
      .filter((n) => n.label);
    if (cleaned.length >= 3) nav = cleaned.slice(0, 7);
  }

  return {
    hero,
    sections,
    cardStyle,
    nav,
    pageTitles: { ...base.pageTitles, ...raw.pageTitles },
    density: raw.density || base.density,
  };
}

/** Prompt fragment: menu the model may choose from */
export function sitePlanMenuForPrompt(): string {
  return `
=== COMPOSITION MENU (choose — do not invent new block ids) ===
hero (pick one):
  hero_fullbleed — cinematic full-viewport image + overlay (spa, dining, hotel)
  hero_asymmetric — split image | copy + metrics (fitness, sports)
  hero_authority — type-led + side media (law, estate, clinic)
  hero_minimal — oversized type, minimal media
  hero_collage — editorial overlapping frames (fashion, beauty, portfolio)
  hero_kinetic — giant split-tone type (agency, creative)
  hero_tech — glow + metrics + product visual (SaaS, tech)
  hero_soft_split — soft product card + copy (retail, wellness, soft brands)

sections (ordered array, 3–7 items, only these ids):
  marquee | services_bento | services_grid | services_list | offerings_editorial
  about_split | metrics_row | gallery_mosaic | quotes | cta_band | cta_panel

cardStyle: bento | grid | list | editorial
nav: array of {href, label} for index/about/services/gallery/contact html files
pageTitles: optional { about, services, gallery, contact } labels

Pick a combination that feels native to THIS niche — not a generic startup landing page.
Page filenames and nav labels are controlled by the template family.
Include a "plan" object in your JSON with: hero, sections, cardStyle, nav, pageTitles (optional).
`.trim();
}
