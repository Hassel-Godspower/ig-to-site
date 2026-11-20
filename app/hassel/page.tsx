import Script from "next/script";
import { Inter, Syne } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--hg-body",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--hg-display",
  display: "swap",
});

const person = {
  name: "Hassel Godspower",
  initials: "HG",
  role: "SEO Specialist · Web Developer",
  location: "Lagos, Nigeria",
  email: "godspowerh0@gmail.com",
  phone: "07065341105",
  phoneIntl: "+2347065341105",
  whatsapp: "https://wa.me/2347065341105",
  website: {
    label: "highvaluesolutions.net",
    href: "https://highvaluesolutions.net",
  },
  lede:
    "I help brands get found and convert. Technical SEO, structured pages, and websites that behave like products—not brochures.",
  about:
    "I work at the intersection of search and shipping: WordPress and modern web stacks, technical and on-page SEO, local visibility, and conversion-minded structure. As founder of HighValue Solutions I lead delivery end-to-end—architecture, content frames, performance, and the small operational details that keep a site earning after launch.",
};

const stats = [
  { n: "10+", l: "Years in digital & brand ops" },
  { n: "7+", l: "Live brand & client sites" },
  { n: "SEO+", l: "Technical · local · content" },
];

const skills = [
  {
    title: "Search",
    items: [
      "Technical SEO",
      "On-page systems",
      "Intent mapping",
      "Local SEO",
      "Internal linking",
      "Metadata & SERP craft",
    ],
  },
  {
    title: "Build",
    items: [
      "WordPress / WooCommerce",
      "HTML · CSS · JS",
      "React · Next.js",
      "Landing architecture",
      "DNS · hosting · SSL",
      "API & automation",
    ],
  },
  {
    title: "Measure",
    items: [
      "GA4",
      "Search Console",
      "Performance baselines",
      "Conversion paths",
      "Content systems",
      "Campaign support",
    ],
  },
  {
    title: "Brand",
    items: [
      "Social ops",
      "Content cadence",
      "Community",
      "Story systems",
      "Campaign coordination",
      "Trend sensing",
    ],
  },
];

type Job = {
  when: string;
  title: string;
  org: string;
  points: string[];
};

const experience: Job[] = [
  {
    when: "Current",
    title: "Founder & Digital Solutions Lead",
    org: "HighValue Solutions",
    points: [
      "Own website and digital delivery: build, optimise, troubleshoot, and evolve live properties.",
      "Design information architecture, service pages, metadata, and SEO foundations into every brief.",
      "Ship tools such as a skin-tone product recommender and an AI site assistant.",
      "Translate business goals into durable web experiences—not one-off templates.",
    ],
  },
  {
    when: "Aug 2022 – May 2026",
    title: "IT Professional / Brand Manager",
    org: "Zikel Cosmetics",
    points: [
      "Designed and ran multi-site web operations for the brand.",
      "Supported ecommerce workflows: orders, site reliability, and day-to-day digital ops.",
      "Led the digital marketing team and kept brand presentation consistent across surfaces.",
    ],
  },
  {
    when: "Dec 2021 – Aug 2022",
    title: "Brand Manager / Digital Marketer",
    org: "Glowhite Cosmetics & Halfcast Cosmetics",
    points: [
      "Managed website back-ends and online order flow.",
      "Coordinated digital marketing with clean brand presentation online.",
    ],
  },
  {
    when: "Aug 2021 – Nov 2021",
    title: "Customer Care / Digital Marketer",
    org: "David Wej Global Ventures",
    points: [
      "Handled enquiries and complaints; supported content for online channels.",
      "Processed local and international orders.",
    ],
  },
];

const projects = [
  {
    name: "Zikel Cosmetics",
    text: "Multi-site presence—structure, ops, and ongoing management.",
    href: "https://zikelcosmetics.com/",
    tag: "Ecommerce · multi-site",
  },
  {
    name: "Halfcast Cosmetics",
    text: "Website co-management and online business support.",
    href: "https://halfcastcosmetics.com/",
    tag: "Brand · ops",
  },
  {
    name: "Ali-Line",
    text: "Custom site for an Australia-based lining company.",
    href: "https://www.ali-line.com.au/",
    tag: "Custom build",
  },
  {
    name: "Shoptradefair",
    text: "Vendor-listing platform for trade discovery.",
    href: "https://shoptradefair.com.ng/",
    tag: "Marketplace",
  },
  {
    name: "Skin Tone Recommender",
    text: "Detects skin tone and recommends relevant products.",
    href: "https://highvaluesolutions.net/skin-tone-recommender/",
    tag: "Product tool",
  },
  {
    name: "AI Website Assistant",
    text: "Reads site content and answers visitor questions in context.",
    tag: "AI · support",
  },
  {
    name: "Pax & Pearl Body Works",
    text: "Service structure, on-page SEO, and local business signals.",
    href: "https://paxandpearl.com",
    tag: "Local SEO",
  },
];

const earlier: Job[] = [
  {
    when: "Oct 2018 – Sep 2019",
    title: "NYSC Teacher",
    org: "Victory Model College, Ogun Waterside",
    points: ["Taught Literature in English."],
  },
  {
    when: "Jan 2015 – Aug 2018",
    title: "Project / Program Coordinator (Part Time)",
    org: "World Transformers International",
    points: [
      "Ran programmes for an NGO focused on human capacity development.",
      "Reports, proposals, records, publicity, and conference representation.",
    ],
  },
  {
    when: "Mar 2010 – Aug 2013",
    title: "Sales Personnel → Supervisor",
    org: "Excel Inn",
    points: [
      "Sales, relationships, retention—progressed to sales supervisor.",
    ],
  },
];

const education = [
  {
    title: "B.A. History & International Studies",
    dates: "2014 – 2018",
    place: "University of Ilorin",
  },
  {
    title: "Digital Marketing Certificate",
    dates: "2019",
    place: "Google Digital Skills for Africa",
  },
  {
    title: "Design Driven Entrepreneurship",
    dates: "2019",
    place: "YALI Network, USA",
  },
];

const css = `
.hg-root {
  --bg: #070a0c;
  --bg-elev: #0e1418;
  --fg: #eef3f2;
  --muted: #8fa3a0;
  --line: rgba(255,255,255,0.08);
  --gold: #c9a227;
  --gold-soft: rgba(201,162,39,0.14);
  --teal: #5fd0c3;
  --display: var(--hg-display), Syne, system-ui, sans-serif;
  --body: var(--hg-body), Inter, system-ui, sans-serif;
  min-height: 100vh;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--body);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
.hg-root *, .hg-root *::before, .hg-root *::after { box-sizing: border-box; }
.hg-root a { color: var(--gold); text-underline-offset: 3px; }
.hg-root a:focus-visible, .hg-root button:focus-visible {
  outline: 2px solid var(--gold); outline-offset: 3px; border-radius: 4px;
}
.hg-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding-left: max(1.25rem, env(safe-area-inset-left));
  padding-right: max(1.25rem, env(safe-area-inset-right));
}
.hg-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  padding: calc(1rem + env(safe-area-inset-top)) 0 2rem;
  border-bottom: 1px solid var(--line);
  margin-bottom: 2.5rem;
}
.hg-mark {
  font-family: var(--display);
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: 0.95rem;
  color: var(--fg);
  text-decoration: none;
}
.hg-mark span { color: var(--gold); }
.hg-nav {
  display: flex; flex-wrap: wrap; gap: 0.35rem 1.1rem;
  list-style: none; margin: 0; padding: 0; font-size: 0.84rem;
}
.hg-nav a { color: var(--muted); text-decoration: none; }
.hg-nav a:hover { color: var(--fg); }
.hg-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
  gap: 2.5rem 3rem;
  align-items: center;
  padding-bottom: 3rem;
}
.hg-kicker {
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 600;
  margin: 0 0 1rem;
}
.hg-hero h1 {
  font-family: var(--display);
  font-weight: 800;
  font-size: clamp(2.6rem, 7vw, 4.25rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 0;
}
.hg-hero .role {
  margin-top: 0.85rem;
  color: var(--muted);
  font-size: 1.05rem;
}
.hg-lede {
  margin-top: 1.25rem;
  max-width: 36rem;
  color: var(--fg);
  opacity: 0.92;
  font-size: 1.08rem;
}
.hg-cta {
  display: flex; flex-wrap: wrap; gap: 0.65rem;
  margin-top: 1.75rem;
}
.hg-btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0.72rem 1.2rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  border: 1px solid transparent;
  transition: transform 0.15s ease, background 0.15s ease;
}
.hg-btn:hover { transform: translateY(-1px); }
.hg-btn-primary {
  background: var(--gold);
  color: #120e04;
}
.hg-btn-ghost {
  border-color: var(--line);
  color: var(--fg);
  background: transparent;
}
.hg-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
.hg-card {
  background: linear-gradient(160deg, #121a1e 0%, #0a1012 100%);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 1.35rem 1.4rem 1.5rem;
  position: relative;
  overflow: hidden;
}
.hg-card::before {
  content: "";
  position: absolute; inset: 0 0 auto 0; height: 2px;
  background: linear-gradient(90deg, var(--gold), transparent 70%);
}
.hg-serp-bar {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 0.8rem;
  color: var(--muted);
  margin-bottom: 1rem;
}
.hg-serp-bar strong { color: var(--fg); font-weight: 500; }
.hg-serp-url { font-size: 0.78rem; color: var(--teal); }
.hg-serp-title {
  font-family: var(--display);
  font-size: 1.15rem;
  font-weight: 700;
  color: #8ec8ff;
  margin: 0.2rem 0 0.4rem;
  line-height: 1.3;
}
.hg-serp-snip { font-size: 0.88rem; color: var(--muted); margin: 0; }
.hg-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  margin: 0 0 3.5rem;
}
.hg-stat {
  background: var(--bg-elev);
  padding: 1.25rem 1rem;
  text-align: center;
}
.hg-stat b {
  display: block;
  font-family: var(--display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--gold);
  letter-spacing: -0.02em;
}
.hg-stat span { font-size: 0.8rem; color: var(--muted); }
.hg-sec {
  padding: 2.75rem 0 0.5rem;
  scroll-margin-top: 1.25rem;
}
.hg-sec-head {
  display: flex; align-items: baseline; gap: 0.85rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--line);
}
.hg-sec-num {
  font-family: var(--display);
  font-size: 0.8rem;
  color: var(--gold);
  letter-spacing: 0.08em;
}
.hg-sec-head h2 {
  font-family: var(--display);
  font-size: 1.45rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}
.hg-about { max-width: 42rem; color: var(--muted); font-size: 1.05rem; }
.hg-about strong { color: var(--fg); font-weight: 600; }
.hg-skills {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.75rem 2.25rem;
}
.hg-skills h3 {
  margin: 0 0 0.65rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 700;
}
.hg-chips {
  display: flex; flex-wrap: wrap; gap: 0.4rem;
  list-style: none; margin: 0; padding: 0;
}
.hg-chips li {
  background: var(--gold-soft);
  color: var(--fg);
  border: 1px solid rgba(201,162,39,0.2);
  padding: 0.28rem 0.65rem;
  border-radius: 6px;
  font-size: 0.84rem;
}
.hg-job {
  display: grid;
  grid-template-columns: 10.5rem minmax(0, 1fr);
  gap: 0.35rem 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--line);
}
.hg-job:first-of-type { border-top: 0; padding-top: 0; }
.hg-when { color: var(--muted); font-size: 0.86rem; padding-top: 0.2rem; }
.hg-job h3 {
  font-family: var(--display);
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}
.hg-org { color: var(--gold); font-weight: 600; margin: 0.2rem 0 0.65rem; font-size: 0.95rem; }
.hg-job ul { margin: 0; padding-left: 1.1rem; display: grid; gap: 0.35rem; color: var(--muted); }
.hg-job li::marker { color: var(--gold); }
.hg-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 1rem;
}
.hg-proj {
  background: var(--bg-elev);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1.2rem 1.25rem;
  display: flex; flex-direction: column; gap: 0.45rem;
  transition: border-color 0.15s ease, transform 0.15s ease;
  text-decoration: none;
  color: inherit;
  min-height: 100%;
}
.hg-proj:hover { border-color: rgba(201,162,39,0.45); transform: translateY(-2px); }
.hg-proj-tag {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--teal);
  font-weight: 600;
}
.hg-proj h3 {
  font-family: var(--display);
  font-size: 1.1rem;
  margin: 0;
  color: var(--fg);
}
.hg-proj p { margin: 0; color: var(--muted); font-size: 0.92rem; flex: 1; }
.hg-proj-link { font-size: 0.82rem; color: var(--gold); margin-top: 0.25rem; }
.hg-edu { display: grid; gap: 1rem; }
.hg-edu-row {
  display: flex; flex-wrap: wrap; justify-content: space-between;
  gap: 0.15rem 1.5rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--line);
}
.hg-edu-row strong {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.02rem;
}
.hg-edu-row .sub { width: 100%; color: var(--muted); font-size: 0.9rem; order: 3; }
.hg-edu-row .dates { color: var(--muted); font-size: 0.86rem; }
.hg-note { margin-top: 1.5rem; color: var(--muted); max-width: 40rem; font-size: 0.95rem; }
.hg-contact {
  margin-top: 3.5rem;
  padding: 3rem 0 calc(3rem + env(safe-area-inset-bottom));
  border-top: 1px solid var(--line);
  background: radial-gradient(ellipse at 20% 0%, rgba(201,162,39,0.08), transparent 55%);
}
.hg-contact h2 {
  font-family: var(--display);
  font-size: clamp(1.75rem, 4vw, 2.4rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}
.hg-contact .sub {
  color: var(--muted);
  margin: 0.65rem 0 0;
  max-width: 32rem;
}
.hg-reach {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 0.85rem;
  margin-top: 1.75rem;
}
.hg-reach-item {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  background: var(--bg-elev);
}
.hg-reach-item .label {
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}
.hg-reach-item .val {
  font-weight: 600;
  font-size: 0.95rem;
  overflow-wrap: anywhere;
  user-select: all;
  color: var(--fg);
}
.hg-reach-item .val a { color: var(--gold); text-decoration: none; }
.hg-reach-item button {
  background: transparent;
  color: var(--gold);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0.35rem 0.7rem;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  flex: none;
}
.hg-reach-item button:hover { border-color: var(--gold); }
.hg-foot {
  margin-top: 2.25rem;
  padding-top: 1.15rem;
  border-top: 1px solid var(--line);
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--muted);
}
@media (max-width: 860px) {
  .hg-hero { grid-template-columns: 1fr; gap: 2rem; }
  .hg-skills { grid-template-columns: 1fr; }
  .hg-job { grid-template-columns: 1fr; }
  .hg-when { order: -1; }
  .hg-stats { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .hg-btn, .hg-proj { transition: none; }
}
`;

const copyScript = `
document.addEventListener("click",function(e){
  var t=e.target; if(!t||!t.closest)return;
  var b=t.closest("button[data-copy]"); if(!b)return;
  var text=b.getAttribute("data-copy")||"";
  var done=function(l){b.textContent=l;setTimeout(function(){b.textContent="Copy"},1500)};
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){done("Copied")},function(){done("Select & copy")});
  } else done("Select & copy");
});
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: "SEO Specialist",
  url: "https://highvaluesolutions.net/hassel",
  email: "mailto:" + person.email,
  telephone: person.phoneIntl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  worksFor: {
    "@type": "Organization",
    name: "HighValue Solutions",
    url: "https://highvaluesolutions.net",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Ilorin",
  },
};

function Sec({
  num,
  id,
  title,
  children,
}: {
  num: string;
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="hg-sec" id={id}>
      <div className="hg-sec-head">
        <span className="hg-sec-num">{num}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function JobBlock({ job }: { job: Job }) {
  return (
    <article className="hg-job">
      <div className="hg-when">{job.when}</div>
      <div>
        <h3>{job.title}</h3>
        <p className="hg-org">{job.org}</p>
        <ul>
          {job.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function HasselPage() {
  return (
    <div className={"hg-root " + inter.variable + " " + syne.variable}>
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

      <div className="hg-wrap">
        <header className="hg-top">
          <a className="hg-mark" href="#top">
            HG<span>.</span>
          </a>
          <ul className="hg-nav">
            <li>
              <a href="#profile">Profile</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#work">Work</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </header>

        <div className="hg-hero" id="top">
          <div>
            <p className="hg-kicker">
              {person.location} · Open to SEO &amp; web roles
            </p>
            <h1>{person.name}</h1>
            <p className="role">{person.role}</p>
            <p className="hg-lede">{person.lede}</p>
            <div className="hg-cta">
              <a className="hg-btn hg-btn-primary" href={person.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a className="hg-btn hg-btn-ghost" href="#projects">
                Selected work
              </a>
              <a className="hg-btn hg-btn-ghost" href={"mailto:" + person.email}>
                Email
              </a>
            </div>
          </div>

          <aside className="hg-card" aria-label="Search result preview">
            <div className="hg-serp-bar">
              ⌕ <strong>Hassel Godspower SEO Lagos</strong>
            </div>
            <div className="hg-serp-url">https://highvaluesolutions.net/hassel</div>
            <div className="hg-serp-title">
              Hassel Godspower | SEO Specialist &amp; Web Growth
            </div>
            <p className="hg-serp-snip">
              Technical SEO, WordPress, local search, and conversion-focused
              websites. Founder of HighValue Solutions — Lagos.
            </p>
          </aside>
        </div>

        <div className="hg-stats" aria-label="Highlights">
          {stats.map((s) => (
            <div className="hg-stat" key={s.l}>
              <b>{s.n}</b>
              <span>{s.l}</span>
            </div>
          ))}
        </div>

        <Sec num="01" id="profile" title="Profile">
          <p className="hg-about">
            <strong>{person.name}.</strong> {person.about}
          </p>
        </Sec>

        <Sec num="02" id="skills" title="Capabilities">
          <div className="hg-skills">
            {skills.map((g) => (
              <div key={g.title}>
                <h3>{g.title}</h3>
                <ul className="hg-chips">
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Sec>

        <Sec num="03" id="work" title="Experience">
          {experience.map((j) => (
            <JobBlock key={j.title + j.when} job={j} />
          ))}
        </Sec>

        <Sec num="04" id="projects" title="Selected projects">
          <div className="hg-projects">
            {projects.map((p) =>
              p.href ? (
                <a
                  key={p.name}
                  className="hg-proj"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="hg-proj-tag">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                  <span className="hg-proj-link">Visit →</span>
                </a>
              ) : (
                <div key={p.name} className="hg-proj">
                  <span className="hg-proj-tag">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                  <span className="hg-proj-link">On request</span>
                </div>
              )
            )}
          </div>
        </Sec>

        <Sec num="05" id="earlier" title="Earlier path">
          {earlier.map((j) => (
            <JobBlock key={j.title + j.when} job={j} />
          ))}
        </Sec>

        <Sec num="06" id="education" title="Education">
          <div className="hg-edu">
            {education.map((e) => (
              <div className="hg-edu-row" key={e.title}>
                <strong>{e.title}</strong>
                <span className="dates">{e.dates}</span>
                <span className="sub">{e.place}</span>
              </div>
            ))}
          </div>
          <p className="hg-note">
            Focus: technical SEO, organic growth, local search, web performance,
            ecommerce UX. References on request.
          </p>
        </Sec>
      </div>

      <footer className="hg-contact" id="contact">
        <div className="hg-wrap">
          <h2>Let’s make the site easier to find.</h2>
          <p className="sub">
            Open to SEO roles, technical audits, and website projects. Prefer
            WhatsApp or email.
          </p>
          <div className="hg-reach">
            <div className="hg-reach-item">
              <div>
                <div className="label">Email</div>
                <div className="val">{person.email}</div>
              </div>
              <button type="button" data-copy={person.email}>
                Copy
              </button>
            </div>
            <div className="hg-reach-item">
              <div>
                <div className="label">Phone</div>
                <div className="val">{person.phone}</div>
              </div>
              <button type="button" data-copy={person.phone}>
                Copy
              </button>
            </div>
            <div className="hg-reach-item">
              <div>
                <div className="label">WhatsApp</div>
                <div className="val">
                  <a href={person.whatsapp} target="_blank" rel="noopener noreferrer">
                    Message
                  </a>
                </div>
              </div>
            </div>
            <div className="hg-reach-item">
              <div>
                <div className="label">Company</div>
                <div className="val">
                  <a href={person.website.href}>{person.website.label}</a>
                </div>
              </div>
            </div>
          </div>
          <div className="hg-foot">
            <span>Hassel Godspower · Lagos</span>
            <span>HighValue Solutions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
