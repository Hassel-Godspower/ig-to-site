"use client";

import { useEffect, useState } from "react";

type PricingInfo = {
  primary: string;
  secondary: string;
  displayCurrency: "NGN" | "USD";
  chargeCurrency: "NGN" | "USD";
  usdEnabled?: boolean;
};

export function PricingTeaser() {
    const [price, setPrice] = useState<PricingInfo>({
    primary: "$15",
    secondary: "₦20,000 · one-time · Paystack",
    displayCurrency: "USD",
    chargeCurrency: "NGN",
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d?.primary) return;
        setPrice({
          primary: d.primary,
          secondary: d.secondary,
          displayCurrency: d.displayCurrency === "USD" ? "USD" : "NGN",
          chargeCurrency: d.chargeCurrency === "USD" ? "USD" : "NGN",
          usdEnabled: !!d.usdEnabled,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const goLiveNote =
    price.displayCurrency === "USD"
      ? price.chargeCurrency === "USD"
        ? "Charged as $15 USD on Paystack · settles to your Paystack balance"
        : "Shown in USD; checkout still in ₦ until USD is enabled on Paystack"
      : "Charged as ₦20,000 NGN on Paystack · ≈ $15";

  return (
    <section className="gk-section gk-section-alt" id="pricing">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2>Preview free. Pay once when you publish.</h2>
          <p>
            Generate from Instagram or LinkedIn / CV and edit at no charge.
            Checkout only when you want a live URL.{" "}
            <strong>No monthly subscription</strong> for Go live.
          </p>
        </div>
        <div className="gk-pricing">
          <article className="gk-price-card">
            <h3>Preview</h3>
            <p className="price">
              {price.displayCurrency === "USD" ? "$0" : "₦0"}{" "}
              <span>/ start</span>
            </p>
            <ul>
              <li>Instagram handle, export, LinkedIn, or CV → site</li>
              <li>Simple editor or full visual editor</li>
              <li>Multi-page preview</li>
              <li>No public URL until you pay</li>
            </ul>
            <a href="#start" className="gk-btn gk-btn-ghost gk-btn-block">
              Start free
            </a>
          </article>
          <article className="gk-price-card featured">
            <h3>Go live</h3>
            <p className="price">
              {price.primary} <span>/ once</span>
            </p>
            <p
              style={{
                margin: "-0.5rem 0 1rem",
                fontSize: 14,
                color: "var(--gk-muted, #9ca3af)",
              }}
            >
              {price.secondary}
            </p>
            <p
              style={{
                margin: "0 0 1rem",
                fontSize: 12,
                color: "var(--gk-muted, #9ca3af)",
              }}
            >
              {goLiveNote}
            </p>
            <ul>
              <li>HTTPS on Cloudflare Pages</li>
              <li>
                <code>yourusername.pages.dev</code> included
              </li>
              <li>Email with your live link</li>
              <li>Dashboard: edit, push live, download ZIP</li>
              <li><strong>$15 once</strong> (₦20,000) — same publish, no subscription</li>
            </ul>
            <a href="#start" className="gk-btn gk-btn-primary gk-btn-block">
              Generate first — pay later
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
