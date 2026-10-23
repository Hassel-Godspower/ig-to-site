/**
 * Premium professional site generator (LinkedIn / CV path).
 *
 * Home uses a speaker-card hero:
 *   left  — name, title, location, bio, skills, CTAs
 *   right — portrait (photoUrl or persona fallback)
 * Below  — highlight card · at-a-glance · selected work
 *
 * Always emits 6 HTML pages + styles.css + script.js + JSON sidecars.
 * Compatible with: themeForProfile, googleFontsLink, ensureSkillGroups, JSON Resume.
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
  return waLink(p.phone) || (p.email ? `mailto:${p.email}` : "contact.html");
}

function portraitUrl(p: ProfessionalProfile): string {
  if (p.photoUrl && /^https?:\/\//i.test(p.photoUrl)) return p.photoUrl;
  const byPersona: Record<string, string> = {
    consultant:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    engineer:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    designer:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    founder:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    lawyer:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    marketer:
      "https://images.unsplash.com/photo-1573497019940-1cfe09a8aea6?auto=format&fit=crop&w=800&q=80",
    creator:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
    general:
      "https://images.unsplash.com/photo-1573497019940-1cfe09a8aea6?auto=format&fit=crop&w=800&q=80",
  };
  return byPersona[p.persona || "general"] || byPersona.general;
}

function roleBadgeFor(p: ProfessionalProfile): string {
  switch (p.persona) {
    case "engineer":
      return "Technologist";
    case "designer":
      return "Designer";
    case "consultant":
      return "Advisor";
    case "founder":
      return "Founder";
    case "lawyer":
      return "Counsel";
    case "marketer":
      return "Strategist";
    case "creator":
      return "Creator";
    default:
      return "Professional";
  }
}

/** Profile-card hero: name + credentials left, portrait right */
function profileHeroHtml(p: ProfessionalProfile, t: ProfessionalTheme): string {
  const photo = portraitUrl(p);
  const skills = arr(p.skills).slice(0, 6);
  const skillLine = skills.length ? skills.map((s) => E(s)).join(" · ") : "";
  const roleBadge = roleBadgeFor(p);
  const focusTitle =
    arr(p.experience)[0]?.title ||
    p.headline?.split(/[|,–—-]/)[0]?.trim() ||
    "Focus areas";
  const focusSub =
    arr(p.experience)[0]?.company || p.location || "Open to conversations";

  return `
  <section class="profile-hero wrap reveal" data-goke="section" data-section-name="Hero">
    <div class="profile-hero-grid">
      <div class="profile-hero-copy">
        <p class="profile-kicker" data-goke="text">${E(roleBadge)}</p>
        <h1 data-goke="heading">${E(p.fullName)}</h1>
        <p class="profile-title" data-goke="text">${E(p.headline || "Professional")}</p>
        ${
          p.location
            ? `<p class="profile-org muted" data-goke="text">${E(p.location)}</p>`
            : ""
        }
        <div class="profile-rule" aria-hidden="true"></div>
        <p class="profile-bio" data-goke="text">${E(
          (p.about || "").slice(0, 320) ||
            "An accomplished professional. Edit this bio to tell your story with clarity and confidence."
        )}</p>
        ${
          skillLine
            ? `<p class="profile-skills muted" data-goke="text">${skillLine}</p>`
            : ""
        }
        <p class="profile-cta-row">
          <a class="btn btn-fill" href="contact.html" data-goke="button">${E(t.ctaPrimary)}</a>
          <a class="btn" href="about.html" data-goke="button">About</a>
          <a class="btn" href="experience.html" data-goke="button">Experience</a>
        </p>
      </div>
      <div class="profile-hero-photo">
        <span class="profile-badge" data-goke="text">${E(roleBadge)}</span>
        <img src="${E(photo)}" alt="${E(p.fullName)}" data-goke="image" width="480" height="560" />
      </div>
    </div>
    <div class="profile-session-card" data-goke="section" data-section-name="Highlight">
      <p class="session-kicker" data-goke="text">HIGHLIGHT</p>
      <h2 data-goke="heading">${E(focusTitle)}</h2>
      <p data-goke="text">${E(focusSub)}</p>
      <div class="session-pills">
        ${
          p.website
            ? `<a class="pill" href="${E(p.website)}" target="_blank" rel="noopener" data-goke="link">${E(
                p.website.replace(/^https?:\/\//, "").split("/")[0]
              )}</a>`
            : ""
        }
        ${
          p.linkedinUrl
            ? `<a class="pill" href="${E(p.linkedinUrl)}" target="_blank" rel="noopener" data-goke="link">LinkedIn</a>`
            : ""
        }
        <a class="pill" href="contact.html" data-goke="link">Contact</a>
      </div>
    </div>
  </section>
  <section class="wrap section reveal home-preview" data-goke="section" data-section-name="Overview">
    <h2><span class="num">01.</span> At a glance</h2>
    <p class="muted" data-goke="text">${E(
      (p.about || "").slice(0, 400) || "Add a fuller introduction on the About page."
    )}</p>
    <div class="home-links">
      <a href="experience.html">Experience →</a>
      <a href="projects.html">Work →</a>
      <a href="skills.html">Skills →</a>
      <a href="contact.html">Contact →</a>
    </div>
  </section>
  <section class="wrap section reveal" data-goke="section" data-section-name="Selected work">
    <h2><span class="num">02.</span> Selected work</h2>
    ${projectTable(p)}
    <p style="margin-top:1rem"><a href="projects.html">All work →</a></p>
  </section>`;
}

function projectTable(p: ProfessionalProfile): string {
  const projects = arr(p.projects);
  if (!projects.length) {
    return `<p class="muted" data-goke="text">Add projects in the editor — titles, links, and outcomes.</p>`;
  }
  const rows = projects
    .slice(0, 8)
    .map((pr) => {
      const stack = arr(pr.keywords).join(", ") || "—";
      const link = pr.url
        ? `<a href="${E(pr.url)}" target="_blank" rel="noopener" data-goke="link">${E(pr.name)}</a>`
        : `<span data-goke="text">${E(pr.name)}</span>`;
      return `<tr>
        <td>${link}</td>
        <td data-goke="text">${E((pr.description || "").slice(0, 120) || "—")}</td>
        <td data-goke="text">${E(stack)}</td>
      </tr>`;
    })
    .join("");
  return `<div class="table-wrap"><table class="work-table" data-goke="container">
    <thead><tr><th>Project</th><th>Summary</th><th>Stack</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function experienceTimeline(p: ProfessionalProfile): string {
  const exp = arr(p.experience);
  if (!exp.length) {
    return `<p class="muted" data-goke="text">Add roles and impact bullets in the editor.</p>`;
  }
  return exp
    .map((ex) => {
      const dates = [ex.start, ex.end || "Present"].filter(Boolean).join(" – ");
      const bullets =
        arr(ex.bullets).length > 0
          ? `<ul>${arr(ex.bullets)
              .slice(0, 6)
              .map((b) => `<li data-goke="text">${E(b)}</li>`)
              .join("")}</ul>`
          : "";
      return `<article class="timeline-item" data-goke="container">
        <h3 data-goke="heading">${E(ex.title)}</h3>
        <p class="meta muted" data-goke="text">${E(ex.company)}${
          ex.location ? ` · ${E(ex.location)}` : ""
        }${dates ? ` · ${E(dates)}` : ""}</p>
        ${bullets}
      </article>`;
    })
    .join("");
}

function skillsChips(p: ProfessionalProfile): string {
  const groups = ensureSkillGroups(p);
  if (!groups.length && !arr(p.skills).length) return "";
  if (groups.length) {
    return groups
      .map(
        (g) => `<div class="skill-group" data-goke="container">
      <h3 data-goke="heading">${E(g.name)}</h3>
      <p class="chips">${arr(g.keywords)
        .map((k) => `<span class="chip" data-goke="text">${E(k)}</span>`)
        .join("")}</p>
    </div>`
      )
      .join("");
  }
  return `<p class="chips">${arr(p.skills)
    .slice(0, 28)
    .map((k) => `<span class="chip" data-goke="text">${E(k)}</span>`)
    .join("")}</p>`;
}

function educationBlock(p: ProfessionalProfile): string {
  const ed = arr(p.education);
  if (!ed.length) return "";
  return `<div class="edu-list">${ed
    .map(
      (e) => `<article data-goke="container">
      <h3 data-goke="heading">${E(e.school)}</h3>
      <p class="muted" data-goke="text">${E(
        [e.degree, e.field, e.year].filter(Boolean).join(" · ")
      )}</p>
    </article>`
    )
    .join("")}</div>`;
}

function socialHtml(p: ProfessionalProfile): string {
  const links: string[] = [];
  if (p.linkedinUrl) {
    links.push(
      `<a href="${E(p.linkedinUrl)}" target="_blank" rel="noopener" data-goke="link">LinkedIn</a>`
    );
  }
  if (p.website) {
    links.push(
      `<a href="${E(p.website)}" target="_blank" rel="noopener" data-goke="link">Website</a>`
    );
  }
  if (p.email) {
    links.push(`<a href="mailto:${E(p.email)}" data-goke="link">Email</a>`);
  }
  return links.join(" · ") || "";
}

function contactBlock(p: ProfessionalProfile, t: ProfessionalTheme): string {
  const wa = waLink(p.phone);
  const href = contactHref(p);
  return `
  <section class="section contact-block" data-goke="section" data-section-name="Contact">
    <h1 data-goke="heading">Contact</h1>
    <p class="muted" data-goke="text">Prefer a direct channel — reply within one business day.</p>
    <p class="contact-actions">
      <a class="btn btn-fill" href="${E(href)}" data-goke="button"${
        wa ? ' target="_blank" rel="noopener"' : ""
      }>${E(t.ctaPrimary)}</a>
      ${
        p.email
          ? `<a class="btn" href="mailto:${E(p.email)}" data-goke="button">Email</a>`
          : ""
      }
    </p>
    <form class="contact-form" data-goke="form" data-email="${E(p.email || "")}" data-wa="${E(
      p.phone || ""
    )}">
      <label>Name<input name="name" required data-goke="input" /></label>
      <label>Email<input name="email" type="email" data-goke="input" /></label>
      <label>Message<textarea name="message" rows="4" required data-goke="input"></textarea></label>
      <button type="submit" class="btn btn-fill" data-goke="button">Send message</button>
    </form>
    <p class="socials muted">${socialHtml(p)}</p>
  </section>`;
}

function shellCss(t: ProfessionalTheme): string {
  return `:root{
  --bg:${t.ink};
  --surface:${t.surface};
  --surface-2:${t.surface2};
  --text:${t.text};
  --muted:${t.muted};
  --accent:${t.accent};
  --on-accent:${t.onAccent};
  --line:${t.line};
  --font-display:${t.displayFont};
  --font-body:${t.bodyFont};
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;
  font-family:var(--font-body);
  background:var(--bg);
  color:var(--text);
  line-height:1.55;
  -webkit-font-smoothing:antialiased;
}
a{color:var(--accent);text-decoration:none}
a:hover{opacity:.9}
img{max-width:100%;height:auto;display:block}
.wrap{width:min(1100px,92vw);margin:0 auto}
.muted{color:var(--muted)}
.num{color:var(--accent);font-weight:700;margin-right:.35rem}

/* Header */
.site-header{
  position:sticky;top:0;z-index:40;
  background:color-mix(in srgb,var(--bg) 88%,transparent);
  backdrop-filter:blur(12px);
  border-bottom:1px solid var(--line);
}
.site-header .inner{
  display:flex;align-items:center;justify-content:space-between;
  gap:1rem;padding:.85rem 0;width:min(1100px,92vw);margin:0 auto;
}
.brand{font-family:var(--font-display);font-weight:700;color:var(--text);letter-spacing:-.02em}
.site-nav{display:flex;flex-wrap:wrap;gap:.15rem 1rem;align-items:center}
.site-nav a{color:var(--muted);font-size:.9rem;font-weight:500}
.site-nav a.is-active,.site-nav a:hover{color:var(--text)}
.nav-toggle{display:none;background:transparent;border:1px solid var(--line);color:var(--text);border-radius:8px;padding:.4rem .65rem;cursor:pointer}
.mobile-panel{display:none;flex-direction:column;gap:.5rem;padding:0 0 1rem;width:min(1100px,92vw);margin:0 auto}
.mobile-panel.open{display:flex}
@media(max-width:760px){
  .site-nav.desktop{display:none}
  .nav-toggle{display:inline-flex}
}

/* Buttons */
.btn{
  display:inline-flex;align-items:center;justify-content:center;
  padding:.65rem 1.1rem;border-radius:999px;font-weight:600;font-size:.9rem;
  border:1px solid var(--line);color:var(--text);background:transparent;cursor:pointer;
}
.btn-fill{background:var(--accent);color:var(--on-accent);border-color:transparent}
.btn + .btn{margin-left:.35rem}

/* Profile-card hero */
.profile-hero{padding:2.5rem 0 1rem}
.profile-hero-grid{display:grid;gap:2rem;align-items:center}
@media(min-width:880px){
  .profile-hero-grid{grid-template-columns:1.05fr .95fr;gap:2.5rem}
}
.profile-kicker{
  font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;
  color:var(--accent);font-weight:700;margin:0 0 .75rem;
}
.profile-hero-copy h1{
  font-family:var(--font-display);
  font-size:clamp(2.1rem,5vw,3.4rem);letter-spacing:-.03em;
  margin:0 0 .5rem;color:var(--text);line-height:1.1;
}
.profile-title{font-size:1.05rem;font-weight:600;color:var(--accent);margin:0 0 .35rem;line-height:1.4}
.profile-org{margin:0 0 1rem;font-size:.95rem}
.profile-rule{width:3px;height:3.25rem;background:var(--accent);border-radius:2px;margin:0 0 1rem}
.profile-bio{color:var(--muted);max-width:34rem;margin:0 0 1rem;font-size:.98rem;line-height:1.7}
.profile-skills{font-size:.85rem;margin:0 0 1.25rem}
.profile-cta-row{display:flex;flex-wrap:wrap;gap:.6rem;margin:0}
.profile-hero-photo{position:relative;justify-self:center;width:min(100%,420px)}
.profile-hero-photo img{
  width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:18px;
  box-shadow:0 24px 60px rgba(0,0,0,.28);background:var(--surface);
}
.profile-badge{
  position:absolute;top:14px;right:14px;z-index:2;
  background:var(--accent);color:var(--on-accent);
  font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  padding:.4rem .75rem;border-radius:999px;
}
.profile-session-card{
  margin-top:2rem;padding:1.35rem 1.5rem 1.5rem;border-radius:16px;
  background:linear-gradient(135deg,var(--surface-2),var(--surface));
  border:1px solid var(--line);box-shadow:0 16px 40px rgba(0,0,0,.18);
}
.session-kicker{
  font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--accent);margin:0 0 .35rem;font-weight:700;
}
.profile-session-card h2{
  font-family:var(--font-display);
  font-size:clamp(1.35rem,3vw,1.85rem);margin:0 0 .35rem;
}
.profile-session-card > p{color:var(--muted);margin:0 0 1rem}
.session-pills{display:flex;flex-wrap:wrap;gap:.5rem}
.session-pills .pill{
  display:inline-flex;align-items:center;padding:.45rem .9rem;border-radius:999px;
  background:color-mix(in srgb,var(--text) 8%,transparent);
  border:1px solid var(--line);color:var(--text);font-size:.8rem;font-weight:600;
}
.session-pills .pill:hover{border-color:var(--accent);color:var(--accent)}
.home-links{display:flex;flex-wrap:wrap;gap:1rem;margin-top:1rem}
.home-links a{font-weight:600}

/* Sections */
.section{padding:2.75rem 0}
.section h1,.section h2{
  font-family:var(--font-display);letter-spacing:-.02em;margin:0 0 1rem;
}
.section h1{font-size:clamp(1.75rem,3.5vw,2.35rem)}
.section h2{font-size:clamp(1.35rem,2.8vw,1.75rem)}

/* Timeline */
.timeline{display:flex;flex-direction:column;gap:1.5rem}
.timeline-item{
  padding:1.15rem 1.25rem;border-radius:14px;
  background:var(--surface);border:1px solid var(--line);
}
.timeline-item h3{margin:0 0 .25rem;font-size:1.05rem}
.timeline-item .meta{margin:0 0 .65rem;font-size:.88rem}
.timeline-item ul{margin:.35rem 0 0;padding-left:1.1rem;color:var(--muted)}

/* Work table */
.table-wrap{overflow-x:auto;border-radius:12px;border:1px solid var(--line)}
.work-table{width:100%;border-collapse:collapse;font-size:.92rem}
.work-table th,.work-table td{padding:.75rem 1rem;text-align:left;border-bottom:1px solid var(--line)}
.work-table th{background:var(--surface);color:var(--muted);font-weight:600;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em}
.work-table tr:last-child td{border-bottom:none}

/* Skills */
.skill-group{margin-bottom:1.25rem}
.skill-group h3{font-size:.95rem;margin:0 0 .5rem}
.chips{display:flex;flex-wrap:wrap;gap:.45rem}
.chip{
  display:inline-flex;padding:.35rem .7rem;border-radius:999px;
  background:var(--surface);border:1px solid var(--line);font-size:.82rem;
}

/* Contact */
.contact-actions{display:flex;flex-wrap:wrap;gap:.6rem;margin:1rem 0 1.5rem}
.contact-form{display:grid;gap:.85rem;max-width:28rem}
.contact-form label{display:grid;gap:.35rem;font-size:.85rem;color:var(--muted)}
.contact-form input,.contact-form textarea{
  font:inherit;padding:.7rem .85rem;border-radius:10px;
  border:1px solid var(--line);background:var(--surface);color:var(--text);
}
.socials{margin-top:1.25rem;font-size:.9rem}

/* Footer */
.site-footer{
  margin-top:3rem;padding:2rem 0;border-top:1px solid var(--line);
  color:var(--muted);font-size:.85rem;
}
.site-footer .inner{width:min(1100px,92vw);margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem}

/* Reveal */
.reveal{opacity:0;transform:translateY(14px);transition:opacity .55s ease,transform .55s ease}
.reveal.visible{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none}}
`;
}

function scriptJs(): string {
  return `document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll(".contact-form").forEach(function(f){
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var fd=new FormData(f);
      var name=String(fd.get("name")||"").trim();
      var email=String(fd.get("email")||"").trim();
      var message=String(fd.get("message")||"").trim();
      var msg="Hello, I am "+name+(email?" ("+email+")":"")+".\\n\\n"+message;
      var wa=f.getAttribute("data-wa");
      if(wa){
        var n=wa.replace(/\\D/g,"");
        if(n.length>=10){window.open("https://wa.me/"+n+"?text="+encodeURIComponent(msg),"_blank");return;}
      }
      var em=f.getAttribute("data-email");
      if(em) window.location.href="mailto:"+em+"?subject=Website%20enquiry&body="+encodeURIComponent(msg);
      else alert("Add a phone or email in the editor so messages can reach you.");
    });
  });
  var toggle=document.querySelector("[data-nav-toggle]");
  var panel=document.querySelector("[data-mobile-panel]");
  if(toggle&&panel){
    toggle.addEventListener("click",function(){panel.classList.toggle("open");});
  }
  if("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting) en.target.classList.add("visible");});
    },{threshold:0.12});
    document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});
  }else{
    document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("visible");});
  }
});
`;
}

function navLinks(layout: ProLayoutMode, active: string): string {
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
  opts: { description?: string; active: string }
): string {
  const fonts = googleFontsLink(t);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${E(title)} | ${E(name)}</title>
  <meta name="description" content="${E(opts.description || title + " — " + name)}" />
  <meta property="og:title" content="${E(title)} | ${E(name)}" />
  <meta property="og:description" content="${E(opts.description || name)}" />
  ${fonts ? `<link rel="stylesheet" href="${E(fonts)}" />` : ""}
  <link rel="stylesheet" href="styles.css" />
</head>
<body data-goke-layout="${E(layout)}" data-wa="${E("")}">
  <header class="site-header" data-goke="container" data-section-name="Header">
    <div class="inner">
      <a class="brand" href="index.html" data-goke="heading">${E(name)}</a>
      <nav class="site-nav desktop" aria-label="Primary">
        ${navLinks(layout, opts.active)}
      </nav>
      <button type="button" class="nav-toggle" data-nav-toggle data-goke="button" aria-label="Menu">Menu</button>
    </div>
    <div class="mobile-panel" data-mobile-panel>
      ${navLinks(layout, opts.active)}
    </div>
  </header>
  <main>
    ${body}
  </main>
  <footer class="site-footer" data-goke="container" data-section-name="Footer">
    <div class="inner">
      <p data-goke="text">© ${new Date().getFullYear()} ${E(name)}</p>
      <p data-goke="text">Built for the open web</p>
    </div>
  </footer>
  <script src="script.js" defer></script>
</body>
</html>`;
}

function buildMultipage(
  p: ProfessionalProfile,
  t: ProfessionalTheme
): ProfessionalSiteFiles {
  const layout: ProLayoutMode = "multipage_editorial";
  const name = p.fullName || "Professional";

  return {
    "index.html": pageShell("Home", name, profileHeroHtml(p, t), t, layout, {
      active: "index.html",
      description: p.headline || name,
    }),
    "about.html": pageShell(
      "About",
      name,
      `<section class="wrap section reveal" data-goke="section" data-section-name="About">
      <h1 data-goke="heading">About</h1>
      <p data-goke="text">${E(p.about || "Add your story in the editor.")}</p>
      ${skillsChips(p)}
      ${educationBlock(p)}
    </section>`,
      t,
      layout,
      { active: "about.html", description: (p.about || "").slice(0, 150) }
    ),
    "experience.html": pageShell(
      "Experience",
      name,
      `<section class="wrap section reveal" data-goke="section" data-section-name="Experience">
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
      `<section class="wrap section reveal" data-goke="section" data-section-name="Projects">
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
      `<section class="wrap section reveal" data-goke="section" data-section-name="Skills">
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
  const layout = resolveLayout(theme, score);

  // Always multipage; home uses profile-card hero
  const pages: ProfessionalSiteFiles = buildMultipage(profile, theme);

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

  pages["styles.css"] = shellCss(theme);
  pages["script.js"] = scriptJs();
  pages["profile.json"] = JSON.stringify(profile, null, 2);
  pages["resume.json"] = JSON.stringify(professionalToJsonResume(profile), null, 2);
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
