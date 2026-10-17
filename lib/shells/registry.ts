/**
 * Multi-shell registry — each niche maps to a distinct design shell.
 * Shells own structure + CSS; AI only fills content.
 */

export type ShellId =
  | "sanctuary"   // spa, wellness, hair glam
  | "sensorial"   // dining, café, bakery, bar
  | "athletic"    // fitness, coach
  | "authority"   // law, accounting, real estate, clinic, dental
  | "editorial"   // fashion, african wear, jewelry, photo, creative
  | "hospitality" // hotel, event, short-let
  | "trade"       // auto, mechanic, logistics, pharmacy, barber
  | "clarity";    // tech, school, church, general

/** Map every blueprint niche → shell */
const NICHE_TO_SHELL: Record<string, ShellId> = {
  // sanctuary
  spa_wellness: "sanctuary",
  hair_salon: "sanctuary",

  // sensorial
  restaurant_dining: "sensorial",
  restaurant_food: "sensorial", // legacy id
  cafe_coffee: "sensorial",
  bakery_pastry: "sensorial",
  bar_lounge: "sensorial",
  fast_food_qsr: "sensorial",

  // athletic
  fitness_gym: "athletic",
  coach_consultant: "athletic",

  // authority
  law_firm: "authority",
  legal_professional: "authority", // legacy
  accounting: "authority",
  real_estate: "authority",
  healthcare_clinic: "authority",
  dental_clinic: "authority",

  // editorial
  fashion_boutique: "editorial",
  african_wear: "editorial",
  jewelry: "editorial",
  photography: "editorial",
  creative_agency: "editorial",
  creative_portfolio: "editorial", // legacy
  beauty_salon: "editorial",

  // hospitality
  hotel_stay: "hospitality",
  event_centre: "hospitality",
  short_let: "hospitality",

  // trade
  auto_dealership: "trade",
  auto_mechanic: "trade",
  logistics: "trade",
  pharmacy: "trade",
  barber_shop: "trade",
  ecommerce_retail: "trade",

  // clarity
  tech_saas: "clarity",
  school_education: "clarity",
  education: "clarity", // legacy
  church_faith: "clarity",
  general_business: "clarity",
};

export function shellIdForNiche(nicheId: string): ShellId {
  return NICHE_TO_SHELL[nicheId] || "clarity";
}

export const SHELL_META: Record<
  ShellId,
  { label: string; reference: string; description: string }
> = {
  sanctuary: {
    label: "Sanctuary",
    reference: "Pax & Pearl",
    description: "Deep emerald + champagne gold · serene spa/wellness",
  },
  sensorial: {
    label: "Sensorial",
    reference: "Brandrich",
    description: "Charcoal + liquid gold · cinematic dining/hospitality food",
  },
  athletic: {
    label: "Athletic",
    reference: "iFitness",
    description: "Ink + lime · performance studio energy",
  },
  authority: {
    label: "Authority",
    reference: "Quiet professional",
    description: "Navy/charcoal + restrained metal · trust & precision",
  },
  editorial: {
    label: "Editorial",
    reference: "Campaign craft",
    description: "High-contrast editorial · fashion & creative",
  },
  hospitality: {
    label: "Hospitality",
    reference: "Space-first luxury",
    description: "Warm opulent stays & events",
  },
  trade: {
    label: "Trade",
    reference: "Industrial premium",
    description: "Clean trust + clarity for services & retail",
  },
  clarity: {
    label: "Clarity",
    reference: "Modern product",
    description: "Adaptable modern clarity for tech, education, general",
  },
};
