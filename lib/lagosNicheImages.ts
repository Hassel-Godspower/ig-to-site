/**
 * Niche-exclusive Unsplash packs for gòke site generation.
 *
 * Rules:
 * - Each pack is ONLY images for that niche (no cross-contamination).
 * - resolveImagesForNiche(id) tries: exact pack id → blueprint alias → legacy guide → general.
 * - Prefer Instagram media when present; these fill heroes/galleries otherwise.
 */

export type NicheImagePack = {
  id: string;
  label: string;
  /** Match Instagram bio/captions for fine-grained detection */
  keywords: string[];
  /**
   * Legacy generateSite BusinessNiche id this pack satisfies when no finer pack matches.
   * Used only as a fallback key — packs are NOT merged into one shared array.
   */
  legacyId?: string;
  /** @deprecated alias of legacyId — kept for older callers */
  guideId?: string;
  images: string[];
};

const u = (photoPath: string, w = 1600) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * One pack per fine-grained niche. Image lists are intentionally exclusive.
 * Blueprint IDs from nicheBlueprints / nicheCompat are included as pack ids.
 */
export const LAGOS_NICHE_PACKS: NicheImagePack[] = [
  // ── Food & hospitality ──────────────────────────────────────────
  {
    id: "restaurant_dining",
    label: "Restaurant & fine dining",
    legacyId: "restaurant_food",
    keywords: ["restaurant", "dining", "fine dining", "chef", "bistro", "eatery"],
    images: [
      u("photo-1517248135467-4c7edcad34c4"), // dining room
      u("photo-1414235077428-338989a2e8c0", 1200), // plated dish
      u("photo-1559339352-11d035aa65de", 1200), // restaurant interior
      u("photo-1600891964599-f61ba0e24092", 1200), // gourmet plate
      u("photo-1414235077428-338989a2e8c0", 800),
      u("photo-1504674900247-0877df9cc836", 1200),
      u("photo-1540189549336-e6e99c3679fe", 1200), // food close-up
      u("photo-1476224203421-9ac39bcb3327", 1200), // table setting
    ],
  },
  {
    id: "restaurant_food",
    label: "Restaurant (legacy)",
    legacyId: "restaurant_food",
    keywords: ["restaurant", "menu", "kitchen"],
    images: [
      u("photo-1517248135467-4c7edcad34c4"),
      u("photo-1414235077428-338989a2e8c0", 1200),
      u("photo-1559339352-11d035aa65de", 1200),
      u("photo-1600891964599-f61ba0e24092", 1200),
      u("photo-1540189549336-e6e99c3679fe", 1200),
      u("photo-1476224203421-9ac39bcb3327", 1200),
    ],
  },
  {
    id: "fast_food_qsr",
    label: "Fast food & QSR",
    legacyId: "restaurant_food",
    keywords: ["fast food", "burger", "pizza", "takeaway", "takeout", "qsr", "shawarma"],
    images: [
      u("photo-1568901346375-23c9450c58cd"), // burger
      u("photo-1513104890138-7c749659a591", 1200), // pizza
      u("photo-1626082927389-6cd097cdc6ec", 1200), // fries/fast
      u("photo-1550547660-d9450f859349", 1200), // burger stack
      u("photo-1571091718767-18b5b1457add", 1200),
      u("photo-1594212699903-ec8a3eca50f5", 1200),
    ],
  },
  {
    id: "cafe_coffee",
    label: "Café & coffee",
    legacyId: "restaurant_food",
    keywords: ["cafe", "café", "coffee", "latte", "espresso", "barista"],
    images: [
      u("photo-1495474472287-4d71bcdd2085"), // coffee cup
      u("photo-1501339847302-ac426a4a7cbb", 1200), // cafe interior
      u("photo-1498804103079-a6351b785d0a", 1200), // latte art
      u("photo-1442512595331-e89e7383998d", 1200), // coffee beans/brew
      u("photo-1453614512568-c4024d13c247", 1200), // cafe workspace
      u("photo-1509042239860-f550ce710b93", 1200), // coffee pour
    ],
  },
  {
    id: "street_food",
    label: "Street food & local",
    legacyId: "restaurant_food",
    keywords: ["street food", "bole", "suya", "amala", "local food", "grill"],
    images: [
      u("photo-1555939594-58d7cb561ad1"), // grilled skewers
      u("photo-1565299624946-b28f40a0ae38", 1200), // street-style food
      u("photo-1529042410759-befb1204b468", 1200), // market food
      u("photo-1504674900247-0877df9cc836", 1200),
      u("photo-1567620905732-2d1ec7ab7445", 1200), // pancakes/local feel
      u("photo-1476224203421-9ac39bcb3327", 1200),
    ],
  },
  {
    id: "bakery_pastry",
    label: "Bakery & pastry",
    legacyId: "restaurant_food",
    keywords: ["bakery", "pastry", "bread", "cake", "confection", "croissant"],
    images: [
      u("photo-1509440159596-0249088772ff"), // bread
      u("photo-1517433670267-08bbd4be890f", 1200), // bakery
      u("photo-1578985545062-69928b1d9587", 1200), // cake
      u("photo-1555507036-ab1f4038808a", 1200), // pastries
      u("photo-1486427944299-d1955d23e34d", 1200), // cupcakes
      u("photo-1464349095431-e9a21285b5f3", 1200), // birthday cake
    ],
  },
  {
    id: "bakery",
    label: "Bakery (alias)",
    legacyId: "restaurant_food",
    keywords: ["bakery", "pastry"],
    images: [
      u("photo-1509440159596-0249088772ff"),
      u("photo-1517433670267-08bbd4be890f", 1200),
      u("photo-1578985545062-69928b1d9587", 1200),
      u("photo-1555507036-ab1f4038808a", 1200),
      u("photo-1486427944299-d1955d23e34d", 1200),
      u("photo-1464349095431-e9a21285b5f3", 1200),
    ],
  },
  {
    id: "bar_lounge",
    label: "Bar & lounge",
    legacyId: "restaurant_food",
    keywords: ["bar", "lounge", "nightlife", "cocktails", "club", "drinks"],
    images: [
      u("photo-1514933651103-005eec06c04b"), // bar counter
      u("photo-1470337458703-46ad1756a187", 1200), // cocktails
      u("photo-1572116469696-31de0f17cc34", 1200), // nightlife bar
      u("photo-1551024709-8f23befc6f87", 1200), // drinks
      u("photo-1536935338788-846bb9981813", 1200), // cocktail pour
      u("photo-1546171753-97d7676e4602", 1200), // dark lounge
    ],
  },

  // ── Stay & events ───────────────────────────────────────────────
  {
    id: "hotel_stay",
    label: "Hotel & lodge",
    legacyId: "hotel_stay",
    keywords: ["hotel", "suite", "lodge", "resort", "hospitality"],
    images: [
      u("photo-1566073771259-6a8506099945"), // hotel exterior/pool
      u("photo-1582719478250-c89cae4dc85b", 1200), // luxury room
      u("photo-1631049307264-da0ec9d70304", 1200), // hotel bed
      u("photo-1578683010236-d716f9a3f461", 1200), // suite
      u("photo-1611892440504-42a792e24d32", 1200), // hotel room
      u("photo-1590490360182-c33d57733427", 1200), // lobby/room
    ],
  },
  {
    id: "short_let",
    label: "Short-let / Airbnb",
    legacyId: "hotel_stay",
    keywords: ["shortlet", "short-let", "airbnb", "apartment stay", "serviced apartment"],
    images: [
      u("photo-1522708323590-d24dbb6b0267"), // modern apartment
      u("photo-1502672260266-1c1ef2d93688", 1200), // living space
      u("photo-1560448204-e02f11c3d0e2", 1200), // apartment interior
      u("photo-1493809842364-78817add7ffb", 1200), // bright flat
      u("photo-1560184897-ae75f418493e", 1200),
      u("photo-1631049307264-da0ec9d70304", 1200),
    ],
  },
  {
    id: "event_centre",
    label: "Event centre & hall",
    legacyId: "hotel_stay",
    keywords: ["event centre", "event center", "hall", "banquet", "reception", "venue"],
    images: [
      u("photo-1519167758481-83f550bb49b3"), // event hall
      u("photo-1464366400600-7168b8af9bc3", 1200), // decorated venue
      u("photo-1511795409834-ef04bbd61622", 1200), // celebration
      u("photo-1505236858219-8359eb29e329", 1200), // event setup
      u("photo-1478146896981-b80fe463b330", 1200), // banquet tables
      u("photo-1530103862676-de8c9debad1d", 1200), // party decor
    ],
  },

  // ── Fashion & retail ────────────────────────────────────────────
  {
    id: "fashion_boutique",
    label: "Fashion boutique",
    legacyId: "ecommerce_retail",
    keywords: ["boutique", "fashion", "clothing", "rtw", "apparel"],
    images: [
      u("photo-1441986300917-64674bd600d8"), // clothing store
      u("photo-1490481651871-ab68de25d43d", 1200), // fashion flatlay
      u("photo-1483985988355-763728e1935b", 1200), // shopping fashion
      u("photo-1445205170230-053b83016050", 1200), // fashion retail
      u("photo-1469334031218-e382a71b716b", 1200), // model fashion
      u("photo-1558769132-cb1aea458c5e", 1200), // fabric/fashion
    ],
  },
  {
    id: "ecommerce_retail",
    label: "Retail / ecommerce",
    legacyId: "ecommerce_retail",
    keywords: ["shop", "store", "retail", "ecommerce", "online store"],
    images: [
      u("photo-1441986300917-64674bd600d8"),
      u("photo-1472851294608-062f824d29cc", 1200), // retail bags
      u("photo-1556742049-0cfed4f6a45d", 1200), // checkout/shop
      u("photo-1483985988355-763728e1935b", 1200),
      u("photo-1445205170230-053b83016050", 1200),
      u("photo-1607083206869-4c7672e72a8a", 1200),
    ],
  },
  {
    id: "african_wear",
    label: "Ankara & African wear",
    legacyId: "ecommerce_retail",
    keywords: ["ankara", "aso ebi", "african wear", "native", "agbada", "iro", "gele"],
    images: [
      u("photo-1594938298603-c8148c4dae35"), // patterned fashion
      u("photo-1558769132-cb1aea458c5e", 1200), // textiles
      u("photo-1490481651871-ab68de25d43d", 1200),
      u("photo-1583391733956-3750e0ff4e8b", 1200), // traditional-leaning
      u("photo-1469334031218-e382a71b716b", 1200),
      u("photo-1515886657613-9f3515b0c78f", 1200), // fashion model
    ],
  },
  {
    id: "african_fashion",
    label: "African fashion (alias)",
    legacyId: "ecommerce_retail",
    keywords: ["ankara", "african fashion"],
    images: [
      u("photo-1594938298603-c8148c4dae35"),
      u("photo-1558769132-cb1aea458c5e", 1200),
      u("photo-1515886657613-9f3515b0c78f", 1200),
      u("photo-1469334031218-e382a71b716b", 1200),
      u("photo-1490481651871-ab68de25d43d", 1200),
      u("photo-1583391733956-3750e0ff4e8b", 1200),
    ],
  },
  {
    id: "jewelry",
    label: "Jewelry & accessories",
    legacyId: "ecommerce_retail",
    keywords: ["jewelry", "jewellery", "beads", "gold", "necklace", "ring"],
    images: [
      u("photo-1515562141207-7a88fb7ce338"), // jewelry display
      u("photo-1611652022419-a9419f74343d", 1200), // rings
      u("photo-1599643478518-a784e5dc4c8f", 1200), // necklace
      u("photo-1601121141461-9d6647bca1ed", 1200), // gold jewelry
      u("photo-1535632066927-ab7c9ab60908", 1200), // earrings
      u("photo-1573408301185-5144c79af5b2", 1200),
    ],
  },

  // ── Beauty ──────────────────────────────────────────────────────
  {
    id: "hair_salon",
    label: "Hair salon & glam",
    legacyId: "beauty_salon",
    keywords: ["salon", "hair", "braids", "wig", "glam", "stylist"],
    images: [
      u("photo-1560066984-138dadb4c035"), // salon interior
      u("photo-1522335789203-aabd1fc54bc9", 1200), // beauty
      u("photo-1522337660859-02fbefca4702", 1200), // hair tools/salon
      u("photo-1562322140-8baeececf3df", 1200), // hair styling
      u("photo-1595476108010-b4d1f102b1b1", 1200),
      u("photo-1516975080664-ed2fc6a32937", 1200),
    ],
  },
  {
    id: "beauty_salon",
    label: "Beauty salon",
    legacyId: "beauty_salon",
    keywords: ["beauty", "salon", "makeup", "spa beauty"],
    images: [
      u("photo-1487412947147-5cebf100ffc2"), // makeup
      u("photo-1560066984-138dadb4c035", 1200),
      u("photo-1522335789203-aabd1fc54bc9", 1200),
      u("photo-1512496015851-a90fb38ba796", 1200), // beauty products
      u("photo-1596462502278-27bfdc403348", 1200),
      u("photo-1522337660859-02fbefca4702", 1200),
    ],
  },
  {
    id: "barber_shop",
    label: "Barber shop",
    legacyId: "beauty_salon",
    keywords: ["barber", "fade", "grooming", "barbershop", "cuts"],
    images: [
      u("photo-1585747860715-2ba37e788b70"), // barber shop
      u("photo-1503951914875-452162b0f3f1", 1200), // barber cut
      u("photo-1621605815971-fbc98d665033", 1200), // barber tools
      u("photo-1599351431202-1e0f0137899a", 1200), // men's cut
      u("photo-1622286342621-4bd786c2447c", 1200),
      u("photo-1493256338651-d82f87ccf3cd", 1200),
    ],
  },
  {
    id: "barber",
    label: "Barber (alias)",
    legacyId: "beauty_salon",
    keywords: ["barber"],
    images: [
      u("photo-1585747860715-2ba37e788b70"),
      u("photo-1503951914875-452162b0f3f1", 1200),
      u("photo-1621605815971-fbc98d665033", 1200),
      u("photo-1599351431202-1e0f0137899a", 1200),
      u("photo-1622286342621-4bd786c2447c", 1200),
      u("photo-1493256338651-d82f87ccf3cd", 1200),
    ],
  },
  {
    id: "spa_wellness",
    label: "Spa & wellness",
    legacyId: "spa_wellness",
    keywords: ["spa", "massage", "wellness", "facial", "hammam", "bodywork", "sauna"],
    images: [
      u("photo-1540555700478-4be289fbecef"), // spa stones
      u("photo-1544161515-4ab6ce6db874", 1200), // massage
      u("photo-1519823551278-64ac92734fb1", 1200), // spa treatment
      u("photo-1515377905703-c4788e51af15", 1200), // spa calm
      u("photo-1544161515-4ab6ce6db874", 800),
      u("photo-1600334129128-685c5582fd35", 1200), // spa towels
    ],
  },

  // ── Health & fitness ────────────────────────────────────────────
  {
    id: "fitness_gym",
    label: "Gym & fitness",
    legacyId: "fitness_gym",
    keywords: ["gym", "fitness", "workout", "training", "crossfit", "weights"],
    images: [
      u("photo-1534438327276-14e5300c3a48"), // gym floor
      u("photo-1517838277536-f5f99be501cd", 1200), // weights
      u("photo-1571019614242-c5c5dee9f50b", 1200), // training
      u("photo-1581009146145-b5ef050c2e1e", 1200), // dumbbells
      u("photo-1540497077202-7c8a3999166f", 1200), // gym equipment
      u("photo-1574680096145-d05b474e2155", 1200), // athlete
    ],
  },
  {
    id: "healthcare_clinic",
    label: "Clinic & healthcare",
    legacyId: "healthcare_clinic",
    keywords: ["clinic", "hospital", "doctor", "medical", "healthcare", "physician"],
    images: [
      u("photo-1519494026892-80bbd2d6fd0d"), // hospital/clinic
      u("photo-1579684385127-1ef15d508118", 1200), // medical
      u("photo-1631217868264-e5b90bb7e133", 1200), // clinic interior
      u("photo-1576091160399-112ba8d25d1d", 1200), // healthcare
      u("photo-1666214280557-f1b5022eb634", 1200), // doctor
      u("photo-1581595220892-b07372751420", 1200),
    ],
  },
  {
    id: "dental_clinic",
    label: "Dental clinic",
    legacyId: "healthcare_clinic",
    keywords: ["dental", "dentist", "teeth", "orthodont", "smile clinic"],
    images: [
      u("photo-1606811841689-23dfddce3e95"), // dental
      u("photo-1588776814546-1ffcf47267a5", 1200), // dentist chair
      u("photo-1598256989800-fe5f95da9787", 1200), // dental tools
      u("photo-1609840114035-3c981b782dfe", 1200),
      u("photo-1516549655169-df83a0774514", 1200),
      u("photo-1629909613654-28e377c37b09", 1200),
    ],
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    legacyId: "healthcare_clinic",
    keywords: ["pharmacy", "chemist", "medicine", "drugstore", "prescription"],
    images: [
      u("photo-1585435557343-3b092031a831"), // pharmacy shelves
      u("photo-1587854692152-cbe660dbde88", 1200), // medicine
      u("photo-1471864190281-a93a3070b6de", 1200), // pills
      u("photo-1584308666744-24d5c474f2ae", 1200),
      u("photo-1576602976047-174e57a47881", 1200),
      u("photo-1631549916768-4119b2e5f926", 1200),
    ],
  },

  // ── Property & mobility ─────────────────────────────────────────
  {
    id: "real_estate",
    label: "Real estate",
    legacyId: "real_estate",
    keywords: ["real estate", "property", "realtor", "homes", "apartment", "lekki", "agency"],
    images: [
      u("photo-1560518883-ce09059eeffa"), // keys / property
      u("photo-1600596542815-ffad4c1539a9", 1200), // modern house
      u("photo-1613490493576-7fde63acd811", 1200), // luxury home
      u("photo-1512917774080-9991f1c4c750", 1200), // house exterior
      u("photo-1600585154340-be6161a56a0c", 1200), // modern home
      u("photo-1564013799919-ab600027ffc6", 1200),
    ],
  },
  {
    id: "auto_dealership",
    label: "Car sales & dealership",
    legacyId: "auto_dealership",
    keywords: ["dealership", "car sales", "showroom", "buy car", "vehicle sales"],
    images: [
      u("photo-1492144534655-ae79c964c9d7"), // sports car
      u("photo-1503376780353-7e6692767b70", 1200), // luxury car
      u("photo-1542362567-b07e54358753", 1200), // car front
      u("photo-1552519507-da3b142c6e3d", 1200), // muscle/car
      u("photo-1617531653332-bd46c24f2068", 1200),
      u("photo-1606664515524-ed2f786a0bd6", 1200),
    ],
  },
  {
    id: "auto_mechanic",
    label: "Auto mechanic & workshop",
    legacyId: "auto_dealership",
    keywords: ["mechanic", "workshop", "repair", "service centre", "garage", "panel beater"],
    images: [
      u("photo-1486262715619-67b85e0b08aa"), // mechanic work
      u("photo-1619642751034-765dfdf7c43e", 1200), // car service
      u("photo-1487754180451-c456f719a1fc", 1200),
      u("photo-1504222490345-c075b6008014", 1200), // workshop
      u("photo-1632829882891-5047ccc421bc", 1200),
      u("photo-1625047509168-a7026f36de04", 1200),
    ],
  },
  {
    id: "logistics",
    label: "Logistics & courier",
    legacyId: "general_business",
    keywords: ["logistics", "courier", "delivery", "dispatch", "shipping", "freight"],
    images: [
      u("photo-1586528116311-ad8dd3c8310d"), // warehouse
      u("photo-1566576912321-d58ddd7a6088", 1200), // delivery van
      u("photo-1566576721346-d4a3b6757106", 1200), // packages
      u("photo-1601584115197-04ecc1da5d9a", 1200), // truck
      u("photo-1590674899484-d5640e854e09", 1200),
      u("photo-1578575437130-527eed3abbec", 1200),
    ],
  },

  // ── Professional services ───────────────────────────────────────
  {
    id: "law_firm",
    label: "Law firm",
    legacyId: "legal_professional",
    keywords: ["law", "legal", "attorney", "solicitor", "chambers", "lawyer"],
    images: [
      u("photo-1589829545856-d10d557cf95f"), // law scales
      u("photo-1505664194779-8beaceb93744", 1200), // law books
      u("photo-1450101499163-c8848c66ca85", 1200), // desk professional
      u("photo-1436450412740-6b988f486c6b", 1200), // gavel-ish
      u("photo-1497366216548-37526070297c", 1200), // office
      u("photo-1454165804606-c3d57bc86b40", 1200),
    ],
  },
  {
    id: "legal_professional",
    label: "Legal (legacy)",
    legacyId: "legal_professional",
    keywords: ["legal", "law"],
    images: [
      u("photo-1589829545856-d10d557cf95f"),
      u("photo-1505664194779-8beaceb93744", 1200),
      u("photo-1450101499163-c8848c66ca85", 1200),
      u("photo-1497366216548-37526070297c", 1200),
      u("photo-1454165804606-c3d57bc86b40", 1200),
      u("photo-1436450412740-6b988f486c6b", 1200),
    ],
  },
  {
    id: "accounting",
    label: "Accounting & tax",
    legacyId: "legal_professional",
    keywords: ["accounting", "accountant", "tax", "audit", "bookkeeping", "finance firm"],
    images: [
      u("photo-1554224155-6726b3ff858f"), // calculator/finance
      u("photo-1460925895917-afdab827c52f", 1200), // analytics
      u("photo-1551288049-bebda4e38f71", 1200), // charts
      u("photo-1450101499163-c8848c66ca85", 1200), // documents
      u("photo-1554224154-26032ffc0d62", 1200),
      u("photo-1579621970563-ebec7560ff3e", 1200),
    ],
  },
  {
    id: "coach_consultant",
    label: "Coach & consultant",
    legacyId: "creative_portfolio",
    keywords: ["coach", "consultant", "mentor", "speaker", "personal brand", "coaching"],
    images: [
      u("photo-1552664730-d307ca884978"), // coaching session
      u("photo-1573496359142-b8d87734a5a2", 1200), // professional woman
      u("photo-1475721027785-f74eccf877e2", 1200), // speaker
      u("photo-1551836022-d5d88e9218df", 1200), // meeting
      u("photo-1522202176988-66273c2fd55f", 1200), // collaboration
      u("photo-1600880292203-757bb62b4baf", 1200),
    ],
  },
  {
    id: "personal_brand",
    label: "Personal brand",
    legacyId: "general_business",
    keywords: ["influencer", "personal brand", "creator"],
    images: [
      u("photo-1573496359142-b8d87734a5a2"),
      u("photo-1552664730-d307ca884978", 1200),
      u("photo-1475721027785-f74eccf877e2", 1200),
      u("photo-1522202176988-66273c2fd55f", 1200),
      u("photo-1600880292203-757bb62b4baf", 1200),
      u("photo-1551836022-d5d88e9218df", 1200),
    ],
  },

  // ── Creative & education ────────────────────────────────────────
  {
    id: "creative_agency",
    label: "Marketing & creative agency",
    legacyId: "creative_portfolio",
    keywords: ["agency", "marketing", "branding", "advertising", "creative agency"],
    images: [
      u("photo-1460925895917-afdab827c52f"), // marketing desk
      u("photo-1557804506-669a67965ba0", 1200), // team meeting
      u("photo-1542744173-8eaa53bd9dfb", 1200), // boardroom
      u("photo-1552664730-d307ca884978", 1200),
      u("photo-1600880292089-90a7e086ee0c", 1200),
      u("photo-1454165804606-c3d57bc86b40", 1200),
    ],
  },
  {
    id: "photography",
    label: "Photography & video",
    legacyId: "creative_portfolio",
    keywords: ["photographer", "photography", "videographer", "studio", "camera"],
    images: [
      u("photo-1452587925148-ce544e77e70d"), // camera
      u("photo-1492691527719-9d1e07e534b4", 1200), // photography
      u("photo-1516035069371-29a1b824cc32", 1200), // camera gear
      u("photo-1471341971476-ae15ff5dd4ea", 1200), // studio light
      u("photo-1542038784456-1ea8e935640e", 1200),
      u("photo-1554048612-b6a482bc67e5", 1200),
    ],
  },
  {
    id: "creative_portfolio",
    label: "Creative portfolio",
    legacyId: "creative_portfolio",
    keywords: ["portfolio", "design", "creative", "artist"],
    images: [
      u("photo-1626785774573-4b7993143486"), // design work
      u("photo-1452587925148-ce544e77e70d", 1200),
      u("photo-1492691527719-9d1e07e534b4", 1200),
      u("photo-1561070791-2526d30994b5", 1200), // design desk
      u("photo-1558655146-d09347e92766", 1200),
      u("photo-1586717791821-3f8f48fcfdf0", 1200),
    ],
  },
  {
    id: "school_education",
    label: "School & education",
    legacyId: "education",
    keywords: ["school", "academy", "education", "students", "admissions"],
    images: [
      u("photo-1503676260728-1c00da094a0b"), // classroom kids
      u("photo-1523050854058-8df90110c9f1", 1200), // graduation
      u("photo-1427504494785-3a9ca7044f45", 1200), // students
      u("photo-1509062522246-3755977927d7", 1200), // teaching
      u("photo-1497633762265-9d179a990aa6", 1200), // books
      u("photo-1588072432836-e10032774350", 1200),
    ],
  },
  {
    id: "education",
    label: "Education (legacy)",
    legacyId: "education",
    keywords: ["school", "tutor", "training", "course"],
    images: [
      u("photo-1503676260728-1c00da094a0b"),
      u("photo-1523050854058-8df90110c9f1", 1200),
      u("photo-1427504494785-3a9ca7044f45", 1200),
      u("photo-1509062522246-3755977927d7", 1200),
      u("photo-1497633762265-9d179a990aa6", 1200),
      u("photo-1588072432836-e10032774350", 1200),
    ],
  },
  {
    id: "church_faith",
    label: "Church & ministry",
    legacyId: "church_faith",
    keywords: ["church", "ministry", "pastor", "fellowship", "worship", "gospel"],
    images: [
      u("photo-1438232992991-995b7058bbb3"), // church interior
      u("photo-1438031186810-cba1dc2a2c07", 1200), // church
      u("photo-1507692049790-de58290a4334", 1200), // worship space
      u("photo-1478146896981-b80fe463b330", 1200), // gathering
      u("photo-1511632765486-a01980e01a18", 1200),
      u("photo-1519834785169-98be25ec3f84", 1200),
    ],
  },
  {
    id: "tech_saas",
    label: "Tech & software",
    legacyId: "tech_saas",
    keywords: ["tech", "software", "app", "saas", "startup", "developer"],
    images: [
      u("photo-1517694712202-14dd9538aa97"), // code laptop
      u("photo-1498050108023-c5249f4df085", 1200), // coding
      u("photo-1460925895917-afdab827c52f", 1200), // product analytics
      u("photo-1551434678-e076c223a692", 1200), // team tech
      u("photo-1519389950473-47ba0277781c", 1200), // workspace
      u("photo-1531297484038-8c6aae1f6c8a", 1200),
    ],
  },
  {
    id: "general_business",
    label: "General business",
    legacyId: "general_business",
    keywords: [],
    images: [
      u("photo-1486406146926-c627a92ad1ab"), // office building
      u("photo-1497366216548-37526070297c", 1200), // office
      u("photo-1522071820081-009f0129c71c", 1200), // team
      u("photo-1497215728101-856f4ea42174", 1200), // workspace
      u("photo-1497366754035-f200968a6e72", 1200),
      u("photo-1600880292203-757bb62b4baf", 1200),
    ],
  },
];

/** Strip accidental broken URLs from pack lists */
function clean(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    if (!url || !url.includes("images.unsplash.com/photo-")) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

/**
 * Index packs by exact id only — never merge different niches into one array.
 * Legacy guide keys point at the *primary* pack for that guide (first with that legacyId).
 */
export function buildNicheCuratedImages(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  const legacyPrimary: Record<string, string[]> = {};

  for (const pack of LAGOS_NICHE_PACKS) {
    const imgs = clean(pack.images);
    if (!imgs.length) continue;
    map[pack.id] = imgs;
    const leg = pack.legacyId || pack.guideId;
    if (leg && !legacyPrimary[leg]) {
      legacyPrimary[leg] = imgs;
    }
  }

  // Legacy keys only if not already a pack id (avoid overwriting fine-grained packs)
  for (const [legacy, imgs] of Object.entries(legacyPrimary)) {
    if (!map[legacy]) map[legacy] = imgs;
  }

  return map;
}

/**
 * Resolve exclusive image list for a niche id (blueprint or legacy).
 */
export function resolveImagesForNiche(nicheId: string): string[] {
  const map = buildNicheCuratedImages();
  if (map[nicheId]?.length) return map[nicheId];

  // keyword soft-match against pack ids / labels
  const lower = nicheId.toLowerCase();
  for (const pack of LAGOS_NICHE_PACKS) {
    if (pack.id === lower || pack.legacyId === lower || pack.guideId === lower) {
      return clean(pack.images);
    }
  }

  return map.general_business || [];
}

export function imagesForGuideId(guideId: string): string[] {
  return resolveImagesForNiche(guideId);
}

/**
 * Pick the best image pack id from profile text (fine-grained).
 */
export function detectImagePackId(text: string): string {
  const t = text.toLowerCase();
  let bestId = "general_business";
  let bestScore = 0;

  for (const pack of LAGOS_NICHE_PACKS) {
    if (pack.id === "general_business") continue;
    let score = 0;
    for (const kw of pack.keywords) {
      if (t.includes(kw.toLowerCase())) {
        score += kw.includes(" ") ? 4 : Math.min(kw.length, 10) / 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestId = pack.id;
    }
  }
  return bestScore >= 2 ? bestId : "general_business";
}
