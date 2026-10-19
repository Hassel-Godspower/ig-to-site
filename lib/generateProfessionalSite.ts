/**
 * Professional / personal-brand multi-page static site from ProfessionalProfile.
 * Reuses AI router when available; falls back to deterministic HTML shell.
 */

import type { ProfessionalProfile } from "./professionalProfile";
import { professionalToJsonResume } from "./jsonResume";

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

function shellCss(): string {
  return `:root{
  --ink:#0b0d12;--surface:#141820;--line:rgba(255,255,255,.08);
  --text:#f3f4f6;--muted:#9ca3af;--accent:#a78bfa;--on-accent:#0b0d12;
  --font-display:"Syne",system-ui,sans-serif;--font-body:system-ui,-apple-system,sans-serif;
  --radius:12px;
}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font-family:var(--font-body);background:var(--ink);color:var(--text);line-height:1.6}
a{color:var(--accent);text-decoration:none}
.wrap{width:min(100% - 2rem,960px);margin:0 auto}
.site-header{position:sticky;top:0;z-index:20;backdrop-filter:blur(12px);background:rgba(11,13,18,.85);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;gap:12px}
.brand{font-family:var(--font-display);font-weight:700;font-size:1.1rem;color:var(--text)}
.nav-links{display:flex;flex-wrap:wrap;gap:14px;font-size:.9rem}
.nav-links a{color:var(--muted)}.nav-links a:hover{color:var(--text)}
.btn{display:inline-block;padding:12px 20px;border-radius:999px;font-weight:600;border:1px solid transparent}
.btn-primary{background:var(--accent);color:var(--on-accent)}
.btn-ghost{border-color:var(--line);color:var(--text)}
.hero{padding:4.5rem 0 3rem}
.hero h1{font-family:var(--font-display);font-size:clamp(2rem,5vw,3.25rem);line-height:1.1;margin:0 0 12px}
.hero .headline{color:var(--muted);font-size:1.15rem;margin:0 0 24px;max-width:36rem}
.hero-cta{display:flex;flex-wrap:wrap;gap:10px}
.section{padding:3rem 0;border-top:1px solid var(--line)}
.section h2{font-family:var(--font-display);font-size:1.5rem;margin:0 0 1.25rem}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:1.25rem;margin-bottom:12px}
.card h3{margin:0 0 4px;font-size:1.05rem}
.card .meta{color:var(--muted);font-size:.85rem;margin-bottom:8px}
.card ul{margin:0;padding-left:1.1rem;color:var(--muted)}
.skills{display:flex;flex-wrap:wrap;gap:8px}
.skills span{border:1px solid var(--line);padding:6px 12px;border-radius:999px;font-size:.85rem;color:var(--muted)}
.site-footer{padding:2rem 0;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem}
@media(max-width:640px){.nav-links{display:none}}
`;
}

function page(
  title: string,
  brand: string,
  body: string,
  opts?: { description?: string }
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${E(title)} · ${E(brand)}</title>
<meta name="description" content="${E(opts?.description || title)}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="styles.css"/>
</head>
<body data-goke-path="professional">
<header class="site-header"><div class="wrap nav">
  <a class="brand" href="index.html" data-goke="link">${E(brand)}</a>
  <nav class="nav-links" data-goke="nav">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="experience.html">Experience</a>
    <a href="skills.html">Skills</a>
    <a href="contact.html">Contact</a>
  </nav>
  <a class="btn btn-primary" href="contact.html" data-goke="button">Contact</a>
</div></header>
${body}
<footer class="site-footer"><div class="wrap"><p>© ${new Date().getFullYear()} ${E(brand)}. Built with gòke.</p></div></footer>
<script src="script.js"></script>
</body></html>`;
}

/**
 * Deterministic professional site (always works without LLM).
 * Call LLM layer separately to upgrade copy when desired.
 */
export function generateProfessionalSiteFiles(
  profile: ProfessionalProfile
): ProfessionalSiteFiles {
  const name = profile.fullName || "Professional";
  const wa = waLink(profile.phone);
  const contactHref = wa || (profile.email ? `mailto:${profile.email}` : "contact.html");

  const experienceHtml = profile.experience.length
    ? profile.experience
        .map(
          (e) => `<article class="card" data-goke="section">
  <h3 data-goke="heading">${E(e.title)}</h3>
  <p class="meta" data-goke="text">${E(e.company)}${e.location ? " · " + E(e.location) : ""}${
            e.start || e.end
              ? ` · ${E(e.start || "")}${e.end ? " – " + E(String(e.end)) : ""}`
              : ""
          }</p>
  ${
    e.bullets?.length
      ? `<ul>${e.bullets.map((b) => `<li data-goke="text">${E(b)}</li>`).join("")}</ul>`
      : ""
  }
</article>`
        )
        .join("\n")
    : `<p class="meta" data-goke="text">Experience details will appear here — edit in gòke or re-upload a richer CV.</p>`;

  const skillsHtml = profile.skills.length
    ? `<div class="skills">${profile.skills
        .map((s) => `<span data-goke="text">${E(s)}</span>`)
        .join("")}</div>`
    : `<p class="meta" data-goke="text">Add skills in the editor.</p>`;

  const educationHtml = profile.education.length
    ? profile.education
        .map(
          (ed) =>
            `<div class="card"><h3 data-goke="heading">${E(ed.school)}</h3><p class="meta" data-goke="text">${E(
              [ed.degree, ed.field, ed.year].filter(Boolean).join(" · ")
            )}</p></div>`
        )
        .join("\n")
    : "";

  const about = profile.about || `${name} is building a professional presence on the open web.`;

  const indexBody = `<main>
<section class="hero wrap" data-goke="section" data-section-name="Hero">
  ${profile.photoUrl ? `<img src="${E(profile.photoUrl)}" alt="" width="96" height="96" style="border-radius:50%;margin-bottom:16px;object-fit:cover"/>` : ""}
  <p class="meta" style="letter-spacing:.12em;text-transform:uppercase;font-size:.75rem;color:var(--accent)" data-goke="text">${E(
    profile.persona || "Professional"
  )}</p>
  <h1 data-goke="heading">${E(name)}</h1>
  <p class="headline" data-goke="text">${E(profile.headline || "Professional portfolio")}</p>
  <div class="hero-cta">
    <a class="btn btn-primary" href="${E(contactHref)}" data-goke="button">${wa ? "Message on WhatsApp" : "Contact"}</a>
    <a class="btn btn-ghost" href="experience.html" data-goke="button">View experience</a>
  </div>
</section>
<section class="section wrap" data-goke="section" data-section-name="About">
  <h2 data-goke="heading">About</h2>
  <p data-goke="text">${E(about.slice(0, 500))}</p>
</section>
<section class="section wrap" data-goke="section" data-section-name="Selected experience">
  <h2 data-goke="heading">Selected experience</h2>
  ${experienceHtml}
  <p style="margin-top:1rem"><a href="experience.html">Full experience →</a></p>
</section>
</main>`;

  const aboutBody = `<main class="section wrap"><h1 data-goke="heading">About</h1><p data-goke="text">${E(
    about
  )}</p>${educationHtml ? `<h2 data-goke="heading" style="margin-top:2rem">Education</h2>${educationHtml}` : ""}</main>`;

  const expBody = `<main class="section wrap"><h1 data-goke="heading">Experience</h1>${experienceHtml}</main>`;
  const skillsBody = `<main class="section wrap"><h1 data-goke="heading">Skills</h1>${skillsHtml}
  ${
    profile.certifications?.length
      ? `<h2 data-goke="heading" style="margin-top:2rem">Certifications</h2><ul>${profile.certifications
          .map((c) => `<li data-goke="text">${E(c)}</li>`)
          .join("")}</ul>`
      : ""
  }</main>`;

  const contactBody = `<main class="section wrap">
  <h1 data-goke="heading">Contact</h1>
  <p data-goke="text">Prefer a direct conversation? Reach out below.</p>
  <div class="hero-cta" style="margin-top:1.5rem">
    ${wa ? `<a class="btn btn-primary" href="${E(wa)}" data-goke="button">WhatsApp</a>` : ""}
    ${profile.email ? `<a class="btn btn-ghost" href="mailto:${E(profile.email)}" data-goke="button">Email</a>` : ""}
    ${profile.linkedinUrl ? `<a class="btn btn-ghost" href="${E(profile.linkedinUrl)}" target="_blank" rel="noopener" data-goke="button">LinkedIn</a>` : ""}
  </div>
  <form class="card" style="margin-top:2rem" data-goke-contact data-wa="${E(profile.phone || "")}">
    <p><label>Name<br/><input name="name" required style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--line);background:var(--ink);color:var(--text)"/></label></p>
    <p><label>Message<br/><textarea name="message" rows="4" required style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--line);background:var(--ink);color:var(--text)"></textarea></label></p>
    <button type="submit" class="btn btn-primary" data-goke="button">Send</button>
  </form>
</main>`;

  const script = `document.querySelectorAll("form[data-goke-contact]").forEach(function(f){
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var fd=new FormData(f);
    var wa=(f.getAttribute("data-wa")||"").replace(/\\D/g,"");
    var msg="Hello, I'm "+(fd.get("name")||"")+".\\n\\n"+(fd.get("message")||"");
    if(wa) window.open("https://wa.me/"+wa+"?text="+encodeURIComponent(msg),"_blank");
    else alert("Thanks — add a phone number on your profile for WhatsApp delivery.");
  });
});`;

  return {
    "index.html": page(name, name, indexBody, {
      description: profile.headline || about.slice(0, 140),
    }),
    "about.html": page("About", name, aboutBody),
    "experience.html": page("Experience", name, expBody),
    "skills.html": page("Skills", name, skillsBody),
    "contact.html": page("Contact", name, contactBody),
    "styles.css": shellCss(),
    "script.js": script,
    "profile.json": JSON.stringify(profile, null, 2),
    "resume.json": JSON.stringify(professionalToJsonResume(profile), null, 2),
    "pages.json": JSON.stringify(
      [
        { file: "index.html", title: "Home" },
        { file: "about.html", title: "About" },
        { file: "experience.html", title: "Experience" },
        { file: "skills.html", title: "Skills" },
        { file: "contact.html", title: "Contact" },
      ],
      null,
      2
    ),
  };
}
