import { SiteHeader } from "./components/marketing/SiteHeader";
import { DualPathHero } from "./components/marketing/DualPathHero";
import { DemoVideos } from "./components/marketing/DemoVideos";
import { HowItWorks } from "./components/marketing/HowItWorks";
import { LiveExamples } from "./components/marketing/LiveExamples";
import { PricingTeaser } from "./components/marketing/PricingTeaser";
import { PricingWhatYouGet } from "./components/marketing/PricingWhatYouGet";
import { AboutGoke } from "./components/marketing/AboutGoke";
import { SiteFooter } from "./components/marketing/SiteFooter";
import Link from "next/link";

/**
 * Shared chrome (header + footer).
 * Hero uses DualPathHero: Moniepoint-style Instagram | LinkedIn switch.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <DualPathHero />

        <HowItWorks />
        <LiveExamples />

        <section className="gk-section gk-section-alt" id="demo">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>See the transformation</h2>
              <p>
                A social or career profile becomes a multi-page site people can
                browse and act on — with clear calls to action, not another list
                of links.
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

        <PricingTeaser />
        <PricingWhatYouGet />
        <AboutGoke />
      </main>

      <SiteFooter />
    </>
  );
}
