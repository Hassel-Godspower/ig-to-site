import { SiteHeader } from "./components/marketing/SiteHeader";
import { HeroUpload } from "./components/marketing/HeroUpload";
import { HowItWorks } from "./components/marketing/HowItWorks";
import { ProofStrip } from "./components/marketing/ProofStrip";
import { LiveExamples } from "./components/marketing/LiveExamples";
import { EditorShowcase } from "./components/marketing/EditorShowcase";
import { TemplatesStrip } from "./components/marketing/TemplatesStrip";
import { PricingTeaser } from "./components/marketing/PricingTeaser";
import { TrustOwnership } from "./components/marketing/TrustOwnership";
import { SiteFooter } from "./components/marketing/SiteFooter";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="gk-hero">
          <div className="gk-container gk-hero-grid">
            <div>
              <p className="gk-kicker">Instagram → website</p>
              <h1>
                Your Instagram, as a <em>real website</em>
              </h1>
              <p className="gk-hero-lead">
                Start with your handle for a simple edit path, or upload an Instagram export for the
                full visual editor. Publish once when you are ready — not another link-in-bio.
              </p>
              <ul className="gk-hero-points">
                <li>Free to generate &amp; edit</li>
                <li>Simple path for owners · full editor for power users</li>
                <li>Pay only to publish · ₦20,000 once via Paystack</li>
              </ul>
              <p className="gk-hero-demo">
                Prefer proof first?{" "}
                <a href="#live-examples">See live gòke sites</a>
              </p>
            </div>
            <HeroUpload />
          </div>
        </section>

        <HowItWorks />
        <ProofStrip />
        <LiveExamples />

        <section className="gk-section gk-section-alt" id="demo">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>See the transformation</h2>
              <p>
                Profile, offer, and gallery become a multi-page site clients can browse, trust, and
                act on — with WhatsApp-ready CTAs where your niche needs them.
              </p>
            </div>
            <p>
              <Link href="/#start" className="gk-btn gk-btn-primary">
                Generate my site
              </Link>{" "}
              <Link href="/how-to-export" className="gk-btn gk-btn-ghost">
                How to export Instagram data
              </Link>
            </p>
          </div>
        </section>

        <EditorShowcase />
        <TemplatesStrip />
        <PricingTeaser />
        <TrustOwnership />
      </main>

      <SiteFooter />
    </>
  );
}
