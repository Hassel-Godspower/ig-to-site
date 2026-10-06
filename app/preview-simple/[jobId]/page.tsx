"use client";

/**
 * Simple multi-page editor for handle-generated sites.
 * Separate from the full JSON/export builder at /preview/[jobId].
 * Edit text, images, and brand color — per page.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

type SitePage = { file: string; title: string };
type Phase = "editing" | "modal" | "verifying" | "polling" | "live" | "failed" | "payment_failed";

type EditableItem = {
  id: string;
  kind: "text" | "image" | "button";
  label: string;
  selector: string;
  value: string;
};

function labelFor(el: Element, index: number): string {
  const tag = el.tagName.toLowerCase();
  const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
  if (tag === "img") {
    const alt = el.getAttribute("alt") || "Image";
    return `Image: ${alt.slice(0, 28)}`;
  }
  if (tag === "h1") return `Headline: ${text || "H1"}`;
  if (tag === "h2") return `Heading: ${text || "H2"}`;
  if (/^h[3-6]$/.test(tag)) return `Subheading: ${text || tag.toUpperCase()}`;
  if (tag === "a" || tag === "button") return `Button: ${text || "CTA"}`;
  return `Text: ${text || `Block ${index + 1}`}`;
}

function scanDocument(doc: Document): EditableItem[] {
  const items: EditableItem[] = [];
  const seen = new WeakSet<Element>();

  const push = (el: Element, kind: EditableItem["kind"]) => {
    if (seen.has(el)) return;
    if (el.closest("script, style, noscript")) return;
    seen.add(el);
    const id = `e${items.length}`;
    el.setAttribute("data-goke-simple-id", id);
    let value = "";
    if (kind === "image") {
      value = (el as HTMLImageElement).src || el.getAttribute("src") || "";
    } else {
      value = (el.textContent || "").trim();
    }
    items.push({
      id,
      kind,
      label: labelFor(el, items.length),
      selector: `[data-goke-simple-id="${id}"]`,
      value,
    });
  };

  doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) => push(el, "text"));
  doc.querySelectorAll("p, li, figcaption, .brand-text, #site-title").forEach((el) => {
    if (el.closest("button, a.btn, .btn, [data-goke='button']")) return;
    if ((el.textContent || "").trim().length < 2) return;
    push(el, "text");
  });
  doc.querySelectorAll("img").forEach((el) => push(el, "image"));
  doc
    .querySelectorAll(
      "a.btn, a.button, button, .btn, [data-goke='button'], #cta-button"
    )
    .forEach((el) => push(el, "button"));

  return items.slice(0, 80);
}

export default function SimplePreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = String(params.jobId || "");
  const paid = searchParams.get("paid");
  const reference =
    searchParams.get("reference") || searchParams.get("trxref");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pages, setPages] = useState<SitePage[]>([
    { file: "index.html", title: "Home" },
  ]);
  const [currentPage, setCurrentPage] = useState("index.html");
  const [items, setItems] = useState<EditableItem[]>([]);
  const [brandColor, setBrandColor] = useState("#3b82f6");
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>(paid ? "verifying" : "editing");
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");

  const previewSrc = `/api/site/${jobId}/${currentPage}`;

  // Load pages + meta
  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    (async () => {
      try {
        const [pagesRes, metaRes] = await Promise.all([
          fetch(`/api/site/${jobId}/pages.json`),
          fetch(`/api/site/${jobId}/editor-meta.json`),
        ]);
        if (pagesRes.ok) {
          const data = await pagesRes.json();
          const list = Array.isArray(data?.pages) ? data.pages : [];
          if (!cancelled && list.length) {
            setPages(
              list.map((p: { file?: string; title?: string }) => ({
                file: p.file || "index.html",
                title: p.title || p.file || "Page",
              }))
            );
          }
        }
        if (metaRes.ok) {
          const meta = await metaRes.json();
          if (!cancelled) {
            if (meta.brandColor) setBrandColor(meta.brandColor);
            if (meta.handle) setHandle(meta.handle);
            if (meta.name) setUsername(String(meta.name).toLowerCase().replace(/\s+/g, ""));
          }
        }
      } catch {
        /* optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const rescan = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const scanned = scanDocument(doc);
    setItems(scanned);

    // Read primary from CSS if present
    try {
      const root = doc.documentElement;
      const v =
        root.style.getPropertyValue("--goke-primary").trim() ||
        root.style.getPropertyValue("--primary").trim() ||
        doc.defaultView
          ?.getComputedStyle(root)
          .getPropertyValue("--goke-primary")
          ?.trim();
      if (v && /^#/.test(v)) setBrandColor(v);
    } catch {
      /* ignore */
    }
  }, []);

  function onIframeLoad() {
    rescan();
  }

  function updateItem(id: string, value: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, value } : it))
    );
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const el = doc.querySelector(`[data-goke-simple-id="${id}"]`);
    if (!el) return;
    if (el.tagName === "IMG") {
      (el as HTMLImageElement).src = value;
      el.setAttribute("src", value);
    } else {
      el.textContent = value;
    }
    setSaved(false);
  }

  function applyBrandColor(hex: string) {
    setBrandColor(hex);
    const doc = iframeRef.current?.contentDocument;
    if (doc) {
      doc.documentElement.style.setProperty("--goke-primary", hex);
      doc.documentElement.style.setProperty("--primary", hex);
      doc.documentElement.style.setProperty("--primary-hover", hex);
    }
    setSaved(false);
  }

  async function savePage() {
    const doc = iframeRef.current?.contentDocument;
    if (!doc || !jobId) return;
    setBusy(true);
    setError(null);
    try {
      // Strip editor-only attrs before save
      doc.querySelectorAll("[data-goke-simple-id]").forEach((el) => {
        el.removeAttribute("data-goke-simple-id");
      });
      const html = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
      await fetch(`/api/site/${jobId}/${currentPage}`, {
        method: "PUT",
        body: html,
      });

      // Persist brand color into styles.css
      try {
        const cssRes = await fetch(`/api/site/${jobId}/styles.css`);
        let css = cssRes.ok ? await cssRes.text() : "";
        const hex = brandColor;
        css = css.replace(
          /--goke-primary\s*:\s*#[0-9a-fA-F]{3,8}/gi,
          `--goke-primary:${hex}`
        );
        css = css.replace(
          /--primary\s*:\s*#[0-9a-fA-F]{3,8}/gi,
          `--primary:${hex}`
        );
        if (!/--goke-primary\s*:/.test(css)) {
          css = `:root{--goke-primary:${hex};--primary:${hex};}\n` + css;
        }
        await fetch(`/api/site/${jobId}/styles.css`, {
          method: "PUT",
          body: css,
        });
      } catch {
        /* optional */
      }

      await fetch(`/api/site/${jobId}/editor-meta.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editorMode: "simple",
          brandColor,
          handle,
          lastPage: currentPage,
          updatedAt: new Date().toISOString(),
        }),
      });

      setSaved(true);
      // Re-stamp ids for continued editing
      rescan();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function switchPage(file: string) {
    if (file === currentPage) return;
    if (!saved) {
      const ok = window.confirm("Save changes on this page before switching?");
      if (ok) await savePage();
    }
    setCurrentPage(file);
    setItems([]);
    setSaved(true);
  }

  async function goLive() {
    setModalOpen(true);
  }

  async function submitCheckout() {
    if (!email || !email.includes("@")) {
      setError("Enter a valid email for the payment receipt.");
      return;
    }
    if (!(username || handle)) {
      setError("Enter a site username.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await savePage();
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          username: username || handle || "site",
          email,
          returnPath: "preview-simple",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      throw new Error("No checkout URL");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setPhase("payment_failed");
    } finally {
      setBusy(false);
      setModalOpen(false);
    }
  }

  // After Paystack redirect: verify payment → create GitHub repo immediately
  useEffect(() => {
    if (phase !== "verifying" || !jobId) return;

    (async () => {
      try {
        if (!reference) {
          // Webhook may still land — poll status briefly
          setPhase("polling");
          return;
        }
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, reference }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Verification failed");
          setPhase("failed");
          return;
        }
        if (data.status === "payment_failed") {
          setError(data.reason || "Payment failed");
          setPhase("payment_failed");
          return;
        }
        if (data.status === "failed") {
          setError(data.error || "GitHub publish failed");
          setPhase("failed");
          return;
        }
        if (data.repoUrl || data.siteUrl) {
          setSiteUrl(data.siteUrl || data.repoUrl);
        }
        if (data.status === "done") {
          setPhase("live");
        } else {
          // deploying — repo should exist on GitHub; poll for live URL
          setPhase("polling");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Verify failed");
        setPhase("failed");
      }
    })();
  }, [phase, jobId, reference]);

  // Poll deploy status until site is reachable (or show repo URL from failed live check)
  useEffect(() => {
    if (phase !== "polling" || !jobId) return;
    let n = 0;
    const interval = window.setInterval(async () => {
      n++;
      try {
        const res = await fetch(`/api/status/${jobId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "done" && data.siteUrl) {
          setSiteUrl(data.siteUrl);
          setPhase("live");
          window.clearInterval(interval);
        } else if (data.status === "failed") {
          setError(data.error || "Publish failed");
          setPhase("failed");
          window.clearInterval(interval);
        } else if (data.siteUrl) {
          setSiteUrl(data.siteUrl);
        }
      } catch {
        /* retry */
      }
      if (n > 90) {
        window.clearInterval(interval);
        // Repo may exist even if vercel.app not live yet
        setPhase("live");
      }
    }, 2500);
    return () => window.clearInterval(interval);
  }, [phase, jobId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0c0a10",
        color: "#f3f4f6",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          borderBottom: "1px solid rgba(167,139,250,0.2)",
          background: "#121018",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ color: "#c4b5fd", textDecoration: "none", fontWeight: 700 }}>
          gòke
        </Link>
        <span style={{ color: "#6b7280", fontSize: 13 }}>Simple editor</span>
        {handle && (
          <span style={{ color: "#9ca3af", fontSize: 13 }}>@{handle}</span>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: saved ? "#6ee7b7" : "#fbbf24" }}>
          {saved ? "Saved" : "Unsaved"}
        </span>
        <button
          type="button"
          onClick={() => void savePage()}
          disabled={busy || saved}
          style={btnSecondary}
        >
          Save page
        </button>
        {phase === "live" && siteUrl ? (
          <a
            href={siteUrl}
            target="_blank"
            rel="noreferrer"
            style={{ ...btnPrimary, textDecoration: "none" }}
          >
            Open live site
          </a>
        ) : (
          <button type="button" onClick={() => void goLive()} style={btnPrimary}>
            Go live
          </button>
        )}
      </header>

      {/* Page tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "8px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          overflowX: "auto",
          background: "#0e0c12",
        }}
      >
        {pages.map((p) => (
          <button
            key={p.file}
            type="button"
            onClick={() => void switchPage(p.file)}
            style={{
              ...btnSecondary,
              background:
                currentPage === p.file
                  ? "rgba(167,139,250,0.25)"
                  : "transparent",
              borderColor:
                currentPage === p.file
                  ? "#a78bfa"
                  : "rgba(255,255,255,0.1)",
              color: currentPage === p.file ? "#ede9fe" : "#9ca3af",
            }}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Canvas */}
        <main style={{ flex: 1, minWidth: 0, background: "#1a1a22", padding: 12 }}>
          <div
            style={{
              height: "100%",
              background: "#fff",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          >
            <iframe
              key={previewSrc}
              ref={iframeRef}
              title="Simple site preview"
              src={previewSrc}
              onLoad={onIframeLoad}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </main>

        {/* Edit panel */}
        <aside
          style={{
            width: 320,
            flexShrink: 0,
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            background: "#121018",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "14px 14px 8px" }}>
            <h2 style={{ margin: 0, fontSize: 15 }}>Edit this page</h2>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#9ca3af", lineHeight: 1.4 }}>
              Change text, image links, and brand color. Switch pages above. Full
              drag-and-drop designer is separate (JSON export path).
            </p>
          </div>

          <div style={{ padding: "0 14px 12px" }}>
            <label style={fieldLabel}>
              Brand color
              <input
                type="color"
                value={/^#/.test(brandColor) ? brandColor : "#3b82f6"}
                onChange={(e) => applyBrandColor(e.target.value)}
                style={{ width: "100%", height: 36, border: "none", background: "transparent" }}
              />
            </label>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 16px" }}>
            {items.length === 0 && (
              <p style={{ fontSize: 12, color: "#6b7280" }}>
                Loading page content…
              </p>
            )}
            {items.map((it) => (
              <label key={it.id} style={fieldLabel}>
                {it.label}
                {it.kind === "image" ? (
                  <input
                    style={inputStyle}
                    value={it.value}
                    onChange={(e) => updateItem(it.id, e.target.value)}
                    placeholder="https://… image URL"
                  />
                ) : (
                  <textarea
                    style={{ ...inputStyle, minHeight: it.kind === "button" ? 40 : 56 }}
                    value={it.value}
                    onChange={(e) => updateItem(it.id, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>

          {error && (
            <div style={{ padding: 12 }}>
              <p style={{ color: "#fca5a5", fontSize: 12, margin: 0 }}>{error}</p>
              {reference && (
                <button
                  type="button"
                  style={{ marginTop: 8, ...btnSecondary }}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      const res = await fetch("/api/deploy", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ jobId, reference }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "Retry failed");
                      setSiteUrl(data.siteUrl || data.repoUrl);
                      setError(null);
                      setPhase(data.status === "done" ? "live" : "polling");
                    } catch (e: unknown) {
                      setError(e instanceof Error ? e.message : "Retry failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Retry publish to GitHub
                </button>
              )}
            </div>
          )}
        </aside>
      </div>

      {modalOpen && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ marginTop: 0 }}>Go live</h3>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              Publish this multi-page site. ₦20,000 once.
            </p>
            <label style={fieldLabel}>
              Site username
              <input
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mybrand"
              />
            </label>
            <label style={fieldLabel}>
              Email (receipt)
              <input
                style={inputStyle}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button type="button" style={btnSecondary} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                style={btnPrimary}
                disabled={busy}
                onClick={() => void submitCheckout()}
              >
                {busy ? "Please wait…" : "Continue to payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnPrimary: CSSProperties = {
  background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
  color: "#0c0a10",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};

const btnSecondary: CSSProperties = {
  background: "#1a1625",
  color: "#e5e7eb",
  border: "1px solid rgba(167,139,250,0.3)",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 13,
  cursor: "pointer",
};

const fieldLabel: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontSize: 11,
  color: "#9ca3af",
  marginBottom: 12,
};

const inputStyle: CSSProperties = {
  background: "#15121c",
  border: "1px solid rgba(167,139,250,0.25)",
  borderRadius: 8,
  padding: "8px 10px",
  color: "#f3f4f6",
  fontSize: 13,
  fontFamily: "inherit",
};

const modalOverlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  display: "grid",
  placeItems: "center",
  zIndex: 100,
};

const modalCard: CSSProperties = {
  background: "#121018",
  border: "1px solid rgba(167,139,250,0.3)",
  borderRadius: 12,
  padding: 24,
  width: "min(400px, 92vw)",
};
