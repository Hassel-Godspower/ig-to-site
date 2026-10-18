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
  if (isCommerceFamily(id)) return FAMILY_PRODUCT_IMAGES.commerce;
  if (isBookingFamily(id)) return FAMILY_PRODUCT_IMAGES.spa;
  return FAMILY_PRODUCT_IMAGES.general;
}


export function seedDemoCatalog(
  familyId: string,
  images: string[] = []
): CatalogItem[] {
  const key = familyId in DEMO ? familyId : isCommerceFamily(familyId) ? "commerce" : isBookingFamily(familyId) ? "spa" : "general";
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
