/**
 * What ₦20k includes + custom domain + add-ons + honest FAQ
 */
const faqs = [
  {
    q: "What does ₦20,000 include?",
    a: "Your generated multi-page website, HTTPS hosting on Cloudflare Pages, and a free subdomain in the form yourusername.pages.dev. You get the static site files and a live link when deploy succeeds. Preview and editing stay free until you choose to publish.",
  },
  {
    q: "Is a custom domain included?",
    a: "No. yourusername.pages.dev is included with Go live. A custom domain such as yourname.com, yourname.org, or yourname.com.ng is an optional add-on at ₦30,000, renewed yearly.",
  },
  {
    q: "Is gòke a marketplace? Will it bring me customers?",
    a: "No. gòke is not a marketplace like Jumia or Jiji, and we do not promise traffic or leads. We help you build a website you own and control — so visitors you already have (or reach yourself) land somewhere credible.",
  },
  {
    q: "Who can use gòke?",
    a: "Anyone: business owners, students, tech enthusiasts, designers, freelancers, and agencies. Use Quick start for a simple path, or the full editor if you want deeper control.",
  },
  {
    q: "Are there extra features after go-live?",
    a: "Yes — optional upgrades such as an ecommerce engine, SEO/AEO packaging, Branded extras, and a web-app style experience. Each is priced separately after you have a live site.",
  },
  {
    q: "Do I pay every month?",
    a: "The core Go live fee is one-time (₦20,000). Custom domains renew yearly (₦30,000). Optional feature packs are charged only if you choose them.",
  },
];

const addons = [
  {
    name: "Custom domain",
    price: "₦30,000 / year",
    body: "yourname.com, .org, .com.ng and similar — connected to your gòke site. Renewed yearly.",
  },
  {
    name: "Ecommerce engine",
    price: "Add-on",
    body: "Store-style flows for products and checkout — only when you need more than a brochure site.",
  },
  {
    name: "SEO / AEO",
    price: "Add-on",
    body: "Stronger search and answer-engine readiness for your published pages.",
  },
  {
    name: "Branded",
    price: "Add-on",
    body: "Deeper brand polish beyond the standard publish package.",
  },
  {
    name: "Web app",
    price: "Add-on",
    body: "Installable / app-like experience on top of your live site where it fits.",
  },
];

export function PricingWhatYouGet() {
  return (
    <section className="gk-section" id="what-you-get" aria-labelledby="what-you-get-title">
      <div className="gk-container" style={{ maxWidth: 900 }}>
        <div className="gk-section-head">
          <h2 id="what-you-get-title">What ₦20,000 gets you</h2>
          <p>
            Clear scope — so you know what is included, what is optional, and what gòke is
            not.
          </p>
        </div>

        <div className="gk-include-grid">
          <article className="gk-include-card">
            <h3>Included with Go live</h3>
            <ul>
              <li>Multi-page website generated from your Instagram handle or export</li>
              <li>
                Hosting on <strong>Cloudflare Pages</strong>
              </li>
              <li>
                Free Cloudflare subdomain:{" "}
                <code className="gk-code">yourusername.pages.dev</code>
              </li>
              <li>HTTPS by default</li>
              <li>Live link emailed when deploy succeeds</li>
              <li>Static files you can keep</li>
            </ul>
          </article>
          <article className="gk-include-card gk-include-card-muted">
            <h3>Not included in ₦20,000</h3>
            <ul>
              <li>
                Custom domain (<code className="gk-code">you.com</code> /{" "}
                <code className="gk-code">.com.ng</code>) —{" "}
                <strong>₦30,000 / year</strong>
              </li>
              <li>Ecommerce engine, SEO/AEO, Branded pack, web-app extras (paid add-ons)</li>
              <li>Marketplace listing or guaranteed customers</li>
              <li>Paid ads or traffic campaigns</li>
            </ul>
          </article>
        </div>

        <h3 className="gk-addons-title">Optional add-ons</h3>
        <div className="gk-addon-grid">
          {addons.map((a) => (
            <article key={a.name} className="gk-addon-card">
              <div className="gk-addon-head">
                <strong>{a.name}</strong>
                <span>{a.price}</span>
              </div>
              <p>{a.body}</p>
            </article>
          ))}
        </div>

        <h3 className="gk-addons-title" id="faq">
          FAQ
        </h3>
        <div className="gk-faq">
          {faqs.map((f) => (
            <details key={f.q} className="gk-faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <p className="gk-honest-note">
          <strong>gòke is not a marketplace.</strong> We do not bring you customers. We help
          you build a website <em>you</em> own and control — for business owners, students,
          tech enthusiasts, and anyone ready to publish a real site.
        </p>
      </div>
    </section>
  );
}
