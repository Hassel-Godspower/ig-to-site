/**
 * Curated Google Fonts for the site builder.
 * Values are full CSS font-family stacks so they work even before the webfont loads.
 */

export type GoogleFont = {
  /** Display name in the UI */
  name: string;
  /** CSS font-family value (quoted family + fallbacks) */
  family: string;
  /** Google Fonts family param, e.g. "Inter:wght@400;600;700" — null = system only */
  google?: string | null;
  category: "sans" | "serif" | "display" | "mono" | "system";
};

export const GOOGLE_FONTS: GoogleFont[] = [
  {
    name: "System UI",
    family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    google: null,
    category: "system",
  },
  {
    name: "Inter",
    family: "'Inter', system-ui, sans-serif",
    google: "Inter:wght@400;500;600;700;800",
    category: "sans",
  },
  {
    name: "Roboto",
    family: "'Roboto', system-ui, sans-serif",
    google: "Roboto:wght@400;500;700",
    category: "sans",
  },
  {
    name: "Open Sans",
    family: "'Open Sans', system-ui, sans-serif",
    google: "Open+Sans:wght@400;600;700",
    category: "sans",
  },
  {
    name: "Poppins",
    family: "'Poppins', system-ui, sans-serif",
    google: "Poppins:wght@400;500;600;700",
    category: "sans",
  },
  {
    name: "Montserrat",
    family: "'Montserrat', system-ui, sans-serif",
    google: "Montserrat:wght@400;500;600;700;800",
    category: "sans",
  },
  {
    name: "Lato",
    family: "'Lato', system-ui, sans-serif",
    google: "Lato:wght@400;700",
    category: "sans",
  },
  {
    name: "Nunito",
    family: "'Nunito', system-ui, sans-serif",
    google: "Nunito:wght@400;600;700;800",
    category: "sans",
  },
  {
    name: "Source Sans 3",
    family: "'Source Sans 3', system-ui, sans-serif",
    google: "Source+Sans+3:wght@400;600;700",
    category: "sans",
  },
  {
    name: "DM Sans",
    family: "'DM Sans', system-ui, sans-serif",
    google: "DM+Sans:wght@400;500;700",
    category: "sans",
  },
  {
    name: "Work Sans",
    family: "'Work Sans', system-ui, sans-serif",
    google: "Work+Sans:wght@400;500;600;700",
    category: "sans",
  },
  {
    name: "Raleway",
    family: "'Raleway', system-ui, sans-serif",
    google: "Raleway:wght@400;500;600;700",
    category: "sans",
  },
  {
    name: "Outfit",
    family: "'Outfit', system-ui, sans-serif",
    google: "Outfit:wght@400;500;600;700",
    category: "sans",
  },
  {
    name: "Plus Jakarta Sans",
    family: "'Plus Jakarta Sans', system-ui, sans-serif",
    google: "Plus+Jakarta+Sans:wght@400;500;600;700",
    category: "sans",
  },
  {
    name: "Manrope",
    family: "'Manrope', system-ui, sans-serif",
    google: "Manrope:wght@400;500;600;700;800",
    category: "sans",
  },
  {
    name: "Playfair Display",
    family: "'Playfair Display', Georgia, serif",
    google: "Playfair+Display:wght@400;600;700",
    category: "serif",
  },
  {
    name: "Lora",
    family: "'Lora', Georgia, serif",
    google: "Lora:wght@400;500;600;700",
    category: "serif",
  },
  {
    name: "Merriweather",
    family: "'Merriweather', Georgia, serif",
    google: "Merriweather:wght@400;700",
    category: "serif",
  },
  {
    name: "Libre Baskerville",
    family: "'Libre Baskerville', Georgia, serif",
    google: "Libre+Baskerville:wght@400;700",
    category: "serif",
  },
  {
    name: "Cormorant Garamond",
    family: "'Cormorant Garamond', Georgia, serif",
    google: "Cormorant+Garamond:wght@400;600;700",
    category: "serif",
  },
  {
    name: "Space Grotesk",
    family: "'Space Grotesk', system-ui, sans-serif",
    google: "Space+Grotesk:wght@400;500;600;700",
    category: "display",
  },
  {
    name: "Bebas Neue",
    family: "'Bebas Neue', Impact, sans-serif",
    google: "Bebas+Neue",
    category: "display",
  },
  {
    name: "Oswald",
    family: "'Oswald', Impact, sans-serif",
    google: "Oswald:wght@400;500;600;700",
    category: "display",
  },
  {
    name: "Abril Fatface",
    family: "'Abril Fatface', Georgia, serif",
    google: "Abril+Fatface",
    category: "display",
  },
  {
    name: "JetBrains Mono",
    family: "'JetBrains Mono', ui-monospace, monospace",
    google: "JetBrains+Mono:wght@400;500;700",
    category: "mono",
  },
  {
    name: "Fira Code",
    family: "'Fira Code', ui-monospace, monospace",
    google: "Fira+Code:wght@400;500;700",
    category: "mono",
  },
];

const LINK_ID_PREFIX = "goke-gf-";

/** Build a Google Fonts CSS2 URL for one or more family params */
export function googleFontsCssUrl(families: string[]): string {
  const unique = Array.from(new Set(families.filter(Boolean)));
  if (!unique.length) return "";
  const q = unique.map((f) => `family=${f}`).join("&");
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}

/** Resolve a CSS family stack to our catalog entry (best effort) */
export function findFontByFamily(family: string): GoogleFont | undefined {
  const n = family.trim().toLowerCase();
  return GOOGLE_FONTS.find(
    (f) =>
      f.family.toLowerCase() === n ||
      f.name.toLowerCase() === n ||
      n.includes(`'${f.name.toLowerCase()}'`) ||
      n.includes(`"${f.name.toLowerCase()}"`)
  );
}

/**
 * Ensure Google Font <link> tags exist in the document for the given CSS stacks.
 * Safe to call repeatedly; removes unused goke-gf-* links.
 */
export function ensureGoogleFontsInDocument(
  doc: Document,
  fontStacks: string[]
): void {
  if (!doc?.head) return;

  const needed = new Set<string>();
  for (const stack of fontStacks) {
    const entry = findFontByFamily(stack);
    if (entry?.google) needed.add(entry.google);
  }

  // Remove stale goke font links
  const existing = Array.from(
    doc.head.querySelectorAll(`link[id^="${LINK_ID_PREFIX}"]`)
  ) as HTMLLinkElement[];
  for (const link of existing) {
    const key = link.id.slice(LINK_ID_PREFIX.length);
    if (!needed.has(key)) link.remove();
  }

  for (const google of needed) {
    const id = LINK_ID_PREFIX + google;
    if (doc.getElementById(id)) continue;
    const link = doc.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = googleFontsCssUrl([google]);
    doc.head.appendChild(link);
  }
}

/** Options for <select> / Style panel */
export function fontSelectOptions(): { value: string; label: string }[] {
  return GOOGLE_FONTS.map((f) => ({
    value: f.family,
    label: f.name,
  }));
}
