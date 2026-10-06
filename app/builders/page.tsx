import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/marketing/SiteHeader";
import { SiteFooter } from "../components/marketing/SiteFooter";

export const metadata: Metadata = {
  title: "Gòke Builders — Build websites. Sell them. Build your income.",
  description:
    "Turn web skills into a business. Build professional websites with gòke, sell to real clients, keep the difference. For students, designers, freelancers, and tech enthusiasts.",
};

const audiences = [
  {
    icon: "🎓",
    title: "Students",
    body: "Learn by building real websites and turn the skill into income — before graduation.",
  },
  {
    icon: "💻",
    title: "Tech enthusiasts",
    body: "If you enjoy technology and design, gòke is a practical way to create real sites.",
  },
  {
    icon: "🎨",
    title: "Designers",
    body: "Turn design skills into complete websites businesses can actually use.",
  },
  {
    icon: "🧑‍💻",
    title: "Freelancers",
    body: "Deliver websites faster without rebuilding the entire system from scratch.",
  },
  {
    icon: "🚀",
    title: "Young entrepreneurs",
    body: "Start a web-design service without first inventing your own platform.",
  },
  {
    icon: "🌐",
    title: "Developers",
    body: "Use gòke as a faster production layer while you focus on higher-value work.",
  },
  {
    icon: "📱",
    title: "Social media managers",
    body: "Offer clients more than content — an owned website they can grow.",
  },
  {
    icon: "🏢",
    title: "Agencies",
    body: "Increase how many websites your team can deliver without proportional headcount.",
  },
];

const steps = [
  {
    n: "01",
    title: "Try gòke",
    body: "Create your first website. Start with a business, brand, or idea.",
  },
  {
    n: "02",
    title: "Build",
    body: "Use templates, components, the visual editor, and customization tools.",
  },
  {
    n: "03",
    title: "Make it yours",
    body: "Change content, images, colors, typography, sections, and layout.",
  },
  {
    n: "04",
    title: "Publish",
    body: "Take the website live when it’s ready.",
  },
  {
    n: "05",
    title: "Start selling",
    body: "Use what you’ve learned to approach businesses that need websites.",
  },
  {
    n: "06",
    title: "Build again",
    body: "Every new client is another opportunity to build and earn.",
  },
];

const gateSteps = [
  "Build your first website",
  "Publish or complete your project",
  "Request Builder access",
  "Join the Gòke Builders community",
  "Learn advanced techniques",
  "Start building for clients",
];

const communityPerks = [
  { icon: "🎥", title: "Design tutorials", body: "Practical videos on creating better websites." },
  { icon: "💡", title: "Design inspiration", body: "Layouts, ideas, compositions, creative approaches." },
  { icon: "🧠", title: "Gòke tips", body: "Shortcuts and techniques to get more from the platform." },
  { icon: "🛠️", title: "Practical guides", body: "Step-by-step builds for different business types." },
  { icon: "📐", title: "Design principles", body: "Make sites look professional — not just functional." },
  { icon: "💼", title: "Business guidance", body: "Approach clients, present work, package your service." },
  { icon: "🤝", title: "Community", body: "Connect with other builders using gòke." },
];

const templates = [
  { name: "Commerce", cat: "E-commerce" },
  { name: "Luxe", cat: "Fashion & luxury" },
  { name: "Estate", cat: "Real estate" },
  { name: "Stay", cat: "Hotels & hospitality" },
  { name: "Pro", cat: "Professionals" },
  { name: "Clinic", cat: "Healthcare" },
  { name: "Auto", cat: "Automobile" },
  { name: "Dine", cat: "Restaurants" },
  { name: "Creative", cat: "Creative pros" },
  { name: "Booking", cat: "Appointments" },
];

const levels = [
  { level: "01", name: "Explorer", desc: "You’ve discovered gòke." },
  { level: "02", name: "Builder", desc: "You’ve built your first website." },
  { level: "03", name: "Gòke Builder", desc: "You’re actively creating websites." },
  { level: "04", name: "Professional", desc: "You’re serving multiple clients." },
  { level: "05", name: "Power Builder", desc: "Consistent delivery — a real web-design practice." },
];

const studentIdeas = [
  "a friend’s business",
  "your department",
  "a campus organization",
  "a local restaurant",
  "a fashion vendor",
  "a barber or salon",
  "a photographer",
  "a startup",
  "a professional",
];

export default function BuildersPage() {
  return (
    <>
      <SiteHeader />
      <main className="gb-page">
        {/* Hero */}
        <section className="gb-hero">
          <div className="gk-container">
            <p className="gk-kicker">Gòke Builders</p>
            <h1>
              Build websites. Sell websites.
              <br />
              <em>Build again.</em>
            </h1>
            <p className="gb-hero-lead">
              Gòke gives students, designers, developers, and tech enthusiasts the tools to create
              professional websites for real businesses — without building every site from scratch.
            </p>
            <p className="gb-hero-sub">
              Build with gòke. Sell with confidence. Build again.
            </p>
            <div className="gb-hero-actions">
              <a href="/#start" className="gk-btn gk-btn-primary gk-btn-lg">
                Start building with gòke
              </a>
              <a href="#how" className="gk-btn gk-btn-ghost gk-btn-lg">
                See how it works
              </a>
            </div>
            <div className="gb-flow" aria-hidden>
              <span>You</span>
              <span className="gb-flow-arrow">→</span>
              <span>Gòke</span>
              <span className="gb-flow-arrow">→</span>
              <span>Website</span>
              <span className="gb-flow-arrow">→</span>
              <span>Client</span>
              <span className="gb-flow-arrow">→</span>
              <span className="gb-flow-money">₦</span>
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="gk-section">
          <div className="gk-container gb-position">
            <h2>You don’t have to build the technology.</h2>
            <p className="gb-position-lead">You can build the business.</p>
            <div className="gb-position-grid">
              <div>
                <h3>Gòke handles</h3>
                <ul>
                  <li>Website creation infrastructure</li>
                  <li>Templates &amp; components</li>
                  <li>Visual editor &amp; publishing</li>
                </ul>
              </div>
              <div>
                <h3>You handle</h3>
                <ul>
                  <li>Finding the client</li>
                  <li>Understanding the business</li>
                  <li>Customizing &amp; delivering</li>
                  <li>Setting your own price</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Money / economics */}
        <section className="gk-section gk-section-alt" id="economics">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>Example economics</h2>
              <p>
                Your client doesn’t need to know how long it took. They care about the result. You
                set the price. Gòke charges a one-time publish fee per site.
              </p>
            </div>
            <div className="gb-econ">
              <div className="gb-econ-card">
                <div className="gb-econ-row">
                  <span>Your website price</span>
                  <strong>₦100,000</strong>
                </div>
                <div className="gb-econ-row">
                  <span>Gòke publish fee</span>
                  <strong>₦20,000</strong>
                </div>
                <div className="gb-econ-row gb-econ-diff">
                  <span>Potential difference</span>
                  <strong>₦80,000</strong>
                </div>
              </div>
              <div className="gb-econ-stack">
                <p>That’s one website.</p>
                <ul>
                  <li>
                    Build another → <span>₦100K → ₦20K → ₦80K difference</span>
                  </li>
                  <li>
                    Build another → <span>₦100K → ₦20K → ₦80K difference</span>
                  </li>
                  <li>
                    Build another → <span>₦100K → ₦20K → ₦80K difference</span>
                  </li>
                </ul>
                <p className="gb-econ-punch">
                  Your earning potential grows with the number of websites you successfully sell and
                  deliver.
                </p>
              </div>
            </div>
            <p className="gb-disclaimer">
              Example only. Gòke does not guarantee client acquisition, selling prices, or earnings.
              Builders set their own prices and are responsible for delivering services to their
              clients.
            </p>
          </div>
        </section>

        {/* Who for */}
        <section className="gk-section" id="who">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>Who is this for?</h2>
              <p>You don’t have to be a senior developer.</p>
            </div>
            <div className="gb-audience-grid">
              {audiences.map((a) => (
                <article key={a.title} className="gb-audience-card">
                  <span className="gb-audience-icon" aria-hidden>
                    {a.icon}
                  </span>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="gk-section gk-section-alt" id="how">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>How it works</h2>
              <p>Your journey starts with one website.</p>
            </div>
            <ol className="gb-steps">
              {steps.map((s) => (
                <li key={s.n}>
                  <span className="gb-step-n">{s.n}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Gate */}
        <section className="gk-section" id="join">
          <div className="gk-container gb-gate">
            <h2>Want to become a Gòke Builder?</h2>
            <p className="gb-gate-lead">
              <strong>Build first. Join second.</strong>
            </p>
            <p>
              We don’t want people joining just to watch tutorials. We want people who have opened
              gòke, built a website, and experienced the platform.
            </p>
            <ol className="gb-gate-list">
              {gateSteps.map((s, i) => (
                <li key={s}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="gb-hero-actions">
              <a href="/#start" className="gk-btn gk-btn-primary">
                Build your first website
              </a>
              <a
                href="https://t.me/"
                className="gk-btn gk-btn-ghost"
                target="_blank"
                rel="noreferrer"
              >
                Request Builders access
              </a>
            </div>
            <p className="gb-gate-note">
              Replace the Telegram link with your real community invite when ready.
            </p>
          </div>
        </section>

        {/* Community */}
        <section className="gk-section gk-section-alt" id="community">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>Gòke Builders community</h2>
              <p>A private space for people actively using gòke to build websites.</p>
            </div>
            <div className="gb-perk-grid">
              {communityPerks.map((p) => (
                <article key={p.title} className="gb-perk-card">
                  <span aria-hidden>{p.icon}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="gk-section" id="templates">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>Build for almost any business</h2>
              <p>Choose a starting point. Transform it into something unique.</p>
            </div>
            <div className="gb-template-grid">
              {templates.map((t) => (
                <div key={t.name} className="gb-template-chip">
                  <strong>Gòke {t.name}</strong>
                  <span>{t.cat}</span>
                </div>
              ))}
            </div>
            <p className="gb-template-foot">
              Fashion brands, restaurants, hotels, real estate, clinics, professionals, schools,
              churches, startups, local businesses — and more.
            </p>
          </div>
        </section>

        {/* Students */}
        <section className="gk-section gk-section-alt" id="students">
          <div className="gk-container gb-students">
            <h2>Students: don’t wait until graduation</h2>
            <p>
              Learn by creating actual websites. Your first project doesn’t have to be perfect —
              it’s your first case study. The second can be better. The third can be faster. The
              tenth can become a business.
            </p>
            <p className="gb-students-label">Build a website for:</p>
            <ul className="gb-student-ideas">
              {studentIdeas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
            <a href="/#start" className="gk-btn gk-btn-primary">
              Start your first build
            </a>
          </div>
        </section>

        {/* Levels */}
        <section className="gk-section" id="levels">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>The progression</h2>
              <p>Not official ranks — a simple map of the journey.</p>
            </div>
            <div className="gb-levels">
              {levels.map((l, i) => (
                <div key={l.level} className="gb-level">
                  <span className="gb-level-n">Level {l.level}</span>
                  <strong>{l.name}</strong>
                  <p>{l.desc}</p>
                  {i < levels.length - 1 && (
                    <span className="gb-level-arrow" aria-hidden>
                      ↓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Three-sided model */}
        <section className="gk-section gk-section-alt">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>A network, not a tutorial club</h2>
              <p>
                Gòke Builders is a network of people using gòke to deliver websites to businesses.
              </p>
            </div>
            <div className="gb-triad">
              <article>
                <h3>Businesses</h3>
                <p>Need websites.</p>
              </article>
              <span className="gb-triad-arrow" aria-hidden>
                →
              </span>
              <article>
                <h3>Gòke Builders</h3>
                <p>Find clients and deliver sites.</p>
              </article>
              <span className="gb-triad-arrow" aria-hidden>
                →
              </span>
              <article>
                <h3>Gòke</h3>
                <p>Provides the infrastructure.</p>
              </article>
            </div>
            <p className="gb-triad-note">
              The builder earns from the service. Gòke earns from the platform. More websites sold
              means more websites created on gòke.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="gk-cta-band gb-final-cta">
          <div className="gk-container">
            <h2>Your first website is waiting</h2>
            <p>
              You don’t need a client. You don’t need a company. You don’t need to be an expert.
              Open gòke. Build something. Once you’ve completed your first website, request access
              to the Gòke Builders community.
            </p>
            <div className="gb-hero-actions" style={{ justifyContent: "center" }}>
              <a href="/#start" className="gk-btn gk-btn-primary gk-btn-lg">
                Start building with gòke
              </a>
              <a
                href="https://t.me/"
                className="gk-btn gk-btn-ghost gk-btn-lg"
                target="_blank"
                rel="noreferrer"
              >
                Already built? Request access
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
