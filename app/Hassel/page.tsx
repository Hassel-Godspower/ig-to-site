import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--f-body",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--f-display",
  display: "swap",
});

const site = {
  url: "https://highvaluesolutions.net/hassel",
  title: "Hassel Godspower | SEO Specialist, Technical SEO & Web Growth",
  description:
    "Hassel Godspower is an SEO specialist and website developer in Lagos, Nigeria. Technical SEO, WordPress, WooCommerce, local search and conversion-focused websites.",
};

const person = {
  name: "Hassel Godspower",
  initials: "HG",
  role: "SEO Specialist",
  location: "Lagos, Nigeria",
  email: "godspowerh0@gmail.com",
  phone: "07065341105",
  website: {
    label: "highvaluesolutions.net",
    href: "https://highvaluesolutions.net",
  },
  lede:
    "Technical SEO, web development and digital growth. I build business websites that are easy to find, fast to use and set up to turn visitors into customers.",
  searchQuery: "Hassel Godspower SEO specialist Lagos",
  serp: {
    url: "highvaluesolutions.net",
    title: "Hassel Godspower | SEO Specialist, Technical SEO & Web Growth",
    snippet:
      "Website developer and digital marketing professional. Technical and on-page SEO, WordPress and WooCommerce, local search and conversion-focused websites. Founder of HighValue Solutions.",
  },
  about:
    "Website developer and digital marketing professional with experience managing business websites, supporting e-commerce operations, and building digital experiences for brands. I combine practical WordPress and web-development knowledge with SEO fundamentals: technical and on-page optimisation, landing-page structure, content optimisation, website performance and local search. As founder of HighValue Solutions, I deliver website and digital solutions for businesses, using search visibility, useful content and conversion-focused websites to drive measurable growth.",
  contactHeading: "Let's make your site easier to find.",
  contactLede:
    "Open to SEO roles and website projects. Reach out by email or phone.",
  footer: "Hassel Godspower · SEO & Digital Growth",
};

const nav = [
  { id: "hg-profile", label: "Profile" },
  { id: "hg-skills", label: "Skills" },
  { id: "hg-work", label: "Experience" },
  { id: "hg-projects", label: "Projects" },
  { id: "hg-education", label: "Education" },
  { id: "hg-contact", label: "Contact" },
];

const skills = [
  {
    title: "SEO & Search",
    items: [
      "Technical SEO",
      "On-page optimisation",
      "Keyword research",
      "Search-intent mapping",
      "Metadata",
      "Heading structure",
      "Internal linking",
      "Image optimisation",
      "Local SEO",
      "SEO content planning",
    ],
  },
  {
    title: "Web & Technical",
    items: [
      "WordPress",
      "WooCommerce",
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Next.js",
      "Website architecture",
      "Landing pages",
      "Security & backups",
      "Hosting, domains & DNS",
      "API integration & automation",
    ],
  },
  {
    title: "Analytics & Growth",
    items: [
      "Google Analytics / GA4",
      "Google Search Console",
      "Performance monitoring",
      "Conversion-focused page structure",
      "Content strategy",
      "Digital campaign support",
    ],
  },
  {
    title: "Digital Marketing",
    items: [
      "Social media management",
      "Content creation & scheduling",
      "Community engagement",
      "Brand storytelling",
      "Campaign management",
      "Trend monitoring",
    ],
  },
];

type JobItem = {
  when: string;
  title: string;
  org: string;
  points: string[];
};

const experience: JobItem[] = [
  {
    when: "Current",
    title: "Founder & Digital Solutions Lead",
    org: "HighValue Solutions",
    points: [
      "Lead website and digital solution projects for businesses, including development, management, optimisation and technical troubleshooting.",
      "Plan and implement website structures, service pages, metadata, content organisation and other SEO improvements as part of delivery.",
      "Build and maintain digital tools and web applications, including a skin-tone product recommender and an AI website assistant.",
      "Translate client business objectives into functional websites and practical digital experiences.",
    ],
  },
  {
    when: "Aug 2022 – May 2026",
    title: "IT Professional / Brand Manager",
    org: "Zikel Cosmetics",
    points: [
      "Designed, built and managed the back-end of the brand's websites, including the multi-site Zikel Cosmetics web presence.",
      "Supported e-commerce operations by receiving and processing orders and maintaining website-related business workflows.",
      "Managed the digital marketing team and maintained consistent brand presentation.",
      "Worked across website administration, online customer experience and digital brand operations.",
    ],
  },
  {
    when: "Dec 2021 – Aug 2022",
    title: "Brand Manager / Digital Marketer",
    org: "Glowhite Cosmetics & Halfcast Cosmetics",
    points: [
      "Managed the back-end of the brands' websites and supported day-to-day e-commerce operations.",
      "Received and processed online orders and coordinated activities with the digital marketing team.",
      "Contributed to brand management and the online presentation of the businesses.",
    ],
  },
  {
    when: "Aug 2021 – Nov 2021",
    title: "Customer Care / Digital Marketer",
    org: "David Wej Global Ventures",
    points: [
      "Handled customer enquiries and complaints and supported online marketing content development.",
      "Received and processed local and international orders.",
    ],
  },
];

const projects = [
  {
    name: "Zikel Cosmetics",
    text: "Built and managed the brand's multi-site website presence.",
    href: "https://zikelcosmetics.com/",
    label: "zikelcosmetics.com",
  },
  {
    name: "Halfcast Cosmetics",
    text: "Co-managed the company website and supported its online business operations.",
    href: "https://halfcastcosmetics.com/",
    label: "halfcastcosmetics.com",
  },
  {
    name: "Ali-Line",
    text: "Custom-built website for an Australia-based lining company.",
    href: "https://www.ali-line.com.au/",
    label: "ali-line.com.au",
  },
  {
    name: "Shoptradefair",
    text: "Built a vendor-listing platform.",
    href: "https://shoptradefair.com.ng/",
    label: "shoptradefair.com.ng",
  },
  {
    name: "Skin Tone Recommender",
    text: "Web-based tool that detects skin tone and recommends relevant products.",
    href: "https://highvaluesolutions.net/skin-tone-recommender/",
    label: "highvaluesolutions.net/skin-tone-recommender",
  },
  {
    name: "AI Website Assistant",
    text: "Chat assistant that reads a website's content and uses it to answer visitors' questions.",
    note: "Project details available on request",
  },
  {
    name: "Pax & Pearl Body Works",
    text: "Website and local-search optimisation: service-page structure, on-page elements and local business information.",
    href: "https://paxandpearl.com",
    label: "paxandpearl.com",
  },
];

const earlier: JobItem[] = [
  {
    when: "Oct 2018 – Sep 2019",
    title: "NYSC Teacher",
    org: "Victory Model College, Ogun Waterside, Ogun State",
    points: ["Taught Literature in English."],
  },
  {
    when: "Jan 2015 – Aug 2018",
    title: "Project / Program Coordinator (Part Time)",
    org: "World Transformers International",
    points: [
      "Organised and supervised projects and programmes for an NGO focused on human capacity development.",
      "Prepared monthly reports, presentations and project proposals; maintained records and responded to enquiries.",
      "Supported publicity and campaign activities and represented the organisation at seminars and conferences.",
    ],
  },
  {
    when: "Mar 2010 – Aug 2013",
    title: "Sales Personnel",
    org: "Excel Inn",
    points: [
      "Worked with the sales team to support sales, customer relationships and retention; progressed to sales supervisor.",
    ],
  },
];

const education = [
  {
    title: "B.A. History & International Studies",
    dates: "Aug 2014 – Sep 2018",
    place: "University of Ilorin, Nigeria",
  },
  {
    title: "Certificate in Digital Marketing",
    dates: "Apr 2019 – Jun 2019",
    place: "Google Digital Skills for Africa, Google Inc.",
  },
  {
    title: "Design Driven Entrepreneurship",
    dates: "Sep 2019 – Oct 2019",
    place: "YALI Network, USA",
  },
];

const interests =
  "Technical SEO, organic search growth, local search, content strategy, web performance, e-commerce and conversion-focused digital experiences.";

const css = `
.hg {
  --bg: #F6F9F9;
  --surface: #FFFFFF;
  --fg: #14262A;
  --muted: #4F656A;
  --line: #D3DFE0;
  --accent: #0F766E;
  --accent-soft: #E0F1EE;
  --hero-bg: #0B3B3A;
  --hero-fg: #F2FAF9;
  --hero-muted: #A9CFCB;
  --hero-accent: #7FD6CC;
  --hero-line: rgba(255, 255, 255, 0.16);
  --font-display: var(--f-display), "Segoe UI", system-ui, sans-serif;
  --font-body: var(--f-body), "Segoe UI", system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
html[data-theme="dark"] .hg,
.hg[data-force-dark] {
  --bg: #0B1718;
  --surface: #112325;
  --fg: #E5F0EF;
  --muted: #9DB4B7;
  --line: #223A3E;
  --accent: #5FD0C3;
  --accent-soft: #143A39;
  --hero-bg: #081F20;
  color-scheme: dark;
}
.hg *, .hg *::before, .hg *::after { box-sizing: border-box; }
.hg h1, .hg h2, .hg h3 {
  font-family: var(--font-display);
  line-height: 1.15;
  margin: 0;
  text-wrap: balance;
}
.hg p { margin: 0; }
.hg a { color: var(--accent); text-underline-offset: 3px; }
.hg a:focus-visible, .hg button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 4px;
}
.hg .wrap {
  max-width: 1040px;
  margin: 0 auto;
  padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px));
}
.hg .hero {
  background: var(--hero-bg);
  color: var(--hero-fg);
  padding-top: calc(env(safe-area-inset-top, 0px) + 1.25rem);
  padding-bottom: 3.5rem;
}
.hg .nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding-bottom: 2.5rem;
  font-size: 0.9rem;
}
.hg .nav .mark {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--hero-fg);
  text-decoration: none;
}
.hg .nav ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.hg .nav ul a { color: var(--hero-muted); text-decoration: none; }
.hg .nav ul a:hover { color: var(--hero-fg); }
.hg .hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 3rem;
  align-items: center;
}
.hg .eyebrow {
  color: var(--hero-accent);
  font-weight: 600;
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.hg .hero h1 {
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.hg .hero .lede {
  margin-top: 1.25rem;
  color: var(--hero-muted);
  max-width: 34rem;
  font-size: 1.05rem;
}
.hg .cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}
.hg .btn {
  display: inline-block;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  border: 1px solid var(--hero-accent);
}
.hg .btn.primary { background: var(--hero-accent); color: #06302D; }
.hg .btn.ghost { color: var(--hero-fg); border-color: var(--hero-line); }
.hg .btn.ghost:hover { border-color: var(--hero-accent); }
.hg .serp {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--hero-line);
  border-radius: 10px;
  padding: 1.25rem 1.25rem 1.35rem;
  min-width: 0;
}
.hg .serp .bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid var(--hero-line);
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--hero-muted);
  margin-bottom: 1.1rem;
  overflow-wrap: anywhere;
}
.hg .serp .bar span { color: var(--hero-fg); }
.hg .serp .url {
  font-size: 0.82rem;
  color: var(--hero-muted);
  overflow-wrap: anywhere;
}
.hg .serp .title {
  font-size: 1.15rem;
  color: var(--hero-accent);
  margin: 0.15rem 0 0.35rem;
  font-weight: 500;
  line-height: 1.35;
}
.hg .serp .snippet {
  font-size: 0.9rem;
  color: var(--hero-fg);
  opacity: 0.88;
  line-height: 1.55;
}
.hg .serp .meta {
  margin-top: 0.75rem;
  font-size: 0.78rem;
  color: var(--hero-muted);
}
.hg section {
  padding-top: 4rem;
  padding-bottom: 1rem;
  scroll-margin-top: 1rem;
}
.hg .sec-head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--line);
  padding-bottom: 0.9rem;
}
.hg .sec-head h2 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.hg .about { max-width: 46rem; font-size: 1.08rem; }
.hg .skills {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem 3rem;
}
.hg .skills h3 {
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.75rem;
  font-family: var(--font-body);
  font-weight: 600;
}
.hg .chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.hg .chips li {
  background: var(--accent-soft);
  color: var(--fg);
  padding: 0.25rem 0.65rem;
  border-radius: 5px;
  font-size: 0.88rem;
}
.hg .job {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: 0 2.5rem;
  padding: 1.75rem 0;
  border-top: 1px solid var(--line);
}
.hg .job:first-of-type { border-top: 0; padding-top: 0; }
.hg .job .when {
  color: var(--muted);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  padding-top: 0.3rem;
}
.hg .job h3 { font-size: 1.2rem; }
.hg .job .org {
  color: var(--accent);
  font-weight: 600;
  margin: 0.15rem 0 0.75rem;
}
.hg .job ul {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.4rem;
}
.hg .job li::marker { color: var(--accent); }
.hg .projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 290px), 1fr));
  gap: 1.25rem;
}
.hg .proj {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  transition: border-color 0.15s ease;
}
.hg .proj:hover { border-color: var(--accent); }
.hg .proj h3 { font-size: 1.1rem; }
.hg .proj p { color: var(--muted); font-size: 0.94rem; flex: 1; }
.hg .proj a, .hg .proj .note {
  font-size: 0.88rem;
  overflow-wrap: anywhere;
}
.hg .proj .note { color: var(--muted); font-style: italic; }
.hg .edu { display: grid; gap: 1.1rem; }
.hg .edu-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.1rem 2rem;
}
.hg .edu-row strong {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.05rem;
}
.hg .edu-row .sub {
  color: var(--muted);
  width: 100%;
  order: 3;
  font-size: 0.94rem;
}
.hg .edu-row .dates {
  color: var(--muted);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}
.hg .interests {
  margin-top: 2rem;
  color: var(--muted);
  max-width: 46rem;
}
.hg .interests b { color: var(--fg); font-weight: 600; }
.hg .contact {
  margin-top: 4rem;
  background: var(--hero-bg);
  color: var(--hero-fg);
  padding-top: 3.5rem;
  padding-bottom: calc(3rem + env(safe-area-inset-bottom, 0px));
}
.hg .contact h2 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  letter-spacing: -0.02em;
}
.hg .contact .lede {
  color: var(--hero-muted);
  margin-top: 0.75rem;
  max-width: 34rem;
}
.hg .reach {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.hg .reach-item {
  border: 1px solid var(--hero-line);
  border-radius: 8px;
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}
.hg .reach-item .label {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--hero-muted);
}
.hg .reach-item .val {
  font-weight: 500;
  overflow-wrap: anywhere;
  user-select: all;
}
.hg .reach-item .val a { color: var(--hero-accent); }
.hg .reach-item button {
  background: transparent;
  color: var(--hero-accent);
  border: 1px solid var(--hero-line);
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  flex: none;
}
.hg .reach-item button:hover { border-color: var(--hero-accent); }
.hg .foot {
  margin-top: 2.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--hero-line);
  color: var(--hero-muted);
  font-size: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
}
@media (max-width: 820px) {
  .hg .hero-grid { grid-template-columns: minmax(0, 1fr); gap: 2.25rem; }
  .hg .skills { grid-template-columns: minmax(0, 1fr); }
  .hg .job { grid-template-columns: minmax(0, 1fr); gap: 0.25rem; }
  .hg .job .when { order: -1; padding-top: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .hg .proj { transition: none; }
}
`;

const copyScript = `
document.addEventListener("click", function (e) {
  var t = e.target;
  if (!t || !t.closest) return;
  var b = t.closest("button[data-copy]");
  if (!b) return;
  var text = b.getAttribute("data-copy") || "";
  var done = function (label) {
    b.textContent = label;
    setTimeout(function () { b.textContent = "Copy"; }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      function () { done("Copied"); },
      function () { done("Press Ctrl+C"); }
    );
  } else {
    done("Press Ctrl+C");
  }
});
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  url: site.url,
  email: "mailto:" + person.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  worksFor: {
    "@type": "Organization",
    name: "HighValue Solutions",
    url: person.website.href,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Ilorin",
  },
};

function Job({ job }: { job: JobItem }) {
  return (
    <article className="job">
      <div className="when">{job.when}</div>
      <div>
        <h3>{job.title}</h3>
        <p className="org">{job.org}</p>
        <ul>
          {job.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="sec-head">
      <h2>{children}</h2>
    </div>
  );
}

export default function HasselPage() {
  return (
    <div className={"hg " + inter.variable + " " + grotesk.variable}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="hg-copy"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: copyScript }}
      />

      <header className="hero">
        <div className="wrap">
          <nav className="nav" aria-label="Sections">
            <a className="mark" href="#hg-top">
              {person.initials}
            </a>
            <ul>
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={"#" + n.id}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hero-grid" id="hg-top">
            <div>
              <p className="eyebrow">
                {person.role} · {person.location}
              </p>
              <h1>{person.name}</h1>
              <p className="lede">{person.lede}</p>
              <div className="cta">
                <a className="btn primary" href="#hg-contact">
                  Get in touch
                </a>
                <a className="btn ghost" href="#hg-projects">
                  See my work
                </a>
              </div>
            </div>

            <div className="serp" aria-label="Search result preview">
              <div className="bar" aria-hidden="true">
                &#9906; <span>{person.searchQuery}</span>
              </div>
              <div className="url">{person.serp.url}</div>
              <div className="title">{person.serp.title}</div>
              <p className="snippet">{person.serp.snippet}</p>
              <p className="meta">{person.location}</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="hg-profile">
          <div className="wrap">
            <SectionHead>Profile</SectionHead>
            <p className="about">{person.about}</p>
          </div>
        </section>

        <section id="hg-skills">
          <div className="wrap">
            <SectionHead>Skills</SectionHead>
            <div className="skills">
              {skills.map((g) => (
                <div key={g.title}>
                  <h3>{g.title}</h3>
                  <ul className="chips">
                    {g.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="hg-work">
          <div className="wrap">
            <SectionHead>Experience</SectionHead>
            {experience.map((j) => (
              <Job key={j.title + j.when} job={j} />
            ))}
          </div>
        </section>

        <section id="hg-projects">
          <div className="wrap">
            <SectionHead>Selected projects</SectionHead>
            <div className="projects">
              {projects.map((p) => (
                <article className="proj" key={p.name}>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noopener noreferrer">
                      {p.label}
                    </a>
                  ) : (
                    <span className="note">{p.note}</span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="hg-earlier">
          <div className="wrap">
            <SectionHead>Earlier experience</SectionHead>
            {earlier.map((j) => (
              <Job key={j.title + j.when} job={j} />
            ))}
          </div>
        </section>

        <section id="hg-education">
          <div className="wrap">
            <SectionHead>Education &amp; certifications</SectionHead>
            <div className="edu">
              {education.map((e) => (
                <div className="edu-row" key={e.title}>
                  <strong>{e.title}</strong>
                  <span className="dates">{e.dates}</span>
                  <span className="sub">{e.place}</span>
                </div>
              ))}
            </div>
            <p className="interests">
              <b>Professional interests:</b> {interests}{" "}
              <b>References</b> available upon request.
            </p>
          </div>
        </section>
      </main>

      <footer className="contact" id="hg-contact">
        <div className="wrap">
          <h2>{person.contactHeading}</h2>
          <p className="lede">{person.contactLede}</p>
          <div className="reach">
            <div className="reach-item">
              <div>
                <div className="label">Email</div>
                <div className="val">{person.email}</div>
              </div>
              <button type="button" data-copy={person.email}>
                Copy
              </button>
            </div>
            <div className="reach-item">
              <div>
                <div className="label">Phone</div>
                <div className="val">{person.phone}</div>
              </div>
              <button type="button" data-copy={person.phone}>
                Copy
              </button>
            </div>
            <div className="reach-item">
              <div>
                <div className="label">Website</div>
                <div className="val">
                  <a
                    href={person.website.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {person.website.label}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="foot">
            <span>{person.footer}</span>
            <span>{person.location}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
