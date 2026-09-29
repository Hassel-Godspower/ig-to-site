export function EditorShowcase() {
  return (
    <section className="gk-section gk-section-alt" id="editor">
      <div className="gk-container">
        <div className="gk-feature-row">
          <div className="gk-feature-copy">
            <h2>A visual editor that takes the site seriously</h2>
            <p>
              After generation you’re not stuck with a fixed template. Structure, components,
              design tokens, and device previews — closer to a page builder than a one-shot AI
              page.
            </p>
            <ul className="gk-feature-list">
              <li>Structure tree &amp; component palette</li>
              <li>Content, design, and global styles</li>
              <li>Desktop, tablet, and mobile canvas</li>
              <li>Templates you can apply without losing your Instagram copy</li>
            </ul>
          </div>

          <div className="gk-editor-mock" aria-hidden>
            <div className="gk-editor-bar">
              <span className="gk-editor-dot" />
              <span className="gk-editor-dot" />
              <span className="gk-editor-dot" />
              <span style={{ marginLeft: 8 }}>gòke editor</span>
              <span style={{ marginLeft: "auto" }}>Desktop · Tablet · Mobile</span>
            </div>
            <div className="gk-editor-body">
              <div className="gk-editor-side">
                <div className="row" />
                <div className="row short" />
                <div className="row" />
                <div className="row short" />
                <div className="row" />
                <div className="row short" />
              </div>
              <div className="gk-editor-canvas">
                <div className="mock-nav" />
                <div className="mock-h" />
                <div className="mock-p" />
                <div className="mock-btn" />
              </div>
              <div className="gk-editor-side right">
                <div className="row" />
                <div className="row short" />
                <div className="row" />
                <div className="row short" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
