/**
 * What ₦20k includes + custom domain + add-ons + honest FAQ + guarantee
 */
const faqs = [
  {
    q: "What does $15 include?",
    a: "Your generated multi-page website (Instagram business path or LinkedIn / CV professional path), HTTPS hosting on Cloudflare Pages, and a free subdomain such as yourusername.pages.dev. Preview and editing stay free until you choose to publish.",
  },
  {
    q: "Is a custom domain included?",
    a: "No. yourusername.pages.dev is included with Go live. A custom domain such as yourname.com, yourname.org, or yourname.com.ng is an optional add-on, renewed yearly.",
  },
  {
    q: "What if publish fails after I pay?",
    a: "If payment succeeds but we cannot get your site live after a reasonable attempt, contact us on WhatsApp (+234 706 534 1105) with your Paystack reference. We will either complete the publish or refund the Go live fee — we do not keep payment for a site that never went live.",
  },
  {
    q: "Is gòke a marketplace? Will it bring me customers?",
    a: "No. gòke is not a marketplace like Jumia or Jiji, and we do not promise traffic or leads. We help you build a website you own and control — so visitors you already have (or reach yourself) land somewhere credible.",
  },
  {
    q: "Who can use gòke?",
    a: "Anyone: business owners (Instagram path), consultants and job seekers (LinkedIn / CV path), students, designers, freelancers, and agencies. Quick start or full editor depending on how deep you want to go.",
  },
  {
    q: "Are there extra features after go-live?",
    a: "Yes — optional upgrades such as an ecommerce engine, SEO/AEO packaging, Branded extras, and a web-app style experience. Each is priced separately after you have a live site.",
  },
  {
    q: "Do I pay every month?",
    a: "The core Go live fee is one-time ($15). Custom domains renew yearly. Optional feature packs are charged only if you choose them.",
  },
  {
    q: "What happens to my Instagram export or CV?",
    a: "We use uploads only to generate and host your site. We do not sell your data. See the Privacy page for storage and payment details.",
  },
];

const addons = [
  {
    name: "Custom domain",
    price: "$25/year",
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
    <section
      className="gk-section"
      id="what-you-get"
      aria-labelledby="what-you-get-title"
    >
      <div className="gk-container" style={{ maxWidth: 920 }}>
        <div className="gk-section-head">
          <h2 id="what-you-get-title">What you get for $15 · ₦20,000</h2>
          <p>
            One-time publish fee. About <strong>$15</strong> — billed as{" "}
            <strong>₦20,000</strong> on Paystack in Nigeria. No monthly subscription
            for the core package.
          </p>
        </div>

        <div className="gk-include-grid">
          <article className="gk-include-card">
            <h3>Included with Go live</h3>
            <ul>
              <li>
                Multi-page website from Instagram (handle or export) or LinkedIn
                / CV
              </li>
              <li>
                Hosting on <strong>Cloudflare Pages</strong>
              </li>
              <li>
                Free subdomain:{" "}
                <code className="gk-code">yourusername.pages.dev</code>
              </li>
              <li>HTTPS by default</li>
              <li>Live link by email when deploy succeeds</li>
              <li>
                Dashboard access to edit, push updates, and download a ZIP
              </li>
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
              <li>
                Ecommerce engine, SEO/AEO, Branded pack, web-app extras (paid
                add-ons)
              </li>
              <li>Marketplace listing or guaranteed customers</li>
              <li>Paid ads or traffic campaigns</li>
            </ul>
          </article>
        </div>

        <p
          className="gk-honest-note"
          style={{
            marginTop: "1.25rem",
            padding: "1rem 1.15rem",
            borderRadius: 12,
            border: "1px solid rgba(167,139,250,0.35)",
            background: "rgba(167,139,250,0.08)",
          }}
        >
          <strong>Publish guarantee.</strong> If Paystack shows a successful
          payment and we cannot get your site live after a reasonable attempt, we
          complete the deploy or refund the ₦20,000 Go live fee. WhatsApp{" "}
          <a
            href="https://wa.me/2347065341105"
            target="_blank"
            rel="noreferrer"
          >
            +234 706 534 1105
          </a>{" "}
          with your payment reference.
        </p>

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
            <div key={f.q} className="gk-faq-item" style={{ marginBottom: "1rem" }}>
              <h4 style={{ margin: "0 0 0.35rem", fontSize: "1rem" }}>{f.q}</h4>
              <p style={{ margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>

        <p className="gk-honest-note">
          <strong>gòke is not a marketplace.</strong> We do not bring you
          customers. We help you build a website <em>you</em> own and control —
          for business owners, professionals, students, and anyone ready to
          publish a real site.
        </p>
      </div>
    </section>
  );
}
