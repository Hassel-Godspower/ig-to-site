import { resolveOpulentDirection } from "./opulentDirection";
import { normalizeSitePlan, defaultPlanForNiche, type SitePlan } from "./sitePlan";
import { resolveTemplateFamily, type FamilyPage, type TemplateFamily } from "./templateFamilies";
import { assembleHomeMain, assembleServicesBody, assembleListingBody } from "./siteBlocks";
import { assembleCartPageBody, buildBookingCatalogJson, BOOKING_CART_CSS } from "./bookingPages";
import {
  assembleCommerceCartBody,
  assembleCommerceCheckoutBody,
  productsScriptTag,
  AURELIA_CART_CSS,
} from "./commercePages";
import type { CatalogItem, CatalogSeed } from "./extractCatalog";
import { COMMERCE_BOOKING_RUNTIME, ensureCommerceRuntime } from "./staticCommerceRuntime";
import { catalogFromTitles, isShoppableFamily, modeForFamily } from "./extractCatalog";
/**
 * Deterministic premium shell (craft: ifitnessng.pages.dev).
 */
export type ShellTheme = {
  ink: string; ink2: string; surface: string; line: string;
  text: string; muted: string; accent: string; accentDim: string;
  accentGlow: string; onAccent: string; mode: "dark" | "light";
  fontDisplay: string;
  fontBody: string;
  googleFontsHref: string;
  radius: string;
  radiusLg: string;
};
export type ShellService = { tag: string; title: string; body: string; image: string };
export type ShellLayout = "opulent" | "performance" | "authority";

export type ShellContent = {
  brand: string; logoUrl: string; kicker: string;
  headlineLine1: string; headlineLine2: string; lead: string;
  primaryCta: string; secondaryCta: string;
  metrics: { value: string; label: string }[];
  marquee: string[]; services: ShellService[];
  aboutTitle: string; aboutParagraphs: string[]; aboutList: string[]; aboutImage: string;
  gallery: { src: string; alt: string }[];
  quotes: { text: string; author: string }[];
  ctaTitle: string; ctaBody: string; footerBlurb: string;
  nav: { href: string; label: string }[];
  waNumber: string; theme: ShellTheme;
  /** @deprecated use plan — kept for compat */
  layout?: ShellLayout;
  /** AI + niche composition plan */
  plan: SitePlan;
  /** Structured sellable / bookable items */
  products: CatalogItem[];
  shoppable: boolean;
  cartMode: "commerce" | "booking" | "brochure";
  cartAddLabel: string;
  cartCheckoutLabel: string;
};
const E = (s: string) =>
  String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

export function themeForNiche(nicheId: string, brandPrimary?: string): ShellTheme {
  const o = resolveOpulentDirection(nicheId || "general_business");
  const accent =
    brandPrimary && /^#[0-9a-fA-F]{6}$/.test(brandPrimary) ? brandPrimary : o.accent;
  return {
    ink: o.ink,
    ink2: o.ink2,
    surface: o.surface,
    line: o.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(40,30,20,0.12)",
    text: o.text,
    muted: o.muted,
    accent,
    accentDim: `${accent}26`,
    accentGlow: `${accent}59`,
    onAccent: o.onAccent,
    mode: o.mode,
    fontDisplay: o.fontDisplay,
    fontBody: o.fontBody,
    googleFontsHref: o.googleFontsHref,
    radius: o.radius,
    radiusLg: o.radiusLg,
  };
}


export function layoutForNiche(nicheId: string): ShellLayout {
  const o = resolveOpulentDirection(nicheId || "general_business");
  const a = o.archetype;
  if (
    a === "athletic_edge" ||
    a === "technical_opulence" ||
    a === "product_clarity" ||
    a === "editorial_craft"
  ) {
    return "performance";
  }
  if (a === "quiet_authority" || a === "clinical_precision") {
    return "authority";
  }
  // exotic_sanctuary, sensorial_indulgence, modern_heritage, warm_institution
  return "opulent";
}

export function shellCss(theme: ShellTheme): string {
  const t = theme; const d = t.mode === "dark";
  return `/* goke shell — multi-family */
:root{--ink:${t.ink};--ink-2:${t.ink2};--surface:${t.surface};--line:${t.line};--text:${t.text};--muted:${t.muted};--accent:${t.accent};--accent-dim:${t.accentDim};--accent-glow:${t.accentGlow};--on-accent:${t.onAccent};--radius:${t.radius};--radius-lg:${t.radiusLg};--max:1180px;--font-display:${t.fontDisplay};--font-body:${t.fontBody}}
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{font-family:var(--font-body);background:var(--ink);color:var(--text);line-height:1.65;min-height:100vh;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block;height:auto}a{color:inherit;text-decoration:none}ul{list-style:none}
h1,h2,h3{font-family:var(--font-display);font-weight:600;line-height:1.12;letter-spacing:-.02em}
.site-header{position:fixed;top:0;left:0;right:0;z-index:100;border-bottom:1px solid transparent;transition:background .3s,border-color .3s,backdrop-filter .3s}
.site-header.is-scrolled{background:${d?"rgba(7,9,15,.88)":"rgba(247,243,239,.92)"};backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom-color:var(--line)}
.nav-bar{max-width:var(--max);margin:0 auto;padding:1rem 1.35rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:inline-flex;align-items:center;gap:.55rem;font-family:var(--font-display);font-weight:700;font-size:1.25rem;letter-spacing:-.02em}
.brand img{height:36px;width:auto;max-width:120px;object-fit:contain;border-radius:8px}
.desktop-nav{display:none;gap:1.75rem;align-items:center}.desktop-nav a{font-size:.88rem;color:var(--muted);font-weight:500;transition:color .2s}
.desktop-nav a:hover,.desktop-nav a[aria-current="page"]{color:var(--text)}
.header-ctas{display:none}.nav-toggle{width:44px;height:44px;border:1px solid var(--line);border-radius:12px;background:transparent;display:grid;place-items:center;gap:5px;cursor:pointer}
.nav-toggle span{display:block;width:18px;height:2px;background:var(--text);border-radius:2px}
.mobile-nav{display:none;flex-direction:column;gap:1rem;padding:1rem 1.35rem 1.5rem;background:var(--ink-2);border-bottom:1px solid var(--line)}
.mobile-nav:not([hidden]){display:flex}.mobile-nav a{font-size:1rem;color:var(--muted)}.mobile-nav a.cta{color:var(--on-accent);background:var(--accent);padding:.85rem 1.2rem;border-radius:999px;text-align:center;font-weight:600}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;padding:.9rem 1.5rem;border-radius:999px;font-weight:600;font-size:.82rem;letter-spacing:.04em;border:1px solid transparent;cursor:pointer;transition:transform .2s,background .2s,border-color .2s,color .2s}
.btn-primary{background:var(--accent);color:var(--on-accent)}.btn-primary:hover{filter:brightness(1.06);transform:translateY(-1px)}
.btn-ghost{background:transparent;color:var(--text);border-color:var(--line)}.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
.btn-sm{padding:.55rem 1rem;font-size:.78rem}
.btn-outline{background:transparent;border-color:var(--accent);color:var(--accent)}.btn-outline:hover{background:var(--accent);color:var(--on-accent)}

/* ── Performance hero (asymmetric) ── */
.hero{display:grid;gap:0;min-height:88vh;padding-top:72px}
.hero-visual{position:relative;min-height:42vh;background:var(--ink-2)}.hero-visual img{width:100%;height:100%;object-fit:cover;min-height:42vh}
.hero-visual::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,var(--ink) 0%,transparent 55%)}
.hero-body{padding:2rem 1.35rem 3rem;max-width:var(--max);margin:0 auto;width:100%}
.hero-kicker{font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem}
.hero h1{font-size:clamp(2.4rem,7vw,4.2rem);margin-bottom:1rem}
.hero h1 .line2{color:var(--accent)}
.hero-lead{color:var(--muted);font-size:1.05rem;max-width:36ch;margin-bottom:1.75rem;line-height:1.7}
.hero-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:2rem}
.hero-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;padding-top:1.5rem;border-top:1px solid var(--line)}
.hero-metrics strong{display:block;font-family:var(--font-display);font-size:1.75rem}.hero-metrics span{font-size:.72rem;color:var(--muted);text-transform:uppercase;font-weight:600}

/* ── Opulent hero (full-bleed cinematic) ── */
.hero-bleed{position:relative;min-height:100vh;display:flex;align-items:flex-end;padding:0;overflow:hidden}
.hero-bleed .hero-media{position:absolute;inset:0;z-index:0}
.hero-bleed .hero-media img{width:100%;height:100%;object-fit:cover}
.hero-bleed .hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,.55) 40%,var(--ink) 100%)}
.hero-bleed .hero-content{position:relative;z-index:2;max-width:var(--max);margin:0 auto;padding:7rem 1.35rem 4rem;width:100%}
.hero-bleed .eyebrow{font-size:.75rem;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);margin-bottom:1.25rem;font-weight:500}
.hero-bleed h1{font-size:clamp(2.6rem,6.5vw,4.5rem);font-weight:400;max-width:14ch;margin-bottom:1.25rem;line-height:1.08}
.hero-bleed .hero-lead{max-width:38ch;font-size:1.08rem;color:var(--text);opacity:.88;margin-bottom:2rem}
.hero-bleed .hero-actions{margin-bottom:0}

/* ── Authority hero ── */
.hero-authority{padding:8rem 1.35rem 4rem;max-width:var(--max);margin:0 auto}
.hero-authority .eyebrow{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:1.25rem}
.hero-authority h1{font-size:clamp(2.5rem,5.5vw,3.8rem);max-width:16ch;margin-bottom:1.25rem}
.hero-authority .hero-lead{max-width:42ch;color:var(--muted);margin-bottom:2rem}
.hero-authority-grid{display:grid;gap:2rem;align-items:center}
@media(min-width:900px){.hero-authority-grid{grid-template-columns:1.1fr .9fr}.hero{grid-template-columns:1fr 1fr;align-items:stretch;min-height:100vh;padding-top:0}.hero-visual{min-height:100vh}.hero-visual img{min-height:100vh}.hero-body{display:flex;flex-direction:column;justify-content:center;padding:6rem 2rem}}

.section{padding:4.5rem 1.35rem}.section-inner{max-width:var(--max);margin:0 auto}
.section-label{font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:.75rem}
.section-title{font-size:clamp(1.75rem,3.5vw,2.6rem);margin-bottom:1rem}
.section-copy{color:var(--muted);max-width:42ch;margin-bottom:2rem;line-height:1.7}

/* Bento (performance) */
.bento{display:grid;gap:1rem}
.bento-card{position:relative;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line);background:var(--surface);min-height:280px;display:flex;flex-direction:column;justify-content:flex-end}
.bento-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45}
.bento-card .body{position:relative;z-index:1;padding:1.5rem;background:linear-gradient(transparent,${d?"rgba(7,9,15,.92)":"rgba(255,255,255,.95)"} 40%)}
.bento-card .tag{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--on-accent);background:var(--accent);padding:.25rem .55rem;border-radius:6px;margin-bottom:.65rem}
.bento-card h3{font-size:1.45rem;margin-bottom:.35rem}.bento-card p{color:var(--muted);font-size:.92rem;margin-bottom:1rem}

/* Opulent service cards */
.svc-grid{display:grid;gap:1.25rem}
.svc-card{border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;background:var(--surface);display:flex;flex-direction:column}
.svc-card img{aspect-ratio:16/10;object-fit:cover;width:100%}
.svc-card .body{padding:1.35rem 1.4rem 1.5rem}
.svc-card .tag{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:.5rem}
.svc-card h3{font-size:1.35rem;font-weight:500;margin-bottom:.45rem}
.svc-card p{color:var(--muted);font-size:.92rem;margin:0}

/* Authority list services */
.svc-list{display:grid;gap:0;border-top:1px solid var(--line)}
.svc-list article{display:grid;gap:.35rem;padding:1.5rem 0;border-bottom:1px solid var(--line)}
@media(min-width:700px){.svc-list article{grid-template-columns:120px 1fr auto;align-items:center;gap:1.5rem}}
.svc-list .tag{font-family:var(--font-display);font-size:1.25rem;color:var(--accent)}
.svc-list h3{font-size:1.2rem;margin:0}.svc-list p{color:var(--muted);margin:0;font-size:.92rem}

.marquee-wrap{overflow:hidden;border-block:1px solid var(--line);background:var(--ink-2);padding:1rem 0}
.marquee{display:flex;gap:2.5rem;width:max-content;animation:scroll 28s linear infinite;font-family:var(--font-display);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.marquee em{font-style:normal;color:var(--accent)}@keyframes scroll{to{transform:translateX(-50%)}}

.split{display:grid;gap:2rem;align-items:center}.split-media{border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line);aspect-ratio:5/4}.split-media img{width:100%;height:100%;object-fit:cover}
.split-copy p{color:var(--muted);margin-bottom:1rem}.list-check li{position:relative;padding-left:1.5rem;margin-bottom:.55rem}.list-check li::before{content:"→";position:absolute;left:0;color:var(--accent);font-weight:700}

.numbers{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.num-card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:1.25rem;text-align:center}
.num-card strong{display:block;font-family:var(--font-display);font-size:1.85rem;margin-bottom:.25rem}.num-card span{font-size:.78rem;color:var(--muted)}

.mosaic{display:grid;gap:.75rem;grid-template-columns:1fr 1fr}.mosaic figure{border-radius:var(--radius);overflow:hidden;border:1px solid var(--line);aspect-ratio:1}
.mosaic figure:first-child{grid-column:1/-1;aspect-ratio:16/9}.mosaic img{width:100%;height:100%;object-fit:cover}

.quotes{display:grid;gap:1rem}.quote{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);padding:1.75rem}
.quote p{font-size:1.15rem;font-family:var(--font-display);margin-bottom:1.25rem}.quote footer{color:var(--muted);font-size:.88rem}

.cta-panel{border-radius:var(--radius-lg);border:1px solid var(--line);background:radial-gradient(ellipse at 20% 50%,var(--accent-dim),transparent 55%),var(--surface);padding:3rem 1.75rem;text-align:center}
.cta-panel h2{font-size:clamp(1.85rem,4vw,2.75rem);margin-bottom:.75rem}.cta-panel p{color:var(--muted);margin:0 auto 1.5rem;max-width:40ch}

.cta-band{padding:4rem 1.35rem;border-block:1px solid var(--line);background:var(--ink-2);text-align:center}
.cta-band h2{font-size:clamp(1.75rem,3.5vw,2.4rem);margin-bottom:.75rem}.cta-band p{color:var(--muted);margin:0 auto 1.5rem;max-width:40ch}

.page-top{padding:8rem 1.35rem 3rem;border-bottom:1px solid var(--line)}.page-top h1{font-size:clamp(2.4rem,6vw,4rem);margin-bottom:.75rem}.page-top p{color:var(--muted);max-width:40ch}
.contact-layout{display:grid;gap:1.5rem}.panel{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);padding:1.75rem}
.field{margin-bottom:1rem}.field label{display:block;font-size:.78rem;font-weight:600;color:var(--muted);margin-bottom:.4rem;text-transform:uppercase;letter-spacing:.06em}
input,textarea{width:100%;padding:.9rem 1rem;border-radius:12px;border:1px solid var(--line);background:var(--ink);color:var(--text);font:inherit}textarea{min-height:120px;resize:vertical}

.site-footer{border-top:1px solid var(--line);padding:3rem 1.35rem 5.5rem;background:${d?"#05060a":"#ebe4dc"}}
.footer-grid{max-width:var(--max);margin:0 auto 2rem;display:grid;gap:2rem}.footer-grid p{color:var(--muted);font-size:.92rem;max-width:28ch}
.footer-col h4{font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem}.footer-col a{display:block;color:var(--text);padding:.3rem 0;font-size:.92rem;opacity:.85}.footer-col a:hover{opacity:1;color:var(--accent)}
.footer-bottom{max-width:var(--max);margin:0 auto;padding-top:1.5rem;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;font-size:.8rem;color:var(--muted)}
.mobile-tabbar{display:none}
.reveal{opacity:0;transform:translateY(28px);transition:.7s ease}.reveal.is-visible{opacity:1;transform:none}

@media(min-width:700px){.svc-grid{grid-template-columns:1fr 1fr}.numbers{grid-template-columns:repeat(4,1fr)}.quotes{grid-template-columns:1fr 1fr}}
@media(min-width:900px){
  .desktop-nav,.header-ctas{display:flex}.nav-toggle{display:none}
  .bento{grid-template-columns:1fr 1fr}.bento-card:first-child{grid-row:span 2;min-height:100%}
  .split{grid-template-columns:1fr 1fr}.footer-grid{grid-template-columns:1.4fr 1fr 1fr}
  .contact-layout{grid-template-columns:1.1fr .9fr}.svc-grid{grid-template-columns:1fr 1fr 1fr}
}
@media(max-width:899px){
  body{padding-bottom:calc(64px + env(safe-area-inset-bottom,0px))}
  .mobile-tabbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:90;background:${d?"rgba(7,9,15,.94)":"rgba(255,255,255,.94)"};backdrop-filter:blur(12px);border-top:1px solid var(--line);padding:.35rem .5rem calc(.35rem + env(safe-area-inset-bottom,0px));justify-content:space-around}
  .mobile-tabbar a{flex:1;text-align:center;font-size:.65rem;color:var(--muted);padding:.4rem .2rem;font-weight:600}
  .mobile-tabbar a[aria-current="page"]{color:var(--accent)}
}
`;
}

export function shellJs(): string {
  return `document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("[data-year]").forEach(el=>{el.textContent=String(new Date().getFullYear())});const header=document.querySelector(".site-header");if(header){const s=()=>header.classList.toggle("is-scrolled",window.scrollY>16);s();window.addEventListener("scroll",s,{passive:true})}const toggle=document.querySelector(".nav-toggle"),mobile=document.getElementById("mobileNav");if(toggle&&mobile){toggle.addEventListener("click",()=>{const o=mobile.classList.contains("is-open");if(o){mobile.classList.remove("is-open");mobile.setAttribute("hidden","");toggle.setAttribute("aria-expanded","false")}else{mobile.classList.add("is-open");mobile.removeAttribute("hidden");toggle.setAttribute("aria-expanded","true")}});mobile.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{if(window.innerWidth<900){mobile.classList.remove("is-open");mobile.setAttribute("hidden","");toggle.setAttribute("aria-expanded","false")}}))}const reveals=document.querySelectorAll(".reveal");if("IntersectionObserver" in window){const io=new IntersectionObserver((ents,obs)=>{ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");obs.unobserve(e.target)}})},{threshold:.12});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add("is-visible"));const form=document.getElementById("contact-form");if(form){form.addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(form);const lines=[];["name","email","message"].forEach(k=>{const v=fd.get(k);if(v)lines.push(k[0].toUpperCase()+k.slice(1)+": "+v)});const text=lines.join("\\n")||"Hello";const num=String(document.body.getAttribute("data-wa")||"").replace(/\\D/g,"");if(!num){alert("Thanks.");return}window.open("https://wa.me/"+num+"?text="+encodeURIComponent(text),"_blank","noopener")})}});`;
}

function head(title: string, desc: string, fontsHref?: string) {
  const fonts = fontsHref || "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${E(title)}</title><meta name="description" content="${E(desc)}"/><meta property="og:title" content="${E(title)}"/><meta property="og:description" content="${E(desc)}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${fonts}" rel="stylesheet"/>
<link rel="stylesheet" href="styles.css"/><script src="script.js" defer></script></head>`;
}
function chrome(c: ShellContent, cur: string) {
  const nav = c.nav
    .map((n) => {
      const badge =
        n.href === "cart.html"
          ? '<span class="goke-cart-badge goke-cart-count" style="display:none">0</span>'
          : "";
      return `<a href="${n.href}" class="${n.href === "cart.html" ? "goke-nav-cart" : ""}"${n.href === cur ? ' aria-current="page"' : ""}>${E(n.label)}${badge}</a>`;
    })
    .join("");
  const logo = c.logoUrl ? `<img src="${E(c.logoUrl)}" alt="${E(c.brand)}" width="40" height="40"/>` : "";
  const header = `<header class="site-header"><div class="nav-bar"><a href="index.html" class="brand" id="site-title" data-goke="link">${logo}<span>${E(c.brand)}</span></a>
<button type="button" class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mobileNav"><span></span><span></span><span></span></button>
<nav class="desktop-nav site-nav" id="site-nav" data-goke="nav" aria-label="Main">${nav}</nav>
<div class="header-ctas">${c.shoppable ? `<a href="cart.html" class="btn btn-ghost btn-sm goke-nav-cart" data-goke="button">${c.cartMode === "booking" ? "Booking" : "Cart"}<span class="goke-cart-badge goke-cart-count" style="display:none">0</span></a>` : ""}<a href="${c.shoppable ? "cart.html" : "contact.html"}" class="btn btn-primary btn-sm" data-goke="button">${E(c.primaryCta)}</a></div>
<div class="mobile-nav" id="mobileNav" hidden>${nav}<a href="contact.html" class="cta">${E(c.primaryCta)}</a></div></div></header>`;
  const footer = `<footer class="site-footer"><div class="footer-grid"><div><a href="index.html" class="brand">${logo}<span>${E(c.brand)}</span></a><p>${E(c.footerBlurb)}</p></div>
<div class="footer-col"><h4>Explore</h4>${c.nav.map((n) => `<a href="${n.href}">${E(n.label)}</a>`).join("")}</div>
<div class="footer-col"><h4>Contact</h4><a href="contact.html">${E(c.primaryCta)}</a></div></div>
<div class="footer-bottom"><span>© <span data-year></span> ${E(c.brand)}</span><span>Built with gòke</span></div></footer>`;
  const tabbar = `<nav class="mobile-tabbar" aria-label="Mobile"><a href="index.html"${cur === "index.html" ? ' aria-current="page"' : ""}>Home</a><a href="services.html"${cur === "services.html" ? ' aria-current="page"' : ""}>Services</a><a href="gallery.html"${cur === "gallery.html" ? ' aria-current="page"' : ""}>Gallery</a><a href="contact.html"${cur === "contact.html" ? ' aria-current="page"' : ""}>Contact</a></nav>`;
  return { header, footer, tabbar };
}

export function contentFromProfile(
  profile: { name?: string; username?: string; bio?: string; profilePic?: string },
  opts: { waNumber?: string | null; galleryUrls: string[]; titles: string[]; nicheId: string; primaryCta?: string; brandPrimary?: string; products?: CatalogItem[] }
): ShellContent {
  const brand = profile.name || profile.username || "Business";
  const bio = (profile.bio || "").trim();
  const imgs = [...opts.galleryUrls.filter(Boolean)];
  while (imgs.length < 6) imgs.push("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80");
  const titles = opts.titles.length ? opts.titles : ["Signature offer", "Core service", "Premium experience", "Consult"];
  const services = titles.slice(0, 4).map((title, i) => ({
    tag: `0${i + 1}`,
    title: title.slice(0, 48),
    body: bio ? bio.slice(0, 120) : "Crafted for clients who want clarity, quality, and a clear next step.",
    image: imgs[i % imgs.length],
  }));
  const plan = defaultPlanForNiche(opts.nicheId);
  const family = resolveTemplateFamily(opts.nicheId);
  const shoppable = isShoppableFamily(family.id);
  const cartMode = modeForFamily(family.id);
  const products: CatalogItem[] = (opts as { products?: CatalogItem[] }).products?.length
    ? (opts as { products: CatalogItem[] }).products
    : catalogFromTitles(titles, imgs, family.id);
  const cartAddLabel =
    cartMode === "booking" ? "Add to booking" : cartMode === "commerce" ? "Add to cart" : "Select";
  const cartCheckoutLabel =
    cartMode === "booking" ? "Book on WhatsApp" : "Checkout on WhatsApp";
  return {
    brand,
    logoUrl: profile.profilePic || "",
    kicker: brand,
    headlineLine1: brand.split(" ")[0] || brand,
    headlineLine2: "crafted with intention.",
    lead: bio.slice(0, 200) || `${brand} is built for clients who value clarity, craft, and a composed experience — from first look to final contact.`,
    primaryCta: opts.primaryCta || family.primaryCtaDefault,
    secondaryCta: "Explore",
    metrics: [
      { value: "01", label: "Discover" },
      { value: "02", label: "Experience" },
      { value: "03", label: "Connect" },
    ],
    marquee: titles.slice(0, 5).map((x) => x.slice(0, 32)),
    services,
    aboutTitle: `Why ${brand}`,
    aboutParagraphs: [bio.slice(0, 280) || `${brand} is built around trust, clarity, and results.`],
    aboutList: titles.slice(0, 4).map((t) => t.slice(0, 60)),
    aboutImage: imgs[1] || imgs[0],
    gallery: imgs.slice(0, 6).map((src, i) => ({ src, alt: titles[i] || brand })),
    quotes: bio ? [{ text: bio.slice(0, 140), author: brand }] : [],
    ctaTitle: "Ready when you are",
    ctaBody: `Message ${brand} — we respond on WhatsApp.`,
    footerBlurb: bio.slice(0, 120) || `${brand} on the open web.`,
    nav: plan.nav,
    waNumber: opts.waNumber || "",
    theme: themeForNiche(opts.nicheId, opts.brandPrimary),
    layout: layoutForNiche(opts.nicheId),
    plan,
    products,
    shoppable,
    cartMode,
    cartAddLabel,
    cartCheckoutLabel,
  };
}

export function parseShellContentJson(
  raw: string,
  fallback: ShellContent,
  nicheId?: string
): ShellContent {
  try {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return fallback;
    const j = JSON.parse(m[0]) as Partial<ShellContent> & { plan?: Partial<SitePlan> };
    const plan = normalizeSitePlan(
      j.plan ? { ...fallback.plan, ...j.plan } : fallback.plan,
      nicheId || "general_business"
    );
    const nav = plan.nav?.length ? plan.nav : fallback.nav;
    return {
      ...fallback,
      ...j,
      metrics: j.metrics?.length ? j.metrics : fallback.metrics,
      services: j.services?.length ? j.services : fallback.services,
      gallery: j.gallery?.length ? j.gallery : fallback.gallery,
      marquee: j.marquee?.length ? j.marquee : fallback.marquee,
      aboutParagraphs: j.aboutParagraphs?.length ? j.aboutParagraphs : fallback.aboutParagraphs,
      aboutList: j.aboutList?.length ? j.aboutList : fallback.aboutList,
      quotes: j.quotes ?? fallback.quotes,
      nav,
      theme: fallback.theme,
      layout: fallback.layout,
      plan,
      waNumber: fallback.waNumber,
      logoUrl: (j as { logoUrl?: string }).logoUrl || fallback.logoUrl,
      brand: (j as { brand?: string }).brand || fallback.brand,
      products: (j as { products?: CatalogItem[] }).products?.length
        ? (j as { products: CatalogItem[] }).products
        : fallback.products,
      shoppable: fallback.shoppable,
      cartMode: fallback.cartMode,
      cartAddLabel: fallback.cartAddLabel,
      cartCheckoutLabel: fallback.cartCheckoutLabel,
    };
  } catch {
    return fallback;
  }
}

export function renderShellSite(
  c: ShellContent,
  nicheId?: string
): Record<string, string> {
  const desc = c.lead.slice(0, 160);
  const family = resolveTemplateFamily(nicheId || "general_business");
  const plan = c.plan || defaultPlanForNiche(nicheId || family.id);
  // Prefer family nav (unique IA) when plan nav is generic 5-page
  // Family owns multi-page IA (clinic doctors, estate properties, etc.)
  let nav = family.pages.map((p) => ({ href: p.file, label: p.title }));

  // Ensure cart/booking page in nav when shoppable (use `c` — content not declared yet)
  if (c.shoppable && !nav.some((n) => n.href === "cart.html")) {
    const label = c.cartMode === "booking" ? "Booking" : "Cart";
    const contactIdx = nav.findIndex((n) => n.href === "contact.html");
    const entry = { href: "cart.html", label };
    if (contactIdx >= 0) nav.splice(contactIdx, 0, entry);
    else nav.push(entry);
  }
  if (
    c.shoppable &&
    c.cartMode === "commerce" &&
    !nav.some((n) => n.href === "checkout.html")
  ) {
    /* checkout reachable from cart; optional in nav */
  }

  const content: ShellContent = {
    ...c,
    nav,
    plan: { ...plan, nav },
    primaryCta: c.primaryCta || family.primaryCtaDefault,
  };
  const ch = chrome(content, "index.html");

  const aboutPs = content.aboutParagraphs.map((p) => `<p data-goke="text">${E(p)}</p>`).join("");
  const aboutLi = content.aboutList.map((x) => `<li data-goke="text">${E(x)}</li>`).join("");
  const mosaic = content.gallery
    .slice(0, 6)
    .map(
      (g) =>
        `<figure data-goke="container"><img src="${E(g.src)}" alt="${E(g.alt)}" loading="lazy" data-goke="image"/></figure>`
    )
    .join("");

  const pageShell = (file: string, title: string, body: string) => {
    const x = chrome(content, file);
    return `${head(title + " · " + content.brand, desc, content.theme.googleFontsHref)}<body data-wa="${E(content.waNumber)}" data-goke-cart-mode="${E(content.cartMode || "commerce")}">${x.header}<main><section class="page-top"><div class="section-inner"><h1 data-goke="heading">${E(title)}</h1><p data-goke="text">${E(content.lead)}</p></div></section>${body}</main>${x.footer}${x.tabbar}</body></html>`;
  };

  const aboutBody = `<section class="section" data-goke="section" data-section-name="about"><div class="section-inner split"><div class="split-media"><img src="${E(content.aboutImage)}" alt="" data-goke="image"/></div><div class="split-copy"><h2 data-goke="heading">${E(content.aboutTitle)}</h2>${aboutPs}<ul class="list-check">${aboutLi}</ul></div></div></section>`;
  const servicesBody = assembleServicesBody(plan, content);
  const galleryBody = `<section class="section" data-goke="section" data-section-name="gallery"><div class="section-inner"><div class="mosaic">${mosaic}</div></div></section>`;
  const contactBody = `<section class="section" data-goke="section" data-section-name="contact"><div class="section-inner contact-layout"><div class="panel"><h2 style="margin-bottom:1rem" data-goke="heading">${E(content.ctaTitle)}</h2><p style="color:var(--muted);margin-bottom:1.5rem" data-goke="text">${E(content.ctaBody)}</p><form id="contact-form"><div class="field"><label for="name">Name</label><input id="name" name="name" required data-goke="text"/></div><div class="field"><label for="email">Email</label><input id="email" name="email" type="email"/></div><div class="field"><label for="message">Message</label><textarea id="message" name="message" required></textarea></div><button type="submit" class="btn btn-primary" data-goke="button">Send via WhatsApp</button></form></div><div class="panel"><h3 data-goke="heading">${E(content.brand)}</h3><p style="color:var(--muted)" data-goke="text">${E(content.footerBlurb)}</p></div></div></section>`;
  const listingBody = `<section class="section" data-goke="section" data-section-name="listing"><div class="section-inner"><p class="section-label" data-goke="text">${E(family.label)}</p><h2 class="section-title" data-goke="heading">Browse</h2><div class="svc-grid">${content.services
    .map(
      (s) =>
        `<article class="svc-card reveal" data-goke="container"><img src="${E(s.image)}" alt="${E(s.title)}" loading="lazy" data-goke="image"/><div class="body"><p class="tag" data-goke="text">${E(s.tag)}</p><h3 data-goke="heading">${E(s.title)}</h3><p data-goke="text">${E(s.body)}</p><a href="contact.html" class="btn btn-ghost btn-sm" data-goke="button">${E(content.primaryCta)}</a></div></article>`
    )
    .join("")}</div></div></section>`;
  const teamBody = `<section class="section" data-goke="section" data-section-name="team"><div class="section-inner"><p class="section-label" data-goke="text">People</p><h2 class="section-title" data-goke="heading">The team</h2><div class="svc-grid">${content.services
    .slice(0, 4)
    .map(
      (s, i) =>
        `<article class="svc-card reveal" data-goke="container"><img src="${E(content.gallery[i % content.gallery.length]?.src || s.image)}" alt="${E(s.title)}" loading="lazy" data-goke="image"/><div class="body"><h3 data-goke="heading">${E(s.title)}</h3><p data-goke="text">${E(s.body)}</p></div></article>`
    )
    .join("")}</div></div></section>`;
  const bookingBody = contactBody.replace(
    'data-section-name="contact"',
    'data-section-name="booking"'
  );
  const proofBody = `<section class="section" data-goke="section" data-section-name="proof"><div class="section-inner"><p class="section-label" data-goke="text">Proof</p><h2 class="section-title" data-goke="heading">Results &amp; notes</h2><div class="quotes">${content.quotes.length ? content.quotes.map((q) => `<blockquote class="quote"><p data-goke="text">${E(q.text)}</p><footer data-goke="text">— ${E(q.author)}</footer></blockquote>`).join("") : content.aboutParagraphs.map((p) => `<blockquote class="quote"><p data-goke="text">${E(p)}</p></blockquote>`).join("")}</div><div class="numbers" style="margin-top:2rem">${content.metrics.map((m) => `<div class="num-card"><strong data-goke="text">${E(m.value)}</strong><span data-goke="text">${E(m.label)}</span></div>`).join("")}</div></div></section>`;

  const files: Record<string, string> = {};
  const indexMain = assembleHomeMain(plan, content);
  files["index.html"] =
    `${head(content.brand + " — " + content.kicker, desc, content.theme.googleFontsHref)}<body data-wa="${E(content.waNumber)}" data-goke-cart-mode="${E(content.cartMode || "commerce")}">${ch.header}<main>${indexMain}</main>${ch.footer}${ch.tabbar}</body></html>`;

  const pages: FamilyPage[] = family.pages;
  for (const p of pages) {
    if (p.file === "index.html") continue;
    let body = aboutBody;
    if (p.role === "about") body = aboutBody;
    else if (p.role === "services") body = content.shoppable ? assembleListingBody(content, p.title) : servicesBody;
    else if (p.role === "gallery") body = galleryBody;
    else if (p.role === "contact") body = contactBody;
    else if (p.role === "listing") body = assembleListingBody(content, p.title);
    else if (p.role === "team") body = teamBody;
    else if (p.role === "booking" || p.file === "cart.html") {
      body =
        content.cartMode === "booking"
          ? assembleCartPageBody(content)
          : assembleCommerceCartBody(content);
    }
    else if (p.role === "proof" || p.role === "detail") body = proofBody;
    else body = servicesBody;
    files[p.file] = pageShell(p.file, p.title, body);
  }

  // Ensure core contact exists for WA even if family omitted
  // Always emit mode-correct cart (booking form vs Aurelia commerce cart)
  if (content.shoppable) {
    const cartBody =
      content.cartMode === "booking"
        ? assembleCartPageBody(content)
        : assembleCommerceCartBody(content);
    files["cart.html"] = pageShell(
      "cart.html",
      content.cartMode === "booking" ? "Booking" : "Cart",
      cartBody
    );
  }
  // Aurelia-style checkout for sales niches only
  if (content.shoppable && content.cartMode === "commerce") {
    files["checkout.html"] = pageShell(
      "checkout.html",
      "Checkout",
      assembleCommerceCheckoutBody(content)
    );
  }
  if (!files["contact.html"] && !files["appointment.html"] && !files["booking.html"]) {
    files["contact.html"] = pageShell("contact.html", "Contact", contactBody);
  }

  files["styles.css"] =
    shellCss(content.theme) + "\n" + BOOKING_CART_CSS + "\n" + AURELIA_CART_CSS;
  const productsBoot =
    content.products?.length
      ? productsScriptTag(content.products).replace(/^<script>/, "").replace(/<\/script>$/, "")
      : "";
  files["script.js"] = ensureCommerceRuntime(
    (productsBoot ? productsBoot + "\n" : "") +
      shellJs() +
      (content.shoppable || (content.products && content.products.length)
        ? "\n" + COMMERCE_BOOKING_RUNTIME
        : "")
  );
  files["pages.json"] = JSON.stringify(
    {
      family: family.id,
      gokeTemplateId: family.gokeTemplateId,
      pages: pages.map((p) => ({ file: p.file, title: p.title, role: p.role })),
      plan,
    },
    null,
    2
  );
  const mode = content.cartMode === "booking" ? "booking" : "commerce";
  const catalogFile = buildBookingCatalogJson(
    content.products || [],
    content.waNumber,
    content.cartMode === "brochure" ? "commerce" : mode
  );
  files["catalog.json"] = JSON.stringify(
    {
      ...catalogFile,
      shoppable: content.shoppable,
      addLabel: content.cartAddLabel || "Add to cart",
      checkoutLabel: content.cartCheckoutLabel || "Checkout on WhatsApp",
      cartNoun: content.cartMode === "booking" ? "booking" : "cart",
      updatedAt: new Date().toISOString(),
      items: content.products || [],
    },
    null,
    2
  );
  files["family.json"] = JSON.stringify(
    {
      id: family.id,
      label: family.label,
      gokeTemplateId: family.gokeTemplateId,
      primaryCta: family.primaryCtaDefault,
    },
    null,
    2
  );

  return files;
}

