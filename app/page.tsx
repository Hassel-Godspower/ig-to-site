import { SiteHeader } from "./components/marketing/SiteHeader";
import { HeroUpload } from "./components/marketing/HeroUpload";
import { DemoVideos } from "./components/marketing/DemoVideos";
import { HeroRotator } from "./components/marketing/HeroRotator";
import { HowItWorks } from "./components/marketing/HowItWorks";
import { LiveExamples } from "./components/marketing/LiveExamples";
import { PricingTeaser } from "./components/marketing/PricingTeaser";
import { AboutGoke } from "./components/marketing/AboutGoke";
import { SiteFooter } from "./components/marketing/SiteFooter";
import Link from "next/link";

/**
 * Lean homepage — only what converts:
 * Hero → How it works → Live sites → Demo → Pricing → About → CTA
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* 1. Hero + generate */}
        <section className="gk-hero" id="start">
          <div className="gk-container gk-hero-grid">
            <div>
              <HeroRotator />
            </div>
            <HeroUpload />
          </div>
        </section>

        {/* 2. Three steps */}
        <HowItWorks />

        {/* 3. Live customer sites */}
        <LiveExamples />

        {/* 4. Demo video */}
        <section className="gk-section gk-section-alt" id="demo">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>See the transformation</h2>
              <p>
                An Instagram presence becomes a multi-page site clients can browse
                and act on — with WhatsApp-ready calls to action.
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

        {/* 5. Price */}
        <PricingTeaser />

        {/* 6. Who / contact */}
        <AboutGoke />

        {/* 7. Final CTA */}
        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>Ready when your Instagram is</h2>
            <p>
              Type your handle or upload an export — preview free, pay once to go
              live.
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
