"use client";

/**
 * Live site builder — Elementor-style structure + design
 * Keeps payment / deploy / save pipeline unchanged.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { Builder } from "@/src/goke-editor/core/builder";
import { Undo } from "@/src/goke-editor/core/undo";
import { styleManager } from "@/src/goke-editor/core/style-manager";
import { registry } from "@/src/goke-editor/core/registry";
import type {
  ComponentDefinition,
  ComponentProperty,
} from "@/src/goke-editor/types";
import type { Breakpoint, NavNode } from "@/src/goke-editor/types/document";
import { ComponentPalette } from "@/src/goke-editor/components/ComponentPalette";
import { PropertiesPanel } from "@/src/goke-editor/components/PropertiesPanel";
import { Navigator } from "@/src/goke-editor/components/Navigator";
import { ContextToolbar } from "@/src/goke-editor/components/ContextToolbar";
import { StylePanel } from "@/src/goke-editor/components/StylePanel";
import { matchSiteElement } from "@/src/goke-editor/components/site-markers";
import {
  applyBreakpointPreview,
  applyResponsiveStylesToDocument,
} from "@/src/goke-editor/core/responsive-export";

import "@/src/goke-editor/components/goke-components";
import "@/src/goke-editor/components/site-markers";
import "@/src/goke-editor/styles/editor.css";

type Phase =
  | "editing"
  | "modal"
  | "verifying"
  | "polling"
  | "live"
  | "failed"
  | "payment_failed";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PreviewPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const searchParams = useSearchParams();
  const paid = searchParams.get("paid");
  const reference =
    searchParams.get("reference") || searchParams.get("trxref");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const builderRef = useRef<Builder | null>(null);

  const [saved, setSaved] = useState(true);
  const [phase, setPhase] = useState<Phase>(paid ? "verifying" : "editing");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [builderReady, setBuilderReady] = useState(false);

  const [selectedElement, setSelectedElement] =
    useState<HTMLElement | null>(null);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentDefinition | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [device, setDevice] = useState<Breakpoint>("desktop");
  const [tree, setTree] = useState<NavNode[]>([]);
  const [rightTab, setRightTab] = useState<"content" | "design">("content");

  const previewSrc = `/api/site/${jobId}/index.html`;

  const refreshTree = useCallback(() => {
    const t = builderRef.current?.getTree() ?? [];
    setTree(t);
  }, []);

  const attachBuilder = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    builderRef.current?.destroy();
    const builder = new Builder();
    builderRef.current = builder;
    await builder.attach(iframe);

    builder.on("select", ({ element }: { element: HTMLElement | null }) => {
      if (!element) {
        setSelectedElement(null);
        setSelectedComponent(null);
        return;
      }
      const component =
        matchSiteElement(element) ?? registry.matchNode(element);
      setSelectedElement(element);
      setSelectedComponent(component);
      setRightTab(component?.properties?.length ? "content" : "design");
    });

    builder.on("change", () => {
      setSaved(false);
    });

    builder.on("tree", () => {
      refreshTree();
    });

    setBuilderReady(true);
    refreshTree();
  }, [refreshTree]);

  function onIframeLoad() {
    attachBuilder();
  }

  useEffect(() => {
    const onUndoChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setCanUndo(detail.canUndo);
      setCanRedo(detail.canRedo);
    };
    window.addEventListener("goke.undo.change", onUndoChange);
    return () => {
      window.removeEventListener("goke.undo.change", onUndoChange);
      builderRef.current?.destroy();
      builderRef.current = null;
    };
  }, []);


  // Keyboard shortcuts (Elementor-style)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      const editingText =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (e.target as HTMLElement)?.isContentEditable;

      // Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl+Y redo
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        Undo.undo();
        setSaved(false);
        refreshTree();
        return;
      }
      if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "z") ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        Undo.redo();
        setSaved(false);
        refreshTree();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void saveEdits();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        if (editingText) return;
        e.preventDefault();
        builderRef.current?.duplicateNode();
        return;
      }

      if (editingText) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        builderRef.current?.deleteNode();
        return;
      }
      if (e.key === "Escape") {
        builderRef.current?.selectNode(null);
        return;
      }
      if (e.key === "ArrowUp" && (e.altKey || e.metaKey)) {
        e.preventDefault();
        builderRef.current?.moveNode(undefined, "up");
        return;
      }
      if (e.key === "ArrowDown" && (e.altKey || e.metaKey)) {
        e.preventDefault();
        builderRef.current?.moveNode(undefined, "down");
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When device breakpoint changes, re-apply stored responsive styles on canvas
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc || !builderReady) return;
    applyBreakpointPreview(doc, device);
  }, [device, builderReady]);

  // Payment verification
  useEffect(() => {
    if (phase !== "verifying") return;
    if (!reference) {
      setPhase("polling");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, reference }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
          setPhase("failed");
        } else if (data.status === "payment_failed") {
          setError(data.reason || "The payment wasn't completed.");
          setPhase("payment_failed");
        } else if (data.status === "done") {
          setSiteUrl(data.siteUrl);
          setPhase("live");
        } else if (data.status === "failed") {
          setError(data.error);
          setPhase("failed");
        } else {
          setPhase("polling");
        }
      } catch (err: any) {
        setError(String(err?.message ?? err));
        setPhase("failed");
      }
    })();
  }, [phase, jobId, reference]);

  // Deploy poll
  useEffect(() => {
    if (phase !== "polling") return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/status/${jobId}`);
      const data = await res.json();
      if (data.status === "done") {
        setSiteUrl(data.siteUrl);
        setPhase("live");
        clearInterval(interval);
      } else if (data.status === "failed") {
        setError(data.error);
        setPhase("failed");
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [phase, jobId]);

  const handleUndo = useCallback(() => {
    Undo.undo();
    setSaved(false);
    refreshTree();
  }, [refreshTree]);

  const handleRedo = useCallback(() => {
    Undo.redo();
    setSaved(false);
    refreshTree();
  }, [refreshTree]);

  async function saveEdits() {
    const builder = builderRef.current;
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    // Ensure responsive + hover CSS is baked into the HTML
    applyResponsiveStylesToDocument(doc);
    const html =
      builder?.getHtml() ||
      "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;

    await fetch(`/api/site/${jobId}/index.html`, {
      method: "PUT",
      body: html,
    });

    // Also append editor CSS into styles.css if it exists (non-fatal)
    try {
      const styleTag = doc.getElementById("goke-editor-responsive");
      if (styleTag?.textContent) {
        const existing = await fetch(`/api/site/${jobId}/styles.css`).then(
          (r) => (r.ok ? r.text() : "")
        );
        const marker = "/* === goke-editor-responsive === */";
        let next = existing || "";
        const idx = next.indexOf(marker);
        if (idx >= 0) next = next.slice(0, idx).trimEnd();
        next =
          next +
          "\n\n" +
          marker +
          "\n" +
          styleTag.textContent +
          "\n";
        await fetch(`/api/site/${jobId}/styles.css`, {
          method: "PUT",
          body: next,
        });
      }
    } catch {
      /* styles.css optional */
    }

    setSaved(true);
  }

  function startDrag(type: string, e: React.DragEvent) {
    builderRef.current?.startDrag(type, e.nativeEvent);
  }

  function updateProperty(
    _key: string,
    value: string | number | boolean,
    property: ComponentProperty
  ) {
    const el = selectedElement;
    const builder = builderRef.current;
    if (!el || !builder) return;

    let target = el;
    if (property.child) {
      const child = el.querySelector(property.child) as HTMLElement | null;
      if (child) target = child;
    }

    if (property.onChange) {
      const result = property.onChange(target, value);
      if (result instanceof HTMLElement) builder.selectNode(result);
    } else if (property.htmlAttr) {
      builder.setAttribute(target, property.htmlAttr, String(value));
    } else if (property.cssProperty) {
      styleManager.setStyle(target, property.cssProperty, String(value));
    }
    setSaved(false);
  }

  async function goLive() {
    setError(null);
    setPhase("modal");
  }

  async function confirmPayment() {
    setError(null);
    if (!username.trim()) {
      setError("Choose a subdomain first.");
      return;
    }
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email — Paystack sends your receipt there.");
      return;
    }
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        username: username.trim(),
        email: email.trim(),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    window.location.href = data.checkoutUrl;
  }

  async function retryDeploy() {
    setError(null);
    setPhase("polling");
    const res = await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      setPhase("failed");
    }
  }

  const deviceWidths: Record<string, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
  };

  return (
    <div className="goke-editor" style={{ height: "100vh" }}>
      <header className="goke-toolbar">
        <div className="goke-toolbar-left">
          <span className="goke-logo">gòke</span>
          <button type="button" disabled={!canUndo} onClick={handleUndo}>
            ↶ Undo
          </button>
          <button type="button" disabled={!canRedo} onClick={handleRedo}>
            ↷ Redo
          </button>
          {!saved && (
            <span style={{ color: "#fbbf24", fontSize: 12 }}>Unsaved</span>
          )}
          <span className="goke-kbd-hint" title="Del delete · ⌘Z undo · ⌘S save · ⌘D duplicate · Esc deselect">
            ⌨ shortcuts
          </span>
        </div>

        <div className="goke-toolbar-center">
          <div className="goke-device-switch">
            {(
              [
                ["desktop", "Desktop"],
                ["tablet", "Tablet"],
                ["mobile", "Mobile"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={device === id ? "active" : ""}
                onClick={() => setDevice(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="goke-toolbar-right">
          {phase === "live" && siteUrl ? (
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#4ade80", fontSize: 13 }}
            >
              {siteUrl.replace(/^https?:\/\//, "")}
            </a>
          ) : phase === "polling" || phase === "verifying" ? (
            <span style={{ color: "#a3a3a3", fontSize: 13 }}>
              Creating live website…
            </span>
          ) : phase === "failed" ? (
            <button type="button" onClick={retryDeploy}>
              Retry deploy
            </button>
          ) : phase === "payment_failed" ? (
            <button type="button" className="goke-btn-primary" onClick={goLive}>
              Try payment again
            </button>
          ) : (
            <>
              <button type="button" onClick={saveEdits} disabled={saved}>
                {saved ? "Saved" : "Save changes"}
              </button>
              <button
                type="button"
                className="goke-btn-primary"
                onClick={goLive}
              >
                Go live
              </button>
            </>
          )}
        </div>
      </header>

      {(phase === "failed" || phase === "payment_failed") && error && (
        <div
          style={{
            background: "#450a0a",
            color: "#fca5a5",
            padding: "8px 16px",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div className="goke-workspace">
        {/* Left: structure + components */}
        <div className="goke-left-stack">
          <Navigator
            tree={tree}
            selectedElement={selectedElement}
            onSelect={(el) => builderRef.current?.selectNode(el)}
          />
          <ComponentPalette onDragStart={startDrag} />
        </div>

        {/* Center: canvas */}
        <main className="goke-canvas-wrap" style={{ position: "relative" }}>
          <div
            className="goke-canvas-frame"
            style={{
              width: deviceWidths[device],
              maxWidth: "100%",
              margin: "0 auto",
              transition: "width 0.25s ease",
            }}
          >
            <iframe
              ref={iframeRef}
              title="Site preview"
              src={previewSrc}
              className="goke-canvas"
              sandbox="allow-same-origin allow-scripts"
              onLoad={onIframeLoad}
            />
          </div>
          {!builderReady && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9aa0a6",
                pointerEvents: "none",
              }}
            >
              Loading editor…
            </div>
          )}
        </main>

        {/* Right: content props + design panel */}
        <aside className="goke-properties">
          <div className="goke-properties-header">
            <h2>{selectedComponent?.name || "Properties"}</h2>
            {selectedElement && (
              <div className="goke-device-switch" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className={rightTab === "content" ? "active" : ""}
                  onClick={() => setRightTab("content")}
                >
                  Content
                </button>
                <button
                  type="button"
                  className={rightTab === "design" ? "active" : ""}
                  onClick={() => setRightTab("design")}
                >
                  Design
                </button>
              </div>
            )}
          </div>
          <div className="goke-properties-body">
            {!selectedElement ? (
              <p className="goke-properties-empty">
                Select an element on the canvas
              </p>
            ) : rightTab === "content" ? (
              <PropertiesPanel
                embedded
                element={selectedElement}
                component={selectedComponent}
                onUpdate={updateProperty}
              />
            ) : (
              <StylePanel
                element={selectedElement}
                breakpoint={device}
                onChange={() => setSaved(false)}
              />
            )}
          </div>
        </aside>
      </div>

      <ContextToolbar
        element={selectedElement}
        iframe={iframeRef.current}
        onDuplicate={() => builderRef.current?.duplicateNode()}
        onDelete={() => builderRef.current?.deleteNode()}
        onMoveUp={() => builderRef.current?.moveNode(undefined, "up")}
        onMoveDown={() => builderRef.current?.moveNode(undefined, "down")}
      />

      {phase === "modal" && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h2 style={s.modalHeading}>Go live</h2>
            <p style={s.modalSub}>
              Pick a subdomain and email. You&apos;ll pay on the next screen,
              then we&apos;ll publish your site.
            </p>
            <label style={s.fieldLabel}>
              Subdomain
              <div style={s.usernameRow}>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourname"
                  style={s.usernameInput}
                />
                <span style={s.usernameSuffix}>.vercel.app</span>
              </div>
            </label>
            <label style={{ ...s.fieldLabel, marginTop: 12 }}>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={s.emailInput}
              />
            </label>
            {error && <p style={s.error}>{error}</p>}
            <div style={s.modalActions}>
              <button
                type="button"
                style={s.button}
                onClick={() => {
                  setError(null);
                  setPhase("editing");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                style={s.primaryButton}
                onClick={confirmPayment}
              >
                Continue to payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10050,
  },
  modal: {
    background: "#171717",
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    padding: 28,
    width: 360,
  },
  modalHeading: {
    color: "#f5f5f5",
    fontSize: 18,
    fontWeight: 500,
    margin: "0 0 8px",
  },
  modalSub: { color: "#a3a3a3", fontSize: 13, margin: "0 0 16px" },
  fieldLabel: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "#a3a3a3",
    fontSize: 12,
  },
  emailInput: {
    width: "100%",
    background: "#0d0d0d",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#f5f5f5",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  usernameRow: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    overflow: "hidden",
  },
  usernameInput: {
    flex: 1,
    background: "#0d0d0d",
    border: "none",
    padding: "10px 12px",
    color: "#f5f5f5",
    fontSize: 14,
    outline: "none",
  },
  usernameSuffix: { color: "#6b6b6b", fontSize: 13, padding: "0 12px" },
  error: { color: "#f87171", fontSize: 13, margin: "8px 0 0" },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 20,
  },
  button: {
    background: "transparent",
    color: "#d4d4d4",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
  },
  primaryButton: {
    background: "#22c55e",
    color: "#052e12",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
};
