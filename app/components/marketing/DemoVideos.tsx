"use client";

import { useEffect, useState } from "react";

/**
 * Only ONE video in the DOM at a time:
 * - mobile (≤768px) → demo-mobile.mp4
 * - desktop/tablet → demo-desktop.mp4
 * Does not rely on CSS hide/show (production was missing those rules).
 */
export function DemoVideos() {
  const [mode, setMode] = useState<"desktop" | "mobile" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setMode(mq.matches ? "mobile" : "desktop");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Avoid flash of wrong video: wait until we know viewport
  if (mode === null) {
    return (
      <div
        className="gk-demo-frame gk-demo-video-wrap"
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
          minHeight: 200,
          background: "#0b0d12",
          borderRadius: 16,
        }}
        aria-hidden
      />
    );
  }

  const isMobile = mode === "mobile";
  const src = isMobile
    ? "/marketing/proof/demo-mobile.mp4"
    : "/marketing/proof/demo-desktop.mp4";
  const fallback = isMobile ? undefined : "/marketing/proof/demo.mp4";

  return (
    <div
      className="gk-demo-frame gk-demo-video-wrap"
      style={{
        width: "100%",
        maxWidth: isMobile ? 420 : 900,
        margin: "0 auto 1.5rem",
        overflow: "hidden",
        lineHeight: 0,
        borderRadius: 16,
      }}
    >
      <video
        key={src}
        controls
        playsInline
        muted
        loop
        autoPlay
        preload="metadata"
        poster="/marketing/proof/fitness.svg"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          maxWidth: "100%",
          objectFit: "contain",
          background: "#0b0d12",
          borderRadius: 15,
        }}
      >
        <source src={src} type="video/mp4" />
        {fallback ? <source src={fallback} type="video/mp4" /> : null}
      </video>
    </div>
  );
}
