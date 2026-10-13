import { SiteHeader } from "./components/marketing/SiteHeader";
import { HeroUpload } from "./components/marketing/HeroUpload";
import { DemoVideos } from "./components/marketing/DemoVideos";
import { HeroRotator } from "./components/marketing/HeroRotator";
import { TechStackStrip } from "./components/marketing/TechStackStrip";
import { HowItWorks } from "./components/marketing/HowItWorks";
import { ProofStrip } from "./components/marketing/ProofStrip";
import { LiveExamples } from "./components/marketing/LiveExamples";
import { EditorShowcase } from "./components/marketing/EditorShowcase";
import { TemplatesStrip } from "./components/marketing/TemplatesStrip";
import { PricingTeaser } from "./components/marketing/PricingTeaser";
import { CommerceBookingStrip } from "./components/marketing/CommerceBookingStrip";
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
        {/* Hero — rotating value props + dual path upload (unchanged) */}
        <section className="gk-hero" id="start">
          <div className="gk-container gk-hero-grid">
            <div>
              <HeroRotator />
              <TechStackStrip />
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
                Profile, offer, and gallery become a multi-page site clients can
                browse, trust, and act on — with WhatsApp-ready CTAs where your niche
                needs them. Example: a fitness coach’s Instagram presence becomes a
                booking-ready site structured for the open web.
              </p>
            </div>
            <DemoVideos />
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
        <CommerceBookingStrip />
        <TrustOwnership />
        <AfterGoLive />
        <PricingTeaser />
        <AboutGoke />

        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>Ready when your Instagram is</h2>
            <p>Export your data or type your handle — then open your site in the editor.</p>
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
