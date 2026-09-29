"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const DISMISS_KEY = "goke-pwa-dismissed";
const INSTALL_SHOWN_KEY = "goke-pwa-shown";
const DELAY_MS = 30_000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

/**
 * Install / Add to Home Screen after 30s.
 * - Chromium: Install → native prompt()
 * - iOS Safari / Chrome iOS: guided Share → Add to Home Screen (no JS install API)
 */
export function PwaInstallPrompt() {
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [open, setOpen] = useState(false);
  const [ios, setIos] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [iosStepsExpanded, setIosStepsExpanded] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;

    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* ignore */
    }

    const onIos = isIosDevice();
    setIos(onIos);
    if (onIos) setIosStepsExpanded(true);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      deferredRef.current = e as BeforeInstallPromptEvent;
      setHasPrompt(true);
      setStatus(null);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    const onInstalled = () => {
      deferredRef.current = null;
      setHasPrompt(false);
      setOpen(false);
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("appinstalled", onInstalled);

    const timer = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem(INSTALL_SHOWN_KEY) === "1") return;
        sessionStorage.setItem(INSTALL_SHOWN_KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
    }, DELAY_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(timer);
    };
  }, []);

  const close = useCallback((persist?: boolean) => {
    setOpen(false);
    setStatus(null);
    if (persist) {
      try {
        localStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }, []);

  const handleInstall = useCallback(async () => {
    if (ios) {
      setIosStepsExpanded(true);
      setStatus(null);
      return;
    }

    const deferred = deferredRef.current;
    if (!deferred) {
      setStatus(
        "Install isn’t ready in this browser yet. Use the browser menu → Install app / Add to Home screen."
      );
      return;
    }

    setBusy(true);
    setStatus(null);
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      deferredRef.current = null;
      setHasPrompt(false);
      if (choice.outcome === "accepted") {
        close(true);
      } else {
        setStatus("Install cancelled. You can try again anytime.");
      }
    } catch {
      setStatus("Could not open the install dialog. Try the browser menu → Install app.");
    } finally {
      setBusy(false);
    }
  }, [ios, close]);

  if (!open) return null;

  return (
    <div
      className="goke-pwa-root"
      role="dialog"
      aria-labelledby="goke-pwa-title"
      aria-modal="true"
    >
      <div className="goke-pwa-backdrop" onClick={() => close(false)} />
      <div className="goke-pwa-sheet">
        <div className="goke-pwa-mark" aria-hidden>
          g
        </div>

        <h2 id="goke-pwa-title">
          {ios ? "Add gòke to your Home Screen" : "Add gòke to your home screen"}
        </h2>
        <p>
          {ios
            ? "On iPhone and iPad, Safari doesn’t allow a one-tap install. Use Share — takes about 10 seconds."
            : "Install the app for one-tap access — opens full screen like a native app."}
        </p>

        {ios && iosStepsExpanded ? (
          <div className="goke-pwa-ios">
            <ol className="goke-pwa-steps goke-pwa-steps--ios">
              <li>
                <span className="goke-pwa-step-num">1</span>
                <span>
                  Tap the <strong>Share</strong> button
                  <span className="goke-pwa-share-icon" aria-hidden title="Share">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 4v12M8 8l4-4 4 4" />
                      <path d="M5 14v5a1 1 0 001 1h12a1 1 0 001-1v-5" />
                    </svg>
                  </span>
                  at the bottom of Safari (or top on iPad)
                </span>
              </li>
              <li>
                <span className="goke-pwa-step-num">2</span>
                <span>
                  Scroll and tap <strong>Add to Home Screen</strong>
                  <span className="goke-pwa-plus-icon" aria-hidden>
                    +
                  </span>
                </span>
              </li>
              <li>
                <span className="goke-pwa-step-num">3</span>
                <span>
                  Tap <strong>Add</strong> in the top right
                </span>
              </li>
            </ol>
            <p className="goke-pwa-ios-note">
              Works in Safari. Other browsers on iOS still use WebKit — open this page in{" "}
              <strong>Safari</strong> if you don’t see “Add to Home Screen”.
            </p>
          </div>
        ) : null}

        {status ? <p className="goke-pwa-status">{status}</p> : null}

        <div className="goke-pwa-actions">
          {ios ? (
            <button
              type="button"
              className="goke-pwa-primary"
              onClick={() => {
                setIosStepsExpanded(true);
                document.getElementById("goke-pwa-title")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Show install steps
            </button>
          ) : (
            <button
              type="button"
              className="goke-pwa-primary"
              onClick={handleInstall}
              disabled={busy}
            >
              {busy ? "Opening install…" : "Install"}
            </button>
          )}

          {!ios && !hasPrompt ? (
            <p className="goke-pwa-hint">
              If nothing appears, open your browser menu and choose{" "}
              <strong>Install app</strong> or <strong>Add to Home screen</strong>.
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
