"use client";

/**
 * Live site builder — Elementor-style structure + design
 * Keeps payment / deploy / save pipeline unchanged.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { Builder } from "@/src/goke-editor/core/builder";
import { decorateEditableDocument } from "@/src/goke-editor/core/decorate-editable";
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
import { GlobalsPanel } from "@/src/goke-editor/components/GlobalsPanel";
import { TemplatesPanel } from "@/src/goke-editor/components/TemplatesPanel";
import { MediaPanel } from "@/src/goke-editor/components/MediaPanel";
import { loadStarterHtml } from "@/src/goke-editor/core/load-starter";
import { loadGokeMainHtml } from "@/src/goke-editor/core/load-goke-template";
import type { StarterTemplate } from "@/src/goke-editor/data/starter-templates";
import type { GokeMainTemplate } from "@/src/goke-editor/data/goke-main-templates";
import { mergeCurrentDocIntoTemplate } from "@/src/goke-editor/core/merge-content";
import type { StarterApplyMode } from "@/src/goke-editor/components/TemplatesPanel";
import { MediaProvider } from "@/src/goke-editor/context/MediaContext";
import {
  EditorTour,
  shouldAutoStartTour,
  markTourDone,
} from "@/src/goke-editor/components/EditorTour";
import { matchSiteElement } from "@/src/goke-editor/components/site-markers";
import {
  applyBreakpointPreview,
  applyResponsiveStylesToDocument,
} from "@/src/goke-editor/core/responsive-export";
import {
  applyTokensToDocument,
  documentFromDom,
  serializeDocument,
  parseDocument,
  captureSectionTemplate,
  emptyDocument,
  readTokensFromDocument,
} from "@/src/goke-editor/core/document-io";
import {
  copyStyles,
  pasteStyles,
  hasStyleClipboard,
} from "@/src/goke-editor/core/style-clipboard";
import { generateElements } from "@/src/goke-editor/utils/dom";
import type { DesignTokens } from "@/src/goke-editor/types/document";
import { DEFAULT_TOKENS } from "@/src/goke-editor/types/document";
import { saveTemplate } from "@/lib/templateStore";

import "@/src/goke-editor/components/goke-components";
import "@/src/goke-editor/components/site-markers";
import "@/src/goke-editor/components/section-kits";
import "@/src/goke-editor/data/icons";
import "@/src/goke-editor/styles/editor.css";
import "@/src/goke-editor/styles/editor-scroll-override.css";

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
  const [customerName, setCustomerName] = useState("");
  const [siteUrl, setSiteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [builderReady, setBuilderReady] = useState(false);

  const [selectedElement, setSelectedElement] =
    useState<HTMLElement | null>(null);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentDefinition | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [device, setDevice] = useState<Breakpoint>("mobile");
  const [mobileSheet, setMobileSheet] = useState<"none" | "left" | "right">("none");
  /** Canvas frame width in px — phone-first; desktop can widen */
  const [frameWidthPx, setFrameWidthPx] = useState(390);
  type SitePage = { file: string; title: string };
  const [pages, setPages] = useState<SitePage[]>([
    { file: "index.html", title: "Home" },
  ]);
  const [currentPage, setCurrentPage] = useState("index.html");

  // Unlock whole-page scroll on mobile (html/body otherwise often overflow:hidden from app layout)
  useEffect(() => {
    document.documentElement.classList.add("goke-editor-route");
    document.body.classList.add("goke-editor-route");
    return () => {
      document.documentElement.classList.remove("goke-editor-route");
      document.body.classList.remove("goke-editor-route");
    };
  }, []);

  // Multipage manifest
  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/site/${jobId}/pages.json`);
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data?.pages) ? data.pages : [];
        if (!cancelled && list.length) {
          setPages(
            list.map((p: { file?: string; title?: string }) => ({
              file: p.file || "index.html",
              title: p.title || p.file || "Page",
            }))
          );
          const files = list.map((p: { file?: string }) => p.file).filter(Boolean);
          if (files.length && !files.includes(currentPage)) {
            setCurrentPage(files[0] as string);
          }
        }
      } catch {
        /* single-page sites ok */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  // Phone-first on small viewports
  useEffect(() => {
    const apply = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth <= 900) {
        setDevice("mobile");
        setFrameWidthPx(390);
      }
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // Page min-width tracks canvas frame so the WHOLE page can scroll horizontally
  useEffect(() => {
    const w =
      device === "desktop"
        ? frameWidthPx
        : device === "tablet"
          ? 768
          : 390;
    document.documentElement.style.setProperty(
      "--goke-page-min-width",
      `${Math.max(w + 32, window.innerWidth)}px`
    );
  }, [device, frameWidthPx]);


  const [tree, setTree] = useState<NavNode[]>([]);
  const [rightTab, setRightTab] = useState<"content" | "design" | "globals">("content");
  const [leftTab, setLeftTab] = useState<"structure" | "components" | "templates" | "media">("components");
  const [tokens, setTokens] = useState<DesignTokens>(DEFAULT_TOKENS);
  const [tplRefresh, setTplRefresh] = useState(0);
  const [canPasteStyle, setCanPasteStyle] = useState(false);
  /** Timed guidance: 'regen' at 1min, 'publish' at 3min */
  const [helpPrompt, setHelpPrompt] = useState<null | "regen" | "publish">(null);
  const [tourOpen, setTourOpen] = useState(false);


  const previewSrc = `/api/site/${jobId}/${currentPage}`;

  // Guidance popups: 1 min → redo generation; 3 min → publish help
  useEffect(() => {
    if (!jobId || phase !== "editing") return;

    const key1 = `goke-help-regen-${jobId}`;
    const key3 = `goke-help-publish-${jobId}`;

    const t1 = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem(key1)) return;
      } catch {
        /* ignore */
      }
      setHelpPrompt((cur) => (cur ? cur : "regen"));
    }, 60_000);

    const t3 = window.setTimeout(() => {
      try {
        if (sessionStorage.getItem(key3)) return;
      } catch {
        /* ignore */
      }
      setHelpPrompt("publish");
    }, 180_000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t3);
    };
  }, [jobId, phase]);



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

    // Mark all text / images / buttons so Properties panel can edit them
    try {
      const doc = iframe.contentDocument;
      if (doc) {
        decorateEditableDocument(doc);
        // Ensure generated site can scroll vertically inside the phone frame
        const html = doc.documentElement;
        const body = doc.body;
        if (html && body) {
          html.style.overflowY = "auto";
          html.style.height = "auto";
          body.style.overflowY = "auto";
          body.style.height = "auto";
          body.style.setProperty("-webkit-overflow-scrolling", "touch");
          if (!doc.getElementById("goke-scroll-style")) {
            const style = doc.createElement("style");
            style.id = "goke-scroll-style";
            style.textContent = `
              html, body {
                overflow-y: auto !important;
                height: auto !important;
                min-height: 100% !important;
                -webkit-overflow-scrolling: touch;
              }
              body::-webkit-scrollbar { width: 6px; }
              body::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.35);
                border-radius: 6px;
              }
            `;
            (doc.head || html).appendChild(style);
          }
        }
      }
    } catch {
      /* cross-origin unlikely for same-origin api iframe */
    }

    builder.on("select", ({ element }: { element: HTMLElement | null }) => {
      if (!element) {
        setSelectedElement(null);
        setSelectedComponent(null);
        return;
      }
      let component =
        matchSiteElement(element) ?? registry.matchNode(element);
      // Template elements without data-goke: map by tag / class
      if (!component) {
        const tag = element.tagName.toLowerCase();
        const cls = element.className?.toString?.() || "";
        if (
          tag === "button" ||
          /\bbtn\b|button|navbar-toggler|menu-toggle|nav-toggle/i.test(cls)
        ) {
          component = registry.get("content/button") ?? null;
        } else if (tag === "a") {
          component =
            /\bbtn\b|button|cta/i.test(cls)
              ? registry.get("content/button") ?? null
              : registry.get("content/link") ?? null;
        } else if (tag === "img" || tag === "video") {
          component = registry.get("content/image") ?? null;
        } else if (/^h[1-6]$/.test(tag)) {
          component = registry.get("content/heading") ?? null;
        } else if (tag === "p" || tag === "span" || tag === "li" || tag === "label") {
          component = registry.get("content/text") ?? null;
        } else if (tag === "input") {
          component = registry.get("form/input") ?? null;
        } else if (tag === "textarea") {
          component = registry.get("form/textarea") ?? null;
        } else if (tag === "form") {
          component = registry.get("form/form") ?? null;
        } else if (tag === "nav" || tag === "header" || tag === "footer") {
          component = registry.get("layout/container") ?? null;
        }
        // Mark so future selects are faster
        if (component && !element.getAttribute("data-goke")) {
          const goke = component.type.split("/")[1] || "text";
          element.setAttribute("data-goke", goke);
        }
      }
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

    // Load editor.json tokens if present
    try {
      const res = await fetch(`/api/site/${jobId}/editor.json`);
      if (res.ok) {
        const raw = await res.text();
        const parsed = parseDocument(raw);
        if (parsed?.tokens) {
          setTokens(parsed.tokens);
          applyTokensToDocument(iframe.contentDocument!, parsed.tokens);
        }
      } else if (iframe.contentDocument) {
        const fromDom = readTokensFromDocument(iframe.contentDocument);
        setTokens(fromDom);
        applyTokensToDocument(iframe.contentDocument, fromDom);
      }
    } catch {
      if (iframe.contentDocument) {
        applyTokensToDocument(iframe.contentDocument, DEFAULT_TOKENS);
      }
    }

    setBuilderReady(true);
      if (jobId && shouldAutoStartTour(jobId)) {
        window.setTimeout(() => setTourOpen(true), 800);
      }
    refreshTree();
  }, [refreshTree, jobId]);

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
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        if (editingText) return;
        e.preventDefault();
        handleCopyStyle();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "v") {
        if (editingText) return;
        e.preventDefault();
        handlePasteStyle();
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

  async function switchPage(file: string) {
    if (file === currentPage) return;
    try {
      // Persist current page before leaving
      if (builderRef.current && iframeRef.current?.contentDocument) {
        await saveEdits();
      }
    } catch {
      /* still switch */
    }
    setCurrentPage(file);
    setSelectedElement(null);
    setSelectedComponent(null);
    setBuilderReady(false);
  }

  async function saveEdits() {
    const builder = builderRef.current;
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    // Ensure responsive + hover CSS is baked into the HTML
    applyResponsiveStylesToDocument(doc);
    const html =
      builder?.getHtml() ||
      "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;

    await fetch(`/api/site/${jobId}/${currentPage}`, {
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


    // Tier 3: persist editor.json (tokens + tree snapshot)
    try {
      const gdoc = documentFromDom(doc, jobId);
      gdoc.tokens = tokens;
      await fetch(`/api/site/${jobId}/editor.json`, {
        method: "PUT",
        body: serializeDocument(gdoc),
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      /* non-fatal */
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


  function handleTokensChange(next: DesignTokens) {
    setTokens(next);
    const doc = iframeRef.current?.contentDocument;
    if (doc) applyTokensToDocument(doc, next);
    setSaved(false);
  }

  function handleCopyStyle() {
    if (!selectedElement) return;
    copyStyles(selectedElement);
    setCanPasteStyle(true);
  }

  function handlePasteStyle() {
    if (!selectedElement) return;
    if (pasteStyles(selectedElement)) {
      setSaved(false);
    }
  }

  function handleSaveTemplate() {
    if (!selectedElement) return;
    const name = window.prompt("Template name", "My section");
    if (!name) return;
    const tpl = captureSectionTemplate(selectedElement, name.trim());
    saveTemplate(tpl);
    setTplRefresh((n) => n + 1);
    setLeftTab("templates");
  }

  function insertTemplateHtml(html: string) {
    const builder = builderRef.current;
    const doc = iframeRef.current?.contentDocument;
    if (!builder || !doc?.body) return;
    const nodes = generateElements(html);
    const node = nodes[0];
    if (!node) return;
    doc.body.appendChild(node);
    builder.selectNode(node);
    setSaved(false);
    refreshTree();
  }

  async function handleApplyStarter(
    starter: StarterTemplate,
    mode: StarterApplyMode = "merge"
  ) {
    const builder = builderRef.current;
    const iframe = iframeRef.current;
    if (!builder || !iframe) throw new Error("Editor not ready");

    const { html: templateHtml } = await loadStarterHtml(starter);
    let html = templateHtml;

    if (mode === "merge") {
      const doc = iframe.contentDocument;
      if (doc?.body) {
        html = mergeCurrentDocIntoTemplate(doc, templateHtml);
      }
    } else {
      const ok = window.confirm(
        `Replace the current page with "${starter.name}"? Your current layout will be lost (content is not merged).`
      );
      if (!ok) return;
    }

    builder.setHtml(html);
    const doc = iframe.contentDocument;
    if (doc) applyTokensToDocument(doc, tokens);
    setSaved(false);
    refreshTree();
    setSelectedElement(null);
    setSelectedComponent(null);
  }


  async function handleApplyGokeMain(
    template: GokeMainTemplate,
    mode: StarterApplyMode = "merge"
  ) {
    const builder = builderRef.current;
    const iframe = iframeRef.current;
    if (!builder || !iframe) throw new Error("Editor not ready");

    const { html: templateHtml } = await loadGokeMainHtml(template);
    let html = templateHtml;

    if (mode === "merge") {
      const doc = iframe.contentDocument;
      if (doc?.body) {
        html = mergeCurrentDocIntoTemplate(doc, templateHtml);
      }
    } else {
      const ok = window.confirm(
        `Replace the current page with "${template.name}"? Your current layout will be lost (content is not merged).`
      );
      if (!ok) return;
    }

    builder.setHtml(html);
    const doc = iframe.contentDocument;
    if (doc) applyTokensToDocument(doc, tokens);
    setSaved(false);
    refreshTree();
    setSelectedElement(null);
    setSelectedComponent(null);
  }



  function dismissHelp(kind: "regen" | "publish") {
    try {
      sessionStorage.setItem(
        kind === "regen" ? `goke-help-regen-${jobId}` : `goke-help-publish-${jobId}`,
        "1"
      );
    } catch {
      /* ignore */
    }
    setHelpPrompt(null);
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
        customerName: customerName.trim(),
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

  function onFrameResizePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    const startX = e.clientX;
    const startW = frameWidthPx;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      setFrameWidthPx(Math.min(1440, Math.max(320, startW + dx)));
      setDevice("desktop");
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  const frameWidthStyle =
    device === "desktop"
      ? `${frameWidthPx}px`
      : device === "tablet"
        ? "768px"
        : "390px";


  return (
    <MediaProvider jobId={jobId}>
    <div className="goke-editor" style={{ minHeight: "100vh", height: "auto" }}>
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
                onClick={() => {
                  setDevice(id);
                  if (id === "desktop") setFrameWidthPx(1200);
                  else if (id === "tablet") setFrameWidthPx(768);
                  else setFrameWidthPx(390);
                }}
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
              <button
                type="button"
                title="Editor tour"
                onClick={() => setTourOpen(true)}
              >
                Guide
              </button>
              <button type="button" onClick={saveEdits} disabled={saved}>
                {saved ? "Saved" : "Save changes"}
              </button>
              <button
                type="button"
                className="goke-btn-primary"
                data-tour="tour-go-live"
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

      <div className="goke-frame-width-bar" aria-label="Canvas width">
        <span>Frame</span>
        <input
          type="range"
          min={320}
          max={1440}
          step={10}
          value={frameWidthPx}
          onChange={(e) => {
            setFrameWidthPx(Number(e.target.value));
            setDevice("desktop");
          }}
        />
        <span>{frameWidthPx}px</span>
        <button
          type="button"
          onClick={() => {
            setDevice("desktop");
            setFrameWidthPx(1200);
          }}
        >
          Desktop
        </button>
        <button
          type="button"
          onClick={() => {
            setDevice("tablet");
            setFrameWidthPx(768);
          }}
        >
          Tablet
        </button>
        <button
          type="button"
          onClick={() => {
            setDevice("mobile");
            setFrameWidthPx(390);
          }}
        >
          Phone
        </button>
      </div>
      <div
        className={`goke-panel-backdrop${mobileSheet !== "none" ? " is-visible" : ""}`}
        onClick={() => setMobileSheet("none")}
        aria-hidden={mobileSheet === "none"}
      />
      {/* Multipage switcher — always visible, horizontal scroll on mobile */}
      <div className="goke-page-tabs" role="tablist" aria-label="Site pages">
        {pages.map((p) => (
          <button
            key={p.file}
            type="button"
            role="tab"
            aria-selected={currentPage === p.file}
            className={currentPage === p.file ? "active" : ""}
            onClick={() => void switchPage(p.file)}
          >
            {p.title}
          </button>
        ))}
      </div>
      <div className="goke-workspace">
        {/* Left: structure + components */}
        <div className={`goke-left-stack${mobileSheet === "left" ? " goke-sheet-open" : ""}`} style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
          <div className="goke-left-tabs">
            <button
              type="button"
              data-tour="tour-structure-tab"
              className={leftTab === "structure" ? "active" : ""}
              onClick={() => setLeftTab("structure")}
            >
              Structure
            </button>
            <button
              type="button"
              data-tour="tour-components-tab"
              className={leftTab === "components" ? "active" : ""}
              onClick={() => setLeftTab("components")}
            >
              Components
            </button>
            <button
              type="button"
              data-tour="tour-templates-tab"
              className={leftTab === "templates" ? "active" : ""}
              onClick={() => setLeftTab("templates")}
            >
              Templates
            </button>
            <button
              type="button"
              data-tour="tour-media-tab"
              className={leftTab === "media" ? "active" : ""}
              onClick={() => setLeftTab("media")}
            >
              Media
            </button>
          </div>
          {leftTab === "structure" && (
            <Navigator
              tree={tree}
              selectedElement={selectedElement}
              onSelect={(el) => builderRef.current?.selectNode(el)}
            />
          )}
          {leftTab === "components" && (
            <div
              data-tour="tour-components-panel"
              style={{
                flex: "1 1 auto",
                minHeight: 0,
                height: "100%",
                maxHeight: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <ComponentPalette onDragStart={startDrag} />
            </div>
          )}
          {leftTab === "templates" && (
            <div data-tour="tour-templates-panel" style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <TemplatesPanel
              onInsert={insertTemplateHtml}
              onApplyStarter={handleApplyStarter}
              onApplyGokeMain={handleApplyGokeMain}
              refreshKey={tplRefresh}
            />
            </div>
          )}
          {leftTab === "media" && (
            <MediaPanel
              onPick={(url) => {
                const el = selectedElement;
                const b = builderRef.current;
                if (el && (el.tagName === "IMG" || el.tagName === "VIDEO" || el.tagName === "SOURCE")) {
                  el.setAttribute("src", url);
                  if (el.tagName === "IMG") el.setAttribute("data-goke", "image");
                  setSaved(false);
                  return;
                }
                // Insert new image into canvas body
                if (b) {
                  const body = b.frameBody;
                  if (body) {
                    const node = b.dropComponent("content/image", body, "inside");
                    if (node) {
                      const img =
                        node.tagName === "IMG"
                          ? node
                          : node.querySelector("img");
                      if (img) img.setAttribute("src", url);
                      setSaved(false);
                      return;
                    }
                  }
                }
                window.alert("Media saved in library. Select an image on the canvas, then click a thumbnail to apply it.");
              }}
            />
          )}
        </div>

        {/* Center: canvas */}
        <main className="goke-canvas-wrap" data-tour="tour-canvas" style={{ position: "relative" }}>
          <div
            className="goke-canvas-frame"
            style={{
              width: frameWidthStyle,
              maxWidth: "none",
              margin: "0 auto",
              transition: "width 0.15s ease",
            }}
          >
            <div
              className="goke-frame-resize"
              onPointerDown={onFrameResizePointerDown}
              title="Drag to resize width"
              role="separator"
              aria-orientation="vertical"
            />
            <iframe
              ref={iframeRef}
              title="Site preview"
              key={previewSrc}
              src={previewSrc}
              className="goke-canvas"
              scrolling="yes"
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
        <aside
          className={`goke-properties${mobileSheet === "right" ? " goke-sheet-open" : ""}`}
          data-tour="tour-properties"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <div className="goke-properties-header" style={{ flexShrink: 0 }}>
            <h2>{selectedComponent?.name || "Properties"}</h2>
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
              <button
                type="button"
                className={rightTab === "globals" ? "active" : ""}
                onClick={() => setRightTab("globals")}
              >
                Globals
              </button>
            </div>
          </div>
          <div
            className="goke-properties-body"
            style={{
              flex: "1 1 auto",
              minHeight: 0,
              overflowY: "scroll",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
              maxHeight: "calc(100vh - 160px)",
              paddingBottom: 28,
            }}
          >
            {rightTab === "globals" ? (
              <GlobalsPanel tokens={tokens} onChange={handleTokensChange} />
            ) : !selectedElement ? (
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
        onCopyStyle={handleCopyStyle}
        onPasteStyle={handlePasteStyle}
        onSaveTemplate={handleSaveTemplate}
        canPasteStyle={canPasteStyle || hasStyleClipboard()}
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
              Your name
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ada Okafor"
                style={s.emailInput}
              />
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

      {/* Timed help: 1 minute — redo generation */}
      {helpPrompt === "regen" && phase === "editing" && (
        <div style={s.overlay} role="dialog" aria-modal="true" aria-labelledby="goke-help-regen-title">
          <div style={{ ...s.modal, width: 400 }}>
            <h2 id="goke-help-regen-title" style={s.modalHeading}>
              Not quite what you expected?
            </h2>
            <p style={s.modalSub}>
              You&apos;ve been editing for a minute. If this site isn&apos;t matching your brand,
              you can run generation again with the same or a fresh Instagram export.
            </p>
            <div style={s.modalActions}>
              <button
                type="button"
                style={s.button}
                onClick={() => dismissHelp("regen")}
              >
                Keep editing
              </button>
              <a
                href="/"
                style={{ ...s.primaryButton, textDecoration: "none", display: "inline-block" }}
                onClick={() => dismissHelp("regen")}
              >
                Redo generation
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Timed help: 3 minutes — publish / we take it from here */}
      {helpPrompt === "publish" && phase === "editing" && (
        <div style={s.overlay} role="dialog" aria-modal="true" aria-labelledby="goke-help-publish-title">
          <div style={{ ...s.modal, width: 420 }}>
            <h2 id="goke-help-publish-title" style={s.modalHeading}>
              Hi there — stuck on design ideas?
            </h2>
            <p style={s.modalSub}>
              Proceed to publish (Go live) and we will take it up from there. You can keep polishing
              after payment, or let us help finish the site once it&apos;s live.
            </p>
            <div style={s.modalActions}>
              <button
                type="button"
                style={s.button}
                onClick={() => dismissHelp("publish")}
              >
                Keep editing
              </button>
              <button
                type="button"
                style={s.primaryButton}
                onClick={() => {
                  dismissHelp("publish");
                  void goLive();
                }}
              >
                Go live
              </button>
            </div>
          </div>
        </div>
      )}

      
      <nav className="goke-mobile-nav" aria-label="Editor panels">
        <button
          type="button"
          className={mobileSheet === "left" ? "active" : ""}
          onClick={() => setMobileSheet((s) => (s === "left" ? "none" : "left"))}
        >
          <span className="ico">☰</span>
          Layers
        </button>
        <button
          type="button"
          className={mobileSheet === "none" ? "active" : ""}
          onClick={() => setMobileSheet("none")}
        >
          <span className="ico">▢</span>
          Canvas
        </button>
        <button
          type="button"
          className={mobileSheet === "right" ? "active" : ""}
          onClick={() => setMobileSheet((s) => (s === "right" ? "none" : "right"))}
        >
          <span className="ico">✎</span>
          Edit
        </button>
      </nav>

      <EditorTour
        open={tourOpen && phase === "editing"}
        onClose={() => {
          setTourOpen(false);
          if (jobId) markTourDone(jobId);
        }}
        onLeftTab={(tab) => {
          if (tab) setLeftTab(tab);
        }}
      />

    </MediaProvider>
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
