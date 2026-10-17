/**
 * Extract structured catalogue items from Instagram posts/captions.
 * Never invent prices — only parse explicit ₦ / NGN / k patterns.
 */

export type CatalogKind = "product" | "service" | "menu" | "listing";

export type CatalogItem = {
  id: string;
  name: string;
  description: string;
  /** Naira major units when known; null = ask / WA */
  price: number | null;
  priceLabel: string;
  image: string;
  kind: CatalogKind;
  source: "caption" | "title" | "derived";
};

export type CatalogSeed = {
  currency: "NGN";
  items: CatalogItem[];
  shoppable: boolean;
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
  if (!m) return { price: null, priceLabel: "Ask on WhatsApp" };
  let n = parseFloat(m[1].replace(/,/g, ""));
  if (Number.isNaN(n)) return { price: null, priceLabel: "Ask on WhatsApp" };
  if (m[2]) n = n * 1000;
  const price = Math.round(n);
  return {
    price,
    priceLabel: `₦${price.toLocaleString("en-NG")}`,
  };
}

function firstLine(caption: string): string {
  return (caption || "")
    .split(/\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 1) || "";
}

function kindForFamily(familyId: string): CatalogKind {
  if (/dine|food|restaurant/.test(familyId)) return "menu";
  if (/spa|clinic|fitness|pro|edu/.test(familyId)) return "service";
  if (/estate|stay|auto/.test(familyId)) return "listing";
  if (/commerce|luxe|shop/.test(familyId)) return "product";
  return "product";
}

export function isShoppableFamily(familyId: string): boolean {
  return /commerce|luxe|dine|spa|fitness|auto|clinic|stay|estate|edu/.test(
    familyId
  );
}

type PostLike = {
  id?: string;
  caption?: string;
  media_url?: string;
  mediaUrl?: string;
  image?: string;
};

/**
 * Build catalogue from posts. Uses caption first line as name.
 * Includes items even without price (priceLabel = Ask on WhatsApp).
 */
export function extractCatalogFromPosts(
  posts: PostLike[],
  opts: {
    familyId: string;
    fallbackImages?: string[];
    maxItems?: number;
  }
): CatalogSeed {
  const max = opts.maxItems ?? 12;
  const kind = kindForFamily(opts.familyId);
  const imgs = opts.fallbackImages || [];
  const items: CatalogItem[] = [];
  const seen = new Set<string>();

  (posts || []).forEach((p, i) => {
    if (items.length >= max) return;
    const cap = String(p.caption || "").trim();
    if (!cap || cap.length < 3) return;
    const name = firstLine(cap).replace(/^#\S+\s*/, "").slice(0, 72);
    if (!name || name.length < 2) return;
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const { price, priceLabel } = parsePriceFromText(cap);
    const image =
      p.media_url ||
      p.mediaUrl ||
      p.image ||
      imgs[i % Math.max(imgs.length, 1)] ||
      "";

    items.push({
      id: String(p.id || slugId(name, i)),
      name,
      description: cap.slice(0, 180).replace(/\n+/g, " "),
      price,
      priceLabel,
      image,
      kind,
      source: "caption",
    });
  });

  // If few posts, still seed from image titles later in contentFromProfile
  return {
    currency: "NGN",
    items,
    shoppable: isShoppableFamily(opts.familyId),
    updatedAt: new Date().toISOString(),
  };
}

/** Merge AI-supplied product rows (only keep valid names; never invent price if AI left empty) */
export function mergeCatalogItems(
  base: CatalogItem[],
  fromAi: Partial<CatalogItem>[] | undefined
): CatalogItem[] {
  if (!fromAi?.length) return base;
  const out: CatalogItem[] = [];
  fromAi.forEach((row, i) => {
    const name = String(row.name || "").trim().slice(0, 72);
    if (!name) return;
    const desc = String(row.description || "").slice(0, 180);
    let price =
      typeof row.price === "number" && row.price > 0 ? Math.round(row.price) : null;
    if (price == null && row.priceLabel) {
      const p = parsePriceFromText(String(row.priceLabel));
      price = p.price;
    }
    // Reject suspiciously round fake-looking only if no source — keep AI price only if > 0
    out.push({
      id: String(row.id || slugId(name, i)),
      name,
      description: desc || name,
      price,
      priceLabel:
        price != null
          ? `₦${price.toLocaleString("en-NG")}`
          : String(row.priceLabel || "Ask on WhatsApp"),
      image: String(row.image || ""),
      kind: (row.kind as CatalogKind) || "product",
      source: "derived",
    });
  });
  return out.length ? out : base;
}

/** Fallback items from service titles when posts had no catalogue */
export function catalogFromTitles(
  titles: string[],
  images: string[],
  familyId: string
): CatalogItem[] {
  const kind = kindForFamily(familyId);
  return titles.slice(0, 8).map((t, i) => {
    const { price, priceLabel } = parsePriceFromText(t);
    return {
      id: slugId(t, i),
      name: t.slice(0, 72),
      description: t.slice(0, 120),
      price,
      priceLabel,
      image: images[i % Math.max(images.length, 1)] || "",
      kind,
      source: "title" as const,
    };
  });
}
