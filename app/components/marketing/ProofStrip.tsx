const examples = [
  {
    label: "Spa · Lagos",
    title: "Bodywork & wellness",
    desc: "Hero, services, gallery, and booking CTA from an Instagram presence.",
    tone: "linear-gradient(145deg, #1e3a5f, #0f2744)",
  },
  {
    label: "Fashion · Boutique",
    title: "Premium retail",
    desc: "Catalogue-style sections with brand story — beyond a link-in-bio.",
    tone: "linear-gradient(145deg, #2a2118, #1a1510)",
  },
  {
    label: "Services · Firm",
    title: "Professional practice",
    desc: "Trust, services, and contact — ready for clients who found you on IG.",
    tone: "linear-gradient(145deg, #1a2332, #0b1f3a)",
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
            proper site, not another bio link.
          </p>
        </div>
        <div className="gk-proof-grid">
          {examples.map((ex) => (
            <article key={ex.title} className="gk-proof-card">
              <div className="gk-proof-visual" style={{ background: ex.tone }}>
                <span>{ex.label}</span>
                Site preview
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
