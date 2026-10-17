/**
 * Site plan — AI chooses composition; engine assembles blocks.
 * Unique arrangement per job/niche without free-form HTML.
 */

import { resolveOpulentDirection, type LuxuryArchetype } from "./opulentDirection";

/** Hero patterns available on the block menu */
export type HeroBlockId =
  | "hero_fullbleed" // cinematic full viewport image + overlay (spa/dining)
  | "hero_asymmetric" // split visual | copy + metrics (fitness)
  | "hero_authority" // type-forward + side media (law/estate)
  | "hero_minimal"; // large type, minimal chrome

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
  | "offerings_editorial"; // label + title + grid, softer than bento

export type CardStyle = "bento" | "grid" | "list" | "editorial";

export type SitePlan = {
  hero: HeroBlockId;
  /** Ordered home-page sections after hero */
  sections: SectionBlockId[];
  cardStyle: CardStyle;
  /** Nav labels for the 5 pages (Home always first conceptually) */
  nav: { href: string; label: string }[];
  /** Optional page title overrides */
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

/** Deterministic default plan from niche — used when AI omits plan */
export function defaultPlanForNiche(nicheId: string): SitePlan {
  const o = resolveOpulentDirection(nicheId);
  return planFromArchetype(o.archetype, nicheId);
}

function planFromArchetype(a: LuxuryArchetype, nicheId: string): SitePlan {
  const id = (nicheId || "").toLowerCase();

  if (a === "athletic_edge" || a === "technical_opulence") {
    return {
      hero: "hero_asymmetric",
      sections: ["marquee", "services_bento", "about_split", "metrics_row", "gallery_mosaic", "cta_panel"],
      cardStyle: "bento",
      nav: fitnessNav(id),
      pageTitles: fitnessTitles(id),
      density: "rich",
    };
  }

  if (a === "quiet_authority" || a === "clinical_precision") {
    return {
      hero: "hero_authority",
      sections: ["services_list", "about_split", "metrics_row", "cta_band"],
      cardStyle: "list",
      nav: [
        { href: "index.html", label: "Home" },
        { href: "about.html", label: "About" },
        { href: "services.html", label: id.includes("estate") ? "Listings" : "Practice" },
        { href: "gallery.html", label: "Insights" },
        { href: "contact.html", label: "Contact" },
      ],
      density: "sparse",
    };
  }

  if (a === "product_clarity" || a === "editorial_craft") {
    return {
      hero: "hero_asymmetric",
      sections: ["services_bento", "about_split", "gallery_mosaic", "cta_panel"],
      cardStyle: "bento",
      nav: DEFAULT_NAV,
      density: "balanced",
    };
  }

  if (a === "sensorial_indulgence") {
    return {
      hero: "hero_fullbleed",
      sections: ["offerings_editorial", "about_split", "gallery_mosaic", "quotes", "cta_band"],
      cardStyle: "editorial",
      nav: [
        { href: "index.html", label: "Home" },
        { href: "about.html", label: "Story" },
        { href: "services.html", label: id.includes("bar") ? "Menu" : "Menu" },
        { href: "gallery.html", label: "Gallery" },
        { href: "contact.html", label: "Reserve" },
      ],
      pageTitles: {
        about: "Story",
        services: "Menu",
        gallery: "Gallery",
        contact: "Reserve",
      },
      density: "balanced",
    };
  }

  if (a === "modern_heritage") {
    return {
      hero: "hero_fullbleed",
      sections: ["services_grid", "about_split", "gallery_mosaic", "cta_band"],
      cardStyle: "grid",
      nav: [
        { href: "index.html", label: "Home" },
        { href: "about.html", label: "Maison" },
        { href: "services.html", label: "Collection" },
        { href: "gallery.html", label: "Lookbook" },
        { href: "contact.html", label: "Contact" },
      ],
      pageTitles: {
        about: "Maison",
        services: "Collection",
        gallery: "Lookbook",
        contact: "Contact",
      },
      density: "sparse",
    };
  }

  if (a === "warm_institution") {
    return {
      hero: "hero_fullbleed",
      sections: ["services_grid", "about_split", "metrics_row", "gallery_mosaic", "cta_band"],
      cardStyle: "grid",
      nav: DEFAULT_NAV,
      density: "balanced",
    };
  }

  // exotic_sanctuary (spa) and default opulent
  return {
    hero: "hero_fullbleed",
    sections: ["offerings_editorial", "about_split", "gallery_mosaic", "quotes", "cta_band"],
    cardStyle: "editorial",
    nav: [
      { href: "index.html", label: "Home" },
      { href: "about.html", label: "About" },
      { href: "services.html", label: "Treatments" },
      { href: "gallery.html", label: "Gallery" },
      { href: "contact.html", label: "Book" },
    ],
    pageTitles: {
      about: "About",
      services: "Treatments",
      gallery: "Gallery",
      contact: "Book",
    },
    density: "sparse",
  };
}

function fitnessNav(id: string): SitePlan["nav"] {
  if (/fitness|gym|train/.test(id)) {
    return [
      { href: "index.html", label: "Home" },
      { href: "about.html", label: "Studio" },
      { href: "services.html", label: "Training" },
      { href: "gallery.html", label: "Floor" },
      { href: "contact.html", label: "Join" },
    ];
  }
  return DEFAULT_NAV;
}

function fitnessTitles(id: string): SitePlan["pageTitles"] {
  if (/fitness|gym|train/.test(id)) {
    return { about: "Studio", services: "Training", gallery: "Floor", contact: "Join" };
  }
  return undefined;
}

const HERO_SET = new Set<string>([
  "hero_fullbleed",
  "hero_asymmetric",
  "hero_authority",
  "hero_minimal",
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
  // Cap length for performance
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
  hero_fullbleed — cinematic full-viewport image + overlay (spa, dining, fashion, hotel)
  hero_asymmetric — split image | copy + metrics (fitness, tech, creative)
  hero_authority — type-led + side media (law, estate, clinic)
  hero_minimal — oversized type, minimal media

sections (ordered array, 3–7 items, only these ids):
  marquee | services_bento | services_grid | services_list | offerings_editorial
  about_split | metrics_row | gallery_mosaic | quotes | cta_band | cta_panel

cardStyle: bento | grid | list | editorial
nav: array of {href, label} for index/about/services/gallery/contact html files
pageTitles: optional { about, services, gallery, contact } labels

Pick a combination that feels native to THIS niche — not a generic startup landing page.
Include a "plan" object in your JSON with: hero, sections, cardStyle, nav, pageTitles (optional).
`.trim();
}
