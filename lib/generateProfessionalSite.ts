/**
 * Premium professional site generator.
 * Compatible with main: themeForProfile, googleFontsLink, ensureSkillGroups, JSON Resume.
 * Layout modes: split_sticky | long_single | work_grid | multipage_editorial
 */

import type { ProfessionalProfile } from "./professionalProfile";
import { ensureSkillGroups } from "./professionalProfile";
import { professionalToJsonResume } from "./jsonResume";
import {
  themeForProfile,
  googleFontsLink,
  contentScore,
  resolveLayout,
  type ProfessionalTheme,
  type ProLayoutMode,
} from "./professionalThemes";

export type ProfessionalSiteFiles = Record<string, string>;

const E = (s: string) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function arr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
}

function waLink(phone?: string): string | null {
  if (!phone) return null;
  const n = phone.replace(/\D/g, "");
  if (n.length < 10) return null;
  return `https://wa.me/${n}`;
}

function contactHref(p: ProfessionalProfile): string {
  return waLink(p.phone) || (p.email ? `mailto:${p.email}` : "#contact");
}

function socialHtml(p: ProfessionalProfile): string {
  const out: string[] = [];
  if (p.linkedinUrl)
    out.push(
      `<a href="${E(p.linkedinUrl)}" target="_blank" rel="noopener noreferrer" data-goke="button">LinkedIn</a>`
    );
  if (p.email)
    out.push(
      `<a href="mailto:${E(p.email)}" data-goke="button">Email</a>`
    );
  const wa = waLink(p.phone);
  if (wa)
    out.push(
      `<a href="${wa}" target="_blank" rel="noopener noreferrer" data-goke="button">WhatsApp</a>`
    );
  return out.join(" · ");
}

function projectTable(p: ProfessionalProfile): string {
  const projects = arr(p.projects);
  if (!projects.length) {
    return `<table class="proj-table" data-goke="section" data-section-name="Projects">
      <thead><tr><th>Year</th><th>Project</th><th>Built with</th><th></th></tr></thead>
      <tbody>
        <tr>
          <td data-goke="text">—</td>
          <td data-goke="heading">Selected project</td>
          <td data-goke="text">Add stack in editor</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <p class="muted" data-goke="text">Replace with real work from your CV or portfolio.</p>`;
  }
  const rows = projects
    .map((pr) => {
      const stack = arr(pr.keywords).join(", ") || "—";
      const link = pr.url
        ? `<a href="${E(pr.url)}" target="_blank" rel="noopener">View</a>`
        : "";
      return `<tr>
        <td data-goke="text">—</td>
        <td data-goke="heading">${E(pr.name)}</td>
        <td data-goke="text">${E(stack)}</td>
        <td>${link}</td>
      </tr>`;
    })
    .join("");
  return `<table class="proj-table" data-goke="section" data-section-name="Projects">
    <thead><tr><th>Year</th><th>Project</th><th>Built with</th><th></th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function experienceTimeline(p: ProfessionalProfile): string {
  const exp = arr(p.experience);
  if (!exp.length) {
    return `<article class="timeline-item"><p data-goke="text">Add roles from your CV in the editor.</p></article>`;
  }
  return exp
    .map(
      (ex) => `<article class="timeline-item">
      <h3 data-goke="heading">${E(ex.title)}</h3>
      <p class="muted" data-goke="text">${E(ex.company)}${
        ex.start || ex.end
          ? ` · ${E([ex.start, ex.end].filter(Boolean).join(" – "))}`
          : ""
      }</p>
      ${
        arr(ex.bullets).length
          ? `<ul>${arr(ex.bullets)
              .map((b) => `<li data-goke="text">${E(b)}</li>`)
              .join("")}</ul>`
          : ""
      }
    </article>`
    )
    .join("");
}

function skillsChips(p: ProfessionalProfile): string {
  const groups = ensureSkillGroups(p);
  if (!groups.length && !arr(p.skills).length) return "";
  const keywords =
    groups.length > 0
      ? groups.flatMap((g) => g.keywords).slice(0, 28)
      : arr(p.skills).slice(0, 28);
  return `<div class="skill-cloud">${keywords
    .map((s) => `<span data-goke="text">${E(s)}</span>`)
    .join("")}</div>`;
}

function contactBlock(p: ProfessionalProfile, t: ProfessionalTheme): string {
  const wa = waLink(p.phone);
  return `<section class="section reveal" id="contact" data-goke="section" data-section-name="Contact">
    <h2><span class="num">04.</span> Contact</h2>
    <p class="muted" data-goke="text">Open to conversations.</p>
    <form class="contact-form" data-goke-contact data-wa="${E(
      (p.phone || "").replace(/\D/g, "")
    )}" data-email="${E(p.email || "")}">
      <input name="name" placeholder="Your name" required data-goke="text" />
      <input name="contact" placeholder="Email or phone" required data-goke="text" />
      <textarea name="message" rows="4" placeholder="Message" data-goke="text"></textarea>
      <button type="submit" class="btn btn-fill" data-goke="button">${E(
        t.ctaPrimary
      )}</button>
    </form>
    <p class="muted social-line">${socialHtml(p)}</p>
  </section>`;
}

function shellCss(t: ProfessionalTheme): string {
  return `:root{
  --ink:${t.ink};--surface:${t.surface};--surface-2:${t.surface2};--line:${t.line};
  --text:${t.text};--muted:${t.muted};--accent:${t.accent};--on-accent:${t.onAccent};
  --font-display:${t.displayFont};--font-body:${t.bodyFont};--radius:${t.radius};
  --wrap:min(1100px,calc(100% - 2.5rem));
}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font-family:var(--font-body);background:var(--ink);color:var(--text);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}a:hover{opacity:.9}
.wrap{width:var(--wrap);margin-inline:auto}
.muted{color:var(--muted)}
h1,h2,h3{font-family:var(--font-display);line-height:1.15;margin:0 0 .65rem}
h1{font-size:clamp(2rem,4.5vw,3.1rem);font-weight:700}
h2{font-size:clamp(1.35rem,2.4vw,1.75rem)}
h2 .num{color:var(--accent);font-family:var(--font-body);font-size:.85em;margin-right:.45rem}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:.7rem 1.2rem;border-radius:999px;font-weight:600;font-size:.9rem;border:1px solid var(--accent);background:transparent;color:var(--accent);cursor:pointer;text-decoration:none}
.btn:hover{background:color-mix(in srgb,var(--accent) 15%,transparent);text-decoration:none}
.btn-fill{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.site-header{position:sticky;top:0;z-index:40;backdrop-filter:blur(12px);background:color-mix(in srgb,var(--ink) 90%,transparent);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;gap:12px}
.brand{font-family:var(--font-display);font-weight:700;font-size:1.1rem;color:var(--accent);text-decoration:none}
.nav-links{display:none;flex-wrap:wrap;gap:1.15rem;font-size:.85rem;margin-left:auto}
.nav-links a{color:var(--muted);text-decoration:none}
.nav-links a:hover,.nav-links a.is-active{color:var(--accent)}
.header-cta{display:none;margin-left:.5rem}
.nav-toggle{margin-left:auto;background:transparent;border:1px solid var(--line);color:var(--text);padding:8px 12px;border-radius:8px;cursor:pointer}
.mobile-panel{display:none;flex-direction:column;gap:12px;padding:12px 0 16px;border-top:1px solid var(--line)}
.mobile-panel.open{display:flex}
@media(min-width:880px){.nav-links{display:flex}.header-cta{display:inline-flex}.nav-toggle,.mobile-panel{display:none!important}}
.split-layout{display:block;padding:1.25rem 0 3rem}
@media(min-width:960px){
  .split-layout{display:grid;grid-template-columns:minmax(260px,380px) 1fr;gap:2.5rem;min-height:100vh;width:var(--wrap);margin-inline:auto;padding:0 0 4rem}
  .split-rail{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;justify-content:center;padding:3rem 0}
  .split-main{padding:3.5rem 0 5rem}
  .site-header.split-hide-desktop{display:none}
}
.split-rail .role{font-size:1.1rem;margin:0 0 1rem;color:var(--text)}
.split-rail .blurb{color:var(--muted);max-width:28rem;margin:0 0 1.25rem}
.split-rail .rail-nav{display:flex;flex-direction:column;gap:.5rem;margin:1.2rem 0}
.split-rail .rail-nav a{color:var(--muted);font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;text-decoration:none}
.split-rail .rail-nav a:hover{color:var(--accent)}
.split-rail .socials{margin-top:2rem;font-size:.9rem}
.section{padding:2.5rem 0;scroll-margin-top:5rem}
.timeline{display:grid;gap:1rem}
.timeline-item{padding:1rem 1.15rem;border-left:2px solid var(--accent);background:var(--surface);border-radius:0 8px 8px 0}
.timeline-item ul{margin:.5rem 0 0;padding-left:1.1rem;color:var(--muted)}
.proj-table{width:100%;border-collapse:collapse;font-size:.9rem}
.proj-table th{text-align:left;color:var(--muted);font-weight:500;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;padding:.5rem .55rem;border-bottom:1px solid var(--line)}
.proj-table td{padding:.8rem .55rem;border-bottom:1px solid var(--line);vertical-align:top}
.proj-table tr:hover td{background:color-mix(in srgb,var(--accent) 8%,transparent)}
.skill-cloud{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.85rem}
.skill-cloud span{padding:.3rem .55rem;border-radius:4px;border:1px solid color-mix(in srgb,var(--accent) 40%,transparent);color:var(--accent);font-size:.75rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.work-grid{display:grid;gap:1rem;grid-template-columns:1fr}
@media(min-width:640px){.work-grid{grid-template-columns:1fr 1fr}}
.work-card{padding:1.2rem;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius)}
.contact-form{display:grid;gap:.7rem;max-width:420px;margin-top:1rem}
.contact-form input,.contact-form textarea{padding:.7rem .85rem;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--text);font:inherit}
.site-footer{border-top:1px solid var(--line);padding:2rem 0;margin-top:2rem;font-size:.8rem;color:var(--muted)}
.footer-inner{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.75rem;width:var(--wrap);margin-inline:auto}
.hero-simple{padding:3.25rem 0 1.5rem}
.hero-simple .lead{color:var(--muted);max-width:36rem}
.reveal{opacity:0;transform:translateY(12px);transition:opacity .5s ease,transform .5s ease}
.reveal.visible{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}html{scroll-behavior:auto}}
.social-line{margin-top:1rem;font-size:.9rem}
`;
}

function scriptJs(): string {
  return `document.querySelectorAll("form[data-goke-contact]").forEach(function(f){
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var fd=new FormData(f);
    var wa=(f.getAttribute("data-wa")||"").replace(/\\D/g,"");
    var msg="Hello, I'm "+(fd.get("name")||"")+".\\nContact: "+(fd.get("contact")||"")+"\\n\\n"+(fd.get("message")||"");
    if(wa) window.open("https://wa.me/"+wa+"?text="+encodeURIComponent(msg),"_blank");
    else {
      var email=f.getAttribute("data-email");
      if(email) window.location.href="mailto:"+email+"?subject=Website%20enquiry&body="+encodeURIComponent(msg);
      else alert("Add a phone or email in the editor so messages can reach you.");
    }
  });
});
var toggle=document.querySelector("[data-nav-toggle]");
var panel=document.querySelector("[data-mobile-panel]");
if(toggle&&panel){toggle.addEventListener("click",function(){panel.classList.toggle("open");});}
if("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting) en.target.classList.add("visible");});
  },{threshold:0.12});
  document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});
}else{document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("visible");});}
`;
}

/** Always multipage site map — never anchor-only single page */
function navLinks(
  layout: ProLayoutMode,
  active: string
): string {
  const items =
    layout === "work_grid"
      ? [
          { href: "index.html", label: "Work" },
          { href: "about.html", label: "About" },
          { href: "experience.html", label: "Experience" },
          { href: "projects.html", label: "Projects" },
          { href: "skills.html", label: "Skills" },
          { href: "contact.html", label: "Contact" },
        ]
      : [
          { href: "index.html", label: "Home" },
          { href: "about.html", label: "About" },
          { href: "experience.html", label: "Experience" },
          { href: "projects.html", label: "Work" },
          { href: "skills.html", label: "Skills" },
          { href: "contact.html", label: "Contact" },
        ];
  return items
    .map((n) => {
      const on = n.href === active ? ' class="is-active" aria-current="page"' : "";
      return `<a href="${n.href}"${on}>${E(n.label)}</a>`;
    })
    .join("\n          ");
}

function pageShell(
  title: string,
  name: string,
  body: string,
  t: ProfessionalTheme,
  layout: ProLayoutMode,
  opts: { description?: string; active: string; hideHeaderDesktop?: boolean }
): string {
  const fonts = googleFontsLink(t);
  const home = "index.html";
  const cta = "contact.html";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${E(title)} | ${E(name)}</title>
  <meta name="description" content="${E(opts.description || title)}" />
  <meta property="og:title" content="${E(title)} | ${E(name)}" />
  <link rel="stylesheet" href="${fonts}" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body id="top" data-theme="${E(t.id)}" data-layout="${layout}">
  <header class="site-header${
    opts.hideHeaderDesktop ? " split-hide-desktop" : ""
  }" data-goke="section" data-section-name="Header">
    <div class="wrap nav">
      <a class="brand" href="${home}" data-goke="heading">${E(
    name.split(/\s+/)[0] || "Home"
  )}</a>
      <nav class="nav-links" aria-label="Primary">
          ${navLinks(layout, opts.active)}
      </nav>
      <a class="btn header-cta" href="${cta}" data-goke="button">${E(
    t.ctaPrimary
  )}</a>
      <button type="button" class="nav-toggle" data-nav-toggle aria-label="Menu">Menu</button>
    </div>
    <div class="wrap mobile-panel" data-mobile-panel>
          ${navLinks(layout, opts.active)}
      <a class="btn" href="${cta}">${E(t.ctaPrimary)}</a>
    </div>
  </header>
  <main>
${body}
  </main>
  <footer class="site-footer" data-goke="section" data-section-name="Footer">
    <div class="footer-inner">
      <span>&copy; ${new Date().getFullYear()} ${E(name)}</span>
      <span>Built with goke</span>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>`;
}

function buildSplitSticky(
  p: ProfessionalProfile,
  t: ProfessionalTheme
): ProfessionalSiteFiles {
  const layout: ProLayoutMode = "split_sticky";
  const name = p.fullName;
  const body = `
  <div class="split-layout">
    <aside class="split-rail" data-goke="section" data-section-name="Identity">
      <p class="muted" style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;margin:0 0 .4rem">Portfolio</p>
      <h1 data-goke="heading">${E(name)}</h1>
      <p class="role" data-goke="text">${E(p.headline || "Builder")}</p>
      <p class="blurb" data-goke="text">${E(
        (p.about || "").slice(0, 280) ||
          "I build thoughtful digital products. Edit this site to tell your story."
      )}</p>
      <nav class="rail-nav" aria-label="Site">
        <a href="about.html">About</a>
        <a href="experience.html">Experience</a>
        <a href="projects.html">Work</a>
        <a href="skills.html">Skills</a>
        <a href="contact.html">Contact</a>
      </nav>
      <div class="socials">${socialHtml(p)}</div>
    </aside>
    <div class="split-main">
      <section class="section reveal" id="about" data-goke="section" data-section-name="About">
        <h2><span class="num">01.</span> About</h2>
        <p data-goke="text">${E(
          p.about || "Add a short narrative about how you work."
        )}</p>
        ${skillsChips(p)}
      </section>
      <section class="section reveal" id="experience" data-goke="section" data-section-name="Experience">
        <h2><span class="num">02.</span> Experience</h2>
        <div class="timeline">${experienceTimeline(p)}</div>
      </section>
      <section class="section reveal" id="work" data-goke="section" data-section-name="Work">
        <h2><span class="num">03.</span> Work</h2>
        ${projectTable(p)}
      </section>
      ${contactBlock(p, t)}
    </div>
  </div>`;
  return {
    "index.html": pageShell("Home", name, body, t, layout, {
      description: p.headline || name,
      active: "#about",
      hideHeaderDesktop: true,
    }),
  };
}

function buildLongSingle(
  p: ProfessionalProfile,
  t: ProfessionalTheme
): ProfessionalSiteFiles {
  const layout: ProLayoutMode = "long_single";
  const name = p.fullName;
  const body = `
  <section class="hero-simple wrap reveal" data-goke="section" data-section-name="Hero">
    <p class="muted" style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase">Personal site</p>
    <h1 data-goke="heading">${E(name)}</h1>
    <p style="font-size:1.15rem;font-weight:600" data-goke="text">${E(
      p.headline || "Professional"
    )}</p>
    <p class="lead" data-goke="text">${E(
      (p.about || "").slice(0, 320) ||
        "A clear presence on the open web — edit every line in goke."
    )}</p>
    <p style="margin-top:1.25rem">
      <a class="btn btn-fill" href="contact.html" data-goke="button">${E(
        t.ctaPrimary
      )}</a>
    </p>
  </section>
  <div class="wrap">
    <section class="section reveal" id="about" data-goke="section" data-section-name="About">
      <h2><span class="num">01.</span> About</h2>
      <p data-goke="text">${E(p.about || "Your story goes here.")}</p>
      ${skillsChips(p)}
    </section>
    <section class="section reveal" id="experience" data-goke="section" data-section-name="Experience">
      <h2><span class="num">02.</span> Experience</h2>
      <div class="timeline">${experienceTimeline(p)}</div>
    </section>
    <section class="section reveal" id="work" data-goke="section" data-section-name="Work">
      <h2><span class="num">03.</span> Selected work</h2>
      ${projectTable(p)}
    </section>
    ${contactBlock(p, t)}
  </div>`;
  return {
    "index.html": pageShell("Home", name, body, t, layout, {
      description: p.headline || name,
      active: "#about",
    }),
  };
}

function buildWorkGrid(
  p: ProfessionalProfile,
  t: ProfessionalTheme
): ProfessionalSiteFiles {
  const layout: ProLayoutMode = "work_grid";
  const name = p.fullName;
  const projects = arr(p.projects);
  const cards = projects.length
    ? projects
        .map(
          (pr) => `<article class="work-card reveal">
        <h3 data-goke="heading">${E(pr.name)}</h3>
        <p class="muted" data-goke="text">${E(pr.description || "")}</p>
        ${
          pr.url
            ? `<a href="${E(pr.url)}" target="_blank" rel="noopener">View</a>`
            : ""
        }
      </article>`
        )
        .join("")
    : `<article class="work-card reveal"><h3 data-goke="heading">Selected work</h3><p class="muted" data-goke="text">Add projects in the editor.</p></article>`;

  return {
    "index.html": pageShell(
      "Work",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="Work">
      <h1 data-goke="heading">Work</h1>
      <p class="muted" data-goke="text">${E(p.headline || "")}</p>
      <div class="work-grid" style="margin-top:1.5rem">${cards}</div>
    </section>`,
      t,
      layout,
      { active: "index.html", description: p.headline || name }
    ),
    "about.html": pageShell(
      "About",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="About">
      <h1 data-goke="heading">About</h1>
      <p data-goke="text">${E(p.about || "")}</p>
      ${skillsChips(p)}
    </section>`,
      t,
      layout,
      { active: "about.html" }
    ),
    "experience.html": pageShell(
      "Experience",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="Experience">
      <h1 data-goke="heading">Experience</h1>
      <div class="timeline">${experienceTimeline(p)}</div>
    </section>`,
      t,
      layout,
      { active: "experience.html" }
    ),
    "contact.html": pageShell(
      "Contact",
      name,
      `<div class="wrap">${contactBlock(p, t)}</div>`,
      t,
      layout,
      { active: "contact.html" }
    ),
  };
}

function buildMultipage(
  p: ProfessionalProfile,
  t: ProfessionalTheme
): ProfessionalSiteFiles {
  const layout: ProLayoutMode = "multipage_editorial";
  const name = p.fullName;
  return {
    "index.html": pageShell(
      "Home",
      name,
      `<section class="hero-simple wrap reveal" data-goke="section" data-section-name="Hero">
      <h1 data-goke="heading">${E(name)}</h1>
      <p style="font-size:1.15rem;font-weight:600" data-goke="text">${E(
        p.headline || "Professional"
      )}</p>
      <p class="lead muted" data-goke="text">${E((p.about || "").slice(0, 260))}</p>
      <p style="margin-top:1.25rem">
        <a class="btn btn-fill" href="contact.html" data-goke="button">${E(
          t.ctaPrimary
        )}</a>
        <a class="btn" href="about.html" style="margin-left:.5rem" data-goke="button">About</a>
      </p>
    </section>
    <section class="wrap section reveal" data-goke="section" data-section-name="Work">
      <h2><span class="num">01.</span> Selected work</h2>
      ${projectTable(p)}
    </section>`,
      t,
      layout,
      { active: "index.html", description: p.headline || name }
    ),
    "about.html": pageShell(
      "About",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="About">
      <h1 data-goke="heading">About</h1>
      <p data-goke="text">${E(p.about || "")}</p>
      ${skillsChips(p)}
    </section>`,
      t,
      layout,
      { active: "about.html" }
    ),
    "experience.html": pageShell(
      "Experience",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="Experience">
      <h1 data-goke="heading">Experience</h1>
      <div class="timeline">${experienceTimeline(p)}</div>
    </section>`,
      t,
      layout,
      { active: "experience.html" }
    ),
    "projects.html": pageShell(
      "Work",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="Projects">
      <h1 data-goke="heading">Work</h1>
      ${projectTable(p)}
    </section>`,
      t,
      layout,
      { active: "projects.html" }
    ),
    "skills.html": pageShell(
      "Skills",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="Skills">
      <h1 data-goke="heading">Skills</h1>
      ${skillsChips(p) || `<p class="muted" data-goke="text">Add skills in the editor.</p>`}
    </section>`,
      t,
      layout,
      { active: "skills.html" }
    ),
    "contact.html": pageShell(
      "Contact",
      name,
      `<div class="wrap">${contactBlock(p, t)}</div>`,
      t,
      layout,
      { active: "contact.html" }
    ),
  };
}

function sharedSecondaryPages(
  p: ProfessionalProfile,
  t: ProfessionalTheme,
  layout: ProLayoutMode
): ProfessionalSiteFiles {
  const name = p.fullName;
  return {
    "about.html": pageShell(
      "About",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="About">
      <h1 data-goke="heading">About</h1>
      <p data-goke="text">${E(p.about || "Add your story in the editor.")}</p>
      ${skillsChips(p)}
    </section>`,
      t,
      layout,
      { active: "about.html", description: (p.about || "").slice(0, 150) }
    ),
    "experience.html": pageShell(
      "Experience",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="Experience">
      <h1 data-goke="heading">Experience</h1>
      <div class="timeline">${experienceTimeline(p)}</div>
    </section>`,
      t,
      layout,
      { active: "experience.html" }
    ),
    "projects.html": pageShell(
      "Work",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="Projects">
      <h1 data-goke="heading">Work</h1>
      ${projectTable(p)}
    </section>`,
      t,
      layout,
      { active: "projects.html" }
    ),
    "skills.html": pageShell(
      "Skills",
      name,
      `<section class="wrap section" data-goke="section" data-section-name="Skills">
      <h1 data-goke="heading">Skills</h1>
      ${
        skillsChips(p) ||
        `<p class="muted" data-goke="text">Add skills in the editor.</p>`
      }
    </section>`,
      t,
      layout,
      { active: "skills.html" }
    ),
    "contact.html": pageShell(
      "Contact",
      name,
      `<div class="wrap">${contactBlock(p, t)}</div>`,
      t,
      layout,
      { active: "contact.html" }
    ),
  };
}

export function generateProfessionalSiteFiles(
  profile: ProfessionalProfile
): ProfessionalSiteFiles {
  const theme = themeForProfile(profile);
  const score = contentScore(profile);
  // Visual layout preference — site is ALWAYS multi-page HTML files
  const layout = resolveLayout(theme, score);

  let pages: ProfessionalSiteFiles;

  if (layout === "work_grid") {
    pages = {
      ...buildWorkGrid(profile, theme),
      ...sharedSecondaryPages(profile, theme, "work_grid"),
    };
    // work grid index is Work-first; ensure projects/skills/contact exist
  } else if (layout === "split_sticky") {
    // Craft sticky-rail HOME, plus full secondary pages
    pages = {
      ...buildSplitSticky(profile, theme),
      ...sharedSecondaryPages(profile, theme, "split_sticky"),
    };
  } else if (layout === "long_single") {
    // Strong multipage with long-form home (not one file only)
    pages = {
      ...buildLongSingleAsHome(profile, theme),
      ...sharedSecondaryPages(profile, theme, "long_single"),
    };
  } else {
    pages = buildMultipage(profile, theme);
  }

  // Guarantee required multi-page set
  const required = [
    "index.html",
    "about.html",
    "experience.html",
    "projects.html",
    "skills.html",
    "contact.html",
  ];
  const fallback = buildMultipage(profile, theme);
  for (const f of required) {
    if (!pages[f]) pages[f] = fallback[f];
  }

  const htmlKeys = required.filter((k) => pages[k]);
  pages["styles.css"] = shellCss(theme);
  pages["script.js"] = scriptJs();
  pages["profile.json"] = JSON.stringify(profile, null, 2);
  pages["resume.json"] = JSON.stringify(
    professionalToJsonResume(profile),
    null,
    2
  );
  pages["pages.json"] = JSON.stringify(
    {
      layout,
      theme: theme.id,
      persona: profile.persona,
      multipage: true,
      pages: [
        { file: "index.html", title: "Home" },
        { file: "about.html", title: "About" },
        { file: "experience.html", title: "Experience" },
        { file: "projects.html", title: "Work" },
        { file: "skills.html", title: "Skills" },
        { file: "contact.html", title: "Contact" },
      ],
    },
    null,
    2
  );
  pages["niche.json"] = JSON.stringify(
    {
      type: "professional",
      persona: profile.persona,
      layout,
      theme: theme.id,
      multipage: true,
    },
    null,
    2
  );
  return pages;
}

/** Long-form aesthetic HOME only — secondary pages are separate HTML files */
function buildLongSingleAsHome(
  p: ProfessionalProfile,
  t: ProfessionalTheme
): ProfessionalSiteFiles {
  const layout: ProLayoutMode = "long_single";
  const name = p.fullName;
  const body = `
  <section class="hero-simple wrap reveal" data-goke="section" data-section-name="Hero">
    <p class="muted" style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase">Personal site</p>
    <h1 data-goke="heading">${E(name)}</h1>
    <p style="font-size:1.15rem;font-weight:600" data-goke="text">${E(
      p.headline || "Professional"
    )}</p>
    <p class="lead" data-goke="text">${E(
      (p.about || "").slice(0, 320) ||
        "A clear presence on the open web — edit every line in goke."
    )}</p>
    <p style="margin-top:1.25rem">
      <a class="btn btn-fill" href="contact.html" data-goke="button">${E(
        t.ctaPrimary
      )}</a>
      <a class="btn" href="about.html" style="margin-left:.5rem" data-goke="button">About</a>
    </p>
  </section>
  <div class="wrap">
    <section class="section reveal" data-goke="section" data-section-name="Work">
      <h2><span class="num">01.</span> Selected work</h2>
      ${projectTable(p)}
      <p style="margin-top:1rem"><a href="projects.html">All work →</a></p>
    </section>
  </div>`;
  return {
    "index.html": pageShell("Home", name, body, t, layout, {
      description: p.headline || name,
      active: "index.html",
    }),
  };
}
