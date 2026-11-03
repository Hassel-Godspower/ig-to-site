import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/marketing/SiteHeader";
import { SiteFooter } from "../components/marketing/SiteFooter";

export const metadata: Metadata = {
  title: "Support gòke — Help build what comes next | HighValue Solutions",
  description:
    "Voluntary support for gòke product development, infrastructure and accessibility. Contributions are not investments. Moniepoint payment channel under HighValue Solutions.",
  openGraph: {
    title: "Support gòke | HighValue Solutions",
    description:
      "Help strengthen the foundation of gòke — product, infrastructure, research and growth.",
    type: "website",
  },
};

/** Official Moniepoint channel — env can override if needed */
const ACCOUNT_NUMBER =
  process.env.NEXT_PUBLIC_SUPPORT_ACCOUNT_NUMBER?.trim() || "7065341105";
const ACCOUNT_NAME =
  process.env.NEXT_PUBLIC_SUPPORT_ACCOUNT_NAME?.trim() || "HighValue Solutions";
const BANK_NAME =
  process.env.NEXT_PUBLIC_SUPPORT_BANK_NAME?.trim() ||
  "Moniepoint Microfinance Bank";

const helpAreas = [
  {
    title: "Product development",
    body: "Supporting engineering, product design, testing and new platform capabilities.",
  },
  {
    title: "Infrastructure and hosting",
    body: "Supporting cloud services, hosting, storage, domains, security and platform reliability.",
  },
  {
    title: "Research and innovation",
    body: "Exploring better ways to use technology and artificial intelligence to solve real problems.",
  },
  {
    title: "Growth and accessibility",
    body: "Improving the platform, reaching more users and making digital tools more accessible.",
  },
];

const otherWays = [
  {
    n: "1",
    title: "Spread the word",
    body: "Introduce gòke to businesses, entrepreneurs and professionals who may benefit from the platform.",
  },
  {
    n: "2",
    title: "Become a development partner",
    body: "Collaborate with us on software engineering, AI, infrastructure, design and product development.",
  },
  {
    n: "3",
    title: "Provide expertise",
    body: "Share your knowledge, professional experience, mentorship or technical resources.",
  },
  {
    n: "4",
    title: "Explore strategic partnerships",
    body: "Organizations, institutions and businesses can collaborate with HighValue Solutions to support innovation and technology development.",
  },
  {
    n: "5",
    title: "Become an early supporter",
    body: "Follow the development of gòke, test new features and provide feedback that helps us improve.",
  },
];

const faqs = [
  {
    q: "Is supporting gòke compulsory?",
    a: "No. Support is entirely voluntary. You can use or explore gòke without making a contribution.",
  },
  {
    q: "Who can support the project?",
    a: "Individuals, businesses, organizations, friends and well-wishers who believe in the mission.",
  },
  {
    q: "Is this an investment opportunity?",
    a: "No. Contributions are not investments and do not confer ownership, equity or financial returns.",
  },
  {
    q: "What bank handles contributions?",
    a: "The designated payment channel is Moniepoint Microfinance Bank, under HighValue Solutions.",
  },
  {
    q: "Can I support with technical expertise or partnerships instead of money?",
    a: "Absolutely. We welcome technical, strategic, professional and institutional partnerships.",
  },
  {
    q: "How can I contact the team?",
    a: "Email info@highvaluesolutions.net or WhatsApp +234 706 534 1105.",
  },
];

export default function SupportPage() {
  return (
    <>
      <SiteHeader />
      <main className="gk-story-page">
        {/* Hero */}
        <section className="gk-story-hero gk-story-hero-support">
          <div className="gk-container gk-story-narrow" style={{ textAlign: "center" }}>
            <p className="gk-kicker">Support innovation. Support progress.</p>
            <h1>
              Help us build what comes <em>next</em>.
            </h1>
            <p className="gk-story-lead">
              Great ideas need more than inspiration. They need people, resources,
              infrastructure and the opportunity to grow.
            </p>
            <p className="gk-story-lead">
              gòke is being built to make professional digital presence and website
              ownership more accessible. If you believe in this vision, you can
              support our work and become part of the journey.
            </p>
            <div className="gk-story-actions" style={{ justifyContent: "center" }}>
              <a href="#contribute" className="gk-btn gk-btn-primary">
                Support our work ↓
              </a>
              <Link href="/founder" className="gk-btn gk-btn-ghost">
                Meet the founder
              </Link>
            </div>
          </div>
        </section>

        {/* Why support */}
        <section className="gk-section gk-section-alt">
          <div className="gk-container gk-story-narrow">
            <p className="gk-kicker">Why your support matters</p>
            <h2>Every contribution helps move the vision forward.</h2>
            <p>
              Building a technology platform requires continuous investment in
              development, infrastructure, research, testing and innovation.
            </p>
            <p>
              Your support helps us strengthen the foundation of gòke and improve
              what we can deliver to the people who use it.
            </p>
            <p>
              We appreciate support from individuals, businesses, friends,
              technology enthusiasts and organizations that believe in practical
              innovation.
            </p>
          </div>
        </section>

        {/* What support builds */}
        <section className="gk-section">
          <div className="gk-container">
            <div className="gk-section-head">
              <p className="gk-kicker">What your support helps us build</p>
              <h2>Where voluntary contributions go.</h2>
            </div>
            <div className="gk-story-cards">
              {helpAreas.map((item) => (
                <article key={item.title} className="gk-story-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bank transfer */}
        <section id="contribute" className="gk-section gk-section-alt">
          <div className="gk-container gk-story-narrow">
            <p className="gk-kicker">Make a contribution</p>
            <h2>Your support makes a difference.</h2>
            <p>
              Whether large or small, every voluntary contribution is appreciated.
            </p>

            <div className="gk-support-bank">
              <p className="gk-support-bank-label">Official payment channel</p>
              <h3>{BANK_NAME}</h3>
              <dl className="gk-support-dl">
                <div>
                  <dt>Account name</dt>
                  <dd>{ACCOUNT_NAME}</dd>
                </div>
                <div>
                  <dt>Account number</dt>
                  <dd>
                    {ACCOUNT_NUMBER ? (
                      <span className="gk-support-account">{ACCOUNT_NUMBER}</span>
                    ) : (
                      <span className="gk-support-pending">
                        Account number will be published here when activated.
                        Contact{" "}
                        <a href="mailto:info@highvaluesolutions.net">
                          info@highvaluesolutions.net
                        </a>{" "}
                        or WhatsApp if you wish to contribute before then.
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Payment reference</dt>
                  <dd>
                    <code>gòke Support</code>
                  </dd>
                </div>
              </dl>
              <p className="gk-story-note">
                Please use the reference <strong>gòke Support</strong> when making
                your contribution, where your bank supports a narration or
                reference field.
              </p>
              <p className="gk-support-powered">Powered by Moniepoint</p>
            </div>

            <div className="gk-support-disclaimer">
              <h3>A note on contributions</h3>
              <p>
                Contributions are voluntary and intended to support the development
                and operations of gòke and related innovation activities under
                HighValue Solutions.
              </p>
              <p>
                <strong>
                  Contributing does not constitute an investment, equity purchase,
                  loan or promise of financial returns.
                </strong>
              </p>
            </div>
          </div>
        </section>

        {/* Other ways */}
        <section className="gk-section">
          <div className="gk-container">
            <div className="gk-section-head">
              <p className="gk-kicker">Other ways to support us</p>
              <h2>Not every contribution has to be financial.</h2>
            </div>
            <ol className="gk-story-ways">
              {otherWays.map((w) => (
                <li key={w.n}>
                  <span className="gk-story-num">{w.n}</span>
                  <div>
                    <h3>{w.title}</h3>
                    <p>{w.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="gk-story-note">
              Partnerships and collaboration:{" "}
              <a href="mailto:info@highvaluesolutions.net">
                info@highvaluesolutions.net
              </a>
              {" · "}
              <a
                href="https://wa.me/2347065341105"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </section>

        {/* Transparency */}
        <section className="gk-section gk-section-alt">
          <div className="gk-container gk-story-narrow">
            <p className="gk-kicker">Transparency and accountability</p>
            <h2>We value the trust behind every contribution.</h2>
            <p>
              Supporting an early-stage technology project involves trust. Our
              commitment is to use contributions responsibly towards legitimate
              product development, operational requirements and the advancement of
              our technology initiatives.
            </p>
            <p>
              We aim to maintain clear communication about our progress, milestones
              and important developments.
            </p>
            <p>
              Supporters should understand that gòke is under active development and
              that product features, timelines and capabilities may evolve.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="gk-section">
          <div className="gk-container gk-story-narrow">
            <p className="gk-kicker">Frequently asked questions</p>
            <h2>Clear answers.</h2>
            <div className="gk-support-faq">
              {faqs.map((f) => (
                <details key={f.q} className="gk-support-faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>The future is built by those who believe in it.</h2>
            <p>
              We are building gòke one idea, one feature and one milestone at a
              time. If you believe in what we are building, we invite you to support
              the journey.
            </p>
            <p style={{ opacity: 0.85, marginTop: "0.5rem" }}>
              Thank you for believing in the work.
            </p>
            <p style={{ marginTop: "1rem", fontWeight: 600 }}>
              gòke by HighValue Solutions.
            </p>
            <div className="gk-story-actions" style={{ justifyContent: "center" }}>
              <a href="#contribute" className="gk-btn gk-btn-primary">
                View payment details
              </a>
              <Link href="/founder" className="gk-btn gk-btn-ghost">
                Founder story
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
