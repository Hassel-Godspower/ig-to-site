import { SiteHeader } from "./components/marketing/SiteHeader";
import { HeroUpload } from "./components/marketing/HeroUpload";
import { HowItWorks } from "./components/marketing/HowItWorks";
import { ProofStrip } from "./components/marketing/ProofStrip";
import { LiveExamples } from "./components/marketing/LiveExamples";
import { EditorShowcase } from "./components/marketing/EditorShowcase";
import { TemplatesStrip } from "./components/marketing/TemplatesStrip";
import { PricingTeaser } from "./components/marketing/PricingTeaser";
import { TrustOwnership } from "./components/marketing/TrustOwnership";
import { AfterGoLive } from "./components/marketing/AfterGoLive";
import { AboutGoke } from "./components/marketing/AboutGoke";
import { SiteFooter } from "./components/marketing/SiteFooter";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero — dual path (handle + export) */}
        <section className="gk-hero" id="start">
          <div className="gk-container gk-hero-grid">
            <div>
              <p className="gk-kicker">Instagram → website</p>
              <h1>
                Your Instagram, as a <em>real website</em>
              </h1>
              <p className="gk-hero-lead">
                Start with your handle for a simple edit path, or upload an Instagram
                export for the full visual editor. Publish once when you are ready —
                not another link-in-bio.
              </p>
              <ul className="gk-hero-points">
                <li>Free to generate &amp; edit</li>
                <li>Simple path for owners · full editor for power users</li>
                <li>Pay only to publish · ₦20,000 once via Paystack</li>
              </ul>
              <p className="gk-hero-demo">
                Prefer proof first?{" "}
                <a href="#live-examples">See live gòke sites</a>
                {" · "}
                <a href="#demo">See the transformation</a>
              </p>
            </div>
            <HeroUpload />
          </div>
        </section>

        <HowItWorks />
        <ProofStrip />

        {/* Real published sites */}
        <LiveExamples />

        {/* Demo / case study band — keep visual proof from original */}
        <section className="gk-section gk-section-alt" id="demo">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>See the transformation</h2>
              <p>
                Profile, offer, and gallery become a multi-page site clients can
                browse, trust, and act on — with WhatsApp-ready CTAs where your niche
                needs them. Example: a fitness coach’s Instagram presence becomes a
                booking-ready site structured for the open web.
              </p>
            </div>
            <div className="gk-demo-frame">
              <img
                src="/marketing/proof/fitness.svg"
                alt="Instagram profile transforming into a fitness website"
                width={900}
                height={520}
              />
            </div>
            <div className="gk-demo-actions">
              <a href="#start" className="gk-btn gk-btn-primary">
                Generate my site
              </a>
              <Link href="/how-to-export" className="gk-btn gk-btn-ghost">
                How to export Instagram data
              </Link>
            </div>
          </div>
        </section>

        <EditorShowcase />
        <TemplatesStrip />
        <PricingTeaser />

        {/* What ₦20k includes */}
        <TrustOwnership />
        <AfterGoLive />
        <AboutGoke />

        {/* Final CTA band — from original main page */}
        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>Ready when your Instagram is</h2>
            <p>
              Use your handle for a quick start, or export your data and open the full
              editor. Free to generate — pay once when you go live.
            </p>
            <a href="#start" className="gk-btn gk-btn-primary gk-btn-lg">
              Generate my site
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
