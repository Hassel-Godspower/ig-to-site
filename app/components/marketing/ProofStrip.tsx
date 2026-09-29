const examples = [
  {
    label: "Spa · Lagos",
    title: "Bodywork & wellness",
    desc: "Hero, services, gallery, and booking CTA from an Instagram presence.",
    slug: "spa",
  },
  {
    label: "Fashion · Boutique",
    title: "Premium retail",
    desc: "Catalogue-style sections with brand story — beyond a link-in-bio.",
    slug: "fashion",
  },
  {
    label: "Services · Firm",
    title: "Professional practice",
    desc: "Trust, services, and contact — ready for clients who found you on IG.",
    slug: "services",
  },
];

export function ProofStrip() {
  return (
    <section className="gk-section">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2>Built for real Instagram businesses</h2>
          <p>
            Spas, boutiques, clinics, consultants — anyone with a following who needs a
            proper site, not another link list.
          </p>
        </div>
        <div className="gk-proof-grid">
          {examples.map((ex) => (
            <article key={ex.slug} className="gk-proof-card">
              <div className="gk-proof-visual">
                <img
                  src={`/marketing/proof/${ex.slug}.svg`}
                  alt={`${ex.title} website preview`}
                  width={640}
                  height={400}
                  loading="lazy"
                />
                <span className="gk-proof-badge">{ex.label}</span>
              </div>
              <div className="gk-proof-body">
                <h3>{ex.title}</h3>
                <p>{ex.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
