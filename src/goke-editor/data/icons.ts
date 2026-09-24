/**
 * Lucide-style inline SVG icons (MIT).
 * Paths are the inner <path d="..."> content for a 24×24 viewBox.
 * Stroke icons use stroke="currentColor" fill="none".
 */

export type IconDef = {
  name: string;
  /** Search keywords */
  keywords?: string[];
  /** Inner SVG markup (paths/circles) for viewBox="0 0 24 24" */
  paths: string;
  /** "stroke" (default) or "fill" */
  style?: "stroke" | "fill";
};

const S =
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"';

export const ICONS: IconDef[] = [
  {
    name: "heart",
    keywords: ["love", "like"],
    paths: `<path ${S} d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  },
  {
    name: "star",
    keywords: ["favorite", "rating"],
    paths: `<polygon ${S} points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  },
  {
    name: "check",
    keywords: ["done", "ok", "tick"],
    paths: `<path ${S} d="M20 6 9 17l-5-5"/>`,
  },
  {
    name: "check-circle",
    keywords: ["done", "success"],
    paths: `<path ${S} d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path ${S} d="m9 11 3 3L22 4"/>`,
  },
  {
    name: "x",
    keywords: ["close", "cancel"],
    paths: `<path ${S} d="M18 6 6 18"/><path ${S} d="m6 6 12 12"/>`,
  },
  {
    name: "plus",
    keywords: ["add"],
    paths: `<path ${S} d="M5 12h14"/><path ${S} d="M12 5v14"/>`,
  },
  {
    name: "minus",
    keywords: ["remove"],
    paths: `<path ${S} d="M5 12h14"/>`,
  },
  {
    name: "arrow-right",
    keywords: ["next"],
    paths: `<path ${S} d="M5 12h14"/><path ${S} d="m12 5 7 7-7 7"/>`,
  },
  {
    name: "arrow-left",
    keywords: ["back"],
    paths: `<path ${S} d="M19 12H5"/><path ${S} d="m12 19-7-7 7-7"/>`,
  },
  {
    name: "chevron-down",
    keywords: ["expand"],
    paths: `<path ${S} d="m6 9 6 6 6-6"/>`,
  },
  {
    name: "chevron-up",
    keywords: ["collapse"],
    paths: `<path ${S} d="m18 15-6-6-6 6"/>`,
  },
  {
    name: "menu",
    keywords: ["hamburger", "nav"],
    paths: `<path ${S} d="M4 5h16"/><path ${S} d="M4 12h16"/><path ${S} d="M4 19h16"/>`,
  },
  {
    name: "search",
    keywords: ["find", "magnify"],
    paths: `<circle ${S} cx="11" cy="11" r="8"/><path ${S} d="m21 21-4.3-4.3"/>`,
  },
  {
    name: "user",
    keywords: ["person", "profile"],
    paths: `<path ${S} d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle ${S} cx="12" cy="7" r="4"/>`,
  },
  {
    name: "users",
    keywords: ["team", "people"],
    paths: `<path ${S} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle ${S} cx="9" cy="7" r="4"/><path ${S} d="M22 21v-2a4 4 0 0 0-3-3.87"/><path ${S} d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  },
  {
    name: "mail",
    keywords: ["email", "envelope"],
    paths: `<rect ${S} width="20" height="16" x="2" y="4" rx="2"/><path ${S} d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
  },
  {
    name: "phone",
    keywords: ["call", "tel"],
    paths: `<path ${S} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`,
  },
  {
    name: "map-pin",
    keywords: ["location", "place"],
    paths: `<path ${S} d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle ${S} cx="12" cy="10" r="3"/>`,
  },
  {
    name: "globe",
    keywords: ["web", "world"],
    paths: `<circle ${S} cx="12" cy="12" r="10"/><path ${S} d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path ${S} d="M2 12h20"/>`,
  },
  {
    name: "link",
    keywords: ["url", "chain"],
    paths: `<path ${S} d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path ${S} d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
  },
  {
    name: "external-link",
    keywords: ["open", "new"],
    paths: `<path ${S} d="M15 3h6v6"/><path ${S} d="M10 14 21 3"/><path ${S} d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,
  },
  {
    name: "home",
    keywords: ["house"],
    paths: `<path ${S} d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline ${S} points="9 22 9 12 15 12 15 22"/>`,
  },
  {
    name: "settings",
    keywords: ["gear", "cog"],
    paths: `<path ${S} d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle ${S} cx="12" cy="12" r="3"/>`,
  },
  {
    name: "camera",
    keywords: ["photo", "image"],
    paths: `<path ${S} d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle ${S} cx="12" cy="13" r="3"/>`,
  },
  {
    name: "image",
    keywords: ["picture", "photo"],
    paths: `<rect ${S} width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle ${S} cx="9" cy="9" r="2"/><path ${S} d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>`,
  },
  {
    name: "video",
    keywords: ["play", "movie"],
    paths: `<path ${S} d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect ${S} x="2" y="6" width="14" height="12" rx="2"/>`,
  },
  {
    name: "play",
    keywords: ["start"],
    paths: `<polygon ${S} points="6 3 20 12 6 21 6 3"/>`,
  },
  {
    name: "shopping-cart",
    keywords: ["cart", "buy", "shop"],
    paths: `<circle ${S} cx="8" cy="21" r="1"/><circle ${S} cx="19" cy="21" r="1"/><path ${S} d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>`,
  },
  {
    name: "credit-card",
    keywords: ["payment", "pay"],
    paths: `<rect ${S} width="20" height="14" x="2" y="5" rx="2"/><path ${S} d="M2 10h20"/>`,
  },
  {
    name: "zap",
    keywords: ["lightning", "fast", "energy"],
    paths: `<path ${S} d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>`,
  },
  {
    name: "shield",
    keywords: ["security", "protect"],
    paths: `<path ${S} d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>`,
  },
  {
    name: "lock",
    keywords: ["secure", "password"],
    paths: `<rect ${S} width="18" height="11" x="3" y="11" rx="2" ry="2"/><path ${S} d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  },
  {
    name: "message-circle",
    keywords: ["chat", "comment"],
    paths: `<path ${S} d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>`,
  },
  {
    name: "send",
    keywords: ["message", "paper plane"],
    paths: `<path ${S} d="m22 2-7 20-4-9-9-4Z"/><path ${S} d="M22 2 11 13"/>`,
  },
  {
    name: "thumbs-up",
    keywords: ["like", "approve"],
    paths: `<path ${S} d="M7 10v12"/><path ${S} d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>`,
  },
  {
    name: "clock",
    keywords: ["time", "schedule"],
    paths: `<circle ${S} cx="12" cy="12" r="10"/><polyline ${S} points="12 6 12 12 16 14"/>`,
  },
  {
    name: "calendar",
    keywords: ["date", "event"],
    paths: `<path ${S} d="M8 2v4"/><path ${S} d="M16 2v4"/><rect ${S} width="18" height="18" x="3" y="4" rx="2"/><path ${S} d="M3 10h18"/>`,
  },
  {
    name: "download",
    keywords: ["save"],
    paths: `<path ${S} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline ${S} points="7 10 12 15 17 10"/><line ${S} x1="12" x2="12" y1="15" y2="3"/>`,
  },
  {
    name: "upload",
    keywords: ["import"],
    paths: `<path ${S} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline ${S} points="17 8 12 3 7 8"/><line ${S} x1="12" x2="12" y1="3" y2="15"/>`,
  },
  {
    name: "share",
    keywords: ["social"],
    paths: `<path ${S} d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline ${S} points="16 6 12 2 8 6"/><line ${S} x1="12" x2="12" y1="2" y2="15"/>`,
  },
  {
    name: "instagram",
    keywords: ["social", "ig"],
    paths: `<rect ${S} width="20" height="20" x="2" y="2" rx="5" ry="5"/><path ${S} d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line ${S} x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>`,
  },
  {
    name: "facebook",
    keywords: ["social"],
    paths: `<path ${S} d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
  },
  {
    name: "twitter",
    keywords: ["social", "x"],
    paths: `<path ${S} d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>`,
  },
  {
    name: "youtube",
    keywords: ["social", "video"],
    paths: `<path ${S} d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path ${S} d="m10 15 5-3-5-3z"/>`,
  },
  {
    name: "whatsapp",
    keywords: ["chat", "social"],
    paths: `<path ${S} d="M3 21 5.5 16A9 9 0 1 1 8 19.5L3 21"/><path ${S} d="M9 10a1 1 0 0 0 2 0V9a1 1 0 0 0-2 0v1zm4 2a1 1 0 0 0 2 0v-1a1 1 0 1 0-2 0v1z"/>`,
  },
  {
    name: "sparkles",
    keywords: ["magic", "ai", "feature"],
    paths: `<path ${S} d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path ${S} d="M5 3v4"/><path ${S} d="M19 17v4"/><path ${S} d="M3 5h4"/><path ${S} d="M17 19h4"/>`,
  },
  {
    name: "briefcase",
    keywords: ["work", "business"],
    paths: `<path ${S} d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect ${S} width="20" height="14" x="2" y="6" rx="2"/>`,
  },
  {
    name: "truck",
    keywords: ["shipping", "delivery"],
    paths: `<path ${S} d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path ${S} d="M15 18H9"/><path ${S} d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle ${S} cx="17" cy="18" r="2"/><circle ${S} cx="7" cy="18" r="2"/>`,
  },
  {
    name: "gift",
    keywords: ["present", "reward"],
    paths: `<rect ${S} x="3" y="8" width="18" height="4" rx="1"/><path ${S} d="M12 8v13"/><path ${S} d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path ${S} d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>`,
  },
  {
    name: "smile",
    keywords: ["happy", "emoji"],
    paths: `<circle ${S} cx="12" cy="12" r="10"/><path ${S} d="M8 14s1.5 2 4 2 4-2 4-2"/><line ${S} x1="9" x2="9.01" y1="9" y2="9"/><line ${S} x1="15" x2="15.01" y1="9" y2="9"/>`,
  },
];

export function getIcon(name: string): IconDef | undefined {
  return ICONS.find((i) => i.name === name);
}

/** Full inline SVG markup for embedding in the canvas */
export function iconSvgMarkup(
  name: string,
  size = 24,
  color = "currentColor"
): string {
  const icon = getIcon(name) ?? ICONS[0];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-icon="${icon.name}" style="display:block;color:${color}">${icon.paths}</svg>`;
}

export function searchIcons(query: string): IconDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return ICONS;
  return ICONS.filter(
    (i) =>
      i.name.includes(q) ||
      i.keywords?.some((k) => k.includes(q))
  );
}
