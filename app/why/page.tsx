import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/marketing/SiteHeader";
import { SiteFooter } from "../components/marketing/SiteFooter";

export const metadata: Metadata = {
  title: "Why gòke — Stop renting a link. Own a website.",
  description:
    "gòke turns an Instagram data export into a real multi-section website you can edit visually. Free to generate. ₦10,000 once to publish.",
};

const reasons = [
  {
    n: "01",
    title: "Start from your Instagram — not a blank canvas",
    body: "Other options make you retype your bio, re-upload photos, and rebuild your story by hand. gòke reads your export and builds structure from what you already published: profile, captions, posts, and the narrative your audience already trusts.",
    punch: "You keep the work. We turn it into a site.",
  },
  {
    n: "02",
    title: "A real website — not a link list",
    body: "Link-style pages are convenient. They are not a home page, about page, services page, gallery, or contact flow. gòke generates a multi-section site you can stand behind — the kind clients open when they leave Instagram and decide whether to trust you.",
  },
  {
    n: "03",
    title: "Edit visually after generation",
    body: "Many “instant site” tools lock you into a rigid template. Full builders give freedom but demand you design everything from scratch. gòke gives you both: generation first, then a visual editor — structure, components, content, and device previews — so the site stays yours after the first build.",
  },
  {
    n: "04",
    title: "Pay when you publish — not to try",
    body: "Subscription tools charge monthly whether you launched or not. Free tiers often mean badges, limits, or a temporary experiment. gòke is free to generate and edit. ₦10,000 once when you go live.",
    punch: "No subscription just to keep a draft. No rent on curiosity.",
  },
  {
    n: "05",
    title: "Built for brands that aren’t only “add to cart”",
    body: "Product-first platforms shine when you have SKUs, stock counts, and daily order ops. They’re heavy if you’re a coach, clinic, studio, boutique story brand, or service firm. gòke is shaped for presence and conversion pages: story, offer, proof, gallery, contact — with templates aimed at real Instagram businesses, not only product grids.",
  },
  {
    n: "06",
    title: "Your brand on the open web",
    body: "App-branded storefronts and tool subdomains are easy. They still feel like someone else’s product. gòke is oriented toward a site you can publish and own as your web presence — the destination behind the Instagram bio, not a temporary page inside another company’s shell.",
  },
];

const compareRows = [
  {
    elsewhere: "Link-in-bio pages",
    cost: "Looks temporary; hard to tell a full story",
    goke: "Multi-page site with real sections",
  },
  {
    elsewhere: "Blank builders",
    cost: "Hours redesigning content you already posted",
    goke: "Generate from Instagram export first",
  },
  {
    elsewhere: "Store-first apps",
    cost: "You pay for inventory & ops you may not need",
    goke: "Focus on brand site + publish",
  },
  {
    elsewhere: "Monthly subscriptions",
    cost: "Cost compounds while you’re still deciding",
    goke: "Free to build; pay once to go live",
  },
  {
    elsewhere: "Rigid templates",
    cost: "Hard to refine after “instant” create",
    goke: "Visual editor after generation",
  },
  {
    elsewhere: "Tool-branded URLs",
    cost: "Feels rented, not owned",
    goke: "Publish-oriented, brand-first flow",
  },
];

const features = [
  "Instagram export upload (.zip / .json) → structured site draft",
  "Multi-section pages — not a single scrolling link stack",
  "Visual editor — structure, components, content, responsive views",
  "Business-ready templates — commerce, services, wellness, creative, and more",
  "Preview free — generate and edit with no card required",
  "One-time publish — ₦10,000 to go live",
  "Explore network — posts from gòke sites in a discovery feed",
  "Installable web app — keep gòke handy on your device",
];

export default function WhyGokePage() {
  return (
    <>
      <SiteHeader />
      <main className="gk-why-page">
        {/* Hero */}
        <section className="gk-why-hero">
          <div className="gk-container gk-why-hero-inner">
            <p className="gk-kicker">Why gòke</p>
            <h1>
              Stop renting a link.
              <br />
              <em>Own a website.</em>
            </h1>
            <p className="gk-why-lead">
              Your Instagram becomes a real website — then you edit, then you publish. Free to
              generate. One payment when you go live.
            </p>
            <div className="gk-demo-actions">
              <Link href="/#start" className="gk-btn gk-btn-primary">
                Generate my site
              </Link>
              <Link href="/how-to-export" className="gk-btn gk-btn-ghost">
                How to export Instagram data
              </Link>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="gk-section">
          <div className="gk-container gk-why-narrow">
            <h2>The problem with “getting online” today</h2>
            <p className="gk-why-intro">
              Most tools force you into one of three traps:
            </p>
            <div className="gk-why-traps">
              <article className="gk-why-trap">
                <span className="gk-why-trap-n">1</span>
                <h3>A list of links</h3>
                <p>Fine for a bio, weak as a business.</p>
              </article>
              <article className="gk-why-trap">
                <span className="gk-why-trap-n">2</span>
                <h3>A storefront that assumes you sell products</h3>
                <p>Inventory, orders, and SKUs when you needed a brand site.</p>
              </article>
              <article className="gk-why-trap">
                <span className="gk-why-trap-n">3</span>
                <h3>A blank website builder</h3>
                <p>
                  Powerful, but you start from zero while your best content already lives on
                  Instagram.
                </p>
              </article>
            </div>
            <p className="gk-why-outro">
              You end up either looking incomplete, paying every month for features you don’t
              use, or rebuilding what you’ve already posted.
            </p>
            <p className="gk-why-path">
              <strong>gòke is built for a different path:</strong> your Instagram becomes a real
              website — then you edit, then you publish.
            </p>
          </div>
        </section>

        {/* What it is */}
        <section className="gk-section gk-section-alt">
          <div className="gk-container gk-why-narrow">
            <p className="gk-kicker">What gòke is</p>
            <h2>Instagram data → multi-section website</h2>
            <p>
              <strong>gòke turns an Instagram data export into a multi-section website</strong> you
              can preview and edit visually. You only pay when you’re ready to go live — not to
              experiment.
            </p>
            <ul className="gk-why-notlist">
              <li>Not another link page.</li>
              <li>Not a full back-office for warehouses and invoices.</li>
              <li>
                A <strong>serious web presence</strong> generated from the content you already
                have.
              </li>
            </ul>
          </div>
        </section>

        {/* Reasons */}
        <section className="gk-section">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>Why people switch to gòke</h2>
              <p>Six reasons Instagram-native businesses choose generation + edit + publish.</p>
            </div>
            <div className="gk-why-reasons">
              {reasons.map((r) => (
                <article key={r.n} className="gk-why-reason">
                  <span className="gk-why-reason-n">{r.n}</span>
                  <div>
                    <h3>{r.title}</h3>
                    <p>{r.body}</p>
                    {r.punch ? <p className="gk-why-punch">{r.punch}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="gk-section gk-section-alt">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>Where other options fall short</h2>
              <p>And how gòke responds.</p>
            </div>
            <div className="gk-why-table-wrap">
              <table className="gk-why-table">
                <thead>
                  <tr>
                    <th>What you often get elsewhere</th>
                    <th>The cost to you</th>
                    <th>How gòke fills it</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.elsewhere}>
                      <td>{row.elsewhere}</td>
                      <td>{row.cost}</td>
                      <td className="gk-why-table-goke">{row.goke}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="gk-section">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>Core features</h2>
            </div>
            <ul className="gk-why-features">
              {features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who */}
        <section className="gk-section gk-section-alt">
          <div className="gk-container gk-why-who">
            <div>
              <h2>Who gòke is for</h2>
              <ul className="gk-why-list">
                <li>Instagram-native businesses that already have content and trust on the app</li>
                <li>Coaches, clinics, spas, boutiques, studios, and service brands</li>
                <li>Anyone tired of “just a link” but not ready for a heavy ops platform</li>
                <li>Owners who want a credible site this week, not a three-month redesign</li>
              </ul>
            </div>
            <div>
              <h2>Who should look elsewhere</h2>
              <ul className="gk-why-list gk-why-list-muted">
                <li>Sellers who need full inventory, multi-staff POS, and order ops every day</li>
                <li>Teams that only need five buttons under a bio link</li>
                <li>Projects that require a complex app ecosystem from day one</li>
              </ul>
              <p className="gk-why-boundary">
                gòke is intentional about that boundary:{" "}
                <strong>
                  excellent at the website from Instagram; not pretending to be your entire
                  warehouse system.
                </strong>
              </p>
            </div>
          </div>
        </section>

        {/* Promise */}
        <section className="gk-section">
          <div className="gk-container gk-why-promise">
            <p className="gk-kicker">The gòke promise</p>
            <h2>Your Instagram, as a real website.</h2>
            <p>Generate. Edit. Publish when you’re ready.</p>
            <p className="gk-why-promise-sub">
              Free until it matters. One payment when it does. Built for the businesses already
              living on Instagram — and ready to look established off it.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>Export your Instagram data. Upload. Open your site in the editor.</h2>
            <p>Stop renting a link. Own a website.</p>
            <div className="gk-demo-actions" style={{ justifyContent: "center" }}>
              <Link href="/#start" className="gk-btn gk-btn-primary gk-btn-lg">
                Generate my site
              </Link>
              <Link href="/how-to-export" className="gk-btn gk-btn-ghost">
                How to export Instagram data
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
