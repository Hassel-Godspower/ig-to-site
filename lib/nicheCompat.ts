/**
 * Bridges new 30-niche blueprint IDs ↔ existing generateSite BusinessNiche IDs
 * and lagosNicheImages guide keys used in ig-to-site-main.
 */

export const BLUEPRINT_TO_LEGACY: Record<string, string> = {
  restaurant_dining: "restaurant_food",
  fast_food_qsr: "restaurant_food",
  cafe_coffee: "restaurant_food",
  bakery_pastry: "restaurant_food",
  bar_lounge: "restaurant_food",
  hotel_stay: "hotel_stay",
  event_centre: "hotel_stay",
  short_let: "hotel_stay",
  fashion_boutique: "ecommerce_retail",
  african_wear: "ecommerce_retail",
  jewelry: "ecommerce_retail",
  hair_salon: "beauty_salon",
  barber_shop: "beauty_salon",
  spa_wellness: "spa_wellness",
  fitness_gym: "fitness_gym",
  healthcare_clinic: "healthcare_clinic",
  dental_clinic: "healthcare_clinic",
  pharmacy: "healthcare_clinic",
  real_estate: "real_estate",
  auto_dealership: "auto_dealership",
  auto_mechanic: "auto_dealership",
  logistics: "general_business",
  law_firm: "legal_professional",
  accounting: "legal_professional",
  creative_agency: "creative_portfolio",
  photography: "creative_portfolio",
  coach_consultant: "creative_portfolio",
  school_education: "education",
  church_faith: "church_faith",
  tech_saas: "tech_saas",
  general_business: "general_business",
  restaurant_food: "restaurant_food",
  beauty_salon: "beauty_salon",
  ecommerce_retail: "ecommerce_retail",
  legal_professional: "legal_professional",
  education: "education",
  creative_portfolio: "creative_portfolio",
};

export const LEGACY_TO_BLUEPRINT: Record<string, string> = {
  restaurant_food: "restaurant_dining",
  beauty_salon: "hair_salon",
  ecommerce_retail: "fashion_boutique",
  legal_professional: "law_firm",
  education: "school_education",
  creative_portfolio: "creative_agency",
  spa_wellness: "spa_wellness",
  fitness_gym: "fitness_gym",
  real_estate: "real_estate",
  hotel_stay: "hotel_stay",
  healthcare_clinic: "healthcare_clinic",
  auto_dealership: "auto_dealership",
  church_faith: "church_faith",
  tech_saas: "tech_saas",
  general_business: "general_business",
};

export function toLegacyNicheId(id: string): string {
  return BLUEPRINT_TO_LEGACY[id] || "general_business";
}

export function toBlueprintId(id: string): string {
  if (LEGACY_TO_BLUEPRINT[id]) return LEGACY_TO_BLUEPRINT[id];
  if (BLUEPRINT_TO_LEGACY[id]) return id;
  return "general_business";
}
