import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/marketing/SiteHeader";
import { SiteFooter } from "../components/marketing/SiteFooter";

export const metadata: Metadata = {
  title: "Founder — Hassel Godspower | gòke by HighValue Solutions",
  description:
    "Meet Hassel Godspower, Founder of gòke and Founder & CEO of HighValue Solutions. Building technology that moves people and businesses from digital presence to digital ownership.",
  openGraph: {
    title: "Founder — Hassel Godspower | gòke",
    description:
      "The person behind gòke: technology, ownership, and practical innovation under HighValue Solutions.",
    type: "profile",
  },
};

const ecosystem = [
  {
    name: "gòke",
    body: "An intelligent business presence and owned website creation platform — Instagram or LinkedIn / CV to a real site you control.",
    href: "/#start",
  },
  {
    name: "LinkedPro",
    body: "A professional digital identity and portfolio platform for individuals and professionals.",
    href: "/#professional",
  },
  {
    name: "AfriVerse",
    body: "An Africa-native participatory knowledge infrastructure initiative for localized AI knowledge.",
    href: null,
  },
  {
    name: "Remotiva PowerDock",
    body: "Exploring universal device connectivity, charging and remote-control solutions.",
    href: null,
  },
];

const principles = [
  {
    title: "Solve real problems",
    body: "Innovation should begin with a meaningful problem, not simply a desire to use new technology.",
  },
  {
    title: "Build for ownership",
    body: "People and businesses should have greater control over the digital assets they create.",
  },
  {
    title: "Think beyond borders",
    body: "Solutions developed in Africa should have the capacity to serve the world.",
  },
  {
    title: "Keep improving",
    body: "Great products are built through experimentation, feedback and continuous development.",
  },
];

const pillars = [
  "Intelligent discovery — understanding businesses and their existing digital identities.",
  "AI-assisted website creation — turning available information into structured website content.",
  "Professional design — industry-aware layouts and customizable experiences.",
  "Digital ownership — an independent web presence beyond rented platforms.",
  "gòke Cloud — infrastructure that supports sites created through the platform.",
  "Continuous growth — improve, manage and expand after the first publish.",
];

export default function FounderPage() {
  return (
    <>
      <SiteHeader />
      <main className="gk-story-page">
        {/* Hero — dark editorial */}
        <section className="gk-story-hero">
          <div className="gk-container gk-story-hero-grid">
            <div>
              <p className="gk-kicker">The person behind the vision</p>
              <h1>
                Building technology that moves people and businesses{" "}
                <em>forward</em>.
              </h1>
              <p className="gk-story-name">Hassel Godspower</p>
              <p className="gk-story-role">
                Founder, gòke · Founder &amp; CEO, HighValue Solutions
              </p>
              <p className="gk-story-lead">
                I believe technology should do more than make things possible. It
                should make progress accessible, empower people to take ownership,
                and create opportunities that were previously out of reach.
              </p>
              <p className="gk-story-lead" style={{ marginTop: "0.75rem" }}>
                I am building gòke around this belief.
              </p>
              <div className="gk-story-actions">
                <a href="/#start" className="gk-btn gk-btn-primary">
                  Explore gòke
                </a>
                <a href="#story" className="gk-btn gk-btn-ghost">
                  Read my story
                </a>
              </div>
            </div>
            <div className="gk-story-portrait" aria-hidden="true">
              {/* Replace src with founder photo in /public/marketing/founder.jpg when available */}
              <div className="gk-story-portrait-frame">
                <img
                  src="/marketing/founder.png"
                  alt="Hassel Godspower — Founder of gòke"
                  width={480}
                  height={600}
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="story" className="gk-section gk-section-alt">
          <div className="gk-container gk-story-narrow">
            <p className="gk-kicker">A little about me</p>
            <h2>Technology, ownership and the possibilities of innovation.</h2>
            <p>
              I am Hassel Godspower, a technology entrepreneur, software systems
              developer and the Founder &amp; CEO of HighValue Solutions.
            </p>
            <p>
              My work is driven by an interest in identifying everyday challenges
              and developing practical technology solutions that address them.
            </p>
            <p>
              I am particularly interested in the intersection of artificial
              intelligence, software engineering, digital infrastructure and human
              opportunity.
            </p>
            <p>
              I believe Africa has enormous potential to build technology,
              intellectual property and digital infrastructure that serve its people
              and compete globally.
            </p>
            <p>
              My approach is simple: identify a meaningful problem, understand it
              deeply, build a practical solution, and continuously improve it.
            </p>
          </div>
        </section>

        {/* Why gòke */}
        <section className="gk-section">
          <div className="gk-container gk-story-narrow">
            <p className="gk-kicker">Why I started gòke</p>
            <h2>
              The internet gave businesses visibility. I believe they deserve
              ownership too.
            </h2>
            <p>
              Millions of businesses are building their digital presence on social
              media. They invest time creating content, attracting followers,
              building communities and generating customers.
            </p>
            <p>
              But there is a fundamental limitation: their digital presence is
              largely dependent on platforms they do not control. Their accounts,
              visibility, audience access and platform experiences are subject to
              decisions made by third parties.
            </p>
            <p>I began thinking about a different approach.</p>
            <ul className="gk-story-list">
              <li>
                What if a business could transform the digital identity it has
                already built into a professional website it actually owns and
                controls?
              </li>
              <li>
                What if creating a website did not require starting from scratch?
              </li>
              <li>
                What if artificial intelligence could help bridge the gap between
                social media presence and professional digital infrastructure?
              </li>
            </ul>
            <p>
              That thinking became the foundation of <strong>gòke</strong>.
            </p>
          </div>
        </section>

        {/* What we are building */}
        <section className="gk-section gk-section-alt">
          <div className="gk-container">
            <div className="gk-section-head">
              <p className="gk-kicker">What we are building</p>
              <h2>gòke: From digital presence to digital ownership.</h2>
              <p>
                gòke is an intelligent website creation platform that helps
                individuals, professionals and businesses transform their existing
                digital presence into a structured, professional website — and an
                ecosystem that grows with them.
              </p>
            </div>
            <ul className="gk-story-pillars">
              {pillars.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="gk-story-note">
              Our long-term ambition is to make establishing a professional digital
              presence significantly easier and more accessible.
            </p>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="gk-section">
          <div className="gk-container">
            <div className="gk-section-head">
              <p className="gk-kicker">The bigger picture</p>
              <h2>Building beyond one product.</h2>
              <p>
                gòke is part of a broader technology-building vision under HighValue
                Solutions. Each initiative addresses a different problem; they share
                one philosophy: useful technology that creates tangible value.
              </p>
            </div>
            <div className="gk-story-cards">
              {ecosystem.map((item) => (
                <article key={item.name} className="gk-story-card">
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                  {item.href ? (
                    <Link href={item.href} className="gk-story-card-link">
                      Learn more →
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="gk-section gk-section-alt">
          <div className="gk-container">
            <div className="gk-section-head">
              <p className="gk-kicker">My philosophy</p>
              <h2>I believe in building things that matter.</h2>
            </div>
            <div className="gk-story-cards gk-story-cards-4">
              {principles.map((p, i) => (
                <article key={p.title} className="gk-story-card">
                  <span className="gk-story-num">0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Message */}
        <section className="gk-section">
          <div className="gk-container gk-story-narrow">
            <p className="gk-kicker">A message from the founder</p>
            <h2>To everyone following this journey.</h2>
            <p>
              gòke is a work in progress, and I am excited about what it can become.
            </p>
            <p>
              Building technology requires curiosity, persistence, resources,
              collaboration and people who are willing to believe in an idea before
              it reaches its full potential.
            </p>
            <p>
              I welcome individuals, businesses, developers, technology enthusiasts,
              strategic partners and everyone interested in helping us build
              something meaningful.
            </p>
            <p>Thank you for being part of the journey.</p>
            <p className="gk-story-sign">
              <strong>Hassel Godspower</strong>
              <br />
              Founder, gòke
            </p>
          </div>
        </section>

        {/* Connect */}
        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>Let&apos;s connect</h2>
            <p>
              Have an idea, partnership proposal or opportunity? Reach out —
              HighValue Solutions and gòke are built in the open web.
            </p>
            <ul className="gk-story-connect">
              <li>
                <a
                  href="https://www.linkedin.com/in/hassel-godspower"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn — Founder profile
                </a>
              </li>
              <li>
                <a href="mailto:info@highvaluesolutions.net">
                  Email — info@highvaluesolutions.net
                </a>
              </li>
              <li>
                <a href="https://highvaluesolutions.net">
                  Website — highvaluesolutions.net
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/highvaluesolutions_nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram — @highvaluesolutions_nigeria
                </a>
              </li>
            </ul>
            <div className="gk-story-actions" style={{ justifyContent: "center" }}>
              <Link href="/support" className="gk-btn gk-btn-primary">
                Support the work
              </Link>
              <a href="/#start" className="gk-btn gk-btn-ghost">
                Generate a site
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
