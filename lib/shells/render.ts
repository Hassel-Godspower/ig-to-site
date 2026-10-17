/**
 * Multi-shell renderer — distinct HTML structure + CSS per shell family.
 * Content is shared; layout and visual system are not.
 */
import type { ShellContent } from "./types";
import { esc as E } from "./types";
import type { ShellId } from "./registry";
import { themeForShell } from "./themes";

function head(title: string, desc: string, fontsHref: string) {
  return `<!DOCTYPE html><html lang="en"><head>
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

function chrome(c: ShellContent, current: string) {
  const nav = (c.nav?.length
    ? c.nav
    : [
        { href: "index.html", label: "Home" },
        { href: "about.html", label: "About" },
        { href: "services.html", label: "Services" },
        { href: "gallery.html", label: "Gallery" },
        { href: "contact.html", label: "Contact" },
      ]
  )
    .map(
      (n) =>
        `<a href="${E(n.href)}"${n.href === current ? ' aria-current="page"' : ""}>${E(n.label)}</a>`
    )
    .join("");
  const logo = c.logoUrl
    ? `<img src="${E(c.logoUrl)}" alt="${E(c.brand)}" height="36"/>`
    : "";
  return {
    header: `<header class="site-header"><div class="nav-bar">
<a class="brand" href="index.html">${logo}<span>${E(c.brand)}</span></a>
<button type="button" class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
<nav class="desktop-nav">${nav}</nav>
<div class="header-ctas"><a class="btn btn-primary btn-sm" href="contact.html">${E(c.primaryCta)}</a></div>
<div class="mobile-nav">${nav}<a class="cta" href="contact.html">${E(c.primaryCta)}</a></div>
</div></header>`,
    footer: `<footer class="site-footer"><div class="footer-inner">
<div><strong class="footer-brand">${E(c.brand)}</strong><p class="footer-blurb">${E(c.footerBlurb)}</p></div>
<div class="footer-links">${nav}</div>
<div class="footer-meta"><p>${E(c.kicker)}</p></div>
</div><div class="footer-bottom"><p>© ${new Date().getFullYear()} ${E(c.brand)}</p></div></footer>`,
    tabbar: `<nav class="tabbar" aria-label="Mobile">
<a href="index.html">Home</a><a href="services.html">Services</a>
<a href="gallery.html">Gallery</a><a href="contact.html">Contact</a></nav>`,
  };
}

/** Shell-specific layout CSS differences layered on base tokens */
function cssForShell(shellId: ShellId, c: ShellContent): string {
  const t = c.theme;
  const d = t.mode === "dark";
  const btnRadius =
    shellId === "editorial" || shellId === "sensorial" || shellId === "sanctuary"
      ? "2px"
      : "999px";
  const letterKicker =
    shellId === "sanctuary" || shellId === "sensorial" || shellId === "hospitality"
      ? "0.22em"
      : "0.14em";

  return `/* goke shell: ${shellId} */
:root{--ink:${t.ink};--ink-2:${t.ink2};--surface:${t.surface};--line:${t.line};--text:${t.text};--muted:${t.muted};--accent:${t.accent};--accent-dim:${t.accentDim};--accent-glow:${t.accentGlow};--on-accent:${t.onAccent};--radius:${t.radius};--radius-lg:${t.radiusLg};--max:1180px;--font-display:${t.fontDisplay};--font-body:${t.fontBody}}
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{font-family:var(--font-body);background:var(--ink);color:var(--text);line-height:1.65;min-height:100vh;font-weight:${shellId === "sanctuary" || shellId === "sensorial" ? "300" : "400"}}
img{max-width:100%;display:block}a{color:inherit;text-decoration:none}ul{list-style:none}
h1,h2,h3{font-family:var(--font-display);font-weight:${shellId === "athletic" || shellId === "trade" ? "700" : "500"};line-height:1.08;letter-spacing:${shellId === "athletic" ? "-.03em" : "0.01em"}}
.site-header{position:fixed;top:0;left:0;right:0;z-index:100;border-bottom:1px solid transparent;transition:.3s}
.site-header.is-scrolled{background:${d ? "rgba(10,12,14,.9)" : "rgba(255,255,255,.92)"};backdrop-filter:blur(18px);border-bottom-color:var(--line)}
.nav-bar{max-width:var(--max);margin:0 auto;padding:1.05rem 1.35rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.brand{display:inline-flex;align-items:center;gap:.6rem;font-family:var(--font-display);font-weight:600;font-size:1.2rem;letter-spacing:.06em}
.brand img{height:36px;width:auto;max-width:120px;object-fit:contain;border-radius:${shellId === "editorial" ? "0" : "8px"}}
.desktop-nav{display:none;gap:1.6rem}.desktop-nav a{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}.desktop-nav a[aria-current=page],.desktop-nav a:hover{color:var(--text)}
.header-ctas{display:none}.nav-toggle{width:44px;height:44px;border:1px solid var(--line);border-radius:${t.radiusLg};background:0;display:grid;place-items:center;gap:5px;cursor:pointer}
.nav-toggle span{display:block;width:18px;height:1.5px;background:var(--text)}
.mobile-nav{display:none;position:absolute;top:100%;left:0;right:0;background:var(--ink-2);padding:.5rem 1.35rem 1.5rem;flex-direction:column;border-bottom:1px solid var(--line)}
.mobile-nav.is-open{display:flex}.mobile-nav a{padding:.85rem 0;border-bottom:1px solid var(--line);font-family:var(--font-display);font-size:1.25rem}
.mobile-nav a.cta{margin-top:1rem;border:0;text-align:center;background:var(--accent);color:var(--on-accent);border-radius:${btnRadius};padding:.9rem;font-family:var(--font-body);font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:.9rem 1.5rem;border-radius:${btnRadius};font-weight:600;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;border:1.5px solid transparent;cursor:pointer;transition:.25s}
.btn-primary{background:var(--accent);color:var(--on-accent)}.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 36px var(--accent-glow)}
.btn-ghost{border-color:var(--line);background:0;color:var(--text)}.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
.btn-sm{padding:.65rem 1.15rem;font-size:.7rem}
.hero{min-height:100dvh;display:grid;position:relative;padding-top:5rem;overflow:hidden}
.hero-visual{position:absolute;inset:0}.hero-visual img{width:100%;height:100%;object-fit:cover;opacity:${shellId === "athletic" ? 0.5 : 0.42};filter:${shellId === "sanctuary" || shellId === "sensorial" ? "brightness(0.85)" : "none"}}
.hero-visual::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,${d ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.35)"} 0%,transparent 40%,${d ? "var(--ink)" : "var(--ink)"} 100%)}
.hero-body{position:relative;z-index:1;max-width:var(--max);margin:0 auto;padding:2rem 1.35rem 3.5rem;width:100%;display:flex;flex-direction:column;justify-content:flex-end${shellId === "sensorial" || shellId === "sanctuary" ? ";text-align:center;align-items:center" : ""}}
.kicker{font-size:.7rem;font-weight:600;letter-spacing:${letterKicker};text-transform:uppercase;color:var(--accent);margin-bottom:1.1rem}
.hero h1{font-size:clamp(2.6rem,9vw,4.8rem);max-width:${shellId === "sensorial" || shellId === "sanctuary" ? "16ch" : "12ch"};margin-bottom:1.1rem}
.hero h1 .line2{color:var(--accent);${shellId === "sanctuary" || shellId === "sensorial" ? "font-style:italic;font-weight:400" : ""}}
.hero-lead{font-size:${shellId === "sanctuary" || shellId === "sensorial" ? "1.2rem" : "1.05rem"};color:var(--muted);max-width:38ch;margin-bottom:1.75rem;${shellId === "sanctuary" || shellId === "sensorial" ? "font-family:var(--font-display);font-style:italic" : ""}}
.hero-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:2.5rem;${shellId === "sensorial" || shellId === "sanctuary" ? "justify-content:center" : ""}}
.hero-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;border-top:1px solid var(--line);padding-top:1.4rem;max-width:480px;width:100%}
.hero-metrics strong{display:block;font-family:var(--font-display);font-size:1.6rem}.hero-metrics span{font-size:.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.section{padding:4.75rem 1.35rem}.section-inner{max-width:var(--max);margin:0 auto}
.section-label{font-size:.7rem;font-weight:600;letter-spacing:${letterKicker};text-transform:uppercase;color:var(--accent);margin-bottom:.7rem;${shellId === "sensorial" || shellId === "sanctuary" || shellId === "hospitality" ? "text-align:center" : ""}}
.section-title{font-size:clamp(1.85rem,4vw,2.75rem);margin-bottom:.75rem;${shellId === "sensorial" || shellId === "sanctuary" || shellId === "hospitality" ? "text-align:center" : ""}}
.section-copy{color:var(--muted);max-width:48ch;margin-bottom:2rem;${shellId === "sensorial" || shellId === "sanctuary" ? "margin-left:auto;margin-right:auto;text-align:center;font-family:var(--font-display);font-style:italic" : ""}}
.divider{width:44px;height:1px;background:var(--accent);margin:0 auto 2rem;opacity:.75}
.bento{display:grid;gap:1.1rem}
.bento-card{position:relative;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--line);background:var(--surface);min-height:${shellId === "editorial" ? "320px" : "270px"};display:flex;flex-direction:column;justify-content:flex-end;transition:transform .35s,border-color .35s}
.bento-card:hover{transform:translateY(-4px);border-color:var(--accent)}
.bento-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.4}
.bento-card .body{position:relative;z-index:1;padding:1.35rem;background:linear-gradient(transparent,rgba(0,0,0,.75))}
.bento-card .tag{font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:.35rem}
.split{display:grid;gap:2.5rem;align-items:center}@media(min-width:860px){.split{grid-template-columns:1fr 1fr;gap:3.5rem}}
.split-media img{width:100%;aspect-ratio:${shellId === "sanctuary" ? "4/5" : "5/4"};object-fit:cover;border:1px solid var(--line);border-radius:var(--radius)}
.list-check{margin-top:1rem}.list-check li{padding:.4rem 0 .4rem 1.4rem;position:relative;color:var(--muted)}.list-check li::before{content:"";position:absolute;left:0;top:.85rem;width:8px;height:8px;border-radius:50%;background:var(--accent)}
.mosaic{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}@media(min-width:768px){.mosaic{grid-template-columns:repeat(3,1fr);gap:1rem}}
.mosaic figure{margin:0;overflow:hidden;border:1px solid var(--line);border-radius:var(--radius)}
.mosaic img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .6s}.mosaic figure:hover img{transform:scale(1.05)}
.quotes{display:grid;gap:1.25rem}@media(min-width:700px){.quotes{grid-template-columns:1fr 1fr}}
.quote{border:1px solid var(--line);padding:1.5rem;border-radius:var(--radius-lg);background:var(--surface)}.quote p{font-family:var(--font-display);font-size:1.2rem;font-style:italic;margin-bottom:.75rem}.quote footer{color:var(--muted);font-size:.85rem}
.cta-panel{text-align:center;padding:3rem 1.5rem;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--surface)}
.cta-panel h2{margin-bottom:.5rem}.cta-panel p{color:var(--muted);margin-bottom:1.5rem;max-width:36ch;margin-left:auto;margin-right:auto}
.page-top{padding:8.5rem 1.35rem 2.5rem;border-bottom:1px solid var(--line)}.page-top h1{font-size:clamp(2rem,5vw,3rem);margin-bottom:.5rem}.page-top p{color:var(--muted);max-width:40ch}
.contact-layout{display:grid;gap:1.5rem}@media(min-width:800px){.contact-layout{grid-template-columns:1.2fr .8fr}}
.panel{border:1px solid var(--line);border-radius:var(--radius-lg);padding:1.5rem;background:var(--surface)}
.field{margin-bottom:1rem}.field label{display:block;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:.35rem}
.field input,.field textarea,.field select{width:100%;padding:.85rem 1rem;background:var(--ink);border:1px solid var(--line);border-radius:var(--radius);color:var(--text);font:inherit}
.field input:focus,.field textarea:focus{outline:none;border-color:var(--accent)}.field textarea{min-height:120px;resize:vertical}
.site-footer{border-top:1px solid var(--line);padding:3rem 1.35rem 5.5rem;background:var(--ink-2)}
.footer-inner{max-width:var(--max);margin:0 auto;display:grid;gap:2rem}@media(min-width:700px){.footer-inner{grid-template-columns:1.4fr 1fr 1fr}}
.footer-brand{font-family:var(--font-display);font-size:1.3rem}.footer-blurb{color:var(--muted);margin-top:.5rem;font-size:.9rem}
.footer-links{display:flex;flex-direction:column;gap:.5rem}.footer-links a{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.footer-links a:hover{color:var(--accent)}
.footer-meta{color:var(--muted);font-size:.88rem}.footer-bottom{max-width:var(--max);margin:2rem auto 0;padding-top:1.25rem;border-top:1px solid var(--line);text-align:center;color:var(--muted);font-size:.78rem}
.tabbar{position:fixed;bottom:0;left:0;right:0;display:flex;background:rgba(10,12,14,.94);backdrop-filter:blur(14px);border-top:1px solid var(--line);z-index:90;padding:.4rem 0 calc(.4rem + env(safe-area-inset-bottom))}
.tabbar a{flex:1;text-align:center;padding:.55rem .2rem;font-size:.62rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}.tabbar a:hover{color:var(--accent)}
@media(min-width:900px){.desktop-nav{display:flex}.header-ctas{display:flex}.nav-toggle{display:none}.tabbar{display:none}.site-footer{padding-bottom:3rem}
.bento{grid-template-columns:${shellId === "editorial" ? "repeat(12,1fr)" : "repeat(3,1fr)"}}
${shellId === "editorial" ? ".bento-card:nth-child(1){grid-column:span 7}.bento-card:nth-child(2){grid-column:span 5}.bento-card:nth-child(3){grid-column:span 5}.bento-card:nth-child(4){grid-column:span 7}" : ""}
}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .75s,transform .75s}.reveal.is-visible{opacity:1;transform:none}
/* shell-specific accents */
${shellId === "sanctuary" ? ".hero-body{padding-bottom:4rem}.bento-card{min-height:300px}" : ""}
${shellId === "sensorial" ? ".hero h1{font-weight:400}.menu-row{display:flex;justify-content:space-between;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--line)}.menu-row h4{font-family:var(--font-display);font-size:1.15rem;font-weight:500}.menu-row .price{color:var(--accent);font-family:var(--font-display)}" : ""}
${shellId === "athletic" ? ".hero h1{letter-spacing:-.04em}.hero-metrics strong{color:var(--accent)}" : ""}
${shellId === "authority" ? ".hero-body{max-width:640px}.bento{grid-template-columns:1fr;gap:1rem}@media(min-width:900px){.bento{grid-template-columns:1fr 1fr}}" : ""}
${shellId === "trade" ? ".hero-metrics{max-width:100%;grid-template-columns:repeat(4,1fr)}" : ""}
`;
}

function renderIndex(shellId: ShellId, c: ShellContent): string {
  const ch = chrome(c, "index.html");
  const desc = c.lead.slice(0, 155);
  const metrics = (c.metrics || [])
    .slice(0, shellId === "trade" ? 4 : 3)
    .map(
      (m) =>
        `<div><strong>${E(m.value)}</strong><span>${E(m.label)}</span></div>`
    )
    .join("");
  const services = (c.services || [])
    .slice(0, 4)
    .map(
      (s) =>
        `<article class="bento-card"><img src="${E(s.image)}" alt="${E(s.title)}" loading="lazy"/><div class="body"><p class="tag">${E(s.tag)}</p><h3>${E(s.title)}</h3><p style="color:var(--muted);font-size:.92rem;margin-top:.35rem">${E(s.body)}</p></div></article>`
    )
    .join("");
  const aboutPs = (c.aboutParagraphs || [])
    .map((p) => `<p style="color:var(--muted);margin-bottom:.9rem">${E(p)}</p>`)
    .join("");
  const aboutLi = (c.aboutList || [])
    .map((x) => `<li>${E(x)}</li>`)
    .join("");
  const mosaic = (c.gallery || [])
    .slice(0, 6)
    .map(
      (g) =>
        `<figure><img src="${E(g.src)}" alt="${E(g.alt)}" loading="lazy"/></figure>`
    )
    .join("");
  const quotes = (c.quotes || [])
    .slice(0, 2)
    .map(
      (q) =>
        `<blockquote class="quote"><p>${E(q.text)}</p><footer>— <strong>${E(q.author)}</strong></footer></blockquote>`
    )
    .join("");
  const heroImg = c.gallery[0]?.src || c.aboutImage;
  const centered = shellId === "sanctuary" || shellId === "sensorial" || shellId === "hospitality";

  // Structural variation by shell
  const servicesBlock =
    shellId === "sensorial"
      ? `<section class="section reveal"><div class="section-inner"><p class="section-label">Signature selections</p><h2 class="section-title">From the kitchen</h2><div class="divider"></div><p class="section-copy">${E(c.lead)}</p><div class="bento">${services}</div><p style="text-align:center;margin-top:1.75rem"><a class="btn btn-ghost" href="services.html">${E(c.secondaryCta)}</a></p></div></section>`
      : shellId === "authority"
        ? `<section class="section reveal"><div class="section-inner"><p class="section-label">Practice areas</p><h2 class="section-title">How we help</h2><p class="section-copy">${E(c.lead)}</p><div class="bento">${services}</div></div></section>`
        : `<section class="section reveal"><div class="section-inner"><p class="section-label">${shellId === "athletic" ? "Paths" : "Offerings"}</p><h2 class="section-title">${shellId === "athletic" ? "Choose how you train" : "What we offer"}</h2><p class="section-copy">${E(c.lead)}</p><div class="bento">${services}</div></div></section>`;

  const aboutBlock = `<section class="section reveal" style="background:var(--ink-2)"><div class="section-inner split">
<div class="split-media"><img src="${E(c.aboutImage)}" alt="" loading="lazy"/></div>
<div class="split-copy"><p class="section-label" style="text-align:left">About</p><h2 style="text-align:left">${E(c.aboutTitle)}</h2>
${centered ? '<div class="divider" style="margin-left:0"></div>' : ""}
${aboutPs}<ul class="list-check">${aboutLi}</ul>
<p style="margin-top:1.5rem"><a class="btn btn-primary" href="about.html">Our story</a></p></div></div></section>`;

  const galleryBlock = `<section class="section reveal"><div class="section-inner"><p class="section-label">Gallery</p><h2 class="section-title">${shellId === "sensorial" ? "Plates & atmosphere" : shellId === "sanctuary" ? "The space" : "Inside the work"}</h2>
${centered ? '<div class="divider"></div>' : ""}
<div class="mosaic">${mosaic}</div>
<p style="margin-top:1.5rem;${centered ? "text-align:center" : ""}"><a class="btn btn-ghost" href="gallery.html">View gallery</a></p></div></section>`;

  const marquee =
    c.marquee?.length && shellId === "athletic"
      ? `<div class="marquee-wrap" style="overflow:hidden;border-block:1px solid var(--line);padding:.85rem 0"><div style="display:flex;gap:2.5rem;animation:none;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);justify-content:center;flex-wrap:wrap">${c.marquee.map((m) => `<span>${E(m)}</span>`).join("")}</div></div>`
      : "";

  return `${head(c.brand + " — " + c.kicker, desc, c.theme.googleFontsHref)}<body data-wa="${E(c.waNumber)}" data-shell="${shellId}">${ch.header}<main>
<section class="hero"><div class="hero-visual"><img src="${E(heroImg)}" alt="${E(c.brand)}" width="1800" height="1200"/></div>
<div class="hero-body"><p class="kicker">${E(c.kicker)}</p>
<h1 id="hero-headline">${E(c.headlineLine1)}<br><span class="line2">${E(c.headlineLine2)}</span></h1>
<p class="hero-lead" id="hero-subheadline">${E(c.lead)}</p>
<div class="hero-actions"><a href="contact.html" class="btn btn-primary" id="cta-button">${E(c.primaryCta)}</a>
<a href="services.html" class="btn btn-ghost">${E(c.secondaryCta)}</a></div>
${metrics ? `<div class="hero-metrics">${metrics}</div>` : ""}
</div></section>
${marquee}
${shellId === "sanctuary" || shellId === "hospitality" ? aboutBlock + servicesBlock : servicesBlock + aboutBlock}
${galleryBlock}
${quotes ? `<section class="section"><div class="section-inner quotes">${quotes}</div></section>` : ""}
<section class="section"><div class="section-inner"><div class="cta-panel reveal"><h2>${E(c.ctaTitle)}</h2><p>${E(c.ctaBody)}</p>
<a href="contact.html" class="btn btn-primary">${E(c.primaryCta)}</a></div></div></section>
</main>${ch.footer}${ch.tabbar}</body></html>`;
}

function pageShell(
  shellId: ShellId,
  c: ShellContent,
  file: string,
  title: string,
  body: string
) {
  const ch = chrome(c, file);
  const desc = c.lead.slice(0, 155);
  return `${head(title + " · " + c.brand, desc, c.theme.googleFontsHref)}<body data-wa="${E(c.waNumber)}" data-shell="${shellId}">${ch.header}<main>
<section class="page-top"><div class="section-inner"><h1>${E(title)}</h1><p>${E(c.lead)}</p></div></section>
${body}</main>${ch.footer}${ch.tabbar}</body></html>`;
}

export function renderShellById(
  shellId: ShellId,
  c: ShellContent
): Record<string, string> {
  // Ensure theme matches shell if caller passed generic theme
  const themed: ShellContent = {
    ...c,
    theme: c.theme?.fontDisplay ? c.theme : themeForShell(shellId),
  };
  // Prefer shell theme fonts/colors always for distinctness
  themed.theme = themeForShell(shellId, c.theme?.accent);

  const services = (themed.services || [])
    .map(
      (s) =>
        `<article class="bento-card"><img src="${E(s.image)}" alt="${E(s.title)}" loading="lazy"/><div class="body"><p class="tag">${E(s.tag)}</p><h3>${E(s.title)}</h3><p style="color:var(--muted);margin-top:.35rem">${E(s.body)}</p></div></article>`
    )
    .join("");
  const aboutPs = (themed.aboutParagraphs || [])
    .map((p) => `<p style="color:var(--muted);margin-bottom:.9rem">${E(p)}</p>`)
    .join("");
  const aboutLi = (themed.aboutList || [])
    .map((x) => `<li>${E(x)}</li>`)
    .join("");
  const mosaic = (themed.gallery || [])
    .map(
      (g) =>
        `<figure><img src="${E(g.src)}" alt="${E(g.alt)}" loading="lazy"/></figure>`
    )
    .join("");

  return {
    "index.html": renderIndex(shellId, themed),
    "about.html": pageShell(
      shellId,
      themed,
      "about.html",
      "About",
      `<section class="section"><div class="section-inner split"><div class="split-media"><img src="${E(themed.aboutImage)}" alt=""/></div><div class="split-copy"><h2>${E(themed.aboutTitle)}</h2>${aboutPs}<ul class="list-check">${aboutLi}</ul></div></div></section>`
    ),
    "services.html": pageShell(
      shellId,
      themed,
      "services.html",
      "Services",
      `<section class="section"><div class="section-inner"><div class="bento">${services}</div><p style="margin-top:2rem;text-align:center"><a class="btn btn-primary" href="contact.html">${E(themed.primaryCta)}</a></p></div></section>`
    ),
    "gallery.html": pageShell(
      shellId,
      themed,
      "gallery.html",
      "Gallery",
      `<section class="section"><div class="section-inner"><div class="mosaic">${mosaic}</div></div></section>`
    ),
    "contact.html": pageShell(
      shellId,
      themed,
      "contact.html",
      "Contact",
      `<section class="section"><div class="section-inner contact-layout"><div class="panel"><h2 style="margin-bottom:1rem">${E(themed.ctaTitle)}</h2><p style="color:var(--muted);margin-bottom:1.5rem">${E(themed.ctaBody)}</p>
<form id="contact-form"><div class="field"><label for="name">Name</label><input id="name" name="name" required/></div>
<div class="field"><label for="email">Email</label><input id="email" name="email" type="email"/></div>
<div class="field"><label for="message">Message</label><textarea id="message" name="message" required></textarea></div>
<button type="submit" class="btn btn-primary">Send via WhatsApp</button></form></div>
<div class="panel"><h3>${E(themed.brand)}</h3><p style="color:var(--muted)">${E(themed.footerBlurb)}</p></div></div></section>`
    ),
    "styles.css": cssForShell(shellId, themed),
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
        shell: shellId,
      },
      null,
      2
    ),
  };
}
