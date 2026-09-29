export function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Export your Instagram",
      body: "Download your official data export (profile + posts). We only need the small JSON — not your entire media library.",
    },
    {
      n: "2",
      title: "We build the site",
      body: "gòke turns your bio, posts, and structure into a multi-section website with a real layout — not a link list.",
    },
    {
      n: "3",
      title: "Edit, then go live",
      body: "Open the visual editor: change copy, colors, sections, and templates. Publish when you’re ready.",
    },
  ];

  return (
    <section className="gk-section gk-section-alt" id="how">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2>From Instagram to a real website</h2>
          <p>
            One pipeline: export → generate → visual edit → publish. Built for businesses
            that already live on Instagram.
          </p>
        </div>
        <div className="gk-steps">
          {steps.map((s) => (
            <article key={s.n} className="gk-step">
              <div className="gk-step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
