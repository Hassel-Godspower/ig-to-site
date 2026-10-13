"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop landscape + mobile portrait demos.
 * Only the active viewport player is visible and playing.
 */
export function DemoVideos() {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");

    function sync() {
      const mobile = mq.matches;
      const desk = desktopRef.current;
      const mob = mobileRef.current;
      if (!desk || !mob) return;

      if (mobile) {
        desk.pause();
        void mob.play().catch(() => {});
      } else {
        mob.pause();
        void desk.play().catch(() => {});
      }
    }

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="gk-demo-frame gk-demo-video-wrap">
      <video
        ref={desktopRef}
        className="gk-demo-video gk-demo-video--desktop"
        controls
        playsInline
        muted
        loop
        autoPlay
        preload="metadata"
        poster="/marketing/proof/fitness.svg"
      >
        <source src="/marketing/proof/demo-desktop.mp4" type="video/mp4" />
        <source src="/marketing/proof/demo.mp4" type="video/mp4" />
      </video>
      <video
        ref={mobileRef}
        className="gk-demo-video gk-demo-video--mobile"
        controls
        playsInline
        muted
        loop
        autoPlay
        preload="metadata"
        poster="/marketing/proof/fitness.svg"
      >
        <source src="/marketing/proof/demo-mobile.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
