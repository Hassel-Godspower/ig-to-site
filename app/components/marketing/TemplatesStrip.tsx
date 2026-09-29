const templates = [
  { name: "Commerce", cat: "Store", color: "linear-gradient(145deg,#1e3a5f,#0f172a)" },
  { name: "Luxe", cat: "Fashion", color: "linear-gradient(145deg,#1a1510,#0a0a0a)" },
  { name: "Estate", cat: "Property", color: "linear-gradient(145deg,#0f2744,#1a3a5c)" },
  { name: "Stay", cat: "Hotel", color: "linear-gradient(145deg,#1a3a3a,#2d5555)" },
  { name: "Pro", cat: "Services", color: "linear-gradient(145deg,#0b1f3a,#1e4a7a)" },
  { name: "Clinic", cat: "Health", color: "linear-gradient(145deg,#134e4a,#0f766e)" },
  { name: "Auto", cat: "Motors", color: "linear-gradient(145deg,#1c1917,#44403c)" },
  { name: "Creative", cat: "Portfolio", color: "linear-gradient(145deg,#4c1d95,#6d28d9)" },
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
            <article key={t.name} className="gk-template-card">
              <div className="gk-template-thumb" style={{ background: t.color }}>
                {t.cat}
              </div>
              <div className="meta">
                <h3>Gòke {t.name}</h3>
                <p>{t.cat}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
