import { SiteHeader } from "./components/marketing/SiteHeader";
import { HeroRotator } from "./components/marketing/HeroRotator";
import { InteractivePathTabs } from "./components/marketing/InteractivePathTabs";
import { InteractiveSetup } from "./components/marketing/InteractiveSetup";
import { ProductFeatureGrid } from "./components/marketing/ProductFeatureGrid";
import { DemoVideos } from "./components/marketing/DemoVideos";
import { LiveExamples } from "./components/marketing/LiveExamples";
import { PricingTeaser } from "./components/marketing/PricingTeaser";
import { PricingWhatYouGet } from "./components/marketing/PricingWhatYouGet";
import { AboutGoke } from "./components/marketing/AboutGoke";
import { SiteFooter } from "./components/marketing/SiteFooter";
import Link from "next/link";

/**
 * Homepage UX inspired by high-clarity B2B landings (e.g. Nubela/NinjaPear):
 * speech tip, tabbed product entry, setup steps + copy, feature grid, demo chrome.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Value prop strip — short, then interactive generator */}
        <section className="gk-hero" aria-label="Introduction">
          <div className="gk-container" style={{ maxWidth: 720, textAlign: "center" }}>
            <HeroRotator />
            <div style={{ marginTop: "1.25rem" }}>
              <a href="#start" className="gk-btn gk-btn-primary gk-btn-lg">
                Generate my site
              </a>
            </div>
          </div>
        </section>

        <InteractivePathTabs />
        <ProductFeatureGrid />
        <InteractiveSetup />
        <LiveExamples />

        <section className="gk-section gk-section-alt" id="demo">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>See the transformation</h2>
              <p>
                Social or career presence → multi-page site you can edit and own.
              </p>
            </div>
            <DemoVideos />
            <div className="gk-demo-actions">
              <a href="#start" className="gk-btn gk-btn-primary">
                Start generating
              </a>
              <Link href="/how-to-export" className="gk-btn gk-btn-ghost">
                Instagram export guide
              </Link>
            </div>
          </div>
        </section>

        <PricingTeaser />
        <PricingWhatYouGet />
        <AboutGoke />

        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>Ready when your presence is</h2>
            <p>
              Instagram or LinkedIn / CV — generate free, edit fully, publish once.
            </p>
            <a href="#start" className="gk-btn gk-btn-primary gk-btn-lg">
              Open generator
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
