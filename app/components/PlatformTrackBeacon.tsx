"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Fires pageviews + heartbeats for the gòke marketing site (your site).
 * Mount once in root layout.
 */
export function PlatformTrackBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Don't track admin UI noise as heavily — still ok to track
    const KEY = "goke_platform_sid";
    let sid = "";
    try {
      sid = localStorage.getItem(KEY) || "";
      if (!sid) {
        sid =
          "p" +
          Math.random().toString(36).slice(2) +
          Date.now().toString(36);
        localStorage.setItem(KEY, sid);
      }
    } catch {
      return;
    }

    const path =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    function send(type: "pageview" | "ping") {
      const payload = {
        sid,
        type,
        path,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      };
      try {
        fetch("/api/track/platform", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* ignore */
      }
    }

    send("pageview");
    const id = window.setInterval(() => send("ping"), 20000);
    const onVis = () => {
      if (document.visibilityState === "visible") send("ping");
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pathname, searchParams]);

  return null;
}
