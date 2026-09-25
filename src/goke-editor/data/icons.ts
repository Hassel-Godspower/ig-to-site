/**
 * Lucide-style inline SVG icons (MIT / ISC).
 * Paths are inner SVG content for viewBox="0 0 24 24".
 * Source inspiration: https://github.com/lucide-icons/lucide
 */

export type IconDef = {
  name: string;
  keywords?: string[];
  paths: string;
  style?: "stroke" | "fill";
};

export const ICONS: IconDef[] = [
  {
    name: "heart",
    keywords: ['love', 'like'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  },
  {
    name: "star",
    keywords: ['favorite', 'rating'],
    paths: `<polygon stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  },
  {
    name: "check",
    keywords: ['done', 'ok', 'tick'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M20 6 9 17l-5-5"/>`,
  },
  {
    name: "check-circle",
    keywords: ['done', 'success'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m9 11 3 3L22 4"/>`,
  },
  {
    name: "x",
    keywords: ['close', 'cancel'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M18 6 6 18"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m6 6 12 12"/>`,
  },
  {
    name: "x-circle",
    keywords: ['close', 'error'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="10"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m15 9-6 6"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m9 9 6 6"/>`,
  },
  {
    name: "plus",
    keywords: ['add'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M5 12h14"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 5v14"/>`,
  },
  {
    name: "plus-circle",
    keywords: ['add'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="10"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8 12h8"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 8v8"/>`,
  },
  {
    name: "minus",
    keywords: ['remove'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M5 12h14"/>`,
  },
  {
    name: "arrow-right",
    keywords: ['next'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M5 12h14"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m12 5 7 7-7 7"/>`,
  },
  {
    name: "arrow-left",
    keywords: ['back'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19 12H5"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m12 19-7-7 7-7"/>`,
  },
  {
    name: "arrow-up",
    keywords: ['up'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m5 12 7-7 7 7"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 19V5"/>`,
  },
  {
    name: "arrow-down",
    keywords: ['down'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 5v14"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m19 12-7 7-7-7"/>`,
  },
  {
    name: "chevron-down",
    keywords: ['expand'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m6 9 6 6 6-6"/>`,
  },
  {
    name: "chevron-up",
    keywords: ['collapse'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m18 15-6-6-6 6"/>`,
  },
  {
    name: "chevron-left",
    keywords: ['back'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m15 18-6-6 6-6"/>`,
  },
  {
    name: "chevron-right",
    keywords: ['next'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m9 18 6-6-6-6"/>`,
  },
  {
    name: "menu",
    keywords: ['hamburger', 'nav'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4 5h16"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4 12h16"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4 19h16"/>`,
  },
  {
    name: "search",
    keywords: ['find', 'magnify'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="11" cy="11" r="8"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m21 21-4.3-4.3"/>`,
  },
  {
    name: "user",
    keywords: ['person', 'profile'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="7" r="4"/>`,
  },
  {
    name: "users",
    keywords: ['team', 'people'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="9" cy="7" r="4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M22 21v-2a4 4 0 0 0-3-3.87"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  },
  {
    name: "mail",
    keywords: ['email', 'envelope'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="20" height="16" x="2" y="4" rx="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
  },
  {
    name: "phone",
    keywords: ['call', 'tel'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`,
  },
  {
    name: "map-pin",
    keywords: ['location', 'place'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="10" r="3"/>`,
  },
  {
    name: "globe",
    keywords: ['world', 'web'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="10"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2 12h20"/>`,
  },
  {
    name: "link",
    keywords: ['url', 'chain'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
  },
  {
    name: "external-link",
    keywords: ['open'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15 3h6v6"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M10 14 21 3"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`,
  },
  {
    name: "home",
    keywords: ['house'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="9 22 9 12 15 12 15 22"/>`,
  },
  {
    name: "settings",
    keywords: ['gear', 'cog'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="3"/>`,
  },
  {
    name: "camera",
    keywords: ['photo'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="13" r="3"/>`,
  },
  {
    name: "image",
    keywords: ['picture', 'photo'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="18" height="18" x="3" y="3" rx="2"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="9" cy="9" r="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>`,
  },
  {
    name: "video",
    keywords: ['film'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x="2" y="6" width="14" height="12" rx="2"/>`,
  },
  {
    name: "play",
    keywords: ['start'],
    paths: `<polygon stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="6 3 20 12 6 21 6 3"/>`,
  },
  {
    name: "pause",
    keywords: ['stop'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x="14" y="4" width="4" height="16" rx="1"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x="6" y="4" width="4" height="16" rx="1"/>`,
  },
  {
    name: "shopping-cart",
    keywords: ['cart', 'shop'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="8" cy="21" r="1"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="19" cy="21" r="1"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>`,
  },
  {
    name: "credit-card",
    keywords: ['payment', 'card'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="20" height="14" x="2" y="5" rx="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2 10h20"/>`,
  },
  {
    name: "zap",
    keywords: ['lightning', 'power'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>`,
  },
  {
    name: "shield",
    keywords: ['security', 'protect'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>`,
  },
  {
    name: "lock",
    keywords: ['secure', 'password'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="18" height="11" x="3" y="11" rx="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  },
  {
    name: "unlock",
    keywords: ['open'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="18" height="11" x="3" y="11" rx="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M7 11V7a5 5 0 0 1 9.9-1"/>`,
  },
  {
    name: "message-circle",
    keywords: ['chat', 'comment'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>`,
  },
  {
    name: "send",
    keywords: ['submit'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m21.854 2.147-10.94 10.939"/>`,
  },
  {
    name: "thumbs-up",
    keywords: ['like'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M7 10v12"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>`,
  },
  {
    name: "thumbs-down",
    keywords: ['dislike'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M17 14V2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>`,
  },
  {
    name: "clock",
    keywords: ['time'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="10"/><polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="12 6 12 12 16 14"/>`,
  },
  {
    name: "calendar",
    keywords: ['date', 'event'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8 2v4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 2v4"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="18" height="18" x="3" y="4" rx="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M3 10h18"/>`,
  },
  {
    name: "download",
    keywords: ['save'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="7 10 12 15 17 10"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="12" x2="12" y1="15" y2="3"/>`,
  },
  {
    name: "upload",
    keywords: ['file'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="17 8 12 3 7 8"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="12" x2="12" y1="3" y2="15"/>`,
  },
  {
    name: "share",
    keywords: ['social'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="18" cy="5" r="3"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="6" cy="12" r="3"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="18" cy="19" r="3"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>`,
  },
  {
    name: "instagram",
    keywords: ['ig', 'social'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="20" height="20" x="2" y="2" rx="5"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>`,
  },
  {
    name: "facebook",
    keywords: ['social'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
  },
  {
    name: "twitter",
    keywords: ['x', 'social'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>`,
  },
  {
    name: "youtube",
    keywords: ['video', 'social'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m10 15 5-3-5-3z"/>`,
  },
  {
    name: "whatsapp",
    keywords: ['chat', 'social'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 10c.3 1.5 1.5 3 3 3.5"/>`,
  },
  {
    name: "linkedin",
    keywords: ['social', 'work'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="4" height="12" x="2" y="9"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="4" cy="4" r="2"/>`,
  },
  {
    name: "sparkles",
    keywords: ['magic', 'ai'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M5 3v4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19 17v4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M3 5h4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M17 19h4"/>`,
  },
  {
    name: "briefcase",
    keywords: ['work', 'job'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="20" height="14" x="2" y="6" rx="2"/>`,
  },
  {
    name: "truck",
    keywords: ['shipping', 'delivery'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15 18H9"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="17" cy="18" r="2"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="7" cy="18" r="2"/>`,
  },
  {
    name: "gift",
    keywords: ['present', 'reward'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x="3" y="8" width="18" height="4" rx="1"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 8v13"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>`,
  },
  {
    name: "smile",
    keywords: ['happy', 'emoji'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="10"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8 14s1.5 2 4 2 4-2 4-2"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="9" x2="9.01" y1="9" y2="9"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="15" x2="15.01" y1="9" y2="9"/>`,
  },
  {
    name: "eye",
    keywords: ['view', 'visible'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="3"/>`,
  },
  {
    name: "eye-off",
    keywords: ['hide'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m2 2 20 20"/>`,
  },
  {
    name: "bell",
    keywords: ['notification', 'alert'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,
  },
  {
    name: "bookmark",
    keywords: ['save', 'favorite'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>`,
  },
  {
    name: "flag",
    keywords: ['mark'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="4" x2="4" y1="22" y2="15"/>`,
  },
  {
    name: "filter",
    keywords: ['sort'],
    paths: `<polygon stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>`,
  },
  {
    name: "edit",
    keywords: ['pencil', 'write'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 20h9"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>`,
  },
  {
    name: "trash",
    keywords: ['delete', 'remove'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M3 6h18"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>`,
  },
  {
    name: "copy",
    keywords: ['duplicate'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="14" height="14" x="8" y="8" rx="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>`,
  },
  {
    name: "clipboard",
    keywords: ['paste'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="8" height="4" x="8" y="2" rx="1"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>`,
  },
  {
    name: "file",
    keywords: ['document'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M14 2v4a2 2 0 0 0 2 2h4"/>`,
  },
  {
    name: "folder",
    keywords: ['directory'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`,
  },
  {
    name: "printer",
    keywords: ['print'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x="6" y="14" width="12" height="8" rx="1"/>`,
  },
  {
    name: "wifi",
    keywords: ['internet', 'network'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 20h.01"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2 8.82a15 15 0 0 1 20 0"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M5 12.859a10 10 0 0 1 14 0"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8.5 16.429a5 5 0 0 1 7 0"/>`,
  },
  {
    name: "battery",
    keywords: ['power'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="16" height="10" x="2" y="7" rx="2"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="22" x2="22" y1="11" y2="13"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="6" x2="6" y1="11" y2="13"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="10" x2="10" y1="11" y2="13"/>`,
  },
  {
    name: "sun",
    keywords: ['light', 'day'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 2v2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 20v2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m4.93 4.93 1.41 1.41"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m17.66 17.66 1.41 1.41"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2 12h2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M20 12h2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m6.34 17.66-1.41 1.41"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m19.07 4.93-1.41 1.41"/>`,
  },
  {
    name: "moon",
    keywords: ['dark', 'night'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,
  },
  {
    name: "cloud",
    keywords: ['weather'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>`,
  },
  {
    name: "droplet",
    keywords: ['water'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>`,
  },
  {
    name: "flame",
    keywords: ['fire', 'hot'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,
  },
  {
    name: "leaf",
    keywords: ['nature', 'eco'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>`,
  },
  {
    name: "award",
    keywords: ['badge', 'prize'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="8" r="6"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>`,
  },
  {
    name: "trophy",
    keywords: ['win', 'prize'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4 22h16"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M14 14.66V17c0 .67.43 1.21 1.03 1.21C16.15 18.75 17 20.24 17 22"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>`,
  },
  {
    name: "target",
    keywords: ['goal', 'aim'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="10"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="6"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="2"/>`,
  },
  {
    name: "rocket",
    keywords: ['launch', 'startup'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>`,
  },
  {
    name: "layers",
    keywords: ['stack'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 12.5"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 17.5"/>`,
  },
  {
    name: "layout",
    keywords: ['grid', 'dashboard'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="18" height="18" x="3" y="3" rx="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M3 9h18"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 21V9"/>`,
  },
  {
    name: "grid",
    keywords: ['gallery'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="7" height="7" x="3" y="3" rx="1"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="7" height="7" x="14" y="3" rx="1"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="7" height="7" x="14" y="14" rx="1"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="7" height="7" x="3" y="14" rx="1"/>`,
  },
  {
    name: "list",
    keywords: ['menu', 'items'],
    paths: `<line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="8" x2="21" y1="6" y2="6"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="8" x2="21" y1="12" y2="12"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="8" x2="21" y1="18" y2="18"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="3" x2="3.01" y1="6" y2="6"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="3" x2="3.01" y1="12" y2="12"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="3" x2="3.01" y1="18" y2="18"/>`,
  },
  {
    name: "bar-chart",
    keywords: ['stats', 'analytics'],
    paths: `<line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="12" x2="12" y1="20" y2="10"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="18" x2="18" y1="20" y2="4"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="6" x2="6" y1="20" y2="14"/>`,
  },
  {
    name: "pie-chart",
    keywords: ['stats'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M22 12A10 10 0 0 0 12 2v10z"/>`,
  },
  {
    name: "trending-up",
    keywords: ['growth'],
    paths: `<polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="16 7 22 7 22 13"/>`,
  },
  {
    name: "dollar-sign",
    keywords: ['money', 'price'],
    paths: `<line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="12" x2="12" y1="2" y2="22"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  },
  {
    name: "percent",
    keywords: ['discount', 'sale'],
    paths: `<line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="19" x2="5" y1="5" y2="19"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="6.5" cy="6.5" r="2.5"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="17.5" cy="17.5" r="2.5"/>`,
  },
  {
    name: "tag",
    keywords: ['label', 'price'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="7.5" cy="7.5" r=".5" fill="currentColor"/>`,
  },
  {
    name: "package",
    keywords: ['box', 'product'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 22V12"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m7.5 4.27 9 5.15"/>`,
  },
  {
    name: "store",
    keywords: ['shop'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2 7h20"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>`,
  },
  {
    name: "map",
    keywords: ['location'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619V19a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V5a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15 5.764v15"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 3.236v15"/>`,
  },
  {
    name: "navigation",
    keywords: ['compass', 'direction'],
    paths: `<polygon stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="3 11 22 2 13 21 11 13 3 11"/>`,
  },
  {
    name: "headphones",
    keywords: ['audio', 'support'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>`,
  },
  {
    name: "mic",
    keywords: ['audio', 'record'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19 10v2a7 7 0 0 1-14 0v-2"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="12" x2="12" y1="19" y2="22"/>`,
  },
  {
    name: "volume-2",
    keywords: ['sound'],
    paths: `<polygon stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`,
  },
  {
    name: "music",
    keywords: ['audio', 'song'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 18V5l12-2v13"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="6" cy="18" r="3"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="18" cy="16" r="3"/>`,
  },
  {
    name: "info",
    keywords: ['help', 'about'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="10"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 16v-4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 8h.01"/>`,
  },
  {
    name: "help-circle",
    keywords: ['faq', 'question'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="10"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 17h.01"/>`,
  },
  {
    name: "alert-triangle",
    keywords: ['warning'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 9v4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 17h.01"/>`,
  },
  {
    name: "alert-circle",
    keywords: ['warning', 'error'],
    paths: `<circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="12" r="10"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="12" x2="12" y1="8" y2="12"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="12" x2="12.01" y1="16" y2="16"/>`,
  },
  {
    name: "refresh-cw",
    keywords: ['reload', 'sync'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M21 3v5h-5"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8 16H3v5"/>`,
  },
  {
    name: "loader",
    keywords: ['loading', 'spinner'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 2v4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m16.2 7.8 2.9-2.9"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M18 12h4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m16.2 16.2 2.9 2.9"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 18v4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m4.9 19.1 2.9-2.9"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2 12h4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m4.9 4.9 2.9 2.9"/>`,
  },
  {
    name: "code",
    keywords: ['developer', 'html'],
    paths: `<polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="16 18 22 12 16 6"/><polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="8 6 2 12 8 18"/>`,
  },
  {
    name: "terminal",
    keywords: ['cli', 'code'],
    paths: `<polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="4 17 10 11 4 5"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="12" x2="20" y1="19" y2="19"/>`,
  },
  {
    name: "cpu",
    keywords: ['tech', 'chip'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x="4" y="4" width="16" height="16" rx="2"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x="9" y="9" width="6" height="6"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15 2v2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15 20v2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2 15h2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M2 9h2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M20 15h2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M20 9h2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 2v2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 20v2"/>`,
  },
  {
    name: "database",
    keywords: ['data', 'storage'],
    paths: `<ellipse stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="12" cy="5" rx="9" ry="3"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M3 5V19A9 3 0 0 0 21 19V5"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M3 12A9 3 0 0 0 21 12"/>`,
  },
  {
    name: "server",
    keywords: ['hosting'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="20" height="8" x="2" y="2" rx="2"/><rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="20" height="8" x="2" y="14" rx="2"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="6" x2="6.01" y1="6" y2="6"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="6" x2="6.01" y1="18" y2="18"/>`,
  },
  {
    name: "cloud-upload",
    keywords: ['upload', 'backup'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 13v8"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m8 17 4-4 4 4"/>`,
  },
  {
    name: "log-in",
    keywords: ['signin'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="10 17 15 12 10 7"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="15" x2="3" y1="12" y2="12"/>`,
  },
  {
    name: "log-out",
    keywords: ['signout'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" points="16 17 21 12 16 7"/><line stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" x1="21" x2="9" y1="12" y2="12"/>`,
  },
  {
    name: "key",
    keywords: ['password', 'access'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="m21 2-9.6 9.6"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="7.5" cy="15.5" r="5.5"/>`,
  },
  {
    name: "building",
    keywords: ['office', 'company'],
    paths: `<rect stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" width="16" height="20" x="4" y="2" rx="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 22v-4h6v4"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8 6h.01"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 6h.01"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 6h.01"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 10h.01"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M12 14h.01"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 10h.01"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 14h.01"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8 10h.01"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M8 14h.01"/>`,
  },
  {
    name: "coffee",
    keywords: ['cafe', 'drink'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M10 2v2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M14 2v2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M6 2v2"/>`,
  },
  {
    name: "utensils",
    keywords: ['food', 'restaurant'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M7 2v20"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>`,
  },
  {
    name: "car",
    keywords: ['auto', 'vehicle'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="7" cy="17" r="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M9 17h6"/><circle stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" cx="17" cy="17" r="2"/>`,
  },
  {
    name: "plane",
    keywords: ['flight', 'travel'],
    paths: `<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>`,
  }
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

export function listIconNames(): string[] {
  return ICONS.map((i) => i.name);
}
