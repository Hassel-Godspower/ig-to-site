const metrics = [
  { value: "Free", label: "to generate & edit" },
  { value: "₦10k", label: "once to publish" },
  { value: "Multi-page", label: "not a link list" },
  { value: "Visual", label: "editor included" },
];

const examples = [
  {
    label: "Fitness · Lagos",
    title: "Coach → full training site",
    desc: "Profile, offer, and gallery become a booking-ready fitness website.",
    slug: "fitness",
  },
  {
    label: "Fashion · Boutique",
    title: "Boutique → lookbook site",
    desc: "Posts and brand voice turn into a catalogue with story and shop CTAs.",
    slug: "fashion",
  },
  {
    label: "Spa · Wellness",
    title: "Spa → booking site",
    desc: "Services and highlights become a calm site with a clear book action.",
    slug: "spa",
  },
];

export function ProofStrip() {
  return (
    <section className="gk-section" id="proof">
      <div className="gk-container">
        <div className="gk-proof-metrics">
          {metrics.map((m) => (
            <div key={m.label} className="gk-proof-metric">
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>

        <div className="gk-section-head">
          <h2>Instagram profile → real website</h2>
          <p>
            Same content you already post — structured into a multi-section site clients can
            browse, trust, and act on.
          </p>
        </div>
        <div className="gk-proof-grid gk-proof-grid--transform">
          {examples.map((ex) => (
            <article key={ex.slug} className="gk-proof-card gk-proof-card--transform">
              <div className="gk-proof-visual gk-proof-visual--wide">
                <img
                  src={`/marketing/proof/${ex.slug}.svg`}
                  alt={`${ex.title}: Instagram to website`}
                  width={900}
                  height={520}
                  loading="lazy"
                />
              </div>
              <div className="gk-proof-body">
                <span className="gk-proof-label">{ex.label}</span>
                <h3>{ex.title}</h3>
                <p>{ex.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="gk-proof-footnote">
          Built for Instagram-native businesses — coaches, spas, boutiques, studios, and service
          brands ready to look established off the app.
        </p>
      </div>
    </section>
  );
}
