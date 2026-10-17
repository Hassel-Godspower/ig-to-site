/**
 * Multi-shell renderer — STRUCTURALLY distinct layouts per shell.
 * athletic  → iFitness (left hero + metrics + marquee + bento)
 * sanctuary → Pax (centered hero + numbered pillars + image cards)
 * sensorial → Brandrich (cinematic hero + classic top-image cards + dividers)
 * authority → formal split hero + horizontal practice rows
 * others map to closest distinct structure
 */
import type { ShellContent } from "./types";
import { esc as E } from "./types";
import type { ShellId } from "./registry";
import { themeForShell } from "./themes";

function head(title: string, desc: string, fontsHref: string, shellId: string) {
  return `<!DOCTYPE html><html lang="en" data-shell="${shellId}"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${E(title)}</title><meta name="description" content="${E(desc)}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${fontsHref}" rel="stylesheet"/>
<link rel="stylesheet" href="styles.css"/>
<script src="script.js" defer></script>
</head>`;
}

function shellJs() {
  return `document.addEventListener("DOMContentLoaded",()=>{
const t=document.querySelector(".nav-toggle"),m=document.querySelector(".mobile-nav"),h=document.querySelector(".site-header");
if(t&&m){t.addEventListener("click",()=>{const o=t.getAttribute("aria-expanded")==="true";t.setAttribute("aria-expanded",String(!o));m.classList.toggle("is-open",!o);});
m.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{t.setAttribute("aria-expanded","false");m.classList.remove("is-open");}));}
const onScroll=()=>{if(!h)return;h.classList.toggle("is-scrolled",scrollY>24);};addEventListener("scroll",onScroll,{passive:true});onScroll();
const els=document.querySelectorAll(".reveal");
if("IntersectionObserver"in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target);}});},{threshold:0.12});els.forEach(el=>io.observe(el));}
else els.forEach(el=>el.classList.add("is-visible"));
});
(function(){function wa(){return String((document.body&&document.body.getAttribute("data-wa"))||"").replace(/\\D/g,"");}
document.querySelectorAll("#contact-form,form[data-goke-contact]").forEach(function(form){if(form.__goke)return;form.__goke=true;
form.addEventListener("submit",function(e){e.preventDefault();var n=wa();var fd=new FormData(form);var lines=[];
["name","email","phone","message","service","date","guests"].forEach(function(k){var v=fd.get(k);if(v)lines.push(k+": "+v);});
var text=encodeURIComponent(lines.join("\\n")||"Hello");
if(n)location.href="https://wa.me/"+n+"?text="+text;else alert("Thanks — we will respond shortly.");});});})();`;
}

function navHtml(c: ShellContent) {
  const items = c.nav?.length ? c.nav : [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "services.html", label: "Services" },
    { href: "gallery.html", label: "Gallery" },
    { href: "contact.html", label: "Contact" },
  ];
  return items.map((n) => `<a href="${E(n.href)}">${E(n.label)}</a>`).join("");
}

function pagesJson(shell: string) {
  return JSON.stringify({
    pages: [
      { file: "index.html", title: "Home" },
      { file: "about.html", title: "About" },
      { file: "services.html", title: "Services" },
      { file: "gallery.html", title: "Gallery" },
      { file: "contact.html", title: "Contact" },
    ],
    shell,
  }, null, 2);
}

function baseCss(t: ShellContent["theme"], shell: string, extra: string) {
  return `/* goke shell: ${shell} */
:root{--ink:${t.ink};--ink-2:${t.ink2};--surface:${t.surface};--line:${t.line};--text:${t.text};--muted:${t.muted};--accent:${t.accent};--accent-dim:${t.accentDim};--accent-glow:${t.accentGlow};--on-accent:${t.onAccent};--radius:${t.radius};--radius-lg:${t.radiusLg};--max:1180px;--font-display:${t.fontDisplay};--font-body:${t.fontBody}}
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{font-family:var(--font-body);background:var(--ink);color:var(--text);line-height:1.65;min-height:100vh}
img{max-width:100%;display:block}a{color:inherit;text-decoration:none}ul{list-style:none}
h1,h2,h3{font-family:var(--font-display);line-height:1.1}
.site-header{position:fixed;top:0;left:0;right:0;z-index:100;transition:.3s;border-bottom:1px solid transparent}
.site-header.is-scrolled{background:rgba(8,10,12,.92);backdrop-filter:blur(16px);border-bottom-color:var(--line)}
.nav-bar{max-width:var(--max);margin:0 auto;padding:1rem 1.35rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:inline-flex;align-items:center;gap:.6rem;font-family:var(--font-display);font-weight:600;font-size:1.2rem}
.desktop-nav{display:none;gap:1.5rem}.desktop-nav a{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.header-ctas{display:none}.nav-toggle{width:44px;height:44px;border:1px solid var(--line);background:0;display:grid;place-items:center;gap:5px;cursor:pointer}
.nav-toggle span{display:block;width:18px;height:1.5px;background:var(--text)}
.mobile-nav{display:none;position:absolute;top:100%;left:0;right:0;background:var(--ink-2);padding:1rem 1.35rem;flex-direction:column;gap:.5rem}
.mobile-nav.is-open{display:flex}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:.9rem 1.5rem;font-size:.75rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;border:1.5px solid transparent;cursor:pointer;transition:.25s}
.btn-primary{background:var(--accent);color:var(--on-accent)}.btn-ghost{border-color:var(--line);color:var(--text)}
.section{padding:4.5rem 1.35rem}.section-inner{max-width:var(--max);margin:0 auto}
.page-top{padding:8rem 1.35rem 2rem}.page-top h1{font-size:clamp(2rem,5vw,3rem);margin-bottom:.5rem}
.field{margin-bottom:1rem}.field label{display:block;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:.3rem}
.field input,.field textarea,.field select{width:100%;padding:.85rem;background:var(--surface);border:1px solid var(--line);color:var(--text);font:inherit}
.field textarea{min-height:120px}
.site-footer{border-top:1px solid var(--line);padding:3rem 1.35rem 5.5rem;background:var(--ink-2);color:var(--muted)}
.tabbar{position:fixed;bottom:0;left:0;right:0;display:flex;background:rgba(8,10,12,.95);border-top:1px solid var(--line);z-index:90}
.tabbar a{flex:1;text-align:center;padding:.55rem;font-size:.62rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
@media(min-width:900px){.desktop-nav,.header-ctas{display:flex}.nav-toggle,.tabbar{display:none}.site-footer{padding-bottom:3rem}}
.reveal{opacity:0;transform:translateY(20px);transition:.75s}.reveal.is-visible{opacity:1;transform:none}
${extra}`;
}

function chrome(c: ShellContent, variant: "athletic" | "sanctuary" | "sensorial" | "authority") {
  const nav = navHtml(c);
  const logo = c.logoUrl ? `<img src="${E(c.logoUrl)}" alt="" style="height:36px;width:auto;border-radius:8px"/>` : "";
  if (variant === "sanctuary") {
    const initial = (c.brand || "P").charAt(0);
    return {
      header: `<header class="site-header"><div class="nav-bar">
<a class="brand" href="index.html"><span class="brand-mark">${E(initial)}</span><span class="brand-stack"><strong>${E(c.brand)}</strong><em>${E(c.kicker)}</em></span></a>
<button type="button" class="nav-toggle" aria-expanded="false"><span></span><span></span><span></span></button>
<nav class="desktop-nav">${nav}</nav>
<div class="header-ctas"><a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a></div>
<div class="mobile-nav">${nav}</div></div></header>`,
      footer: `<footer class="site-footer"><div class="section-inner" style="display:grid;gap:1.5rem"><strong style="color:var(--text);font-family:var(--font-display);font-size:1.3rem">${E(c.brand)}</strong><p>${E(c.footerBlurb)}</p><div style="display:flex;flex-wrap:wrap;gap:1rem">${nav}</div><p>© ${new Date().getFullYear()} ${E(c.brand)}</p></div></footer>
<nav class="tabbar"><a href="index.html">Home</a><a href="services.html">Services</a><a href="gallery.html">Gallery</a><a href="contact.html">Contact</a></nav>`,
    };
  }
  return {
    header: `<header class="site-header"><div class="nav-bar">
<a class="brand" href="index.html">${logo}<span>${E(c.brand)}</span></a>
<button type="button" class="nav-toggle" aria-expanded="false"><span></span><span></span><span></span></button>
<nav class="desktop-nav">${nav}</nav>
<div class="header-ctas"><a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a></div>
<div class="mobile-nav">${nav}</div></div></header>`,
    footer: `<footer class="site-footer"><div class="section-inner" style="display:grid;gap:1rem"><strong style="color:var(--text)">${E(c.brand)}</strong><p>${E(c.footerBlurb)}</p><div style="display:flex;flex-wrap:wrap;gap:1rem">${nav}</div><p>© ${new Date().getFullYear()} ${E(c.brand)}</p></div></footer>
<nav class="tabbar"><a href="index.html">Home</a><a href="services.html">Services</a><a href="gallery.html">Gallery</a><a href="contact.html">Contact</a></nav>`,
  };
}

function contactBlock(c: ShellContent) {
  return `<section class="section"><div class="section-inner" style="max-width:520px">
<h2 style="margin-bottom:1rem">${E(c.ctaTitle)}</h2><p style="color:var(--muted);margin-bottom:1.5rem">${E(c.ctaBody)}</p>
<form id="contact-form">
<div class="field"><label>Name</label><input name="name" required/></div>
<div class="field"><label>Email</label><input name="email" type="email"/></div>
<div class="field"><label>Message</label><textarea name="message" required></textarea></div>
<button type="submit" class="btn btn-primary">Send via WhatsApp</button>
</form></div></section>`;
}

function page(shell: string, c: ShellContent, ch: { header: string; footer: string }, title: string, body: string) {
  return `${head(title + " · " + c.brand, c.lead.slice(0, 155), c.theme.googleFontsHref, shell)}<body data-wa="${E(c.waNumber)}" data-shell="${shell}">${ch.header}<main>
<section class="page-top"><div class="section-inner"><h1>${E(title)}</h1><p style="color:var(--muted)">${E(c.lead)}</p></div></section>
${body}</main>${ch.footer}</body></html>`;
}

/** ATHLETIC: left hero, metrics, marquee, bento overlays */
function renderAthletic(c: ShellContent): Record<string, string> {
  const ch = chrome(c, "athletic");
  const heroImg = c.gallery[0]?.src || c.aboutImage;
  const metrics = (c.metrics || []).slice(0, 3).map((m) => `<div><strong>${E(m.value)}</strong><span>${E(m.label)}</span></div>`).join("");
  const marquee = (c.marquee?.length ? c.marquee : c.services.map((s) => s.title)).map((m) => `<span>${E(m)}</span>`).join("<span>·</span>");
  const bento = (c.services || []).slice(0, 3).map((s, i) =>
    `<article class="bento-card"><img src="${E(s.image)}" alt="${E(s.title)}"/><div class="body"><span class="tag">${E(s.tag)}</span><h3>${E(s.title)}</h3><p>${E(s.body)}</p><a class="btn btn-ghost" href="services.html" style="margin-top:.75rem;padding:.5rem 1rem;font-size:.7rem">Explore →</a></div></article>`
  ).join("");
  const aboutPs = (c.aboutParagraphs || []).map((p) => `<p style="color:var(--muted);margin-bottom:.8rem">${E(p)}</p>`).join("");
  const aboutLi = (c.aboutList || []).map((x) => `<li>${E(x)}</li>`).join("");
  const mosaic = (c.gallery || []).slice(0, 6).map((g) => `<figure><img src="${E(g.src)}" alt="${E(g.alt)}"/></figure>`).join("");
  const extra = `
.btn{border-radius:999px}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 36px var(--accent-glow)}
.hero{min-height:100dvh;display:grid;position:relative;padding-top:5.5rem}
.hero-visual{position:absolute;inset:0}.hero-visual img{width:100%;height:100%;object-fit:cover;opacity:.5}
.hero-visual::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,9,15,.5),rgba(7,9,15,.2) 40%,var(--ink))}
.hero-body{position:relative;z-index:1;max-width:var(--max);margin:0 auto;padding:2rem 1.35rem 3rem;width:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;text-align:left}
.kicker{font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:1.2rem;display:inline-flex;align-items:center;gap:.5rem}
.kicker::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent)}
.hero h1{font-size:clamp(2.75rem,10vw,5.2rem);font-weight:700;letter-spacing:-.03em;max-width:12ch;margin-bottom:1.2rem}
.hero h1 .line2{color:var(--accent)}.hero-lead{color:var(--muted);max-width:36ch;margin-bottom:1.75rem}
.hero-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:2.5rem}
.hero-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;border-top:1px solid var(--line);padding-top:1.4rem;max-width:480px;width:100%}
.hero-metrics strong{display:block;font-family:var(--font-display);font-size:1.7rem;color:var(--accent)}.hero-metrics span{font-size:.7rem;color:var(--muted);text-transform:uppercase}
.marquee-wrap{border-block:1px solid var(--line);padding:.85rem;background:var(--ink-2);display:flex;justify-content:center;gap:1.5rem;flex-wrap:wrap;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);font-weight:600}
.bento{display:grid;gap:1rem}@media(min-width:900px){.bento{grid-template-columns:repeat(3,1fr)}}
.bento-card{position:relative;min-height:280px;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line);display:flex;flex-direction:column;justify-content:flex-end}
.bento-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.42}
.bento-card .body{position:relative;z-index:1;padding:1.3rem;background:linear-gradient(transparent,rgba(0,0,0,.85))}
.bento-card .tag{font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700}
.split{display:grid;gap:2rem}@media(min-width:860px){.split{grid-template-columns:1fr 1fr;gap:3rem;align-items:center}}
.split img{width:100%;aspect-ratio:5/4;object-fit:cover;border-radius:var(--radius-lg);border:1px solid var(--line)}
.list-check li{padding:.4rem 0 .4rem 1.3rem;position:relative;color:var(--muted)}.list-check li::before{content:"";position:absolute;left:0;top:.85rem;width:8px;height:8px;border-radius:50%;background:var(--accent)}
.mosaic{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}@media(min-width:768px){.mosaic{grid-template-columns:repeat(3,1fr)}}
.mosaic figure{margin:0;border-radius:var(--radius);overflow:hidden;border:1px solid var(--line)}.mosaic img{width:100%;aspect-ratio:1;object-fit:cover}
.cta-panel{text-align:center;padding:3rem 1.5rem;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--surface)}
.section-label{font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:.6rem}
`;
  const index = `${head(c.brand, c.lead.slice(0, 155), c.theme.googleFontsHref, "athletic")}<body data-wa="${E(c.waNumber)}" data-shell="athletic">${ch.header}<main>
<section class="hero"><div class="hero-visual"><img src="${E(heroImg)}" alt="${E(c.brand)}"/></div>
<div class="hero-body"><p class="kicker">${E(c.kicker)}</p>
<h1>${E(c.headlineLine1)}<br><span class="line2">${E(c.headlineLine2)}</span></h1>
<p class="hero-lead">${E(c.lead)}</p>
<div class="hero-actions"><a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a><a class="btn btn-ghost" href="services.html">${E(c.secondaryCta)}</a></div>
<div class="hero-metrics">${metrics}</div></div></section>
<div class="marquee-wrap">${marquee}</div>
<section class="section reveal"><div class="section-inner"><p class="section-label">Paths</p><h2 style="font-size:clamp(1.8rem,4vw,2.8rem);margin-bottom:1rem">Choose how you train</h2>
<p style="color:var(--muted);max-width:48ch;margin-bottom:2rem">${E(c.lead)}</p><div class="bento">${bento}</div></div></section>
<section class="section reveal"><div class="section-inner split"><div><img src="${E(c.aboutImage)}" alt=""/></div>
<div><p class="section-label">About</p><h2 style="margin-bottom:1rem">${E(c.aboutTitle)}</h2>${aboutPs}<ul class="list-check">${aboutLi}</ul>
<a class="btn btn-primary" style="margin-top:1rem" href="about.html">Our approach</a></div></div></section>
<section class="section reveal"><div class="section-inner"><p class="section-label">Floor</p><h2 style="margin-bottom:1.5rem">Moments from the room</h2><div class="mosaic">${mosaic}</div></div></section>
<section class="section"><div class="section-inner"><div class="cta-panel reveal"><h2>${E(c.ctaTitle)}</h2><p style="color:var(--muted);margin:1rem 0 1.5rem">${E(c.ctaBody)}</p><a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a></div></div></section>
</main>${ch.footer}</body></html>`;
  return {
    "index.html": index,
    "about.html": page("athletic", c, ch, "About", `<section class="section"><div class="section-inner split"><div><img src="${E(c.aboutImage)}" alt=""/></div><div><h2>${E(c.aboutTitle)}</h2>${aboutPs}<ul class="list-check">${aboutLi}</ul></div></div></section>`),
    "services.html": page("athletic", c, ch, "Services", `<section class="section"><div class="section-inner"><div class="bento">${bento}</div></div></section>`),
    "gallery.html": page("athletic", c, ch, "Gallery", `<section class="section"><div class="section-inner"><div class="mosaic">${mosaic}</div></div></section>`),
    "contact.html": page("athletic", c, ch, "Contact", contactBlock(c)),
    "styles.css": baseCss(c.theme, "athletic", extra),
    "script.js": shellJs(),
    "pages.json": pagesJson("athletic"),
  };
}

/** SANCTUARY: centered hero, NO metrics, numbered text pillars first, then image cards */
function renderSanctuary(c: ShellContent): Record<string, string> {
  const ch = chrome(c, "sanctuary");
  const heroImg = c.gallery[0]?.src || c.aboutImage;
  const pillars = (c.services || []).slice(0, 3).map((s, i) =>
    `<article class="pillar"><span class="num">0${i + 1}</span><h3>${E(s.title)}</h3><p>${E(s.body)}</p></article>`
  ).join("");
  const cards = (c.services || []).slice(0, 3).map((s) =>
    `<article class="scard"><img src="${E(s.image)}" alt="${E(s.title)}"/><div class="pad"><h3>${E(s.title)}</h3><p>${E(s.body)}</p><a href="services.html">Details →</a></div></article>`
  ).join("");
  const aboutPs = (c.aboutParagraphs || []).map((p) => `<p style="color:var(--muted);margin-bottom:.9rem">${E(p)}</p>`).join("");
  const gal = (c.gallery || []).slice(0, 3).map((g) => `<img src="${E(g.src)}" alt="${E(g.alt)}"/>`).join("");
  const extra = `
.btn{border-radius:999px}.brand-mark{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;color:var(--accent);font-family:var(--font-display);font-size:1.2rem}
.brand-stack{display:flex;flex-direction:column;line-height:1.15}.brand-stack em{font-style:normal;font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);font-family:var(--font-body)}
.hero-s{min-height:94vh;display:flex;align-items:center;justify-content:center;position:relative;text-align:center}
.hero-s .bg{position:absolute;inset:0}.hero-s .bg img{width:100%;height:100%;object-fit:cover;filter:brightness(.38)}
.hero-s .bg::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,var(--ink),transparent 50%)}
.hero-s .content{position:relative;z-index:2;padding:2rem 1.5rem;max-width:800px}
.eyebrow{font-size:.7rem;letter-spacing:.28em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem}
.hero-s h1{font-size:clamp(2.5rem,6vw,4rem);font-weight:400;margin-bottom:1rem}
.hero-s .lead{font-family:var(--font-display);font-style:italic;font-size:1.25rem;color:var(--muted);margin-bottom:2rem}
.hero-s .actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}
.pillars{display:grid;gap:1.5rem}@media(min-width:700px){.pillars{grid-template-columns:repeat(3,1fr)}}
.pillar{background:var(--surface);border:1px solid var(--line);padding:2rem 1.5rem;border-radius:var(--radius-lg)}
.pillar .num{font-family:var(--font-display);color:var(--accent);letter-spacing:.1em;display:block;margin-bottom:.75rem}
.center{text-align:center;max-width:560px;margin:0 auto 2.5rem}
.divider{width:44px;height:1px;background:var(--accent);margin:0 auto 1.5rem}
.scards{display:grid;gap:1.5rem}@media(min-width:700px){.scards{grid-template-columns:repeat(3,1fr)}}
.scard{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;display:flex;flex-direction:column}
.scard img{width:100%;aspect-ratio:4/3;object-fit:cover}.scard .pad{padding:1.25rem}.scard a{color:var(--accent);font-size:.78rem;letter-spacing:.12em;text-transform:uppercase}
.split{display:grid;gap:2.5rem;align-items:center}@media(min-width:860px){.split{grid-template-columns:1fr 1fr}}
.split img{width:100%;aspect-ratio:4/5;object-fit:cover;border:1px solid var(--line)}
.grow{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}@media(min-width:768px){.grow{grid-template-columns:repeat(3,1fr)}}
.grow img{width:100%;aspect-ratio:1;object-fit:cover;border:1px solid var(--line)}
.final{text-align:center;padding:5rem 1.5rem;border-block:1px solid var(--line);background:var(--ink-2)}
`;
  const index = `${head(c.brand, c.lead.slice(0, 155), c.theme.googleFontsHref, "sanctuary")}<body data-wa="${E(c.waNumber)}" data-shell="sanctuary">${ch.header}<main>
<section class="hero-s"><div class="bg"><img src="${E(heroImg)}" alt=""/></div>
<div class="content"><p class="eyebrow">${E(c.kicker)}</p>
<h1>${E(c.headlineLine1)}<br>${E(c.headlineLine2)}</h1>
<p class="lead">${E(c.lead)}</p>
<div class="actions"><a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a><a class="btn btn-ghost" href="services.html">${E(c.secondaryCta)}</a></div></div></section>
<section class="section reveal"><div class="section-inner"><div class="center"><p class="eyebrow">The Philosophy</p><h2>${E(c.aboutTitle)}</h2><div class="divider"></div><p style="color:var(--muted)">${E(c.lead)}</p></div>
<div class="pillars">${pillars}</div></div></section>
<section class="section reveal" style="background:var(--ink-2)"><div class="section-inner split">
<div><img src="${E(c.aboutImage)}" alt=""/></div>
<div><p class="eyebrow">About the Sanctuary</p><h2>${E(c.aboutTitle)}</h2><div class="divider" style="margin-left:0"></div>${aboutPs}
<a class="btn btn-ghost" href="about.html">Our Story</a></div></div></section>
<section class="section reveal"><div class="section-inner"><div class="center"><p class="eyebrow">Signature Offerings</p><h2>Sessions shaped around you</h2><div class="divider"></div></div>
<div class="scards">${cards}</div></div></section>
<section class="section reveal" style="background:var(--ink-2)"><div class="section-inner"><div class="center"><p class="eyebrow">The Space</p><h2>Quiet. Intentional. Yours.</h2><div class="divider"></div></div>
<div class="grow">${gal}</div><p style="text-align:center;margin-top:1.5rem"><a class="btn btn-ghost" href="gallery.html">Open Gallery</a></p></div></section>
<section class="final reveal"><p class="eyebrow">Begin Here</p><h2>${E(c.ctaTitle)}</h2><p style="color:var(--muted);font-family:var(--font-display);font-style:italic;margin:1rem 0 1.5rem">${E(c.ctaBody)}</p>
<a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a></section>
</main>${ch.footer}</body></html>`;
  return {
    "index.html": index,
    "about.html": page("sanctuary", c, ch, "About", `<section class="section"><div class="section-inner split"><div><img src="${E(c.aboutImage)}" alt=""/></div><div><h2>${E(c.aboutTitle)}</h2>${aboutPs}</div></div></section>`),
    "services.html": page("sanctuary", c, ch, "Services", `<section class="section"><div class="section-inner"><div class="scards">${cards}</div></div></section>`),
    "gallery.html": page("sanctuary", c, ch, "Gallery", `<section class="section"><div class="section-inner"><div class="grow">${(c.gallery || []).map((g) => `<img src="${E(g.src)}" alt="${E(g.alt)}"/>`).join("")}</div></div></section>`),
    "contact.html": page("sanctuary", c, ch, "Contact", contactBlock(c)),
    "styles.css": baseCss(c.theme, "sanctuary", extra),
    "script.js": shellJs(),
    "pages.json": pagesJson("sanctuary"),
  };
}

/** SENSORIAL: cinematic centered hero, classic cards (image on TOP), gold dividers, menu list on services */
function renderSensorial(c: ShellContent): Record<string, string> {
  const ch = chrome(c, "sensorial");
  const heroImg = c.gallery[0]?.src || c.aboutImage;
  const cards = (c.services || []).slice(0, 3).map((s) =>
    `<article class="card"><img src="${E(s.image)}" alt="${E(s.title)}"/><div class="pad"><h3>${E(s.title)}</h3><p>${E(s.body)}</p><a class="btn btn-ghost" href="services.html">Explore</a></div></article>`
  ).join("");
  const menu = (c.services || []).map((s) =>
    `<div class="menu-row"><div><h4>${E(s.title)}</h4><p>${E(s.body)}</p></div><span>${E(s.tag)}</span></div>`
  ).join("");
  const aboutPs = (c.aboutParagraphs || []).map((p) => `<p style="color:var(--muted);margin-bottom:.9rem">${E(p)}</p>`).join("");
  const gal = (c.gallery || []).slice(0, 6).map((g) => `<figure><img src="${E(g.src)}" alt="${E(g.alt)}"/></figure>`).join("");
  const extra = `
.btn{border-radius:2px;letter-spacing:.16em}
.hero-c{min-height:92vh;display:flex;align-items:center;justify-content:center;position:relative;text-align:center}
.hero-c img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.42)}
.hero-c::after{content:"";position:absolute;left:0;right:0;bottom:0;height:160px;background:linear-gradient(to top,var(--ink),transparent)}
.hero-c .content{position:relative;z-index:2;padding:2rem 1.5rem;max-width:840px}
.eyebrow{font-size:.7rem;letter-spacing:.28em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem}
.hero-c h1{font-size:clamp(2.6rem,6vw,4.2rem);font-weight:400;margin-bottom:.75rem}
.hero-c .sub{font-family:var(--font-display);font-style:italic;font-size:1.3rem;color:var(--muted);margin-bottom:2rem}
.hero-c .actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}
.divider{width:48px;height:1px;background:var(--accent);margin:0 auto 2rem;opacity:.75}
.center{text-align:center}.lead-c{font-family:var(--font-display);font-style:italic;color:var(--muted);max-width:520px;margin:0 auto 2.5rem}
.cards{display:grid;gap:1.5rem}@media(min-width:700px){.cards{grid-template-columns:repeat(3,1fr)}}
.card{background:var(--surface);border:1px solid var(--line);overflow:hidden;display:flex;flex-direction:column}
.card img{width:100%;aspect-ratio:4/3;object-fit:cover}.card .pad{padding:1.4rem;display:flex;flex-direction:column;gap:.6rem;flex:1}
.card .btn{align-self:flex-start;margin-top:auto}
.split{display:grid;gap:2.5rem;align-items:center}@media(min-width:860px){.split{grid-template-columns:1fr 1fr}}
.split img{width:100%;aspect-ratio:4/5;object-fit:cover;border:1px solid var(--line)}
.mosaic{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}@media(min-width:768px){.mosaic{grid-template-columns:repeat(3,1fr)}}
.mosaic figure{margin:0;border:1px solid var(--line);overflow:hidden}.mosaic img{width:100%;aspect-ratio:1;object-fit:cover}
.cta-band{text-align:center;padding:5rem 1.5rem;border-block:1px solid var(--line);background:var(--ink-2)}
.menu-row{display:flex;justify-content:space-between;gap:1rem;padding:1.15rem 0;border-bottom:1px solid var(--line)}
.menu-row h4{font-family:var(--font-display);font-size:1.2rem;font-weight:500;margin:0 0 .25rem}
.menu-row p{color:var(--muted);font-size:.9rem;margin:0}.menu-row span{color:var(--accent);font-family:var(--font-display);white-space:nowrap}
`;
  const index = `${head(c.brand, c.lead.slice(0, 155), c.theme.googleFontsHref, "sensorial")}<body data-wa="${E(c.waNumber)}" data-shell="sensorial">${ch.header}<main>
<section class="hero-c"><img class="bg" src="${E(heroImg)}" alt=""/>
<div class="content"><p class="eyebrow">${E(c.kicker)}</p>
<h1>${E(c.headlineLine1)}<br>${E(c.headlineLine2)}</h1>
<p class="sub">${E(c.lead)}</p>
<div class="actions"><a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a><a class="btn btn-ghost" href="services.html">${E(c.secondaryCta)}</a></div></div></section>
<section class="section reveal"><div class="section-inner center"><p class="eyebrow">The Experience</p><h2>Crafted moments</h2><div class="divider"></div>
<p class="lead-c">${E(c.lead)}</p><div class="cards" style="text-align:left">${cards}</div></div></section>
<section class="section reveal" style="background:var(--ink-2)"><div class="section-inner split">
<div><img src="${E(c.aboutImage)}" alt=""/></div>
<div><p class="eyebrow">Our Story</p><h2>${E(c.aboutTitle)}</h2><div class="divider" style="margin-left:0"></div>${aboutPs}
<a class="btn btn-primary" href="about.html">Discover Our Story</a></div></div></section>
<section class="section reveal"><div class="section-inner center"><p class="eyebrow">Visual Journal</p><h2>Atmosphere</h2><div class="divider"></div>
<div class="mosaic">${gal}</div><p style="margin-top:1.5rem"><a class="btn btn-ghost" href="gallery.html">View Full Gallery</a></p></div></section>
<section class="cta-band reveal"><p class="eyebrow">Reservations</p><h2>${E(c.ctaTitle)}</h2>
<p class="lead-c">${E(c.ctaBody)}</p><a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a></section>
</main>${ch.footer}</body></html>`;
  return {
    "index.html": index,
    "about.html": page("sensorial", c, ch, "About", `<section class="section"><div class="section-inner split"><div><img src="${E(c.aboutImage)}" alt=""/></div><div><h2>${E(c.aboutTitle)}</h2>${aboutPs}</div></div></section>`),
    "services.html": page("sensorial", c, ch, "Menu", `<section class="section"><div class="section-inner" style="max-width:720px"><p class="eyebrow center">Menu</p><h2 class="center">Signature selections</h2><div class="divider"></div>${menu}</div></section>`),
    "gallery.html": page("sensorial", c, ch, "Gallery", `<section class="section"><div class="section-inner"><div class="mosaic">${gal}</div></div></section>`),
    "contact.html": page("sensorial", c, ch, "Reserve", contactBlock(c)),
    "styles.css": baseCss(c.theme, "sensorial", extra),
    "script.js": shellJs(),
    "pages.json": pagesJson("sensorial"),
  };
}

/** AUTHORITY: split hero (text left, image right), horizontal service rows */
function renderAuthority(c: ShellContent): Record<string, string> {
  const ch = chrome(c, "authority");
  const heroImg = c.aboutImage || c.gallery[0]?.src || "";
  const rows = (c.services || []).map((s) =>
    `<div class="row reveal"><img src="${E(s.image)}" alt="${E(s.title)}"/><div><h3>${E(s.title)}</h3><p>${E(s.body)}</p></div></div>`
  ).join("");
  const aboutPs = (c.aboutParagraphs || []).map((p) => `<p style="color:var(--muted);margin-bottom:.8rem">${E(p)}</p>`).join("");
  const extra = `
.btn{border-radius:2px}.hero-a{padding:8.5rem 1.35rem 3rem;max-width:var(--max);margin:0 auto;display:grid;gap:2rem}
@media(min-width:800px){.hero-a{grid-template-columns:1.15fr .85fr;align-items:center}}
.hero-a h1{font-size:clamp(2.3rem,5vw,3.5rem);font-weight:400;margin:0 0 1rem}
.hero-a .lead{color:var(--muted);margin-bottom:1.5rem;max-width:40ch}
.hero-a img{width:100%;aspect-ratio:4/5;object-fit:cover;border:1px solid var(--line)}
.kicker{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:.85rem}
.row{display:grid;gap:1.25rem;padding:1.75rem 0;border-bottom:1px solid var(--line)}@media(min-width:700px){.row{grid-template-columns:200px 1fr;align-items:center}}
.row img{width:100%;aspect-ratio:4/3;object-fit:cover;border:1px solid var(--line)}
.row h3{font-size:1.45rem;font-weight:400;margin:0 0 .4rem}.row p{color:var(--muted);margin:0}
.cta-strip{text-align:center;padding:3.5rem 1.5rem;border-block:1px solid var(--line);background:var(--surface)}
`;
  const index = `${head(c.brand, c.lead.slice(0, 155), c.theme.googleFontsHref, "authority")}<body data-wa="${E(c.waNumber)}" data-shell="authority">${ch.header}<main>
<section class="hero-a"><div><span class="kicker">${E(c.kicker)}</span>
<h1>${E(c.headlineLine1)} ${E(c.headlineLine2)}</h1>
<p class="lead">${E(c.lead)}</p>
<a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a>
<a class="btn btn-ghost" style="margin-left:.5rem" href="services.html">${E(c.secondaryCta)}</a></div>
<div><img src="${E(heroImg)}" alt="${E(c.brand)}"/></div></section>
<section class="section"><div class="section-inner"><span class="kicker">Practice</span><h2 style="margin-bottom:1rem;font-weight:400">How we help</h2>${rows}</div></section>
<section class="section" style="background:var(--ink-2)"><div class="section-inner" style="max-width:640px"><span class="kicker">About</span><h2 style="font-weight:400">${E(c.aboutTitle)}</h2>${aboutPs}
<a class="btn btn-primary" style="margin-top:1rem" href="about.html">Learn more</a></div></section>
<section class="cta-strip reveal"><h2 style="font-weight:400">${E(c.ctaTitle)}</h2><p style="color:var(--muted);margin:1rem auto 1.5rem;max-width:36ch">${E(c.ctaBody)}</p>
<a class="btn btn-primary" href="contact.html">${E(c.primaryCta)}</a></section>
</main>${ch.footer}</body></html>`;
  return {
    "index.html": index,
    "about.html": page("authority", c, ch, "About", `<section class="section"><div class="section-inner" style="max-width:640px"><h2>${E(c.aboutTitle)}</h2>${aboutPs}</div></section>`),
    "services.html": page("authority", c, ch, "Services", `<section class="section"><div class="section-inner">${rows}</div></section>`),
    "gallery.html": page("authority", c, ch, "Gallery", `<section class="section"><div class="section-inner" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">${(c.gallery || []).map((g) => `<img src="${E(g.src)}" alt="${E(g.alt)}" style="width:100%;aspect-ratio:1;object-fit:cover;border:1px solid var(--line)"/>`).join("")}</div></section>`),
    "contact.html": page("authority", c, ch, "Contact", contactBlock(c)),
    "styles.css": baseCss(c.theme, "authority", extra),
    "script.js": shellJs(),
    "pages.json": pagesJson("authority"),
  };
}

export function renderShellById(shellId: ShellId, c: ShellContent): Record<string, string> {
  const themed: ShellContent = { ...c, theme: themeForShell(shellId, c.theme?.accent) };
  switch (shellId) {
    case "athletic":
      return renderAthletic(themed);
    case "sanctuary":
      return renderSanctuary(themed);
    case "sensorial":
      return renderSensorial(themed);
    case "authority":
      return renderAuthority(themed);
    case "editorial":
      // editorial: athletic bones + sharp zero-radius + asymmetric note in CSS
      {
        const files = renderAthletic(themed);
        files["styles.css"] += `\n/* editorial overrides */.btn,.btn-primary,.btn-ghost{border-radius:0!important}.hero h1{letter-spacing:.02em;font-weight:500}
@media(min-width:900px){.bento{grid-template-columns:repeat(12,1fr)}.bento-card:nth-child(1){grid-column:span 7}.bento-card:nth-child(2){grid-column:span 5}.bento-card:nth-child(3){grid-column:span 5}}`;
        return files;
      }
    case "hospitality":
      return renderSensorial(themed); // space-first centered luxury
    case "trade":
      return renderAuthority(themed); // rows + trust
    case "clarity":
    default:
      return renderAthletic(themed);
  }
}
