import { resolveOpulentDirection } from "./opulentDirection";
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

export function shellCss(theme: ShellTheme): string {
  const t = theme; const d = t.mode === "dark";
  return `/* goke shell */:root{--ink:${t.ink};--ink-2:${t.ink2};--surface:${t.surface};--line:${t.line};--text:${t.text};--muted:${t.muted};--accent:${t.accent};--accent-dim:${t.accentDim};--accent-glow:${t.accentGlow};--on-accent:${t.onAccent};--radius:${t.radius};--radius-lg:${t.radiusLg};--max:1180px;--font-display:${t.fontDisplay};--font-body:${t.fontBody}}
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{font-family:var(--font-body);background:var(--ink);color:var(--text);line-height:1.65;min-height:100vh}
img{max-width:100%;display:block}a{color:inherit;text-decoration:none}ul{list-style:none}
h1,h2,h3{font-family:var(--font-display);font-weight:700;line-height:1.05;letter-spacing:-.03em}
.site-header{position:fixed;top:0;left:0;right:0;z-index:100;border-bottom:1px solid transparent}
.site-header.is-scrolled{background:${d?"rgba(7,9,15,.85)":"rgba(247,243,239,.9)"};backdrop-filter:blur(18px);border-bottom-color:var(--line)}
.nav-bar{max-width:var(--max);margin:0 auto;padding:1rem 1.35rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:inline-flex;align-items:center;gap:.55rem;font-family:var(--font-display);font-weight:800;font-size:1.25rem}
.brand img{height:36px;width:auto;max-width:120px;object-fit:contain;border-radius:8px}
.desktop-nav{display:none;gap:1.75rem}.desktop-nav a{font-size:.88rem;color:var(--muted)}.desktop-nav a[aria-current=page]{color:var(--text)}
.header-ctas{display:none}.nav-toggle{width:44px;height:44px;border:1px solid var(--line);border-radius:12px;background:0;display:grid;place-items:center;gap:5px}
.nav-toggle span{display:block;width:18px;height:2px;background:var(--text)}
.mobile-nav{display:none;position:absolute;top:100%;left:0;right:0;background:var(--ink-2);padding:.5rem 1.35rem 1.5rem;flex-direction:column}
.mobile-nav.is-open{display:flex}.mobile-nav a{padding:.9rem 0;border-bottom:1px solid var(--line)}
.mobile-nav a.cta{margin-top:1rem;border:0;text-align:center;background:var(--accent);color:var(--on-accent);border-radius:999px;padding:.9rem;font-weight:700}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:.9rem 1.45rem;border-radius:999px;font-weight:700;border:1.5px solid transparent;cursor:pointer;transition:transform .2s,box-shadow .2s}
.btn-primary{background:var(--accent);color:var(--on-accent)}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px var(--accent-glow)}
.btn-ghost{border-color:var(--line);background:0;color:var(--text)}.btn-sm{padding:.6rem 1.1rem;font-size:.82rem}
.hero{min-height:100dvh;display:grid;position:relative;padding-top:5.5rem;overflow:hidden}
.hero-visual{position:absolute;inset:0}.hero-visual img{width:100%;height:100%;object-fit:cover;opacity:${d?.55:.35}}
.hero-visual::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,${d?"rgba(7,9,15,.55)":"rgba(247,243,239,.4)"} 0%,${d?"rgba(7,9,15,.25)":"rgba(247,243,239,.2)"} 35%,${d?"rgba(7,9,15,.95)":"rgba(247,243,239,.95)"} 100%),radial-gradient(ellipse at 80% 20%,var(--accent-dim),transparent 45%)}
.hero-body{position:relative;z-index:1;max-width:var(--max);margin:0 auto;padding:2rem 1.35rem 3rem;width:100%;display:flex;flex-direction:column;justify-content:flex-end}
.kicker{display:inline-flex;align-items:center;gap:.55rem;font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:1.25rem}
.kicker::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 12px var(--accent)}
.hero h1{font-size:clamp(2.75rem,10vw,5.5rem);max-width:12ch;margin-bottom:1.25rem}.hero h1 .line2{color:var(--accent)}
.hero-lead{font-size:1.1rem;color:var(--muted);max-width:36ch;margin-bottom:2rem}
.hero-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:3rem}
.hero-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;border-top:1px solid var(--line);padding-top:1.5rem;max-width:480px}
.hero-metrics strong{display:block;font-family:var(--font-display);font-size:1.75rem}.hero-metrics span{font-size:.72rem;color:var(--muted);text-transform:uppercase;font-weight:600}
.section{padding:4.5rem 1.35rem}.section-inner{max-width:var(--max);margin:0 auto}
.section-label{font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:.75rem}
.section-title{font-size:clamp(1.85rem,4.5vw,3rem);margin-bottom:.85rem}
.section-copy{color:var(--muted);max-width:48ch;margin-bottom:2rem}
.bento{display:grid;gap:1rem}.bento-card{position:relative;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line);background:var(--surface);min-height:280px;display:flex;flex-direction:column;justify-content:flex-end}
.bento-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45}
.bento-card .body{position:relative;z-index:1;padding:1.5rem;background:linear-gradient(transparent,${d?"rgba(7,9,15,.92)":"rgba(255,255,255,.95)"} 40%)}
.bento-card .tag{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--on-accent);background:var(--accent);padding:.25rem .55rem;border-radius:6px;margin-bottom:.65rem}
.bento-card h3{font-size:1.45rem;margin-bottom:.35rem}.bento-card p{color:var(--muted);font-size:.92rem;margin-bottom:1rem}
.marquee-wrap{overflow:hidden;border-block:1px solid var(--line);background:var(--ink-2);padding:1rem 0}
.marquee{display:flex;gap:2.5rem;width:max-content;animation:scroll 28s linear infinite;font-family:var(--font-display);font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.marquee em{font-style:normal;color:var(--accent)}@keyframes scroll{to{transform:translateX(-50%)}}
.split{display:grid;gap:2rem;align-items:center}.split-media{border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line);aspect-ratio:5/4}.split-media img{width:100%;height:100%;object-fit:cover}
.split-copy p{color:var(--muted);margin-bottom:1rem}.list-check li{position:relative;padding-left:1.5rem;margin-bottom:.55rem}.list-check li::before{content:"→";position:absolute;left:0;color:var(--accent);font-weight:700}
.mosaic{display:grid;gap:.75rem;grid-template-columns:1fr 1fr}.mosaic figure{border-radius:var(--radius);overflow:hidden;border:1px solid var(--line);aspect-ratio:1}
.mosaic figure:first-child{grid-column:1/-1;aspect-ratio:16/9}.mosaic img{width:100%;height:100%;object-fit:cover}
.quotes{display:grid;gap:1rem}.quote{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);padding:1.75rem}
.quote p{font-size:1.15rem;font-family:var(--font-display);margin-bottom:1.25rem}.quote footer{color:var(--muted);font-size:.88rem}
.cta-panel{border-radius:var(--radius-lg);border:1px solid var(--line);background:radial-gradient(ellipse at 20% 50%,var(--accent-dim),transparent 55%),var(--surface);padding:3rem 1.75rem;text-align:center}
.cta-panel h2{font-size:clamp(1.85rem,4vw,2.75rem);margin-bottom:.75rem}.cta-panel p{color:var(--muted);margin:0 auto 1.5rem;max-width:40ch}
.page-top{padding:8rem 1.35rem 3rem;border-bottom:1px solid var(--line)}.page-top h1{font-size:clamp(2.4rem,6vw,4rem);margin-bottom:.75rem}.page-top p{color:var(--muted)}
.contact-layout{display:grid;gap:1.5rem}.panel{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);padding:1.75rem}
.field{margin-bottom:1rem}.field label{display:block;font-size:.78rem;font-weight:600;color:var(--muted);margin-bottom:.4rem;text-transform:uppercase}
input,textarea{width:100%;padding:.9rem 1rem;border-radius:12px;border:1px solid var(--line);background:var(--ink);color:var(--text);font:inherit}textarea{min-height:120px}
.site-footer{border-top:1px solid var(--line);padding:3rem 1.35rem 5.5rem;background:${d?"#05060a":"#ebe4dc"}}
.footer-grid{max-width:var(--max);margin:0 auto 2rem;display:grid;gap:2rem}.footer-grid p{color:var(--muted);font-size:.92rem;max-width:28ch;margin-top:.75rem}
.footer-col h4{font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem}.footer-col a{display:block;padding:.35rem 0}
.footer-bottom{max-width:var(--max);margin:0 auto;padding-top:1.5rem;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;color:var(--muted);font-size:.82rem}
.mobile-tabbar{display:none}.reveal{opacity:0;transform:translateY(28px);transition:.7s ease}.reveal.is-visible{opacity:1;transform:none}
@media(min-width:900px){.desktop-nav,.header-ctas{display:flex}.nav-toggle{display:none}.bento{grid-template-columns:1fr 1fr}.bento-card:first-child{grid-row:span 2}.split{grid-template-columns:1fr 1fr;gap:3rem}.mosaic{grid-template-columns:repeat(4,1fr)}.mosaic figure:first-child{grid-column:span 2;grid-row:span 2;aspect-ratio:auto;min-height:100%}.quotes{grid-template-columns:1fr 1fr}.footer-grid{grid-template-columns:2fr 1fr 1fr 1fr}.contact-layout{grid-template-columns:1fr 1fr}}
@media(max-width:899px){body{padding-bottom:calc(64px + env(safe-area-inset-bottom,0px))}.mobile-tabbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:90;justify-content:space-around;padding:8px 6px calc(8px + env(safe-area-inset-bottom,0px));background:${d?"rgba(7,9,15,.92)":"rgba(255,255,255,.92)"};backdrop-filter:blur(16px);border-top:1px solid var(--line)}.mobile-tabbar a{flex:1;text-align:center;font-size:10px;font-weight:600;color:var(--muted);padding:6px}.mobile-tabbar a[aria-current=page]{color:var(--accent)}}`;
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
  const nav = c.nav.map((n) => `<a href="${n.href}"${n.href === cur ? ' aria-current="page"' : ""}>${E(n.label)}</a>`).join("");
  const logo = c.logoUrl ? `<img src="${E(c.logoUrl)}" alt="${E(c.brand)}" width="40" height="40"/>` : "";
  const header = `<header class="site-header"><div class="nav-bar"><a href="index.html" class="brand" id="site-title">${logo}<span>${E(c.brand)}</span></a>
<button type="button" class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mobileNav"><span></span><span></span><span></span></button>
<nav class="desktop-nav" aria-label="Main">${nav}</nav>
<div class="header-ctas"><a href="contact.html" class="btn btn-primary btn-sm">${E(c.primaryCta)}</a></div>
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
  opts: { waNumber?: string | null; galleryUrls: string[]; titles: string[]; nicheId: string; primaryCta?: string; brandPrimary?: string }
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
  return {
    brand,
    logoUrl: profile.profilePic || "",
    kicker: brand,
    headlineLine1: brand.split(" ")[0] || brand,
    headlineLine2: "crafted with intention.",
    lead: bio.slice(0, 200) || `${brand} is built for clients who value clarity, craft, and a composed experience — from first look to final contact.`,
    primaryCta: opts.primaryCta || "Get in touch",
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
    nav: [
      { href: "index.html", label: "Home" },
      { href: "about.html", label: "About" },
      { href: "services.html", label: "Services" },
      { href: "gallery.html", label: "Gallery" },
      { href: "contact.html", label: "Contact" },
    ],
    waNumber: opts.waNumber || "",
    theme: themeForNiche(opts.nicheId, opts.brandPrimary),
  };
}

export function parseShellContentJson(raw: string, fallback: ShellContent): ShellContent {
  try {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return fallback;
    const j = JSON.parse(m[0]) as Partial<ShellContent>;
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
      nav: fallback.nav,
      theme: fallback.theme,
      waNumber: fallback.waNumber,
      logoUrl: j.logoUrl || fallback.logoUrl,
      brand: j.brand || fallback.brand,
    };
  } catch {
    return fallback;
  }
}

export function renderShellSite(c: ShellContent): Record<string, string> {
  const desc = c.lead.slice(0, 160);
  const ch = chrome(c, "index.html");
  const metrics = c.metrics
    .slice(0, 3)
    .map((m) => `<div><strong>${E(m.value)}</strong><span>${E(m.label)}</span></div>`)
    .join("");
  const marquee = [...c.marquee, ...c.marquee]
    .map((x, i) => `<span>${i % 2 ? `<em>${E(x)}</em>` : E(x)}</span>`)
    .join("");
  const bento = c.services
    .slice(0, 4)
    .map(
      (s) =>
        `<article class="bento-card reveal"><img src="${E(s.image)}" alt="${E(s.title)}" loading="lazy"/><div class="body"><span class="tag">${E(s.tag)}</span><h3>${E(s.title)}</h3><p>${E(s.body)}</p><a href="services.html" class="btn btn-ghost btn-sm">Explore</a></div></article>`
    )
    .join("");
  const aboutPs = c.aboutParagraphs.map((p) => `<p>${E(p)}</p>`).join("");
  const aboutLi = c.aboutList.map((x) => `<li>${E(x)}</li>`).join("");
  const mosaic = c.gallery
    .slice(0, 6)
    .map((g) => `<figure><img src="${E(g.src)}" alt="${E(g.alt)}" loading="lazy"/></figure>`)
    .join("");
  const quotes = c.quotes
    .slice(0, 2)
    .map(
      (q) =>
        `<blockquote class="quote reveal"><p>${E(q.text)}</p><footer>— <strong>${E(q.author)}</strong></footer></blockquote>`
    )
    .join("");
  const heroImg = c.gallery[0]?.src || c.aboutImage;
  const index = `${head(c.brand + " — " + c.kicker, desc, c.theme.googleFontsHref)}<body data-wa="${E(c.waNumber)}">${ch.header}<main>
<section class="hero"><div class="hero-visual"><img src="${E(heroImg)}" alt="${E(c.brand)}" width="1800" height="1200"/></div>
<div class="hero-body"><p class="kicker">${E(c.kicker)}</p><h1 id="hero-headline">${E(c.headlineLine1)}<br><span class="line2">${E(c.headlineLine2)}</span></h1>
<p class="hero-lead" id="hero-subheadline">${E(c.lead)}</p>
<div class="hero-actions"><a href="contact.html" class="btn btn-primary" id="cta-button">${E(c.primaryCta)}</a><a href="services.html" class="btn btn-ghost">${E(c.secondaryCta)}</a></div>
<div class="hero-metrics">${metrics}</div></div></section>
${c.marquee.length ? `<div class="marquee-wrap"><div class="marquee">${marquee}</div></div>` : ""}
<section class="section reveal" data-goke="section" data-section-name="services"><div class="section-inner"><p class="section-label">What we offer</p><h2 class="section-title">Built for real results</h2><p class="section-copy">${E(c.lead)}</p><div class="bento">${bento}</div></div></section>
<section class="section reveal" data-goke="section" data-section-name="about"><div class="section-inner split"><div class="split-media"><img src="${E(c.aboutImage)}" alt="" loading="lazy"/></div><div class="split-copy"><p class="section-label">About</p><h2>${E(c.aboutTitle)}</h2>${aboutPs}<ul class="list-check">${aboutLi}</ul><p style="margin-top:1.5rem"><a href="about.html" class="btn btn-primary">Our story</a></p></div></div></section>
<section class="section reveal" data-goke="section" data-section-name="gallery"><div class="section-inner"><p class="section-label">Gallery</p><h2 class="section-title">Inside the work</h2><div class="mosaic">${mosaic}</div><p style="margin-top:1.5rem"><a href="gallery.html" class="btn btn-ghost">View gallery</a></p></div></section>
${quotes ? `<section class="section"><div class="section-inner quotes">${quotes}</div></section>` : ""}
<section class="section"><div class="section-inner"><div class="cta-panel reveal"><h2>${E(c.ctaTitle)}</h2><p>${E(c.ctaBody)}</p><a href="contact.html" class="btn btn-primary">${E(c.primaryCta)}</a></div></div></section>
</main>${ch.footer}${ch.tabbar}</body></html>`;
  const page = (file: string, title: string, body: string) => {
    const x = chrome(c, file);
    return `${head(title + " · " + c.brand, desc, c.theme.googleFontsHref)}<body data-wa="${E(c.waNumber)}">${x.header}<main><section class="page-top"><div class="section-inner"><h1>${E(title)}</h1><p>${E(c.lead)}</p></div></section>${body}</main>${x.footer}${x.tabbar}</body></html>`;
  };
  return {
    "index.html": index,
    "about.html": page(
      "about.html",
      "About",
      `<section class="section"><div class="section-inner split"><div class="split-media"><img src="${E(c.aboutImage)}" alt=""/></div><div class="split-copy"><h2>${E(c.aboutTitle)}</h2>${aboutPs}<ul class="list-check">${aboutLi}</ul></div></div></section>`
    ),
    "services.html": page(
      "services.html",
      "Services",
      `<section class="section"><div class="section-inner"><div class="bento">${bento}</div><p style="margin-top:2rem;text-align:center"><a href="contact.html" class="btn btn-primary">${E(c.primaryCta)}</a></p></div></section>`
    ),
    "gallery.html": page(
      "gallery.html",
      "Gallery",
      `<section class="section"><div class="section-inner"><div class="mosaic">${mosaic}</div></div></section>`
    ),
    "contact.html": page(
      "contact.html",
      "Contact",
      `<section class="section"><div class="section-inner contact-layout"><div class="panel"><h2 style="margin-bottom:1rem">${E(c.ctaTitle)}</h2><p style="color:var(--muted);margin-bottom:1.5rem">${E(c.ctaBody)}</p><form id="contact-form"><div class="field"><label for="name">Name</label><input id="name" name="name" required/></div><div class="field"><label for="email">Email</label><input id="email" name="email" type="email"/></div><div class="field"><label for="message">Message</label><textarea id="message" name="message" required></textarea></div><button type="submit" class="btn btn-primary" data-goke="button">Send via WhatsApp</button></form></div><div class="panel"><h3>${E(c.brand)}</h3><p style="color:var(--muted)">${E(c.footerBlurb)}</p></div></div></section>`
    ),
    "styles.css": shellCss(c.theme),
    "script.js": shellJs(),
    "pages.json": JSON.stringify(
      {
        pages: [
          { file: "index.html", title: "Home" },
          { file: "about.html", title: "About" },
          { file: "services.html", title: "Services" },
          { file: "gallery.html", title: "Gallery" },
          { file: "contact.html", title: "Contact" },
        ],
      },
      null,
      2
    ),
  };
}
