"use client";

import { useEffect, useState, useCallback } from "react";

const DISMISS_KEY = "goke-pwa-dismissed";
const INSTALL_SHOWN_KEY = "goke-pwa-shown";
const DELAY_MS = 30_000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

/**
 * Registers the service worker and shows "Save to device" after 30s.
 */
export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;

    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* ignore */
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline / first paint */
      });
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    const timer = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem(INSTALL_SHOWN_KEY) === "1") return;
        sessionStorage.setItem(INSTALL_SHOWN_KEY, "1");
      } catch {
        /* ignore */
      }

      if (isIos()) {
        setIosHint(true);
        setOpen(true);
      } else {
        setOpen(true);
      }
    }, DELAY_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.clearTimeout(timer);
    };
  }, []);

  const close = useCallback((persist?: boolean) => {
    setOpen(false);
    if (persist) {
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }, []);

  const install = useCallback(async () => {
    if (!deferred) {
      // No native prompt — keep sheet open with instructions already visible
      return;
    }
    await deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      /* ignore */
    }
    setDeferred(null);
    close(true);
  }, [deferred, close]);

  if (!open) return null;

  return (
    <div className="goke-pwa-root" role="dialog" aria-labelledby="goke-pwa-title" aria-modal="true">
      <div className="goke-pwa-backdrop" onClick={() => close(false)} />
      <div className="goke-pwa-sheet">
        <div className="goke-pwa-mark" aria-hidden>
          g
        </div>
        <h2 id="goke-pwa-title">Save gòke to your device</h2>
        <p>
          Install the app for faster access — works offline for the shell, and feels like a
          native app on your home screen.
        </p>

        {iosHint ? (
          <ol className="goke-pwa-steps">
            <li>
              Tap the <strong>Share</strong> button in Safari
            </li>
            <li>
              Choose <strong>Add to Home Screen</strong>
            </li>
            <li>
              Tap <strong>Add</strong>
            </li>
          </ol>
        ) : null}

        <div className="goke-pwa-actions">
          {!iosHint && deferred ? (
            <button type="button" className="goke-pwa-primary" onClick={install}>
              Install app
            </button>
          ) : null}
          {!iosHint && !deferred ? (
            <p className="goke-pwa-hint">
              Use your browser menu → <strong>Install app</strong> or <strong>Add to Home screen</strong>.
            </p>
          ) : null}
          <button type="button" className="goke-pwa-ghost" onClick={() => close(false)}>
            Not now
          </button>
          <button type="button" className="goke-pwa-link" onClick={() => close(true)}>
            Don&apos;t show again
          </button>
        </div>
      </div>
    </div>
  );
}
