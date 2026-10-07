/**
 * Lagos business niches + Unsplash image packs for gòke site generation.
 * Prefer IG media when available; these fill heroes/galleries otherwise.
 */

export type NicheImagePack = {
  id: string;
  label: string;
  /** Keywords used to match Instagram bio/captions */
  keywords: string[];
  /** Maps onto existing detectNiche guide ids when possible */
  guideId?: string;
  images: string[];
};

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Full Lagos-oriented niche catalogue */
export const LAGOS_NICHE_PACKS: NicheImagePack[] = [
  {
    id: "restaurant_food",
    label: "Restaurant & dining",
    guideId: "restaurant_food",
    keywords: ["restaurant", "dining", "chef", "menu", "food", "kitchen"],
    images: [
      u("photo-1517248135467-4c7edcad34c4"),
      u("photo-1414235077428-338989a2e8c0", 1200),
      u("photo-1504674900247-0877df9cc836", 1200),
      u("photo-1559339352-11d035aa65de", 1200),
    ],
  },
  {
    id: "cafe_coffee",
    label: "Café & coffee",
    guideId: "restaurant_food",
    keywords: ["cafe", "café", "coffee", "latte", "espresso"],
    images: [
      u("photo-1495474472287-4d71bcdd2085"),
      u("photo-1501339847302-ac426a4a7cbb", 1200),
      u("photo-1498804103079-a6351b785d0a", 1200),
    ],
  },
  {
    id: "street_food",
    label: "Street food & local",
    guideId: "restaurant_food",
    keywords: ["street food", "bole", "suya", "local food", "amala"],
    images: [
      u("photo-1555939594-58d7cb561ad1"),
      u("photo-1504674900247-0877df9cc836", 1200),
      u("photo-1565299624946-b28f40a0ae38", 1200),
    ],
  },
  {
    id: "bakery",
    label: "Bakery & pastry",
    guideId: "restaurant_food",
    keywords: ["bakery", "pastry", "bread", "cake", "confection"],
    images: [
      u("photo-1509440159596-0249088772ff"),
      u("photo-1517433670267-08bbd4be890f", 1200),
      u("photo-1578985545062-69928b1d9587", 1200),
    ],
  },
  {
    id: "hotel_stay",
    label: "Hotel & short stay",
    guideId: "hotel_stay",
    keywords: ["hotel", "suite", "lodge", "shortlet", "short-let", "airbnb"],
    images: [
      u("photo-1566073771259-6a8506099945"),
      u("photo-1582719478250-c89cae4dc85b", 1200),
      u("photo-1631049307264-da0ec9d70304", 1200),
      u("photo-1578683010236-d716f9a3f461", 1200),
    ],
  },
  {
    id: "event_centre",
    label: "Event centre & hall",
    guideId: "hotel_stay",
    keywords: ["event centre", "event center", "hall", "banquet", "reception"],
    images: [
      u("photo-1519167758481-83f550bb49b3"),
      u("photo-1464366400600-7168b8af9bc3", 1200),
      u("photo-1511795409834-ef04bbd61622", 1200),
    ],
  },
  {
    id: "bar_lounge",
    label: "Bar & lounge",
    guideId: "restaurant_food",
    keywords: ["bar", "lounge", "nightlife", "cocktails", "club"],
    images: [
      u("photo-1514933651103-005eec06c04b"),
      u("photo-1470337458703-46ad1756a187", 1200),
      u("photo-1572116469696-31de0f17cc34", 1200),
    ],
  },
  {
    id: "ecommerce_retail",
    label: "Fashion boutique & retail",
    guideId: "ecommerce_retail",
    keywords: ["boutique", "fashion", "shop", "store", "retail", "clothing"],
    images: [
      u("photo-1441986300917-64674bd600d8"),
      u("photo-1490481651871-ab68de25d43d", 1200),
      u("photo-1483985988355-763728e1935b", 1200),
      u("photo-1445205170230-053b83016050", 1200),
    ],
  },
  {
    id: "african_fashion",
    label: "Ankara & African wear",
    guideId: "ecommerce_retail",
    keywords: ["ankara", "aso ebi", "african wear", "native", "agbada", "iro"],
    images: [
      u("photo-1594938298603-c8148c4dae35"),
      u("photo-1558769132-cb1aea458c5e", 1200),
      u("photo-1490481651871-ab68de25d43d", 1200),
    ],
  },
  {
    id: "jewelry",
    label: "Jewelry & accessories",
    guideId: "ecommerce_retail",
    keywords: ["jewelry", "jewellery", "beads", "gold", "accessories"],
    images: [
      u("photo-1515562141207-7a88fb7ce338"),
      u("photo-1611652022419-a9419f74343d", 1200),
      u("photo-1599643478518-a784e5dc4c8f", 1200),
    ],
  },
  {
    id: "beauty_salon",
    label: "Salon, hair & glam",
    guideId: "beauty_salon",
    keywords: ["salon", "hair", "braids", "makeup", "glam", "beauty"],
    images: [
      u("photo-1560066984-138dadb4c035"),
      u("photo-1522335789203-aabd1fc54bc9", 1200),
      u("photo-1487412947147-5cebf100ffc2", 1200),
      u("photo-1522337660859-02fbefca4702", 1200),
    ],
  },
  {
    id: "barber",
    label: "Barber shop",
    guideId: "beauty_salon",
    keywords: ["barber", "fade", "grooming", "cuts"],
    images: [
      u("photo-1585747860715-2ba37e788b70"),
      u("photo-1503951914875-452162b0f3f1", 1200),
      u("photo-1621605815971-fbc98d665033", 1200),
    ],
  },
  {
    id: "spa_wellness",
    label: "Spa & wellness",
    guideId: "spa_wellness",
    keywords: ["spa", "massage", "wellness", "facial", "hammam", "bodywork"],
    images: [
      u("photo-1540555700478-4be289fbecef"),
      u("photo-1544161515-4ab6ce6db874", 1200),
      u("photo-1519823551278-64ac92734fb1", 1200),
      u("photo-1515377905703-c4788e51af15", 1200),
    ],
  },
  {
    id: "fitness_gym",
    label: "Gym & fitness",
    guideId: "fitness_gym",
    keywords: ["gym", "fitness", "workout", "training", "coach", "crossfit"],
    images: [
      u("photo-1534438327276-14e5300c3a48"),
      u("photo-1517838277536-f5f99be501cd", 1200),
      u("photo-1571019614242-c5c5dee9f50b", 1200),
      u("photo-1581009146145-b5ef050c2e1e", 1200),
    ],
  },
  {
    id: "healthcare_clinic",
    label: "Clinic & healthcare",
    guideId: "healthcare_clinic",
    keywords: ["clinic", "hospital", "doctor", "medical", "health", "dental"],
    images: [
      u("photo-1519494026892-80bbd2d6fd0d"),
      u("photo-1579684385127-1ef15d508118", 1200),
      u("photo-1631217868264-e5b90bb7e133", 1200),
    ],
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    guideId: "healthcare_clinic",
    keywords: ["pharmacy", "chemist", "medicine", "drug store"],
    images: [
      u("photo-1585435557343-3b092031a831"),
      u("photo-1587854692152-cbe660dbde88", 1200),
    ],
  },
  {
    id: "real_estate",
    label: "Real estate",
    guideId: "real_estate",
    keywords: ["real estate", "property", "realtor", "homes", "apartment", "lekki"],
    images: [
      u("photo-1560518883-ce09059eeffa"),
      u("photo-1600596542815-ffad4c1539a9", 1200),
      u("photo-1613490493576-7fde63acd811", 1200),
      u("photo-1512917774080-9991f1c4c750", 1200),
    ],
  },
  {
    id: "auto_dealership",
    label: "Auto sales & rental",
    guideId: "auto_dealership",
    keywords: ["car", "auto", "vehicle", "dealership", "mechanic", "rental"],
    images: [
      u("photo-1492144534655-ae79c964c9d7"),
      u("photo-1503376780353-7e6692767b70", 1200),
      u("photo-1449965408869-eaa3f722e40d", 1200),
      u("photo-1486262715619-67b85e0b08aa", 1200),
    ],
  },
  {
    id: "logistics",
    label: "Logistics & courier",
    guideId: "general_business",
    keywords: ["logistics", "courier", "delivery", "dispatch", "shipping"],
    images: [
      u("photo-1586528116311-ad8dd3c8310d"),
      u("photo-1566576912321-d58ddd7a6088", 1200),
      u("photo-1566576721346-d4a3b6757106", 1200),
    ],
  },
  {
    id: "legal_professional",
    label: "Legal & professional",
    guideId: "legal_professional",
    keywords: ["law", "legal", "attorney", "solicitor", "consulting", "accountant"],
    images: [
      u("photo-1589829545856-d10d557cf95f"),
      u("photo-1454165804606-c3d57bc86b40", 1200),
      u("photo-1497366216548-37526070297c", 1200),
    ],
  },
  {
    id: "tech_saas",
    label: "Tech & digital",
    guideId: "tech_saas",
    keywords: ["tech", "software", "app", "saas", "startup", "digital"],
    images: [
      u("photo-1517694712202-14dd9538aa97"),
      u("photo-1498050108023-c5249f4df085", 1200),
      u("photo-1460925895917-afdab827c52f", 1200),
    ],
  },
  {
    id: "creative_portfolio",
    label: "Creative & media",
    guideId: "creative_portfolio",
    keywords: ["photographer", "videographer", "studio", "design", "creative", "portfolio"],
    images: [
      u("photo-1452587925148-ce544e77e70d"),
      u("photo-1492691527719-9d1e07e534b4", 1200),
      u("photo-1626785774573-4b7993143486", 1200),
    ],
  },
  {
    id: "education",
    label: "Education & training",
    guideId: "education",
    keywords: ["school", "tutor", "academy", "training", "course", "lesson"],
    images: [
      u("photo-1503676260728-1c00da094a0b"),
      u("photo-1523050854058-8df90110c9f1", 1200),
      u("photo-1427504494785-3a9ca7044f45", 1200),
    ],
  },
  {
    id: "church_faith",
    label: "Church & ministry",
    guideId: "church_faith",
    keywords: ["church", "ministry", "pastor", "fellowship", "worship"],
    images: [
      u("photo-1438232992991-995b7058bbb3"),
      u("photo-1438031186810-cba1dc2a2c07", 1200),
    ],
  },
  {
    id: "personal_brand",
    label: "Coach & personal brand",
    guideId: "general_business",
    keywords: ["coach", "speaker", "mentor", "personal brand", "influencer"],
    images: [
      u("photo-1552664730-d307ca884978"),
      u("photo-1573496359142-b8d87734a5a2", 1200),
      u("photo-1475721027785-f74eccf877e2", 1200),
    ],
  },
  {
    id: "general_business",
    label: "General business",
    guideId: "general_business",
    keywords: [],
    images: [
      u("photo-1486406146926-c627a92ad1ab"),
      u("photo-1497366216548-37526070297c", 1200),
      u("photo-1522071820081-009f0129c71c", 1200),
      u("photo-1497215728101-856f4ea42174", 1200),
    ],
  },
];

/** Flatten to guideId → image URLs for generateSite.resolveGalleryUrls */
export function buildNicheCuratedImages(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const pack of LAGOS_NICHE_PACKS) {
    const key = pack.guideId || pack.id;
    if (!map[key]) map[key] = [];
    for (const img of pack.images) {
      if (!map[key].includes(img)) map[key].push(img);
    }
    // also index by pack id for direct lookup
    if (!map[pack.id]) map[pack.id] = [...pack.images];
  }
  return map;
}

export function imagesForGuideId(guideId: string): string[] {
  const map = buildNicheCuratedImages();
  return map[guideId] || map.general_business || [];
}
