/**
 * Professional portfolio generator with craft layout modes.
 * Patterns inspired by public portfolio UX (sticky identity, project tables,
 * work-first grids, long single-page) — original templates, not site copies.
 */

import type { ProfessionalProfile } from "./professionalProfile";
import {
  themeForPersona,
  resolveLayout,
  contentScore,
  type ProTheme,
  type ProLayoutMode,
} from "./professionalThemes";

function esc(s: string): string {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function arr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
}

function waHref(profile: ProfessionalProfile): string | null {
  const digits = (profile.phone || "").replace(/\D/g, "");
  if (digits.length >= 10) return `https://wa.me/${digits}`;
  return null;
}

function contactHref(profile: ProfessionalProfile): string {
  return (
    waHref(profile) ||
    (profile.email ? `mailto:${profile.email}` : "#contact")
  );
}

function navItems(
  profile: ProfessionalProfile,
  layout: ProLayoutMode
): { href: string; label: string }[] {
  if (layout === "long_single" || layout === "split_sticky") {
    const items = [
      { href: "#about", label: "About" },
      { href: "#experience", label: "Experience" },
      { href: "#work", label: "Work" },
      { href: "#contact", label: "Contact" },
    ];
    return items;
  }
  if (layout === "work_grid") {
    return [
      { href: "index.html", label: "Work" },
      { href: "about.html", label: "About" },
      { href: "experience.html", label: "Experience" },
      { href: "contact.html", label: "Contact" },
    ];
  }
  const items = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
  ];
  if (arr(profile.experience).length > 0) {
    items.push({ href: "experience.html", label: "Experience" });
  }
  items.push({ href: "projects.html", label: "Work" });
  items.push({ href: "contact.html", label: "Contact" });
  return items;
}

function socialLinks(profile: ProfessionalProfile): string {
  const parts: string[] = [];
  if (profile.linkedinUrl) {
    parts.push(
      `<a href="${esc(profile.linkedinUrl)}" target="_blank" rel="noopener noreferrer" data-goke="button">LinkedIn</a>`
    );
  }
  if (profile.email) {
    parts.push(
      `<a href="mailto:${esc(profile.email)}" data-goke="button">Email</a>`
    );
  }
  const wa = waHref(profile);
  if (wa) {
    parts.push(
      `<a href="${wa}" target="_blank" rel="noopener noreferrer" data-goke="button">WhatsApp</a>`
    );
  }
  return parts.join("\n          ");
}

function projectTable(profile: ProfessionalProfile): string {
  const projects = arr(profile.projects);
  if (!projects.length) {
    return `<table class="proj-table" data-goke="section" data-section-name="Projects">
          <thead><tr><th>Year</th><th>Project</th><th>Built with</th><th></th></tr></thead>
          <tbody>
            <tr>
              <td data-goke="text">2024</td>
              <td data-goke="heading">Featured project</td>
              <td data-goke="text">Your stack</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <p class="muted" data-goke="text">Replace with real work in the editor.</p>`;
  }
  return `<table class="proj-table" data-goke="section" data-section-name="Projects">
          <thead><tr><th>Year</th><th>Project</th><th>Built with</th><th></th></tr></thead>
          <tbody>
            ${projects
              .map((p, i) => {
                const year = (p as { year?: string }).year || "—";
                const name = esc(p.name || `Project ${i + 1}`);
                const stack = esc(
                  arr((p as { technologies?: string[] }).technologies).join(
                    ", "
                  ) ||
                    (p.description || "").slice(0, 48) ||
                    "—"
                );
                const url = (p as { url?: string }).url;
                const link = url
                  ? `<a href="${esc(url)}" target="_blank" rel="noopener">View</a>`
                  : "";
                return `<tr>
              <td data-goke="text">${esc(String(year))}</td>
              <td data-goke="heading">${name}</td>
              <td data-goke="text">${stack}</td>
              <td>${link}</td>
            </tr>`;
              })
              .join("")}
          </tbody>
        </table>`;
}

function experienceBlock(profile: ProfessionalProfile): string {
  const exp = arr(profile.experience);
  if (!exp.length) {
    return `<article class="timeline-item"><p data-goke="text">Add roles from your CV in the editor.</p></article>`;
  }
  return exp
    .map(
      (ex) => `<article class="timeline-item">
            <h3 data-goke="heading">${esc(ex.title)}</h3>
            <p class="muted" data-goke="text">${esc(ex.company)}${
        ex.start || ex.end
          ? ` · ${esc([ex.start, ex.end].filter(Boolean).join(" – "))}`
          : ""
      }</p>
            ${
              arr(ex.bullets).length
                ? `<ul>${arr(ex.bullets)
                    .map((b) => `<li data-goke="text">${esc(b)}</li>`)
                    .join("")}</ul>`
                : ""
            }
          </article>`
    )
    .join("");
}

function skillsCloud(profile: ProfessionalProfile): string {
  const skills = arr(profile.skills);
  if (!skills.length) return "";
  return `<div class="skill-cloud">${skills
    .slice(0, 24)
    .map((s) => `<span data-goke="text">${esc(s)}</span>`)
    .join("")}</div>`;
}

function contactSection(profile: ProfessionalProfile, theme: ProTheme): string {
  const wa = waHref(profile);
  return `
    <section class="section reveal" id="contact" data-goke="section" data-section-name="Contact">
      <h2><span class="num">04.</span> Contact</h2>
      <p class="muted" data-goke="text">Open to conversations — say hello.</p>
      <form class="contact-form" data-goke="form" data-email="${esc(profile.email || "")}">
        <input name="name" placeholder="Your name" required />
        <input name="contact" placeholder="Email or WhatsApp" required />
        <textarea name="message" rows="4" placeholder="Message"></textarea>
        <button type="submit" class="btn btn-filled" data-goke="button">${esc(theme.ctaPrimary)}</button>
      </form>
      <p class="muted" style="margin-top:1rem;font-size:0.85rem">
        ${profile.email ? `Email: <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a><br/>` : ""}
        ${wa ? `<a href="${wa}" target="_blank" rel="noopener">WhatsApp</a><br/>` : ""}
        ${profile.linkedinUrl ? `<a href="${esc(profile.linkedinUrl)}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
      </p>
    </section>`;
}

function buildCss(theme: ProTheme): string {
  return `:root {
  --bg: ${theme.bg};
  --surface: ${theme.surface};
  --text: ${theme.text};
  --muted: ${theme.muted};
  --accent: ${theme.accent};
  --accent-soft: ${theme.accentSoft};
  --display: ${theme.displayFont};
  --body: ${theme.bodyFont};
  --wrap: min(1100px, calc(100% - 2.5rem));
}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:var(--body);background:var(--bg);color:var(--text);line-height:1.65;-webkit-font-smoothing:antialiased}
.wrap{width:var(--wrap);margin-inline:auto}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.muted{color:var(--muted)}
h1,h2,h3{font-family:var(--display);line-height:1.15;margin:0 0 .65rem}
h1{font-size:clamp(2rem,4.5vw,3.1rem);font-weight:700}
h2{font-size:clamp(1.35rem,2.4vw,1.75rem)}
h2 .num{color:var(--accent);font-family:var(--body);font-size:.85em;margin-right:.45rem}
.btn{display:inline-flex;align-items:center;padding:.7rem 1.15rem;border-radius:4px;font-weight:600;border:1px solid var(--accent);background:transparent;color:var(--accent);cursor:pointer;font-size:.9rem;text-decoration:none}
.btn:hover{background:var(--accent-soft);text-decoration:none}
.btn-filled{background:var(--accent);color:var(--bg)}
.site-header{position:sticky;top:0;z-index:40;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid color-mix(in srgb,var(--text) 8%,transparent)}
.header-inner{display:flex;align-items:center;gap:1rem;min-height:56px}
.logo{font-weight:700;color:var(--accent);text-decoration:none}
.nav-desktop{display:none;gap:1.25rem;margin-left:auto;font-size:.85rem}
.nav-desktop a{color:var(--muted);text-decoration:none}
.nav-desktop a:hover,.nav-desktop a.is-active{color:var(--accent)}
.header-cta{display:none;margin-left:.5rem}
.nav-toggle{margin-left:auto;background:transparent;border:1px solid color-mix(in srgb,var(--text) 15%,transparent);border-radius:4px;padding:.4rem .7rem;color:var(--text);cursor:pointer}
.nav-mobile{display:flex;flex-direction:column;gap:.75rem;padding:1rem var(--wrap);border-top:1px solid color-mix(in srgb,var(--text) 8%,transparent)}
@media(min-width:880px){.nav-desktop{display:flex}.header-cta{display:inline-flex}.nav-toggle,.nav-mobile{display:none!important}}
.split-layout{display:block;padding:1.5rem 0 3rem}
@media(min-width:960px){
  .split-layout{display:grid;grid-template-columns:minmax(280px,380px) 1fr;gap:3rem;min-height:100vh;width:var(--wrap);margin-inline:auto;padding:0 0 4rem}
  .split-rail{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;justify-content:center;padding:3rem 0}
  .split-main{padding:4rem 0 6rem}
  .site-header.split-hide-desktop{display:none}
}
.split-rail .role{font-size:1.15rem;margin:0 0 1rem}
.split-rail .blurb{color:var(--muted);max-width:28rem;margin:0 0 1.25rem}
.split-rail .rail-nav{display:flex;flex-direction:column;gap:.55rem;margin:1.25rem 0}
.split-rail .rail-nav a{color:var(--muted);font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;text-decoration:none}
.split-rail .rail-nav a:hover{color:var(--accent)}
.split-rail .socials{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem;font-size:.9rem}
.section{padding:2.75rem 0;scroll-margin-top:5rem}
.timeline{display:grid;gap:1rem}
.timeline-item{padding:1rem 1.15rem;border-left:2px solid var(--accent);background:var(--surface);border-radius:0 8px 8px 0}
.timeline-item ul{margin:.5rem 0 0;padding-left:1.1rem;color:var(--muted)}
.proj-table{width:100%;border-collapse:collapse;font-size:.9rem}
.proj-table th{text-align:left;color:var(--muted);font-weight:500;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;padding:.5rem .55rem;border-bottom:1px solid color-mix(in srgb,var(--text) 12%,transparent)}
.proj-table td{padding:.8rem .55rem;border-bottom:1px solid color-mix(in srgb,var(--text) 8%,transparent);vertical-align:top}
.proj-table tr:hover td{background:var(--accent-soft)}
.skill-cloud{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.75rem}
.skill-cloud span{padding:.3rem .55rem;border-radius:4px;border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);color:var(--accent);font-size:.75rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.work-grid{display:grid;gap:1rem;grid-template-columns:1fr}
@media(min-width:640px){.work-grid{grid-template-columns:1fr 1fr}}
.work-card{padding:1.2rem;background:var(--surface);border:1px solid color-mix(in srgb,var(--text) 10%,transparent);border-radius:8px}
.contact-form{display:grid;gap:.7rem;max-width:420px;margin-top:1rem}
.contact-form input,.contact-form textarea{padding:.7rem .85rem;border-radius:6px;border:1px solid color-mix(in srgb,var(--text) 18%,transparent);background:var(--surface);color:var(--text);font:inherit}
.site-footer{border-top:1px solid color-mix(in srgb,var(--text) 10%,transparent);padding:2rem 0;margin-top:2rem;font-size:.8rem;color:var(--muted)}
.footer-inner{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.75rem}
.reveal{opacity:0;transform:translateY(12px);transition:opacity .5s ease,transform .5s ease}
.reveal.is-visible{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}html{scroll-behavior:auto}}
.hero-simple{padding:3.5rem 0 2rem}
.hero-simple .lead{color:var(--muted);max-width:36rem}
`;
}

function buildJs(): string {
  return `(()=>{const t=document.querySelector(".nav-toggle"),p=document.querySelector(".nav-mobile");if(t&&p){t.addEventListener("click",()=>{const o=p.hasAttribute("hidden");if(o){p.removeAttribute("hidden");t.setAttribute("aria-expanded","true")}else{p.setAttribute("hidden","");t.setAttribute("aria-expanded","false")}})}if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("is-visible")})},{threshold:.12});document.querySelectorAll(".reveal").forEach(el=>io.observe(el))}else{document.querySelectorAll(".reveal").forEach(el=>el.classList.add("is-visible"))}document.querySelectorAll(".contact-form").forEach(form=>{form.addEventListener("submit",ev=>{ev.preventDefault();const wa=document.body.getAttribute("data-wa");const fd=new FormData(form);const text="Name: "+(fd.get("name")||"")+"\\nContact: "+(fd.get("contact")||"")+"\\n\\n"+(fd.get("message")||"");if(wa)window.open("https://wa.me/"+wa+"?text="+encodeURIComponent(text),"_blank");else{const email=form.getAttribute("data-email");if(email)window.location.href="mailto:"+email+"?subject=Website%20enquiry&body="+encodeURIComponent(text);else alert("Add a phone or email in the editor.")}})})})();`;
}

function pageShell(
  profile: ProfessionalProfile,
  theme: ProTheme,
  layout: ProLayoutMode,
  title: string,
  active: string,
  body: string,
  hideHeaderDesktop = false
): string {
  const name = esc(profile.fullName);
  const nav = navItems(profile, layout)
    .map((n) => {
      const on = n.href === active ? ' class="is-active" aria-current="page"' : "";
      return `<a href="${n.href}"${on}>${esc(n.label)}</a>`;
    })
    .join("\n          ");
  const cta = contactHref(profile);
  const homeHref =
    layout === "long_single" || layout === "split_sticky" ? "#top" : "index.html";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} | ${name}</title>
  <meta name="description" content="${esc(profile.headline || (profile.about || "").slice(0, 155) || name)}" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body id="top" data-theme="${theme.id}"${
    profile.phone
      ? ` data-wa="${esc(profile.phone.replace(/\D/g, ""))}"`
      : ""
  }>
  <header class="site-header${hideHeaderDesktop ? " split-hide-desktop" : ""}" data-goke="section" data-section-name="Header">
    <div class="wrap header-inner">
      <a class="logo" href="${homeHref}" data-goke="heading">${esc(
    profile.fullName.split(/\s+/)[0] || "Home"
  )}</a>
      <nav class="nav-desktop" aria-label="Primary">
          ${nav}
      </nav>
      <a class="btn header-cta" href="${esc(cta)}" data-goke="button">${esc(
    theme.ctaPrimary
  )}</a>
      <button type="button" class="nav-toggle" aria-label="Menu" aria-expanded="false">Menu</button>
    </div>
    <div class="nav-mobile" hidden>
          ${nav}
      <a class="btn" href="${esc(cta)}">${esc(theme.ctaPrimary)}</a>
    </div>
  </header>
  <main>
${body}
  </main>
  <footer class="site-footer" data-goke="section" data-section-name="Footer">
    <div class="wrap footer-inner">
      <span>&copy; ${new Date().getFullYear()} ${name}</span>
      <span>Built with goke</span>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>`;
}

function buildSplitSticky(
  profile: ProfessionalProfile,
  theme: ProTheme
): Record<string, string> {
  const layout: ProLayoutMode = "split_sticky";
  const body = `
  <div class="split-layout">
    <aside class="split-rail" data-goke="section" data-section-name="Identity">
      <p class="muted" style="font-size:.8rem;margin:0 0 .35rem">Portfolio</p>
      <h1 data-goke="heading">${esc(profile.fullName)}</h1>
      <p class="role" data-goke="text">${esc(profile.headline || "Builder")}</p>
      <p class="blurb" data-goke="text">${esc(
        (profile.about || "").slice(0, 280) ||
          "I build thoughtful digital products. Edit this site to tell your real story."
      )}</p>
      <nav class="rail-nav" aria-label="On this page">
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="socials">${socialLinks(profile)}</div>
    </aside>
    <div class="split-main">
      <section class="section reveal" id="about" data-goke="section" data-section-name="About">
        <h2><span class="num">01.</span> About</h2>
        <p data-goke="text">${esc(
          profile.about ||
            "Add a short narrative about how you work and what you care about."
        )}</p>
        ${skillsCloud(profile)}
      </section>
      <section class="section reveal" id="experience" data-goke="section" data-section-name="Experience">
        <h2><span class="num">02.</span> Experience</h2>
        <div class="timeline">${experienceBlock(profile)}</div>
      </section>
      <section class="section reveal" id="work" data-goke="section" data-section-name="Work">
        <h2><span class="num">03.</span> Work</h2>
        ${projectTable(profile)}
      </section>
      ${contactSection(profile, theme)}
    </div>
  </div>`;
  return {
    "index.html": pageShell(
      profile,
      theme,
      layout,
      "Home",
      "#about",
      body,
      true
    ),
  };
}

function buildLongSingle(
  profile: ProfessionalProfile,
  theme: ProTheme
): Record<string, string> {
  const layout: ProLayoutMode = "long_single";
  const body = `
  <section class="hero-simple wrap reveal" data-goke="section" data-section-name="Hero">
    <p class="muted" style="font-size:.8rem;letter-spacing:.08em;text-transform:uppercase">Personal site</p>
    <h1 data-goke="heading">${esc(profile.fullName)}</h1>
    <p class="role" style="font-size:1.2rem;font-weight:600" data-goke="text">${esc(
      profile.headline || "Professional"
    )}</p>
    <p class="lead" data-goke="text">${esc(
      (profile.about || "").slice(0, 320) ||
        "A clear presence on the open web — edit every line in goke."
    )}</p>
    <p style="margin-top:1.25rem">
      <a class="btn btn-filled" href="#contact" data-goke="button">${esc(
        theme.ctaPrimary
      )}</a>
    </p>
  </section>
  <div class="wrap">
    <section class="section reveal" id="about" data-goke="section" data-section-name="About">
      <h2><span class="num">01.</span> About</h2>
      <p data-goke="text">${esc(profile.about || "Your story goes here.")}</p>
      ${skillsCloud(profile)}
    </section>
    <section class="section reveal" id="experience" data-goke="section" data-section-name="Experience">
      <h2><span class="num">02.</span> Experience</h2>
      <div class="timeline">${experienceBlock(profile)}</div>
    </section>
    <section class="section reveal" id="work" data-goke="section" data-section-name="Work">
      <h2><span class="num">03.</span> Selected work</h2>
      ${projectTable(profile)}
    </section>
    ${contactSection(profile, theme)}
  </div>`;
  return {
    "index.html": pageShell(profile, theme, layout, "Home", "#about", body),
  };
}

function buildWorkGrid(
  profile: ProfessionalProfile,
  theme: ProTheme
): Record<string, string> {
  const layout: ProLayoutMode = "work_grid";
  const projects = arr(profile.projects);
  const cards = projects.length
    ? projects
        .map(
          (p) => `<article class="work-card reveal">
        <h3 data-goke="heading">${esc(p.name)}</h3>
        <p class="muted" data-goke="text">${esc(p.description || "")}</p>
        ${
          (p as { url?: string }).url
            ? `<a href="${esc((p as { url?: string }).url!)}" target="_blank" rel="noopener">View</a>`
            : ""
        }
      </article>`
        )
        .join("")
    : `<article class="work-card reveal"><h3 data-goke="heading">Selected work</h3><p class="muted" data-goke="text">Add projects in the editor.</p></article>`;

  const index = pageShell(
    profile,
    theme,
    layout,
    "Work",
    "index.html",
    `<section class="wrap section" data-goke="section" data-section-name="Work">
      <h1 data-goke="heading">Work</h1>
      <p class="muted" data-goke="text">${esc(profile.headline || "")}</p>
      <div class="work-grid" style="margin-top:1.5rem">${cards}</div>
    </section>`
  );
  const about = pageShell(
    profile,
    theme,
    layout,
    "About",
    "about.html",
    `<section class="wrap section" data-goke="section" data-section-name="About">
      <h1 data-goke="heading">About</h1>
      <p data-goke="text">${esc(profile.about || "")}</p>
      ${skillsCloud(profile)}
    </section>`
  );
  const experience = pageShell(
    profile,
    theme,
    layout,
    "Experience",
    "experience.html",
    `<section class="wrap section" data-goke="section" data-section-name="Experience">
      <h1 data-goke="heading">Experience</h1>
      <div class="timeline">${experienceBlock(profile)}</div>
    </section>`
  );
  const contact = pageShell(
    profile,
    theme,
    layout,
    "Contact",
    "contact.html",
    `<div class="wrap">${contactSection(profile, theme)}</div>`
  );
  return {
    "index.html": index,
    "about.html": about,
    "experience.html": experience,
    "contact.html": contact,
  };
}

function buildMultipage(
  profile: ProfessionalProfile,
  theme: ProTheme
): Record<string, string> {
  const layout: ProLayoutMode = "multipage_editorial";
  const index = pageShell(
    profile,
    theme,
    layout,
    "Home",
    "index.html",
    `<section class="hero-simple wrap reveal" data-goke="section" data-section-name="Hero">
      <h1 data-goke="heading">${esc(profile.fullName)}</h1>
      <p style="font-size:1.2rem;font-weight:600" data-goke="text">${esc(
        profile.headline || "Professional"
      )}</p>
      <p class="lead muted" data-goke="text">${esc(
        (profile.about || "").slice(0, 260)
      )}</p>
      <p style="margin-top:1.25rem">
        <a class="btn btn-filled" href="contact.html" data-goke="button">${esc(
          theme.ctaPrimary
        )}</a>
        <a class="btn" href="about.html" style="margin-left:.5rem" data-goke="button">About</a>
      </p>
    </section>
    <section class="wrap section reveal" data-goke="section" data-section-name="Work">
      <h2><span class="num">01.</span> Selected work</h2>
      ${projectTable(profile)}
    </section>`
  );
  const about = pageShell(
    profile,
    theme,
    layout,
    "About",
    "about.html",
    `<section class="wrap section" data-goke="section" data-section-name="About">
      <h1 data-goke="heading">About</h1>
      <p data-goke="text">${esc(profile.about || "")}</p>
      ${skillsCloud(profile)}
    </section>`
  );
  const experience = pageShell(
    profile,
    theme,
    layout,
    "Experience",
    "experience.html",
    `<section class="wrap section" data-goke="section" data-section-name="Experience">
      <h1 data-goke="heading">Experience</h1>
      <div class="timeline">${experienceBlock(profile)}</div>
    </section>`
  );
  const projects = pageShell(
    profile,
    theme,
    layout,
    "Work",
    "projects.html",
    `<section class="wrap section" data-goke="section" data-section-name="Projects">
      <h1 data-goke="heading">Work</h1>
      ${projectTable(profile)}
    </section>`
  );
  const contact = pageShell(
    profile,
    theme,
    layout,
    "Contact",
    "contact.html",
    `<div class="wrap">${contactSection(profile, theme)}</div>`
  );
  return {
    "index.html": index,
    "about.html": about,
    "experience.html": experience,
    "projects.html": projects,
    "contact.html": contact,
  };
}

export function generateProfessionalSiteFiles(
  profile: ProfessionalProfile
): Record<string, string> {
  const theme = themeForPersona(profile.persona || "general");
  const score = contentScore(profile);
  const layout = resolveLayout(theme, score);

  let pages: Record<string, string>;
  switch (layout) {
    case "split_sticky":
      pages = buildSplitSticky(profile, { ...theme, layout });
      break;
    case "long_single":
      pages = buildLongSingle(profile, { ...theme, layout });
      break;
    case "work_grid":
      pages = buildWorkGrid(profile, { ...theme, layout });
      break;
    default:
      pages = buildMultipage(profile, { ...theme, layout });
  }

  pages["styles.css"] = buildCss(theme);
  pages["script.js"] = buildJs();
  pages["pages.json"] = JSON.stringify(
    {
      layout,
      theme: theme.id,
      persona: profile.persona,
      pages: Object.keys(pages).filter((k) => k.endsWith(".html")),
    },
    null,
    2
  );
  pages["niche.json"] = JSON.stringify(
    { type: "professional", persona: profile.persona, layout, theme: theme.id },
    null,
    2
  );
  return pages;
}
