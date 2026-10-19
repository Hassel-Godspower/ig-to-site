/**
 * Premium multi-page professional site from ProfessionalProfile.
 * Design tokens by persona; timeline experience; projects; JSON Resume export.
 */

import type { ProfessionalProfile } from "./professionalProfile";
import { ensureSkillGroups } from "./professionalProfile";
import { professionalToJsonResume } from "./jsonResume";
import { themeForProfile, googleFontsLink } from "./professionalThemes";

export type ProfessionalSiteFiles = Record<string, string>;

const E = (s: string) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function waLink(phone?: string): string | null {
  if (!phone) return null;
  const n = phone.replace(/\D/g, "");
  if (n.length < 10) return null;
  return `https://wa.me/${n}`;
}

function cssVars(t: ReturnType<typeof themeForProfile>): string {
  return `:root{
  --ink:${t.ink};--surface:${t.surface};--surface-2:${t.surface2};--line:${t.line};
  --text:${t.text};--muted:${t.muted};--accent:${t.accent};--on-accent:${t.onAccent};
  --font-display:${t.displayFont};--font-body:${t.bodyFont};--radius:${t.radius};
}`;
}

function shellCss(t: ReturnType<typeof themeForProfile>): string {
  return `${cssVars(t)}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font-family:var(--font-body);background:var(--ink);color:var(--text);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}a:hover{opacity:.9}
.wrap{width:min(100% - 2rem,980px);margin:0 auto}
.site-header{position:sticky;top:0;z-index:40;backdrop-filter:blur(14px);background:color-mix(in srgb,var(--ink) 88%,transparent);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;gap:12px}
.brand{font-family:var(--font-display);font-weight:700;font-size:1.15rem;color:var(--text);letter-spacing:-0.02em}
.nav-links{display:flex;flex-wrap:wrap;gap:1rem;font-size:.9rem}
.nav-links a{color:var(--muted)}.nav-links a:hover{color:var(--text)}
.nav-toggle{display:none;background:transparent;border:1px solid var(--line);color:var(--text);padding:8px 12px;border-radius:8px;cursor:pointer}
.mobile-panel{display:none;flex-direction:column;gap:12px;padding:12px 0 16px;border-top:1px solid var(--line)}
.mobile-panel.open{display:flex}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 22px;border-radius:999px;font-weight:600;font-size:.95rem;border:1px solid transparent;transition:transform .15s ease,box-shadow .15s ease}
.btn:hover{transform:translateY(-1px)}
.btn-primary{background:var(--accent);color:var(--on-accent);box-shadow:0 8px 24px color-mix(in srgb,var(--accent) 35%,transparent)}
.btn-ghost{border-color:var(--line);color:var(--text)}
.hero{padding:clamp(3rem,8vw,5.5rem) 0 3rem}
.hero-grid{display:grid;gap:2rem;align-items:center}
.hero-grid.split{grid-template-columns:1.2fr .8fr}
@media(max-width:800px){.hero-grid.split{grid-template-columns:1fr}}
.eyebrow{letter-spacing:.14em;text-transform:uppercase;font-size:.72rem;color:var(--accent);margin:0 0 12px;font-weight:600}
.hero h1{font-family:var(--font-display);font-size:clamp(2.25rem,5.5vw,3.5rem);line-height:1.08;margin:0 0 14px;letter-spacing:-0.03em}
.hero .headline{color:var(--muted);font-size:1.2rem;margin:0 0 28px;max-width:34rem}
.hero-cta{display:flex;flex-wrap:wrap;gap:10px}
.avatar{width:140px;height:140px;border-radius:50%;object-fit:cover;border:2px solid var(--line);box-shadow:0 20px 50px rgba(0,0,0,.35)}
.section{padding:3.25rem 0;border-top:1px solid var(--line)}
.section h2{font-family:var(--font-display);font-size:clamp(1.4rem,3vw,1.85rem);margin:0 0 1.4rem;letter-spacing:-0.02em}
.lead{color:var(--muted);max-width:42rem;margin:0 0 1.5rem}
.timeline{position:relative;padding-left:1.25rem}
.timeline::before{content:"";position:absolute;left:4px;top:.35rem;bottom:.35rem;width:2px;background:var(--line)}
.tl-item{position:relative;padding:0 0 1.35rem 1.1rem}
.tl-item::before{content:"";position:absolute;left:-1.25rem;top:.55rem;width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 25%,transparent)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:1.35rem 1.4rem;margin-bottom:12px;transition:border-color .2s}
.card:hover{border-color:color-mix(in srgb,var(--accent) 45%,var(--line))}
.card h3{margin:0 0 4px;font-size:1.08rem;font-family:var(--font-display)}
.card .meta{color:var(--muted);font-size:.86rem;margin:0 0 10px}
.card ul{margin:0;padding-left:1.15rem;color:var(--muted)}
.card li{margin-bottom:4px}
.skills{display:flex;flex-wrap:wrap;gap:8px}
.skills span,.skill-chip{border:1px solid var(--line);padding:7px 14px;border-radius:999px;font-size:.85rem;color:var(--muted);background:var(--surface)}
.skill-group{margin-bottom:1.25rem}
.skill-group h3{font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 8px}
.grid-2{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
.stat-row{display:flex;flex-wrap:wrap;gap:1.5rem;margin:1.5rem 0 0}
.stat{min-width:5rem}.stat b{display:block;font-size:1.5rem;font-family:var(--font-display);color:var(--text)}.stat span{font-size:.8rem;color:var(--muted)}
.site-footer{padding:2.25rem 0;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem}
.reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:none}
@media(max-width:720px){
  .nav-links{display:none}
  .nav-toggle{display:inline-flex}
}
`;
}

function nav(brand: string, active?: string): string {
  const links = [
    ["index.html", "Home"],
    ["about.html", "About"],
    ["experience.html", "Experience"],
    ["projects.html", "Projects"],
    ["skills.html", "Skills"],
    ["contact.html", "Contact"],
  ];
  const desktop = links
    .map(
      ([href, label]) =>
        `<a href="${href}"${active === href ? ' aria-current="page"' : ""}>${E(label)}</a>`
    )
    .join("\n    ");
  const mobile = links
    .map(([href, label]) => `<a href="${href}">${E(label)}</a>`)
    .join("\n    ");
  return `<header class="site-header"><div class="wrap">
  <div class="nav">
    <a class="brand" href="index.html" data-goke="link">${E(brand)}</a>
    <nav class="nav-links" data-goke="nav">${desktop}</nav>
    <button type="button" class="nav-toggle" data-nav-toggle aria-label="Menu">Menu</button>
    <a class="btn btn-primary" href="contact.html" data-goke="button">Contact</a>
  </div>
  <div class="mobile-panel" data-mobile-panel>${mobile}</div>
</div></header>`;
}

function page(
  title: string,
  brand: string,
  body: string,
  theme: ReturnType<typeof themeForProfile>,
  opts?: { description?: string; active?: string }
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${E(title)} · ${E(brand)}</title>
<meta name="description" content="${E(opts?.description || title)}"/>
<meta property="og:title" content="${E(title)} · ${E(brand)}"/>
<meta property="og:description" content="${E(opts?.description || title)}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${googleFontsLink(theme)}" rel="stylesheet"/>
<link rel="stylesheet" href="styles.css"/>
</head>
<body data-goke-path="professional" data-persona="${E(theme.id)}">
${nav(brand, opts?.active)}
${body}
<footer class="site-footer"><div class="wrap">
  <p>© ${new Date().getFullYear()} ${E(brand)}. Built with gòke.</p>
</div></footer>
<script src="script.js"></script>
</body></html>`;
}

function experienceTimeline(profile: ProfessionalProfile): string {
  if (!profile.experience.length) {
    return `<p class="lead" data-goke="text">Add roles in the editor — or re-upload a richer CV.</p>`;
  }
  return `<div class="timeline">${profile.experience
    .map(
      (e) => `<article class="tl-item reveal" data-goke="section">
  <div class="card">
    <h3 data-goke="heading">${E(e.title)}</h3>
    <p class="meta" data-goke="text">${E(e.company)}${
        e.location ? " · " + E(e.location) : ""
      }${
        e.start || e.end
          ? ` · ${E(e.start || "")}${e.end ? " – " + E(String(e.end)) : ""}`
          : ""
      }</p>
    ${
      e.bullets?.length
        ? `<ul>${e.bullets.map((b) => `<li data-goke="text">${E(b)}</li>`).join("")}</ul>`
        : ""
    }
  </div>
</article>`
    )
    .join("\n")}</div>`;
}

function projectsGrid(profile: ProfessionalProfile): string {
  const projects = profile.projects || [];
  if (!projects.length) {
    return `<p class="lead" data-goke="text">Selected projects will show here. Add them in the editor.</p>`;
  }
  return `<div class="grid-2">${projects
    .map(
      (pr) => `<article class="card reveal" data-goke="section">
  <h3 data-goke="heading">${E(pr.name)}</h3>
  ${pr.description ? `<p class="meta" data-goke="text">${E(pr.description)}</p>` : ""}
  ${
    pr.highlights?.length
      ? `<ul>${pr.highlights.map((h) => `<li data-goke="text">${E(h)}</li>`).join("")}</ul>`
      : ""
  }
  ${pr.url ? `<p style="margin-top:10px"><a href="${E(pr.url)}" target="_blank" rel="noopener">View →</a></p>` : ""}
</article>`
    )
    .join("\n")}</div>`;
}

function skillsBlock(profile: ProfessionalProfile): string {
  const groups = ensureSkillGroups(profile);
  if (!groups.length) {
    return `<p class="lead" data-goke="text">Add skills in the editor.</p>`;
  }
  return groups
    .map(
      (g) => `<div class="skill-group reveal">
  <h3 data-goke="heading">${E(g.name)}</h3>
  <div class="skills">${g.keywords
    .map((k) => `<span class="skill-chip" data-goke="text">${E(k)}</span>`)
    .join("")}</div>
</div>`
    )
    .join("\n");
}

export function generateProfessionalSiteFiles(
  profile: ProfessionalProfile
): ProfessionalSiteFiles {
  const theme = themeForProfile(profile);
  const name = profile.fullName || "Professional";
  const wa = waLink(profile.phone);
  const contactHref = wa || (profile.email ? `mailto:${profile.email}` : "contact.html");
  const about =
    profile.about ||
    `${name} builds a clear professional presence on the open web — beyond a social profile.`;
  const personaLabel = theme.label;

  const stats = [
    profile.experience.length
      ? `<div class="stat"><b>${profile.experience.length}</b><span>Roles</span></div>`
      : "",
    profile.skills.length
      ? `<div class="stat"><b>${Math.min(profile.skills.length, 99)}</b><span>Skills</span></div>`
      : "",
    (profile.projects || []).length
      ? `<div class="stat"><b>${profile.projects!.length}</b><span>Projects</span></div>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const heroPhoto = profile.photoUrl
    ? `<img class="avatar" src="${E(profile.photoUrl)}" alt="" width="140" height="140" data-goke="image"/>`
    : `<div class="avatar" style="display:grid;place-items:center;background:var(--surface-2);font-family:var(--font-display);font-size:2.5rem;color:var(--accent)">${E(
        name.charAt(0)
      )}</div>`;

  const heroInner =
    theme.heroStyle === "centered"
      ? `<div class="hero-grid" style="text-align:center;justify-items:center">
  ${heroPhoto}
  <div>
    <p class="eyebrow" data-goke="text">${E(personaLabel)}</p>
    <h1 data-goke="heading">${E(name)}</h1>
    <p class="headline" data-goke="text">${E(profile.headline || "Professional portfolio")}</p>
    <div class="hero-cta" style="justify-content:center">
      <a class="btn btn-primary" href="${E(contactHref)}" data-goke="button">${wa ? "Message on WhatsApp" : "Contact"}</a>
      <a class="btn btn-ghost" href="experience.html" data-goke="button">Experience</a>
    </div>
  </div>
</div>`
      : `<div class="hero-grid split">
  <div>
    <p class="eyebrow" data-goke="text">${E(personaLabel)}</p>
    <h1 data-goke="heading">${E(name)}</h1>
    <p class="headline" data-goke="text">${E(profile.headline || "Professional portfolio")}</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="${E(contactHref)}" data-goke="button">${wa ? "Message on WhatsApp" : "Get in touch"}</a>
      <a class="btn btn-ghost" href="experience.html" data-goke="button">View experience</a>
    </div>
    ${stats ? `<div class="stat-row">${stats}</div>` : ""}
  </div>
  <div style="display:flex;justify-content:center">${heroPhoto}</div>
</div>`;

  const indexBody = `<main>
<section class="hero wrap" data-goke="section" data-section-name="Hero">${heroInner}</section>
<section class="section wrap" data-goke="section" data-section-name="About">
  <h2 data-goke="heading">About</h2>
  <p class="lead reveal" data-goke="text">${E(about.slice(0, 600))}</p>
  <p><a href="about.html">Full profile →</a></p>
</section>
<section class="section wrap" data-goke="section" data-section-name="Experience">
  <h2 data-goke="heading">Selected experience</h2>
  ${experienceTimeline({ ...profile, experience: profile.experience.slice(0, 3) })}
  <p style="margin-top:1rem"><a href="experience.html">Full experience →</a></p>
</section>
</main>`;

  const educationHtml = profile.education.length
    ? `<h2 data-goke="heading" style="margin-top:2.5rem">Education</h2><div class="grid-2">${profile.education
        .map(
          (ed) =>
            `<div class="card reveal"><h3 data-goke="heading">${E(ed.school)}</h3><p class="meta" data-goke="text">${E(
              [ed.degree, ed.field, ed.year].filter(Boolean).join(" · ")
            )}</p></div>`
        )
        .join("")}</div>`
    : "";

  const awardsHtml = profile.awards?.length
    ? `<h2 data-goke="heading" style="margin-top:2.5rem">Awards</h2>${profile.awards
        .map(
          (a) =>
            `<div class="card reveal"><h3 data-goke="heading">${E(a.title)}</h3><p class="meta" data-goke="text">${E(
              [a.awarder, a.date].filter(Boolean).join(" · ")
            )}</p>${a.summary ? `<p data-goke="text">${E(a.summary)}</p>` : ""}</div>`
        )
        .join("")}`
    : "";

  const aboutBody = `<main class="section wrap">
  <h1 data-goke="heading">About</h1>
  <p class="lead reveal" data-goke="text">${E(about)}</p>
  ${profile.location ? `<p class="meta" data-goke="text">${E(profile.location)}</p>` : ""}
  ${educationHtml}${awardsHtml}
</main>`;

  const expBody = `<main class="section wrap">
  <h1 data-goke="heading">Experience</h1>
  <p class="lead">Roles and impact — written for humans, not keyword stuffing.</p>
  ${experienceTimeline(profile)}
</main>`;

  const projectsBody = `<main class="section wrap">
  <h1 data-goke="heading">Projects</h1>
  <p class="lead">Selected work and initiatives.</p>
  ${projectsGrid(profile)}
</main>`;

  const certs = profile.certifications?.length
    ? `<h2 data-goke="heading" style="margin-top:2rem">Certifications</h2><ul>${profile.certifications
        .map((c) => `<li class="reveal" data-goke="text">${E(c)}</li>`)
        .join("")}</ul>`
    : "";

  const langs = profile.languages?.length
    ? `<h2 data-goke="heading" style="margin-top:2rem">Languages</h2><div class="skills">${profile.languages
        .map(
          (l) =>
            `<span class="skill-chip" data-goke="text">${E(l.language)}${l.fluency ? ` · ${E(l.fluency)}` : ""}</span>`
        )
        .join("")}</div>`
    : "";

  const skillsBody = `<main class="section wrap">
  <h1 data-goke="heading">Skills</h1>
  ${skillsBlock(profile)}${certs}${langs}
</main>`;

  const contactBody = `<main class="section wrap">
  <h1 data-goke="heading">Contact</h1>
  <p class="lead" data-goke="text">Prefer a direct conversation? Reach out below.</p>
  <div class="hero-cta" style="margin-top:1.25rem">
    ${wa ? `<a class="btn btn-primary" href="${E(wa)}" data-goke="button">WhatsApp</a>` : ""}
    ${profile.email ? `<a class="btn btn-ghost" href="mailto:${E(profile.email)}" data-goke="button">Email</a>` : ""}
    ${profile.linkedinUrl ? `<a class="btn btn-ghost" href="${E(profile.linkedinUrl)}" target="_blank" rel="noopener" data-goke="button">LinkedIn</a>` : ""}
    ${profile.website ? `<a class="btn btn-ghost" href="${E(profile.website)}" target="_blank" rel="noopener" data-goke="button">Website</a>` : ""}
  </div>
  <form class="card" style="margin-top:2rem" data-goke-contact data-wa="${E(profile.phone || "")}">
    <p><label>Name<br/><input name="name" required style="width:100%;margin-top:6px;padding:12px;border-radius:10px;border:1px solid var(--line);background:var(--ink);color:var(--text)"/></label></p>
    <p><label>Message<br/><textarea name="message" rows="4" required style="width:100%;margin-top:6px;padding:12px;border-radius:10px;border:1px solid var(--line);background:var(--ink);color:var(--text)"></textarea></label></p>
    <button type="submit" class="btn btn-primary" data-goke="button">Send message</button>
  </form>
</main>`;

  const script = `document.querySelectorAll("form[data-goke-contact]").forEach(function(f){
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var fd=new FormData(f);
    var wa=(f.getAttribute("data-wa")||"").replace(/\\D/g,"");
    var msg="Hello, I'm "+(fd.get("name")||"")+".\\n\\n"+(fd.get("message")||"");
    if(wa) window.open("https://wa.me/"+wa+"?text="+encodeURIComponent(msg),"_blank");
    else if(window.location) alert("Thanks — add a phone on your profile for WhatsApp delivery.");
  });
});
var toggle=document.querySelector("[data-nav-toggle]");
var panel=document.querySelector("[data-mobile-panel]");
if(toggle&&panel){toggle.addEventListener("click",function(){panel.classList.toggle("open");});}
if("IntersectionObserver" in window){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting) en.target.classList.add("visible");});
  },{threshold:0.12});
  document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});
}else{document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("visible");});}
`;

  const desc = profile.headline || about.slice(0, 150);

  return {
    "index.html": page(name, name, indexBody, theme, {
      description: desc,
      active: "index.html",
    }),
    "about.html": page("About", name, aboutBody, theme, {
      description: about.slice(0, 150),
      active: "about.html",
    }),
    "experience.html": page("Experience", name, expBody, theme, {
      active: "experience.html",
    }),
    "projects.html": page("Projects", name, projectsBody, theme, {
      active: "projects.html",
    }),
    "skills.html": page("Skills", name, skillsBody, theme, {
      active: "skills.html",
    }),
    "contact.html": page("Contact", name, contactBody, theme, {
      active: "contact.html",
    }),
    "styles.css": shellCss(theme),
    "script.js": script,
    "profile.json": JSON.stringify(profile, null, 2),
    "resume.json": JSON.stringify(professionalToJsonResume(profile), null, 2),
    "pages.json": JSON.stringify(
      [
        { file: "index.html", title: "Home" },
        { file: "about.html", title: "About" },
        { file: "experience.html", title: "Experience" },
        { file: "projects.html", title: "Projects" },
        { file: "skills.html", title: "Skills" },
        { file: "contact.html", title: "Contact" },
      ],
      null,
      2
    ),
  };
}
