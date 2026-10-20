import Link from "next/link";
import Image from "next/image";

const WA = "https://wa.me/2347065341105";
const TEL = "+2347065341105";

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
            <p className="gk-footer-tagline">
              Instagram or LinkedIn / CV to a real website — generate, edit, publish when
              you&apos;re ready.
            </p>
            <p className="gk-footer-by">
              A product of{" "}
              <strong>HighValue Solutions</strong>
            </p>
            <p className="gk-footer-contact">
              <a href={WA} target="_blank" rel="noopener noreferrer">
                WhatsApp {TEL}
              </a>
              <span aria-hidden="true"> · </span>
              <a href={`tel:${TEL.replace(/\s/g, "")}`}>{TEL}</a>
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <Link href="/builders">Builders</Link>
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
            <a href="/#about-goke">About</a>
            <a href="/#start">Instagram path</a>
            <a href="/#professional">LinkedIn / CV path</a>
            <a href="/#demo">View demo</a>
            <a href={WA} target="_blank" rel="noopener noreferrer">
              Contact on WhatsApp
            </a>
          </div>
          <div>
            <h4>Legal</h4>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <div className="gk-footer-bottom">
          <span>
            © {new Date().getFullYear()} HighValue Solutions · gòke
          </span>
          <span>gòke by HighValue</span>
        </div>
      </div>
    </footer>
  );
}
