"use client";

/**
 * iOS/Android-style bottom tab bar — mobile only (CSS hides on desktop).
 */
export function MobileAppTabBar() {
  return (
    <nav className="gk-app-tabbar" aria-label="App shortcuts">
      <a className="gk-app-tab" href="/#start">
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
        </svg>
        <span>Home</span>
      </a>
      <a className="gk-app-tab" href="/#live-examples">
        <svg viewBox="0 0 24 24" aria-hidden>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M7 22h10" />
        </svg>
        <span>Live</span>
      </a>
      <a className="gk-app-tab gk-app-tab--primary" href="/#start">
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        <span>Generate</span>
      </a>
      <a className="gk-app-tab" href="/#pricing">
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M12 3v18M8 8h5.5a2.5 2.5 0 0 1 0 5H8h6a2.5 2.5 0 0 1 0 5H8" />
        </svg>
        <span>Price</span>
      </a>
      <a
        className="gk-app-tab"
        href="https://wa.me/2347065341105"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M5 4h4l2 5-2 1a8 8 0 0 0 4 4l1-2 5 2v4a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2z" />
        </svg>
        <span>Chat</span>
      </a>
    </nav>
  );
}
