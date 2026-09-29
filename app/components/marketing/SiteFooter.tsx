import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="gk-footer">
      <div className="gk-container">
        <div className="gk-footer-grid">
          <div>
            <div className="gk-logo" style={{ marginBottom: "0.75rem" }}>
              <span className="gk-logo-mark" aria-hidden>
                g
              </span>
              gòke
            </div>
            <p>
              Instagram to a real website — generate, edit visually, publish when you’re ready.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <a href="#how">How it works</a>
            <a href="#editor">Editor</a>
            <a href="#templates">Templates</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div>
            <h4>Help</h4>
            <Link href="/how-to-export">Export guide</Link>
            <a href="#start">Generate site</a>
          </div>
          <div>
            <h4>Company</h4>
            <p>Built for creators and small businesses on Instagram.</p>
          </div>
        </div>
        <div className="gk-footer-bottom">
          <span>© {new Date().getFullYear()} gòke</span>
          <span>ig-to-site · Visual sites from Instagram</span>
        </div>
      </div>
    </footer>
  );
}
