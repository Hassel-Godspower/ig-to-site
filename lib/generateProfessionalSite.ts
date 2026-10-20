/**
 * Multipage personal / professional portfolio generator.
 * Quality bar inspired by editorial coach, expert, and creator portfolios —
 * not a LinkedIn screenshot.
 *
 * Pages: index, about, experience (or work), services (or programs), contact
 * (+ projects when present)
 */

import type { ProfessionalProfile } from "./professionalProfile";
import { themeForPersona, type ProTheme } from "./professionalThemes";

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

function firstName(full: string): string {
  return (full || "there").trim().split(/\s+/)[0] || "there";
}

function waHref(profile: ProfessionalProfile): string | null {
  const digits = (profile.phone || "").replace(/\D/g, "");
  if (digits.length >= 10) return `https://wa.me/${digits}`;
  return null;
}

function contactHref(profile: ProfessionalProfile): string {
  return waHref(profile) || (profile.email ? `mailto:${profile.email}` : "contact.html");
}

function navItems(profile: ProfessionalProfile): { href: string; label: string }[] {
  const items = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
  ];
  if (arr(profile.experience).length > 0) {
    items.push({ href: "experience.html", label: "Experience" });
  }
  // Always offer Work page for multipage IA (content may be filled in editor)
  items.push({ href: "projects.html", label: "Work" });
  items.push({ href: "services.html", label: "Services" });
  items.push({ href: "contact.html", label: "Contact" });
  return items;
}

function shell(
  profile: ProfessionalProfile,
  theme: ProTheme,
  pageTitle: string,
  activeHref: string,
  body: string,
  extraHead = ""
): string {
  const name = esc(profile.fullName);
  const nav = navItems(profile)
    .map((n) => {
      const on = n.href === activeHref ? ' aria-current="page" class="is-active"' : "";
      return `<a href="${n.href}"${on}>${esc(n.label)}</a>`;
    })
    .join("\n          ");
  const cta = contactHref(profile);
  const ctaLabel = theme.ctaPrimary;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(pageTitle)} · ${name}</title>
  <meta name="description" content="${esc(profile.headline || (profile.about || "").slice(0, 155) || name)}" />
  <meta property="og:title" content="${esc(pageTitle)} · ${name}" />
  <meta property="og:description" content="${esc(profile.headline || "")}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  ${extraHead}
</head>
<body data-theme="${theme.id}"${profile.phone ? ` data-wa="${esc(profile.phone.replace(/\D/g, ""))}"` : ""}>
  <header class="site-header" data-goke="section" data-section-name="Header">
    <div class="wrap header-inner">
      <a class="logo" href="index.html" data-goke="heading">${name}</a>
      <nav class="nav-desktop" aria-label="Primary">
          ${nav}
      </nav>
      <a class="btn btn-primary header-cta" href="${esc(cta)}" data-goke="button">${esc(ctaLabel)}</a>
      <button type="button" class="nav-toggle" aria-label="Menu" aria-expanded="false">Menu</button>
    </div>
    <div class="nav-mobile" hidden>
          ${nav}
      <a class="btn btn-primary" href="${esc(cta)}">${esc(ctaLabel)}</a>
    </div>
  </header>
  <main>
${body}
  </main>
  <footer class="site-footer" data-goke="section" data-section-name="Footer">
    <div class="wrap footer-grid">
      <div>
        <p class="footer-name" data-goke="heading">${name}</p>
        <p class="muted" data-goke="text">${esc(profile.headline || "Professional presence")}</p>
      </div>
      <div class="footer-links">
          ${nav}
      </div>
      <div class="footer-social">
        ${profile.linkedinUrl ? `<a href="${esc(profile.linkedinUrl)}" rel="noopener" target="_blank">LinkedIn</a>` : ""}
        ${profile.email ? `<a href="mailto:${esc(profile.email)}">Email</a>` : ""}
        ${waHref(profile) ? `<a href="${waHref(profile)!}" rel="noopener" target="_blank">WhatsApp</a>` : ""}
      </div>
    </div>
    <div class="wrap footer-copy muted">
      <span>© ${new Date().getFullYear()} ${name}</span>
      <span>Built with gòke</span>
    </div>
  </footer>
  <script src="script.js"></script>
</body>
</html>`;
}

function heroBlock(profile: ProfessionalProfile, theme: ProTheme): string {
  const name = esc(profile.fullName);
  const headline = esc(profile.headline || "Professional");
  const aboutLead = esc(
    (profile.about || "").slice(0, 220) ||
      `${profile.fullName} builds clarity, credibility, and results for clients who value craft.`
  );
  const cta = contactHref(profile);
  const photo = profile.photoUrl
    ? `<img src="${esc(profile.photoUrl)}" alt="${name}" data-goke="image" />`
    : `<div class="photo-fallback" aria-hidden="true">${esc(firstName(profile.fullName).charAt(0))}</div>`;

  if (theme.heroStyle === "split_portrait") {
    return `
    <section class="hero hero-split reveal" data-goke="section" data-section-name="Hero">
      <div class="wrap hero-split-grid">
        <div class="hero-copy">
          <p class="eyebrow">Hello — I'm</p>
          <h1 data-goke="heading">${name}</h1>
          <p class="hero-role" data-goke="text">${headline}</p>
          <p class="hero-lead" data-goke="text">${aboutLead}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${esc(cta)}" data-goke="button">${esc(theme.ctaPrimary)}</a>
            <a class="btn btn-ghost" href="about.html" data-goke="button">${esc(theme.ctaSecondary)}</a>
          </div>
        </div>
        <div class="hero-photo">${photo}</div>
      </div>
    </section>`;
  }

  if (theme.heroStyle === "message_first") {
    return `
    <section class="hero hero-message reveal" data-goke="section" data-section-name="Hero">
      <div class="wrap hero-message-grid">
        <div class="hero-photo">${photo}</div>
        <div class="hero-copy">
          <p class="eyebrow">Personal brand</p>
          <h1 data-goke="heading">${headline.length > 8 ? headline : `Ready to work with ${esc(firstName(profile.fullName))}?`}</h1>
          <p class="hero-lead" data-goke="text">${aboutLead}</p>
          <a class="btn btn-primary" href="${esc(cta)}" data-goke="button">${esc(theme.ctaPrimary)}</a>
        </div>
      </div>
    </section>`;
  }

  if (theme.heroStyle === "cinematic") {
    return `
    <section class="hero hero-cinematic reveal" data-goke="section" data-section-name="Hero">
      <div class="wrap">
        <p class="eyebrow">Portfolio</p>
        <h1 data-goke="heading">I'm <em>${esc(firstName(profile.fullName))}.</em></h1>
        <p class="hero-lead" data-goke="text">${aboutLead}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="projects.html" data-goke="button">${esc(theme.ctaPrimary)}</a>
          <a class="btn btn-ghost" href="contact.html" data-goke="button">${esc(theme.ctaSecondary)}</a>
        </div>
      </div>
    </section>`;
  }

  // name_focus — Neil-like
  const words = headline.split(/\s+/);
  const accentWord = words.length > 1 ? words[words.length - 1] : "";
  const rest = accentWord ? words.slice(0, -1).join(" ") : headline;
  return `
    <section class="hero hero-name reveal" data-goke="section" data-section-name="Hero">
      <div class="wrap hero-name-inner">
        <h1 data-goke="heading">${esc(rest)}${accentWord ? ` <em>${esc(accentWord)}</em>` : ""}</h1>
        <p class="hero-lead" data-goke="text">${aboutLead}</p>
        <p class="step-label">Start here</p>
        <form class="hero-inline-form" action="${esc(cta)}" method="get">
          <input type="text" name="q" placeholder="Your email or WhatsApp" aria-label="Contact" />
          <button type="submit" class="btn btn-primary" data-goke="button">${esc(theme.ctaPrimary)}</button>
        </form>
        <p class="muted tiny">Get a response — not a newsletter trap.</p>
      </div>
    </section>`;
}

function statsBlock(profile: ProfessionalProfile): string {
  const years = arr(profile.experience).length
    ? Math.min(20, Math.max(arr(profile.experience).length * 2, 3))
    : 5;
  const skills = Math.max(arr(profile.skills).length, 8);
  const roles = Math.max(arr(profile.experience).length, 3);
  return `
    <section class="stats reveal" data-goke="section" data-section-name="Stats">
      <div class="wrap stats-grid">
        <div><strong data-goke="text">${years}+</strong><span>Years shaping work</span></div>
        <div><strong data-goke="text">${roles}</strong><span>Roles & chapters</span></div>
        <div><strong data-goke="text">${skills}+</strong><span>Skills in focus</span></div>
        <div><strong data-goke="text">1</strong><span>Site you own</span></div>
      </div>
    </section>`;
}

function servicesBlock(profile: ProfessionalProfile, theme: ProTheme): string {
  const persona = profile.persona || "consultant";
  // Persona union: consultant | engineer | designer | founder | lawyer | marketer | creator | general
  const programs =
    persona === "consultant" || persona === "designer" || persona === "general"
      ? [
          {
            n: "01",
            title: "Career alignment",
            body: "Clarify direction, values, and the next role that fits — not another random application.",
          },
          {
            n: "02",
            title: "Personal brand intensive",
            body: "Position your story, LinkedIn, and portfolio so the right people understand your value fast.",
          },
          {
            n: "03",
            title: "1:1 advisory",
            body: "Focused sessions for pivots, negotiations, and high-stakes decisions.",
          },
        ]
      : persona === "engineer"
        ? [
            {
              n: "01",
              title: "Product engineering",
              body: "Ship reliable systems with clear trade-offs and documentation stakeholders trust.",
            },
            {
              n: "02",
              title: "Architecture review",
              body: "Pressure-test stack, scale, and team process before the next growth phase.",
            },
            {
              n: "03",
              title: "Technical leadership",
              body: "Mentor teams and set delivery standards without drowning in process.",
            },
          ]
        : [
            {
              n: "01",
              title: "Strategy & clarity",
              body: "Diagnose the real constraint, then design a path clients can execute.",
            },
            {
              n: "02",
              title: "Hands-on delivery",
              body: "From positioning to launch — work that shows up in revenue and reputation.",
            },
            {
              n: "03",
              title: "Ongoing partnership",
              body: "A steady advisory cadence for founders and operators who need sharp outside eyes.",
            },
          ];

  // If skills present, weave first skill into third card title lightly
  if (arr(profile.skills)[0] && programs[2]) {
    programs[2].body += ` Strengths include ${arr(profile.skills).slice(0, 3).join(", ")}.`;
  }

  return `
    <section class="programs reveal" data-goke="section" data-section-name="Services">
      <div class="wrap">
        <p class="eyebrow">How we work</p>
        <h2 data-goke="heading">Services & programs</h2>
        <div class="program-list">
          ${programs
            .map(
              (p) => `
          <article class="program-card">
            <span class="program-n">${p.n}</span>
            <div>
              <h3 data-goke="heading">${esc(p.title)}</h3>
              <p data-goke="text">${esc(p.body)}</p>
              <a class="text-link" href="contact.html" data-goke="button">Learn more</a>
            </div>
          </article>`
            )
            .join("")}
        </div>
      </div>
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
  --radius: 12px;
  --wrap: min(1120px, calc(100% - 2rem));
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.wrap { width: var(--wrap); margin-inline: auto; }
a { color: inherit; }
img { max-width: 100%; display: block; }
.muted { color: var(--muted); }
.tiny { font-size: 0.85rem; }
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 600;
  margin: 0 0 0.75rem;
}
h1, h2, h3 { font-family: var(--display); line-height: 1.15; margin: 0 0 0.75rem; }
h1 { font-size: clamp(2.4rem, 5vw, 3.75rem); font-weight: 700; }
h2 { font-size: clamp(1.75rem, 3vw, 2.35rem); }
h1 em, h2 em { font-style: normal; color: var(--accent); }
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.85rem 1.35rem; border-radius: 999px; font-weight: 600;
  text-decoration: none; border: none; cursor: pointer; font-size: 0.95rem;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-ghost { background: transparent; border: 1px solid color-mix(in srgb, var(--text) 18%, transparent); }
.text-link { color: var(--accent); font-weight: 600; text-decoration: none; }
.site-header {
  position: sticky; top: 0; z-index: 40;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
}
.header-inner {
  display: flex; align-items: center; gap: 1rem; min-height: 64px;
}
.logo { font-family: var(--display); font-weight: 700; text-decoration: none; font-size: 1.15rem; }
.nav-desktop { display: none; gap: 1.25rem; margin-left: auto; font-size: 0.92rem; }
.nav-desktop a { text-decoration: none; color: var(--muted); }
.nav-desktop a.is-active, .nav-desktop a:hover { color: var(--text); }
.header-cta { display: none; margin-left: 0.5rem; }
.nav-toggle {
  margin-left: auto; background: var(--surface); border: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
  border-radius: 8px; padding: 0.45rem 0.75rem; color: var(--text);
}
.nav-mobile {
  display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem var(--wrap);
  border-top: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
  background: var(--bg);
}
.nav-mobile a { text-decoration: none; }
@media (min-width: 880px) {
  .nav-desktop { display: flex; }
  .header-cta { display: inline-flex; }
  .nav-toggle, .nav-mobile { display: none !important; }
}
.hero { padding: 3.5rem 0 2.5rem; }
.hero-split-grid, .hero-message-grid {
  display: grid; gap: 2rem; align-items: center;
}
@media (min-width: 880px) {
  .hero-split-grid { grid-template-columns: 1.1fr 0.9fr; }
  .hero-message-grid { grid-template-columns: 0.95fr 1.05fr; }
}
.hero-photo img, .hero-photo .photo-fallback {
  width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 18px;
  background: var(--accent-soft);
}
.photo-fallback {
  display: grid; place-items: center; font-family: var(--display);
  font-size: 4rem; color: var(--accent); font-weight: 700;
}
.hero-role { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.75rem; }
.hero-lead { color: var(--muted); max-width: 36rem; margin: 0 0 1.5rem; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.hero-name-inner { text-align: center; max-width: 40rem; margin-inline: auto; }
.hero-inline-form {
  display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin: 1rem 0 0.5rem;
}
.hero-inline-form input {
  flex: 1 1 200px; max-width: 280px; padding: 0.85rem 1rem; border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--text) 15%, transparent); background: var(--surface); color: var(--text);
}
.step-label { color: var(--muted); font-size: 0.9rem; margin: 1.25rem 0 0; }
.stats {
  background: var(--accent); color: #fff; padding: 2rem 0;
}
.stats-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; text-align: center;
}
@media (min-width: 720px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }
.stats strong { display: block; font-size: 1.75rem; font-family: var(--display); }
.stats span { font-size: 0.8rem; opacity: 0.9; }
.programs, .page-section { padding: 3.5rem 0; }
.program-list { display: grid; gap: 1.5rem; margin-top: 2rem; }
.program-card {
  display: grid; grid-template-columns: auto 1fr; gap: 1.25rem;
  padding: 1.5rem; background: var(--surface); border-radius: var(--radius);
  border: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
}
.program-n { font-family: var(--display); font-size: 1.75rem; color: var(--accent); font-weight: 700; }
.timeline { display: grid; gap: 1.25rem; margin-top: 1.5rem; }
.timeline-item {
  padding: 1.25rem 1.35rem; border-left: 3px solid var(--accent);
  background: var(--surface); border-radius: 0 var(--radius) var(--radius) 0;
}
.skill-cloud { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
.skill-cloud span {
  padding: 0.4rem 0.75rem; border-radius: 999px; background: var(--accent-soft);
  font-size: 0.85rem;
}
.site-footer {
  border-top: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
  padding: 2.5rem 0 1.5rem; margin-top: 2rem;
}
.footer-grid {
  display: grid; gap: 1.5rem;
}
@media (min-width: 720px) { .footer-grid { grid-template-columns: 1.2fr 1fr 1fr; } }
.footer-name { font-family: var(--display); font-size: 1.25rem; font-weight: 700; margin: 0 0 0.35rem; }
.footer-links, .footer-social { display: flex; flex-direction: column; gap: 0.4rem; }
.footer-links a, .footer-social a { text-decoration: none; color: var(--muted); font-size: 0.92rem; }
.footer-copy {
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;
  margin-top: 2rem; font-size: 0.8rem;
}
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.55s ease, transform 0.55s ease; }
.reveal.is-visible { opacity: 1; transform: none; }
body[data-theme="creator_bold"] .btn-primary { color: #111; }
`;
}

function buildJs(): string {
  return `(() => {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".nav-mobile");
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const open = panel.hasAttribute("hidden");
      if (open) { panel.removeAttribute("hidden"); toggle.setAttribute("aria-expanded", "true"); }
      else { panel.setAttribute("hidden", ""); toggle.setAttribute("aria-expanded", "false"); }
    });
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  document.querySelectorAll("form[action*='wa.me'], form.hero-inline-form").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      const action = form.getAttribute("action") || "";
      if (action.startsWith("https://wa.me") || action.startsWith("mailto:")) return;
      const wa = document.body.getAttribute("data-wa");
      if (wa) {
        ev.preventDefault();
        const input = form.querySelector("input");
        const msg = encodeURIComponent("Hi — I found your site via gòke. " + (input && input.value ? input.value : ""));
        window.open("https://wa.me/" + wa + "?text=" + msg, "_blank");
      }
    });
  });
})();`;
}

export function generateProfessionalSiteFiles(
  profile: ProfessionalProfile
): Record<string, string> {
  const theme = themeForPersona(profile.persona || "general");
  const files: Record<string, string> = {};

  // HOME
  files["index.html"] = shell(
    profile,
    theme,
    "Home",
    "index.html",
    `${heroBlock(profile, theme)}
    ${statsBlock(profile)}
    ${servicesBlock(profile, theme)}
    <section class="page-section reveal" data-goke="section" data-section-name="CTA">
      <div class="wrap" style="text-align:center">
        <h2 data-goke="heading">Let's build the next chapter</h2>
        <p class="muted" data-goke="text">A clear conversation beats another cold application.</p>
        <a class="btn btn-primary" href="contact.html" data-goke="button">${esc(theme.ctaPrimary)}</a>
      </div>
    </section>`
  );

  // ABOUT
  files["about.html"] = shell(
    profile,
    theme,
    "About",
    "about.html",
    `<section class="page-section reveal" data-goke="section" data-section-name="About">
      <div class="wrap" style="max-width:720px">
        <p class="eyebrow">About</p>
        <h1 data-goke="heading">${esc(profile.fullName)}</h1>
        <p class="hero-role" data-goke="text">${esc(profile.headline || "")}</p>
        <p data-goke="text">${esc(profile.about || "Add your story in the editor — who you help, how you work, and what success looks like.")}</p>
        ${
          profile.location
            ? `<p class="muted" data-goke="text">${esc(profile.location)}</p>`
            : ""
        }
        ${
          arr(profile.skills).length
            ? `<h2 data-goke="heading" style="margin-top:2rem">Skills</h2>
        <div class="skill-cloud">${arr(profile.skills)
          .slice(0, 24)
          .map((s) => `<span data-goke="text">${esc(s)}</span>`)
          .join("")}</div>`
            : ""
        }
      </div>
    </section>`
  );

  // EXPERIENCE
  files["experience.html"] = shell(
    profile,
    theme,
    "Experience",
    "experience.html",
    `<section class="page-section reveal" data-goke="section" data-section-name="Experience">
      <div class="wrap">
        <p class="eyebrow">Career</p>
        <h1 data-goke="heading">Experience</h1>
        <div class="timeline">
          ${
            arr(profile.experience).length
              ? arr(profile.experience)
                  .map(
                    (ex) => `
          <article class="timeline-item">
            <h3 data-goke="heading">${esc(ex.title)}</h3>
            <p class="muted" data-goke="text">${esc(ex.company)}${ex.start || ex.end ? ` · ${esc([ex.start, ex.end].filter(Boolean).join(" – "))}` : ""}</p>
            ${
              ex.bullets?.length
                ? `<ul>${ex.bullets.map((b) => `<li data-goke="text">${esc(b)}</li>`).join("")}</ul>`
                : ""
            }
          </article>`
                  )
                  .join("")
              : `<article class="timeline-item"><p data-goke="text">Add roles in the editor, or re-generate with a PDF CV for a fuller timeline.</p></article>`
          }
        </div>
        ${
          arr(profile.education).length
            ? `<h2 data-goke="heading" style="margin-top:2.5rem">Education</h2>
        <div class="timeline">${arr(profile.education)
          .map(
            (ed) => `
          <article class="timeline-item">
            <h3 data-goke="heading">${esc(ed.school)}</h3>
            <p class="muted" data-goke="text">${esc([ed.degree, ed.field, ed.year].filter(Boolean).join(" · "))}</p>
          </article>`
          )
          .join("")}</div>`
            : ""
        }
      </div>
    </section>`
  );

  // PROJECTS (optional page always generated for IA consistency)
  files["projects.html"] = shell(
    profile,
    theme,
    "Work",
    "projects.html",
    `<section class="page-section reveal" data-goke="section" data-section-name="Projects">
      <div class="wrap">
        <p class="eyebrow">Selected work</p>
        <h1 data-goke="heading">Projects</h1>
        <div class="program-list">
          ${
            arr(profile.projects).length
              ? arr(profile.projects)
                  .map(
                    (p, i) => `
          <article class="program-card">
            <span class="program-n">${String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 data-goke="heading">${esc(p.name)}</h3>
              <p data-goke="text">${esc(p.description || "")}</p>
              ${p.url ? `<a class="text-link" href="${esc(p.url)}" target="_blank" rel="noopener">View</a>` : ""}
            </div>
          </article>`
                  )
                  .join("")
              : `<article class="program-card"><span class="program-n">01</span><div><h3 data-goke="heading">Featured case study</h3><p data-goke="text">Add projects in the editor — outcomes, stack, and links.</p></div></article>`
          }
        </div>
      </div>
    </section>`
  );

  // SERVICES
  files["services.html"] = shell(
    profile,
    theme,
    "Services",
    "services.html",
    servicesBlock(profile, theme)
  );

  // CONTACT
  const wa = waHref(profile);
  files["contact.html"] = shell(
    profile,
    theme,
    "Contact",
    "contact.html",
    `<section class="page-section reveal" data-goke="section" data-section-name="Contact">
      <div class="wrap" style="max-width:560px">
        <p class="eyebrow">Contact</p>
        <h1 data-goke="heading">Let's talk</h1>
        <p class="muted" data-goke="text">Share a short note — ${esc(firstName(profile.fullName))} will take it from there.</p>
        <form class="contact-form" style="display:grid;gap:0.75rem;margin-top:1.5rem" data-goke="form">
          <input class="gk-input" name="name" placeholder="Your name" required style="padding:0.85rem;border-radius:10px;border:1px solid #ddd" />
          <input class="gk-input" name="contact" placeholder="Email or WhatsApp" required style="padding:0.85rem;border-radius:10px;border:1px solid #ddd" />
          <textarea name="message" rows="4" placeholder="What do you need?" style="padding:0.85rem;border-radius:10px;border:1px solid #ddd"></textarea>
          <button type="submit" class="btn btn-primary" data-goke="button">${esc(theme.ctaPrimary)}</button>
        </form>
        <p class="muted tiny" style="margin-top:1rem">
          ${profile.email ? `Email: <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a><br/>` : ""}
          ${wa ? `<a href="${wa}" target="_blank" rel="noopener">WhatsApp</a><br/>` : ""}
          ${profile.linkedinUrl ? `<a href="${esc(profile.linkedinUrl)}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
        </p>
      </div>
    </section>
    <script>
      document.querySelector(".contact-form")?.addEventListener("submit", function(e) {
        e.preventDefault();
        var wa = document.body.getAttribute("data-wa");
        var fd = new FormData(this);
        var text = "Name: " + (fd.get("name")||"") + "\\nContact: " + (fd.get("contact")||"") + "\\n\\n" + (fd.get("message")||"");
        if (wa) window.open("https://wa.me/" + wa + "?text=" + encodeURIComponent(text), "_blank");
        else if (${profile.email ? "true" : "false"}) window.location.href = "mailto:${esc(profile.email || "")}?subject=Website%20enquiry&body=" + encodeURIComponent(text);
        else alert("Add a phone or email in the editor so messages can reach you.");
      });
    </script>`
  );

  files["styles.css"] = buildCss(theme);
  files["script.js"] = buildJs();
  files["pages.json"] = JSON.stringify(
    {
      pages: navItems(profile).map((n) => ({ file: n.href, title: n.label })),
      persona: profile.persona,
      theme: theme.id,
    },
    null,
    2
  );
  files["niche.json"] = JSON.stringify(
    { type: "professional", persona: profile.persona, theme: theme.id },
    null,
    2
  );

  return files;
}
