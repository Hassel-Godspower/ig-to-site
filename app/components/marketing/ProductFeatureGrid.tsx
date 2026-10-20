export function ProductFeatureGrid() {
  const items = [
    {
      icon: "📷",
      title: "Instagram → website",
      body: "Handle or data export into a multi-page business site.",
      href: "#start",
    },
    {
      icon: "💼",
      title: "LinkedIn / CV → site",
      body: "Personal brand pages for consultants and job seekers.",
      href: "#start",
    },
    {
      icon: "✏️",
      title: "Full visual editor",
      body: "Desktop, tablet, mobile — structure, components, media.",
      href: "#start",
    },
    {
      icon: "🚀",
      title: "Publish once",
      body: "Paystack checkout, Cloudflare hosting, dashboard access.",
      href: "#pricing",
    },
  ];

  return (
    <section className="gk-section" id="product" aria-labelledby="product-heading">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2 id="product-heading">
            What you get with <span style={{ color: "var(--gk-accent)" }}>gòke</span>
          </h2>
          <p>Clear product surfaces — not a pile of unrelated tools.</p>
        </div>
        <div className="gk-feature-grid">
          {items.map((it) => (
            <a key={it.title} href={it.href} className="gk-feature-item">
              <span className="gk-feature-icon" aria-hidden>
                {it.icon}
              </span>
              <div>
                <strong>{it.title}</strong>
                <span>{it.body}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
