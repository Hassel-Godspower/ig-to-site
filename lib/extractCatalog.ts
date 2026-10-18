/**
 * Catalogue + booking seed for generated sites.
 * - Sales niches: ecommerce-rich dummy products with ₦ prices → cart → WhatsApp order
 * - Service niches: bookable services with ₦ prices → cart → WhatsApp booking
 * Caption prices override dummies when present; never leave shoppable niches empty.
 */

export type CatalogKind = "product" | "service" | "menu" | "listing";

/** How the cart checkout message is phrased */
export type CatalogMode = "commerce" | "booking" | "brochure";

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  /** Naira major units — always set for commerce/booking seeds */
  price: number | null;
  priceLabel: string;
  image: string;
  kind: CatalogKind;
  source: "caption" | "title" | "derived" | "demo";
};

export type CatalogSeed = {
  currency: "NGN";
  mode: CatalogMode;
  items: CatalogItem[];
  shoppable: boolean;
  /** UI labels */
  addLabel: string;
  checkoutLabel: string;
  cartNoun: string;
  updatedAt: string;
};

const PRICE_RE =
  /(?:₦|NGN|N)\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|\d+(?:\.\d+)?)\s*(k|K)?/i;

function slugId(s: string, i: number): string {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return `${base || "item"}-${i + 1}`;
}

export function parsePriceFromText(text: string): {
  price: number | null;
  priceLabel: string;
} {
  const m = String(text || "").match(PRICE_RE);
  if (!m) return { price: null, priceLabel: "" };
  let n = parseFloat(m[1].replace(/,/g, ""));
  if (Number.isNaN(n)) return { price: null, priceLabel: "" };
  if (m[2]) n = n * 1000;
  const price = Math.round(n);
  return { price, priceLabel: formatNgn(price) };
}

export function formatNgn(price: number): string {
  return `₦${price.toLocaleString("en-NG")}`;
}

function firstLine(caption: string): string {
  return (
    (caption || "")
      .split(/\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 1) || ""
  );
}

/** Sales / product families */
export function isCommerceFamily(familyId: string): boolean {
  return /^(commerce|luxe|dine|auto)$/.test(familyId);
}

export function isRetailBlueprint(id: string): boolean {
  return /electronics|gadget|phone|laptop|appliance|cosmetics|fragrance|perfume|beauty_retail|supermarket|grocery|minimart|convenience|fashion|jewelry|boutique|ecommerce|retail|shop|pharmacy|building|furniture|farm|produce|agro/.test(
    (id || "").toLowerCase()
  );
}

/** Service / booking families */
export function isBookingFamily(familyId: string): boolean {
  return /^(spa|clinic|fitness|pro|edu|stay|estate)$/.test(familyId);
}

export function isShoppableFamily(familyId: string): boolean {
  return isCommerceFamily(familyId) || isBookingFamily(familyId);
}

export function modeForFamily(familyId: string): CatalogMode {
  if (isCommerceFamily(familyId)) return "commerce";
  if (isBookingFamily(familyId)) return "booking";
  return "brochure";
}

type DemoRow = { name: string; description: string; price: number; kind: CatalogKind };

const DEMO: Record<string, DemoRow[]> = {
  commerce: [
    { name: "Signature everyday set", description: "Bestseller pack — ready to ship.", price: 25000, kind: "product" },
    { name: "Premium gift box", description: "Curated selection for clients & friends.", price: 45000, kind: "product" },
    { name: "Classic essentials", description: "Core line — limited weekly stock.", price: 18000, kind: "product" },
    { name: "Limited drop", description: "Seasonal release — while stocks last.", price: 32000, kind: "product" },
    { name: "Starter bundle", description: "Three must-haves at a friendly price.", price: 15000, kind: "product" },
    { name: "Pro refill pack", description: "Value pack for regular customers.", price: 28000, kind: "product" },
  ],
  luxe: [
    { name: "Editorial capsule piece", description: "Statement item from the new lookbook.", price: 85000, kind: "product" },
    { name: "Atelier essential", description: "Tailored finish, limited run.", price: 120000, kind: "product" },
    { name: "Heritage accessory", description: "Finishing detail for the collection.", price: 45000, kind: "product" },
    { name: "Evening silhouette", description: "Event-ready, made to impress.", price: 150000, kind: "product" },
    { name: "Day-to-night set", description: "Versatile pairing for the week.", price: 95000, kind: "product" },
    { name: "Private order deposit", description: "Secure your custom piece.", price: 50000, kind: "product" },
  ],
  dine: [
    { name: "Chef’s tasting plate", description: "Seasonal highlights from the kitchen.", price: 18000, kind: "menu" },
    { name: "Signature main", description: "House favourite — generous portion.", price: 12000, kind: "menu" },
    { name: "Shared platter", description: "Ideal for two.", price: 22000, kind: "menu" },
    { name: "Dessert selection", description: "Sweet finish of the day.", price: 5500, kind: "menu" },
    { name: "Weekend brunch set", description: "Brunch board + drink.", price: 15000, kind: "menu" },
    { name: "Private table deposit", description: "Hold a table for your party.", price: 20000, kind: "menu" },
  ],
  auto: [
    { name: "Inspection package", description: "Full check before you buy.", price: 25000, kind: "listing" },
    { name: "Detailing — interior", description: "Deep clean and protect.", price: 35000, kind: "service" },
    { name: "Detailing — full", description: "Interior + exterior refresh.", price: 55000, kind: "service" },
    { name: "Financing consult", description: "Talk options with our desk.", price: 0, kind: "service" },
    { name: "Test drive slot", description: "Book a drive on inventory units.", price: 0, kind: "listing" },
  ],
  spa: [
    { name: "Classic full-body massage", description: "60 minutes of release and recovery.", price: 25000, kind: "service" },
    { name: "Deep tissue session", description: "90 minutes for stubborn tension.", price: 35000, kind: "service" },
    { name: "Facial ritual", description: "Cleanse, glow, and calm.", price: 28000, kind: "service" },
    { name: "Couples treatment", description: "Side-by-side session for two.", price: 60000, kind: "service" },
    { name: "Express head & shoulders", description: "45-minute reset.", price: 15000, kind: "service" },
    { name: "Membership day pass", description: "Priority booking for the day.", price: 40000, kind: "service" },
  ],
  clinic: [
    { name: "General consultation", description: "Meet the clinician — first visit.", price: 15000, kind: "service" },
    { name: "Follow-up visit", description: "Review and next steps.", price: 10000, kind: "service" },
    { name: "Wellness screening", description: "Baseline checks package.", price: 45000, kind: "service" },
    { name: "Specialist review", description: "Focused assessment.", price: 35000, kind: "service" },
    { name: "Tele-consult", description: "Remote session where suitable.", price: 12000, kind: "service" },
  ],
  fitness: [
    { name: "Intro PT session", description: "1:1 coaching — first session.", price: 15000, kind: "service" },
    { name: "4-session pack", description: "Structured progress block.", price: 50000, kind: "service" },
    { name: "Group class drop-in", description: "Single class entry.", price: 5000, kind: "service" },
    { name: "Monthly membership", description: "Open-floor + classes access.", price: 45000, kind: "service" },
    { name: "Nutrition check-in", description: "Plan review with your coach.", price: 20000, kind: "service" },
  ],
  pro: [
    { name: "Discovery call", description: "30-minute scope conversation.", price: 0, kind: "service" },
    { name: "Strategy session", description: "90-minute working session.", price: 75000, kind: "service" },
    { name: "Retainer — starter", description: "Monthly advisory block.", price: 250000, kind: "service" },
    { name: "Document review", description: "Focused review and notes.", price: 50000, kind: "service" },
    { name: "On-site consultation", description: "Visit at your location.", price: 100000, kind: "service" },
  ],
  edu: [
    { name: "Intro workshop seat", description: "Half-day practical class.", price: 15000, kind: "service" },
    { name: "Full course deposit", description: "Secure your place on the cohort.", price: 50000, kind: "service" },
    { name: "Private tutoring hour", description: "1:1 session.", price: 12000, kind: "service" },
    { name: "Weekend intensive", description: "Two-day skill block.", price: 45000, kind: "service" },
  ],
  stay: [
    { name: "Standard room — night", description: "Comfortable stay, per night.", price: 45000, kind: "listing" },
    { name: "Deluxe room — night", description: "Extra space and view.", price: 75000, kind: "listing" },
    { name: "Weekend package", description: "Two nights + breakfast.", price: 150000, kind: "listing" },
    { name: "Event space half-day", description: "Meetings and celebrations.", price: 100000, kind: "listing" },
  ],
  estate: [
    { name: "Viewing appointment", description: "Tour a listed property.", price: 0, kind: "listing" },
    { name: "Tenant screening pack", description: "Documented checks.", price: 25000, kind: "service" },
    { name: "Agency engagement", description: "Start a sales or let brief.", price: 0, kind: "listing" },
    { name: "Valuation request", description: "Professional opinion of value.", price: 50000, kind: "service" },
  ],
  general: [
    { name: "Standard package", description: "Core offer for new clients.", price: 25000, kind: "service" },
    { name: "Premium package", description: "Extended support and delivery.", price: 55000, kind: "service" },
    { name: "Consultation", description: "Talk through your needs.", price: 10000, kind: "service" },
  ],

  pharmacy: [
    { name: "Paracetamol 500mg pack", description: "Everyday pain relief (OTC).", price: 800, kind: "product" },
    { name: "Vitamin C tablets", description: "Daily immune support.", price: 3500, kind: "product" },
    { name: "Blood pressure monitor", description: "Home check device.", price: 28000, kind: "product" },
    { name: "First aid kit", description: "Home and travel essentials.", price: 12000, kind: "product" },
    { name: "Cough syrup (adult)", description: "Pharmacy-grade relief.", price: 4500, kind: "product" },
    { name: "Hand sanitiser 500ml", description: "Hygiene essential.", price: 2500, kind: "product" },
  ],
  building: [
    { name: "Cement (bag)", description: "Quality grade for block work.", price: 7500, kind: "product" },
    { name: "Iron rod (bundle)", description: "Reinforcement for slabs.", price: 85000, kind: "product" },
    { name: "Roofing sheets (unit)", description: "Durable covering.", price: 12000, kind: "product" },
    { name: "Paint 20L emulsion", description: "Interior wall finish.", price: 28000, kind: "product" },
    { name: "Plumbing fittings set", description: "Pipes and connectors.", price: 15000, kind: "product" },
    { name: "Tiles (per sqm)", description: "Floor and wall options.", price: 6500, kind: "product" },
  ],
  furniture: [
    { name: "Sofa 3-seater", description: "Living room centrepiece.", price: 280000, kind: "product" },
    { name: "Dining set 6-seater", description: "Table and chairs.", price: 320000, kind: "product" },
    { name: "Office desk", description: "Work-from-home ready.", price: 95000, kind: "product" },
    { name: "Wardrobe 3-door", description: "Bedroom storage.", price: 210000, kind: "product" },
    { name: "Centre table", description: "Living room accent.", price: 45000, kind: "product" },
    { name: "Bed frame queen", description: "Solid frame, modern finish.", price: 180000, kind: "product" },
  ],
  farm: [
    { name: "Fresh tomatoes (basket)", description: "Market-ready produce.", price: 15000, kind: "product" },
    { name: "Yam tuber (unit)", description: "Farm-fresh staple.", price: 3500, kind: "product" },
    { name: "Plantain bunch", description: "Ripe and green options.", price: 5000, kind: "product" },
    { name: "Poultry eggs (crate)", description: "Farm collected.", price: 4500, kind: "product" },
    { name: "Palm oil 5L", description: "Local quality oil.", price: 12000, kind: "product" },
    { name: "Seasonal vegetable mix", description: "Leafy and garden produce.", price: 4000, kind: "product" },
  ],
  electronics: [
    { name: "Wireless earbuds Pro", description: "Noise isolation, long battery, clear calls.", price: 45000, kind: "product" },
    { name: "Power bank 20000mAh", description: "Fast charge for phones and tablets.", price: 28000, kind: "product" },
    { name: "Smart Android TV 43\"", description: "Streaming-ready, sharp 4K picture.", price: 320000, kind: "product" },
    { name: "Laptop stand aluminium", description: "Ergonomic desk setup.", price: 18000, kind: "product" },
    { name: "USB-C hub 7-in-1", description: "Ports for work and travel.", price: 35000, kind: "product" },
    { name: "Phone case + tempered glass", description: "Everyday protection pack.", price: 8500, kind: "product" },
  ],
  cosmetics: [
    { name: "Vitamin C serum 30ml", description: "Brightening daily serum.", price: 18500, kind: "product" },
    { name: "Matte lipstick set", description: "Long-wear, rich pigment.", price: 12000, kind: "product" },
    { name: "Eau de parfum 50ml", description: "Signature scent, lasting trail.", price: 45000, kind: "product" },
    { name: "SPF 50 day cream", description: "Light protection for Lagos sun.", price: 16000, kind: "product" },
    { name: "Body oil glow", description: "Hydration with soft sheen.", price: 14000, kind: "product" },
    { name: "Makeup brush kit", description: "Essential tools for clean application.", price: 22000, kind: "product" },
  ],
  supermarket: [
    { name: "Family rice 10kg", description: "Staple quality grain.", price: 18000, kind: "product" },
    { name: "Cooking oil 5L", description: "Everyday kitchen essential.", price: 12000, kind: "product" },
    { name: "Breakfast cereal pack", description: "Quick mornings, full flavour.", price: 6500, kind: "product" },
    { name: "Fresh produce basket", description: "Seasonal fruits & vegetables.", price: 9000, kind: "product" },
    { name: "Household cleaner set", description: "Home essentials bundle.", price: 7500, kind: "product" },
    { name: "Beverages multipack", description: "Soft drinks for the week.", price: 5500, kind: "product" },
  ],
  mobility: [
    { name: "City ride (approx.)", description: "Short trips across town — confirm on chat.", price: 2500, kind: "service" },
    { name: "Airport transfer", description: "Fixed-route comfort to/from airport.", price: 15000, kind: "service" },
    { name: "Hourly hire", description: "Driver on standby for errands.", price: 12000, kind: "service" },
    { name: "Intercity seat", description: "Book a seat for longer routes.", price: 8000, kind: "service" },
  ],

};


/** Curated Unsplash product/service imagery per family (always non-empty). */
const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const FAMILY_PRODUCT_IMAGES: Record<string, string[]> = {
  commerce: [
    u("photo-1523275335684-37898b6baf30"), // watch/product
    u("photo-1505740420928-5e560c06d30e"), // headphones
    u("photo-1572635196237-14b3f281503f"), // sunglasses
    u("photo-1560343090-f0409e92791a"), // sneakers
    u("photo-1542291026-7eec264c27ff"), // red shoe
    u("photo-1526170375885-4d8ecf77b99f"), // camera
  ],
  luxe: [
    u("photo-1515562141207-7a88fb7ce338"), // jewelry
    u("photo-1599643478518-a784e5dc4c8f"), // necklace
    u("photo-1617038260897-41a1f14a8ca0"), // bag
    u("photo-1492707892479-7bc8d5a4ee93"), // fashion flatlay
    u("photo-1469334031218-e382a71b716b"), // model fashion
    u("photo-1483985988355-763728e1935b"), // shopping
  ],
  dine: [
    u("photo-1540189549336-e6e99c3679fe"), // plated food
    u("photo-1414235077428-338989a2e8c0"), // fine dish
    u("photo-1504674900247-0877df9cc836"), // spread
    u("photo-1559339352-11d035aa65de"), // restaurant
    u("photo-1476224203421-9ac39bcb3327"), // table
    u("photo-1517248135467-4c7edcad34c4"), // dining room
  ],
  auto: [
    u("photo-1492144534655-ae79c964c9d7"), // car front
    u("photo-1503376780353-7e6692767b70"), // sports car
    u("photo-1552519507-da3b142c6e3d"), // muscle car
    u("photo-1494976388531-d1058494cdd8"), // classic
    u("photo-1489824904134-891ab64532f1"), // street car
    u("photo-1511919884226-fd3cad34687c"), // car detail
  ],
  spa: [
    u("photo-1544161515-4ab6ce6db874"), // massage
    u("photo-1519823551278-64ac92753476"), // spa stones
    u("photo-1540555700478-4be289fbecef"), // spa room
    u("photo-1600334129128-685c5582fd35"), // facial
    u("photo-1515377905703-c4788e51af15"), // candles spa
    u("photo-1591343395082-e120087004b3"), // wellness
  ],
  clinic: [
    u("photo-1579684385127-1ef15d508118"), // clinic
    u("photo-1631217868264-e5b90bb7e133"), // medical
    u("photo-1581595220892-b0739db3b8c5"), // care
    u("photo-1666213483642-c3c1e058ac81"), // consultation
    u("photo-1576091160399-112ba8d25d1d"), // health tech
    u("photo-1516549655169-df83a0774514"), // hospital clean
  ],
  fitness: [
    u("photo-1534438327276-14e5300c3a48"), // gym
    u("photo-1517836357463-d25dfeac3438"), // weights
    u("photo-1571902943202-507c50654fe0"), // training
    u("photo-1581009146145-b5ef050c29bb"), // kettlebell
    u("photo-1571019614242-c5c5dee9f50b"), // workout
    u("photo-1549060279-7e168fcee0c2"), // athlete
  ],
  pro: [
    u("photo-1497366216548-37526070297c"), // office
    u("photo-1454165804606-c3d57bc86b40"), // desk work
    u("photo-1521791136064-7986c2920216"), // handshake
    u("photo-1486312338219-ce68d2c6f44d"), // laptop
    u("photo-1556761175-5973dc0f32e7"), // team meeting
    u("photo-1507679799987-c73779587ccf"), // suit
  ],
  edu: [
    u("photo-1503676260728-1c00da094a0b"), // classroom
    u("photo-1509062522246-3755977927d7"), // students
    u("photo-1523240795612-9a054b0db644"), // study group
    u("photo-1427504494785-3a9ca7044f45"), // library
    u("photo-1524178232363-1fb2b075b655"), // lecture
    u("photo-1497633762265-9d179a990aa6"), // books
  ],
  stay: [
    u("photo-1566073771259-6a8506099945"), // hotel room
    u("photo-1582719478250-c89cae4dc85b"), // luxury bed
    u("photo-1578683010236-d716f9a3f461"), // suite
    u("photo-1611892440504-42a792e24d32"), // hotel interior
    u("photo-1551882547-ff40c63fe5fa"), // lobby
    u("photo-1520250497591-112f2f40a3f4"), // resort
  ],
  estate: [
    u("photo-1560518883-ce09059eeffa"), // house keys
    u("photo-1564013799919-ab600027ffc6"), // modern home
    u("photo-1600596542815-ffad4c1539a9"), // luxury house
    u("photo-1600585154340-be6161a56a0c"), // villa
    u("photo-1600607687939-ce8a6c25118c"), // interior
    u("photo-1600047509807-ba8f99d2cd00"), // property
  ],

  pharmacy: [
    u("photo-1584308666744-24d5c474f2ae"),
    u("photo-1471864190281-a93a3070b6de"),
    u("photo-1585435557343-3b092031a831"),
    u("photo-1576602976047-174e57a70ce0"),
    u("photo-1631549916768-4119b2e5f926"),
    u("photo-1587854692152-cbe660dbde88"),
  ],
  building: [
    u("photo-1504307651254-35680f356dfd"),
    u("photo-1581094794329-c8112a89af12"),
    u("photo-1503387762-592deb58ef4e"),
    u("photo-1621905251189-08b45d6a269e"),
    u("photo-1541888946425-d81bb19240f5"),
    u("photo-1590073242678-70eea72e0f44"),
  ],
  furniture: [
    u("photo-1555041469-a586c61ea9bc"),
    u("photo-1493663284031-b7e3aefcae8e"),
    u("photo-1567538096630-e0c55bd6374c"),
    u("photo-1586023492125-27b2c045efd7"),
    u("photo-1556228453-efd6c1ff04f6"),
    u("photo-1616486338812-3dadae4b4ace"),
  ],
  farm: [
    u("photo-1464226184884-fa280b87c399"),
    u("photo-1500595046743-cd271d973d8b"),
    u("photo-1593113598332-cd288d649433"),
    u("photo-1574944204950-d1cdb63d9e8d"),
    u("photo-1625246333195-78d9c38ad449"),
    u("photo-1461354464878-ad803748e6c6"),
  ],
  electronics: [
    u("photo-1511707171634-5f897ff02aa9"),
    u("photo-1498049794561-7780e7231661"),
    u("photo-1505740420928-5e560c06d30e"),
    u("photo-1525547719533-c1d8b8e8d4a0"),
    u("photo-1585386959984-a4155224a1ad"),
    u("photo-1550009158-9ebf69173e03"),
  ],
  cosmetics: [
    u("photo-1596462502278-27bfdc403348"),
    u("photo-1522335789203-aabd1fc54bc9"),
    u("photo-1541643600914-78b084683601"),
    u("photo-1571781926299-e363d68fff31"),
    u("photo-1512496015851-a90fb38ba796"),
    u("photo-1598440947619-2c35fc9aa908"),
  ],
  supermarket: [
    u("photo-1542838132-92c53300491e"),
    u("photo-1604719312566-8912e9227c6a"),
    u("photo-1578916175868-cac3705e8e19"),
    u("photo-1534723452862-4c874180d2dc"),
    u("photo-1506617420156-8e453697f8c0"),
    u("photo-1583258292688-f7e0e8f8d6d8"),
  ],
  mobility: [
    u("photo-1449965408869-eaa3f722e40d"),
    u("photo-1502877338535-766e1452684a"),
    u("photo-1552519507-da3b142c6e3d"),
    u("photo-1492144534655-ae79c964c9d7"),
    u("photo-1449824913935-59a10b8d2000"),
    u("photo-1517940310602-26535839fe89"),
  ],
  general: [
    u("photo-1497366216548-37526070297c"),
    u("photo-1523275335684-37898b6baf30"),
    u("photo-1544161515-4ab6ce6db874"),
    u("photo-1517248135467-4c7edcad34c4"),
    u("photo-1556761175-5973dc0f32e7"),
    u("photo-1507679799987-c73779587ccf"),
  ],
};

export function productImagesForFamily(familyId: string): string[] {
  const id = (familyId || "general").toLowerCase();
  if (FAMILY_PRODUCT_IMAGES[id]) return FAMILY_PRODUCT_IMAGES[id];
  if (/electronics|gadget|phone|laptop|appliance/.test(id))
    return FAMILY_PRODUCT_IMAGES.electronics || FAMILY_PRODUCT_IMAGES.commerce;
  if (/pharmacy/.test(id)) return FAMILY_PRODUCT_IMAGES.pharmacy || FAMILY_PRODUCT_IMAGES.commerce;
  if (/building|cement|materials/.test(id))
    return FAMILY_PRODUCT_IMAGES.building || FAMILY_PRODUCT_IMAGES.commerce;
  if (/furniture|sofa/.test(id)) return FAMILY_PRODUCT_IMAGES.furniture || FAMILY_PRODUCT_IMAGES.commerce;
  if (/farm|produce|agro|agric/.test(id)) return FAMILY_PRODUCT_IMAGES.farm || FAMILY_PRODUCT_IMAGES.commerce;
  if (/cosmetic|fragrance|perfume|beauty_retail/.test(id))
    return FAMILY_PRODUCT_IMAGES.cosmetics || FAMILY_PRODUCT_IMAGES.luxe;
  if (/supermarket|grocery|minimart|convenience/.test(id))
    return FAMILY_PRODUCT_IMAGES.supermarket || FAMILY_PRODUCT_IMAGES.commerce;
  if (/ride|mobility|bolt|uber|transport/.test(id))
    return FAMILY_PRODUCT_IMAGES.mobility || FAMILY_PRODUCT_IMAGES.auto;
  if (isCommerceFamily(id)) return FAMILY_PRODUCT_IMAGES.commerce;
  if (isBookingFamily(id)) return FAMILY_PRODUCT_IMAGES.spa;
  return FAMILY_PRODUCT_IMAGES.general;
}


export function seedDemoCatalog(
  familyId: string,
  images: string[] = []
): CatalogItem[] {
  const fid = (familyId || "").toLowerCase();
  let key = fid in DEMO ? fid : "";
  if (!key) {
    if (/electronics|gadget|phone|laptop/.test(fid)) key = "electronics";
    else if (/pharmacy/.test(fid)) key = "pharmacy";
    else if (/building|cement|materials/.test(fid)) key = "building";
    else if (/furniture|sofa/.test(fid)) key = "furniture";
    else if (/farm|produce|agro|agric/.test(fid)) key = "farm";
    else if (/cosmetic|fragrance|perfume|beauty_retail/.test(fid)) key = "cosmetics";
    else if (/supermarket|grocery|minimart|convenience/.test(fid)) key = "supermarket";
    else if (/ride|mobility|bolt|uber|transport/.test(fid)) key = "mobility";
    else if (isCommerceFamily(fid)) key = "commerce";
    else if (isBookingFamily(fid)) key = "spa";
    else key = "general";
  }
  const rows = DEMO[key] || DEMO.general;
  const pool =
    images.filter((x) => /^https?:\/\//i.test(x) && x.length > 12).length >= 2
      ? images.filter((x) => /^https?:\/\//i.test(x))
      : productImagesForFamily(familyId);
  return rows.map((r, i) => ({
    id: slugId(r.name, i),
    name: r.name,
    description: r.description,
    price: r.price > 0 ? r.price : null,
    priceLabel: r.price > 0 ? formatNgn(r.price) : "Talk on WhatsApp",
    image: pool[i % pool.length] || productImagesForFamily(familyId)[0],
    kind: r.kind,
    source: "demo" as const,
  }));
}

type PostLike = {
  id?: string;
  caption?: string;
  media_url?: string;
  mediaUrl?: string;
  image?: string;
};

/**
 * Build full catalogue: caption items (with real prices when found) merged onto demo seed.
 * Sales + service niches always end up with priced/demo items for cart UX.
 */
export function extractCatalogFromPosts(
  posts: PostLike[],
  opts: {
    familyId: string;
    fallbackImages?: string[];
    maxItems?: number;
  }
): CatalogSeed {
  const familyId = opts.familyId || "general";
  const mode = modeForFamily(familyId);
  const imgs = opts.fallbackImages || [];
  const max = opts.maxItems ?? 12;

  const fromCaptions: CatalogItem[] = [];
  const seen = new Set<string>();

  (posts || []).forEach((p, i) => {
    if (fromCaptions.length >= max) return;
    const cap = String(p.caption || "").trim();
    if (!cap || cap.length < 3) return;
    const name = firstLine(cap).replace(/^#\S+\s*/, "").slice(0, 72);
    if (!name || name.length < 2) return;
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const { price, priceLabel } = parsePriceFromText(cap);
    const image =
      p.media_url || p.mediaUrl || p.image || imgs[i % Math.max(imgs.length, 1)] || "";

    fromCaptions.push({
      id: String(p.id || slugId(name, i)),
      name,
      description: cap.slice(0, 180).replace(/\n+/g, " "),
      price,
      priceLabel: price != null ? priceLabel : mode === "brochure" ? "Ask on WhatsApp" : "",
      image,
      kind: mode === "booking" ? "service" : mode === "commerce" ? "product" : "product",
      source: "caption",
    });
  });

  let items: CatalogItem[] = [];
  if (mode === "brochure") {
    items = fromCaptions.slice(0, max);
  } else {
    const demo = seedDemoCatalog(familyId, imgs);
    // Caption items first; fill remaining slots with demo (ensure prices on demo)
    items = [...fromCaptions];
    for (const d of demo) {
      if (items.length >= max) break;
      if (seen.has(d.name.toLowerCase())) continue;
      // If caption item had no price, keep demo prices on separate demo rows
      items.push(d);
    }
    // Ensure every item shown in cart niches has a display price label
    const pool = productImagesForFamily(familyId);
    items = items.map((it, idx) => {
      let next = { ...it };
      if (!next.image || next.image.length < 8) {
        next.image = pool[idx % pool.length];
      }
      if (next.price != null && next.price > 0) {
        next.priceLabel = formatNgn(next.price);
        return next;
      }
      if (!next.priceLabel || next.priceLabel === "") {
        const fallbackPrice =
          mode === "booking" ? 15000 + (idx % 5) * 5000 : 12000 + (idx % 5) * 6000;
        next.price = fallbackPrice;
        next.priceLabel = formatNgn(fallbackPrice);
        if (next.source === "caption") next.source = "derived";
      }
      return next;
    });
  }

  const shoppable = mode !== "brochure";

  return {
    currency: "NGN",
    mode,
    items: items.slice(0, max),
    shoppable,
    addLabel: mode === "booking" ? "Add to booking" : "Add to cart",
    checkoutLabel: mode === "booking" ? "Book on WhatsApp" : "Checkout on WhatsApp",
    cartNoun: mode === "booking" ? "booking" : "cart",
    updatedAt: new Date().toISOString(),
  };
}

export function mergeCatalogItems(
  base: CatalogItem[],
  fromAi: Partial<CatalogItem>[] | undefined
): CatalogItem[] {
  if (!fromAi?.length) return base;
  const out: CatalogItem[] = [];
  fromAi.forEach((row, i) => {
    const name = String(row.name || "").trim().slice(0, 72);
    if (!name) return;
    let price =
      typeof row.price === "number" && row.price >= 0 ? Math.round(row.price) : null;
    if (price == null && row.priceLabel) {
      price = parsePriceFromText(String(row.priceLabel)).price;
    }
    out.push({
      id: String(row.id || slugId(name, i)),
      name,
      description: String(row.description || name).slice(0, 180),
      price,
      priceLabel:
        price != null && price > 0
          ? formatNgn(price)
          : String(row.priceLabel || "Talk on WhatsApp"),
      image: String(row.image || ""),
      kind: (row.kind as CatalogKind) || "product",
      source: "derived",
    });
  });
  return out.length ? out : base;
}

export function catalogFromTitles(
  titles: string[],
  images: string[],
  familyId: string
): CatalogItem[] {
  const mode = modeForFamily(familyId);
  if (mode !== "brochure") {
    return seedDemoCatalog(familyId, images);
  }
  return titles.slice(0, 8).map((t, i) => {
    const { price, priceLabel } = parsePriceFromText(t);
    return {
      id: slugId(t, i),
      name: t.slice(0, 72),
      description: t.slice(0, 120),
      price,
      priceLabel: price != null ? priceLabel : "Ask on WhatsApp",
      image: images[i % Math.max(images.length, 1)] || "",
      kind: "product" as CatalogKind,
      source: "title" as const,
    };
  });
}
