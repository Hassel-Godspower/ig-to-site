export function EditorShowcase() {
  return (
    <section className="gk-section gk-section-alt" id="editor">
      <div className="gk-container">
        <div className="gk-feature-row">
          <div className="gk-feature-copy">
            <h2>A visual editor built for your site</h2>
            <p>
              After generation you’re not stuck with a fixed template. Adjust structure,
              components, and styles — then preview desktop, tablet, and mobile before you
              publish.
            </p>
            <ul className="gk-feature-list">
              <li>Structure tree &amp; component palette</li>
              <li>Content and design controls</li>
              <li>Desktop, tablet, and mobile canvas</li>
              <li>Templates you can apply without losing your Instagram copy</li>
            </ul>
          </div>

          <div className="gk-editor-mock gk-editor-mock--rich" aria-hidden>
            <div className="gk-editor-bar">
              <span className="gk-editor-dot" />
              <span className="gk-editor-dot" />
              <span className="gk-editor-dot" />
              <span style={{ marginLeft: 8 }}>gòke editor</span>
              <span style={{ marginLeft: "auto", opacity: 0.7 }}>Desktop · Tablet · Mobile</span>
            </div>
            <div className="gk-editor-body">
              <div className="gk-editor-side">
                <div className="gk-ed-label">Structure</div>
                <div className="row on" />
                <div className="row short" />
                <div className="row" />
                <div className="row short" />
                <div className="gk-ed-label" style={{ marginTop: 12 }}>
                  Components
                </div>
                <div className="row short" />
                <div className="row" />
              </div>
              <div className="gk-editor-canvas gk-editor-canvas--site">
                <div className="mock-site-nav">ADE FITNESS</div>
                <div className="mock-site-hero">Strength for busy adults</div>
                <div className="mock-site-row">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="mock-site-btn">Book a session</div>
              </div>
              <div className="gk-editor-side right">
                <div className="gk-ed-label">Style</div>
                <div className="row" />
                <div className="row short" />
                <div className="row" />
                <div className="swatches">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
