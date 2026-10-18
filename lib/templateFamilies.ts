/**
 * Niche → Gòke main template family.
 * Unique multi-page IA (not one global Home/About/Services/Gallery/Contact).
 * Inspired by public/goke-templates packs + marketing template cards.
 */

import type { HeroBlockId, SectionBlockId, CardStyle, SitePlan } from "./sitePlan";

export type TemplateFamilyId =
  | "clinic"
  | "auto"
  | "estate"
  | "stay"
  | "luxe"
  | "commerce"
  | "pro"
  | "portfolio"
  | "edu"
  | "app"
  | "dine"
  | "spa"
  | "fitness"
  | "general";

export type FamilyPage = {
  file: string;
  title: string;
  /** How the assembler fills this page */
  role:
    | "home"
    | "about"
    | "services"
    | "gallery"
    | "contact"
    | "listing" // inventory / properties / rooms / courses / shop
    | "detail" // single item
    | "team"
    | "booking"
    | "proof"; // cases / blog / financing
};

export type TemplateFamily = {
  id: TemplateFamilyId;
  /** Matches goke-main template id when present */
  gokeTemplateId: string;
  label: string;
  categories: string[];
  pages: FamilyPage[];
  defaultHero: HeroBlockId;
  defaultSections: SectionBlockId[];
  cardStyle: CardStyle;
  density: "sparse" | "balanced" | "rich";
  primaryCtaDefault: string;
};

export const TEMPLATE_FAMILIES: Record<TemplateFamilyId, TemplateFamily> = {
  spa: {
    id: "spa",
    gokeTemplateId: "goke-spa",
    label: "Spa / Wellness",
    categories: ["spa", "wellness", "beauty", "salon", "massage"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "about.html", title: "About", role: "about" },
      { file: "services.html", title: "Treatments", role: "services" },
      { file: "gallery.html", title: "Gallery", role: "gallery" },
      { file: "cart.html", title: "Booking", role: "booking" },
      { file: "contact.html", title: "Book", role: "contact" },
    ],
    defaultHero: "hero_fullbleed",
    defaultSections: [
      "offerings_editorial",
      "about_split",
      "gallery_mosaic",
      "quotes",
      "cta_band",
    ],
    cardStyle: "editorial",
    density: "sparse",
    primaryCtaDefault: "Book a session",
  },
  dine: {
    id: "dine",
    gokeTemplateId: "goke-dine",
    label: "Restaurant / Dining",
    categories: ["restaurant", "food", "cafe", "bakery", "bar"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "about.html", title: "Story", role: "about" },
      { file: "services.html", title: "Menu", role: "services" },
      { file: "gallery.html", title: "Gallery", role: "gallery" },
      { file: "cart.html", title: "Cart", role: "booking" },
      { file: "contact.html", title: "Reserve", role: "contact" },
    ],
    defaultHero: "hero_fullbleed",
    defaultSections: [
      "offerings_editorial",
      "about_split",
      "gallery_mosaic",
      "quotes",
      "cta_band",
    ],
    cardStyle: "editorial",
    density: "balanced",
    primaryCtaDefault: "Reserve a table",
  },
  fitness: {
    id: "fitness",
    gokeTemplateId: "goke-fitness",
    label: "Fitness / Training",
    categories: ["fitness", "gym", "coach"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "about.html", title: "Studio", role: "about" },
      { file: "services.html", title: "Training", role: "services" },
      { file: "gallery.html", title: "Floor", role: "gallery" },
      { file: "cart.html", title: "Booking", role: "booking" },
      { file: "contact.html", title: "Join", role: "contact" },
    ],
    defaultHero: "hero_asymmetric",
    defaultSections: [
      "marquee",
      "services_bento",
      "about_split",
      "metrics_row",
      "gallery_mosaic",
      "cta_panel",
    ],
    cardStyle: "bento",
    density: "rich",
    primaryCtaDefault: "Book a free session",
  },
  clinic: {
    id: "clinic",
    gokeTemplateId: "goke-clinic",
    label: "Clinic / Healthcare",
    categories: ["clinic", "healthcare", "dental", "pharmacy"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "about.html", title: "About", role: "about" },
      { file: "services.html", title: "Services", role: "services" },
      { file: "team.html", title: "Doctors", role: "team" },
      { file: "appointment.html", title: "Appointment", role: "booking" },
      { file: "cart.html", title: "Booking", role: "booking" },
      { file: "contact.html", title: "Contact", role: "contact" },
    ],
    defaultHero: "hero_authority",
    defaultSections: ["services_list", "about_split", "metrics_row", "cta_band"],
    cardStyle: "list",
    density: "sparse",
    primaryCtaDefault: "Book appointment",
  },
  estate: {
    id: "estate",
    gokeTemplateId: "goke-estate",
    label: "Real Estate",
    categories: ["real_estate", "estate", "short_let"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "properties.html", title: "Properties", role: "listing" },
      { file: "about.html", title: "About", role: "about" },
      { file: "agents.html", title: "Agents", role: "team" },
      { file: "gallery.html", title: "Gallery", role: "gallery" },
      { file: "cart.html", title: "Booking", role: "booking" },
      { file: "contact.html", title: "Enquire", role: "contact" },
    ],
    defaultHero: "hero_authority",
    defaultSections: [
      "services_grid",
      "about_split",
      "metrics_row",
      "gallery_mosaic",
      "cta_band",
    ],
    cardStyle: "grid",
    density: "balanced",
    primaryCtaDefault: "Enquire",
  },
  stay: {
    id: "stay",
    gokeTemplateId: "goke-stay",
    label: "Hotel / Stay",
    categories: ["hotel", "stay", "lodge"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "rooms.html", title: "Rooms", role: "listing" },
      { file: "about.html", title: "About", role: "about" },
      { file: "gallery.html", title: "Gallery", role: "gallery" },
      { file: "booking.html", title: "Booking", role: "booking" },
      { file: "contact.html", title: "Contact", role: "contact" },
    ],
    defaultHero: "hero_fullbleed",
    defaultSections: [
      "services_grid",
      "about_split",
      "gallery_mosaic",
      "metrics_row",
      "cta_band",
    ],
    cardStyle: "grid",
    density: "balanced",
    primaryCtaDefault: "Check availability",
  },
  luxe: {
    id: "luxe",
    gokeTemplateId: "goke-luxe",
    label: "Fashion / Luxe",
    categories: ["fashion", "luxe", "jewelry", "boutique", "african_wear"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "shop.html", title: "Shop", role: "listing" },
      { file: "collections.html", title: "Collections", role: "services" },
      { file: "lookbook.html", title: "Lookbook", role: "gallery" },
      { file: "about.html", title: "Maison", role: "about" },
      { file: "cart.html", title: "Cart", role: "booking" },
      { file: "contact.html", title: "Contact", role: "contact" },
    ],
    defaultHero: "hero_fullbleed",
    defaultSections: ["services_grid", "about_split", "gallery_mosaic", "cta_band"],
    cardStyle: "grid",
    density: "sparse",
    primaryCtaDefault: "Shop the collection",
  },
  commerce: {
    id: "commerce",
    gokeTemplateId: "goke-commerce",
    label: "Commerce / Store",
    categories: ["commerce", "shop", "retail", "ecommerce"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "shop.html", title: "Shop", role: "listing" },
      { file: "about.html", title: "About", role: "about" },
      { file: "gallery.html", title: "Gallery", role: "gallery" },
      { file: "cart.html", title: "Cart", role: "booking" },
      { file: "contact.html", title: "Contact", role: "contact" },
    ],
    defaultHero: "hero_asymmetric",
    defaultSections: ["services_bento", "about_split", "gallery_mosaic", "cta_panel"],
    cardStyle: "bento",
    density: "rich",
    primaryCtaDefault: "Shop now",
  },
  auto: {
    id: "auto",
    gokeTemplateId: "goke-auto",
    label: "Auto / Motors",
    categories: ["auto", "car", "dealership", "mechanic"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "inventory.html", title: "Inventory", role: "listing" },
      { file: "services.html", title: "Services", role: "services" },
      { file: "financing.html", title: "Financing", role: "proof" },
      { file: "about.html", title: "About", role: "about" },
      { file: "cart.html", title: "Cart", role: "booking" },
      { file: "contact.html", title: "Contact", role: "contact" },
    ],
    defaultHero: "hero_asymmetric",
    defaultSections: [
      "services_bento",
      "about_split",
      "metrics_row",
      "gallery_mosaic",
      "cta_panel",
    ],
    cardStyle: "bento",
    density: "rich",
    primaryCtaDefault: "Book inspection",
  },
  pro: {
    id: "pro",
    gokeTemplateId: "goke-pro",
    label: "Professional services",
    categories: ["law", "legal", "accounting", "consultant", "agency", "professional"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "about.html", title: "About", role: "about" },
      { file: "services.html", title: "Services", role: "services" },
      { file: "team.html", title: "Team", role: "team" },
      { file: "cases.html", title: "Case studies", role: "proof" },
      { file: "cart.html", title: "Booking", role: "booking" },
      { file: "contact.html", title: "Contact", role: "contact" },
    ],
    defaultHero: "hero_authority",
    defaultSections: ["services_list", "about_split", "metrics_row", "cta_band"],
    cardStyle: "list",
    density: "sparse",
    primaryCtaDefault: "Book a consultation",
  },
  portfolio: {
    id: "portfolio",
    gokeTemplateId: "goke-portfolio",
    label: "Creative portfolio",
    categories: ["portfolio", "photo", "creative", "design"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "projects.html", title: "Projects", role: "listing" },
      { file: "about.html", title: "About", role: "about" },
      { file: "gallery.html", title: "Gallery", role: "gallery" },
      { file: "contact.html", title: "Contact", role: "contact" },
    ],
    defaultHero: "hero_minimal",
    defaultSections: ["gallery_mosaic", "about_split", "services_grid", "cta_panel"],
    cardStyle: "grid",
    density: "sparse",
    primaryCtaDefault: "Start a project",
  },
  edu: {
    id: "edu",
    gokeTemplateId: "goke-edu",
    label: "Education",
    categories: ["school", "education", "course"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "courses.html", title: "Courses", role: "listing" },
      { file: "about.html", title: "About", role: "about" },
      { file: "gallery.html", title: "Campus", role: "gallery" },
      { file: "cart.html", title: "Booking", role: "booking" },
      { file: "contact.html", title: "Enquire", role: "contact" },
    ],
    defaultHero: "hero_authority",
    defaultSections: ["services_grid", "about_split", "metrics_row", "cta_band"],
    cardStyle: "grid",
    density: "balanced",
    primaryCtaDefault: "Enquire",
  },
  app: {
    id: "app",
    gokeTemplateId: "goke-app",
    label: "SaaS / Tech",
    categories: ["tech", "saas", "software", "app"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "features.html", title: "Features", role: "services" },
      { file: "pricing.html", title: "Pricing", role: "proof" },
      { file: "about.html", title: "About", role: "about" },
      { file: "contact.html", title: "Contact", role: "contact" },
    ],
    defaultHero: "hero_asymmetric",
    defaultSections: ["services_bento", "about_split", "metrics_row", "cta_panel"],
    cardStyle: "bento",
    density: "rich",
    primaryCtaDefault: "Get started",
  },
  general: {
    id: "general",
    gokeTemplateId: "goke-pro",
    label: "Business",
    categories: ["general"],
    pages: [
      { file: "index.html", title: "Home", role: "home" },
      { file: "about.html", title: "About", role: "about" },
      { file: "services.html", title: "Services", role: "services" },
      { file: "gallery.html", title: "Gallery", role: "gallery" },
      { file: "contact.html", title: "Contact", role: "contact" },
    ],
    defaultHero: "hero_asymmetric",
    defaultSections: ["services_grid", "about_split", "gallery_mosaic", "cta_band"],
    cardStyle: "grid",
    density: "balanced",
    primaryCtaDefault: "Get in touch",
  },
};

/** Resolve family from niche id / blueprint id / free text */
export function resolveTemplateFamily(nicheId: string): TemplateFamily {
  const id = (nicheId || "general").toLowerCase().replace(/-/g, "_");

  const rules: [RegExp, TemplateFamilyId][] = [
    [/spa|wellness|massage|nail|bodywork|hair_salon|barber/, "spa"],
    [/restaurant|food|dining|cafe|coffee|bakery|bar_lounge|lounge|catering|qsr|fast_food/, "dine"],
    [/fitness|gym|train|pt\b|coach/, "fitness"],
    [/clinic|dental|healthcare|hospital/, "clinic"],
    [/(^|_)pharmacy($|_)/, "clinic"], // id pharmacy only, not pharmacy_retail
    [/real_estate|estate|property|short_let/, "estate"],
    [/hotel|stay|lodge|resort/, "stay"],
    [/fashion|luxe|jewelry|boutique|ankara|african_wear|tailor|cosmetics|fragrance|perfume|beauty_retail/, "luxe"],
    [/electronics|gadget|phone|laptop|appliance|supermarket|grocery|minimart|convenience|pharmacy_retail|building|materials|cement|furniture|farm|produce|agro|commerce|ecommerce|e_commerce|shop|retail|store/, "commerce"],
    [/auto|car|dealership|mechanic|vehicle/, "auto"],
    [/ride_hailing|mobility|bolt|uber|transport|logistics/, "app"],
    [/law|legal|accounting|tax|audit|consultant|professional|agency|marketing/, "pro"],
    [/portfolio|photo|video|creative|design/, "portfolio"],
    [/school|education|course|academy|lesson/, "edu"],
    [/tech|saas|software|app|digital|hosting/, "app"],
  ];

  for (const [re, fid] of rules) {
    if (re.test(id)) return TEMPLATE_FAMILIES[fid];
  }
  return TEMPLATE_FAMILIES.general;
}

/** Build SitePlan from family (AI may override allow-listed fields later) */
export function sitePlanFromFamily(family: TemplateFamily): SitePlan {
  return {
    hero: family.defaultHero,
    sections: [...family.defaultSections],
    cardStyle: family.cardStyle,
    nav: family.pages.map((p) => ({ href: p.file, label: p.title })),
    pageTitles: Object.fromEntries(
      family.pages
        .filter((p) => p.role !== "home")
        .map((p) => {
          const key =
            p.role === "about"
              ? "about"
              : p.role === "services" || p.role === "listing"
                ? "services"
                : p.role === "gallery"
                  ? "gallery"
                  : p.role === "contact" || p.role === "booking"
                    ? "contact"
                    : p.role;
          return [key, p.title];
        })
    ) as SitePlan["pageTitles"],
    density: family.density,
  };
}
