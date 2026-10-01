import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="gk-footer">
      <div className="gk-container">
        <div className="gk-footer-grid">
          <div>
            <div className="gk-logo" style={{ marginBottom: "0.75rem" }}>
              <Image
                src="/icons/icon-192.png"
                alt=""
                width={28}
                height={28}
                className="gk-logo-img"
              />
              <span className="gk-logo-word">gòke</span>
            </div>
            <p>
              Instagram to a real website — generate, edit visually, publish when you’re ready.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <Link href="/why">Why gòke</Link>
            <Link href="/own-your-presence">Own your presence</Link>
            <a href="/#how">How it works</a>
            <a href="/#editor">Editor</a>
            <a href="/#templates">Templates</a>
            <a href="/#pricing">Pricing</a>
          </div>
          <div>
            <h4>Help</h4>
            <Link href="/how-to-export">Export guide</Link>
            <Link href="/why">Why gòke</Link>
            <a href="/#start">Generate site</a>
            <a href="/#demo">View demo</a>
          </div>
          <div>
            <h4>Legal</h4>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <div className="gk-footer-bottom">
          <span>© {new Date().getFullYear()} gòke</span>
          <span>Visual sites from Instagram</span>
        </div>
      </div>
    </footer>
  );
}
