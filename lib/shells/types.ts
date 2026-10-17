/** Shared content contract filled by AI; each shell renders differently. */

export type ShellTheme = {
  ink: string;
  ink2: string;
  surface: string;
  line: string;
  text: string;
  muted: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
  onAccent: string;
  mode: "dark" | "light";
  fontDisplay: string;
  fontBody: string;
  googleFontsHref: string;
  radius: string;
  radiusLg: string;
};

export type ShellService = {
  tag: string;
  title: string;
  body: string;
  image: string;
};

export type ShellContent = {
  brand: string;
  logoUrl: string;
  kicker: string;
  headlineLine1: string;
  headlineLine2: string;
  lead: string;
  primaryCta: string;
  secondaryCta: string;
  metrics: { value: string; label: string }[];
  marquee: string[];
  services: ShellService[];
  aboutTitle: string;
  aboutParagraphs: string[];
  aboutList: string[];
  aboutImage: string;
  gallery: { src: string; alt: string }[];
  quotes: { text: string; author: string }[];
  ctaTitle: string;
  ctaBody: string;
  footerBlurb: string;
  nav: { href: string; label: string }[];
  waNumber: string;
  theme: ShellTheme;
};

export type ShellRenderer = (c: ShellContent) => Record<string, string>;

export const esc = (s: string) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
