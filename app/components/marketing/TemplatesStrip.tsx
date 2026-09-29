const templates = [
  {
    name: "Commerce",
    cat: "Store",
    slug: "commerce",
    desc: "Product grid, cart, checkout",
  },
  {
    name: "Luxe",
    cat: "Fashion",
    slug: "luxe",
    desc: "Black, white, gold editorial",
  },
  {
    name: "Estate",
    cat: "Property",
    slug: "estate",
    desc: "Listings, agents, mortgage",
  },
  {
    name: "Stay",
    cat: "Hotel",
    slug: "stay",
    desc: "Rooms, booking, offers",
  },
  {
    name: "Pro",
    cat: "Services",
    slug: "pro",
    desc: "Team, cases, appointments",
  },
  {
    name: "Clinic",
    cat: "Health",
    slug: "clinic",
    desc: "Services, doctors, booking",
  },
  {
    name: "Auto",
    cat: "Motors",
    slug: "auto",
    desc: "Inventory, financing",
  },
  {
    name: "Creative",
    cat: "Portfolio",
    slug: "creative",
    desc: "Projects and case studies",
  },
];

export function TemplatesStrip() {
  return (
    <section className="gk-section" id="templates">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2>Templates for the businesses you already run</h2>
          <p>
            Curated multi-page starters — commerce, hospitality, professional services, and more.
            Apply in the editor while keeping your Instagram content.
          </p>
        </div>
        <div className="gk-template-grid">
          {templates.map((t) => (
            <article key={t.slug} className="gk-template-card">
              <div className="gk-template-thumb">
                <img
                  src={`/marketing/templates/${t.slug}.svg`}
                  alt={`Gòke ${t.name} template preview`}
                  width={640}
                  height={480}
                  loading="lazy"
                />
                <span className="gk-template-badge">{t.cat}</span>
              </div>
              <div className="meta">
                <h3>Gòke {t.name}</h3>
                <p>{t.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
