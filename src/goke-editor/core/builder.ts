/**
 * Core Builder engine – pure TypeScript / Next.js
 * Manages the iframe canvas, selection, drag & drop, HTML get/set
 */

import { Undo } from "./undo";
import { registry } from "./registry";
import { styleManager } from "./style-manager";
import { generateElements, delay } from "../utils/dom";
import {
  resolveDropTarget,
  labelForElement,
  iconForElement,
  getKind,
} from "./structure";
import { applyResponsiveStylesToDocument } from "./responsive-export";
import type { BuilderOptions, ComponentDefinition } from "../types";
import type { NavNode } from "../types/document";

type Listener = (payload?: any) => void;

export class Builder {
  selectedEl: HTMLElement | null = null;
  highlightEl: HTMLElement | null = null;

  iframe: HTMLIFrameElement | null = null;
  frameDoc: Document | null = null;
  frameBody: HTMLElement | null = null;
  frameHead: HTMLHeadElement | null = null;

  private options: BuilderOptions = {};
  private highlightBox: HTMLElement | null = null;
  private selectBox: HTMLElement | null = null;
  private isDragging = false;
  private listeners: Record<string, Listener[]> = {};

  constructor(options: BuilderOptions = {}) {
    this.options = options;
  }

  // ── Lifecycle ──────────────────────────────────

  async init(
    iframe: HTMLIFrameElement,
    initialHtml?: string
  ): Promise<void> {
    this.iframe = iframe;

    await new Promise<void>((resolve) => {
      if (iframe.contentDocument?.readyState === "complete") {
        resolve();
      } else {
        iframe.addEventListener("load", () => resolve(), { once: true });
      }
    });

    this.frameDoc = iframe.contentDocument!;
    this.frameHead = this.frameDoc.head;
    this.frameBody = this.frameDoc.body;

    styleManager.setDocument(this.frameDoc);

    if (initialHtml) {
      this.setHtml(initialHtml);
    } else {
      this.injectBaseStyles();
      this.bindCanvasEvents();
    }

    this.createOverlayBoxes();
  }

  /**
   * Attach to an iframe that already has content loaded (e.g. from a URL).
   * Does NOT overwrite HTML and does NOT inject base reset styles —
   * preserves the generated site's own CSS.
   */
  async attach(iframe: HTMLIFrameElement): Promise<void> {
    this.iframe = iframe;

    await new Promise<void>((resolve) => {
      if (
        iframe.contentDocument?.readyState === "complete" &&
        iframe.contentDocument.body
      ) {
        resolve();
      } else {
        iframe.addEventListener("load", () => resolve(), { once: true });
      }
    });

    this.frameDoc = iframe.contentDocument!;
    this.frameHead = this.frameDoc.head;
    this.frameBody = this.frameDoc.body;

    styleManager.setDocument(this.frameDoc);
    this.bindCanvasEvents();
    this.createOverlayBoxes();
    this.injectEditorChrome();
  }

  /** Lightweight styles for drop targets / empty states on generated sites */
  private injectEditorChrome(): void {
    if (!this.frameHead || !this.frameDoc) return;
    if (this.frameDoc.getElementById("goke-editor-chrome")) return;
    const style = this.frameDoc.createElement("style");
    style.id = "goke-editor-chrome";
    style.textContent = `
      body { position: relative; }
      [data-goke-empty] {
        min-height: 96px;
        border: 2px dashed #cbd5e1;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #94a3b8;
        font-size: 14px;
        background: repeating-linear-gradient(
          -45deg, transparent, transparent 8px,
          rgba(148,163,184,0.08) 8px, rgba(148,163,184,0.08) 16px
        );
      }
      [data-goke-empty]:empty::before { content: "Drop a component here"; }
      .goke-drop-target {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px;
      }
    `;
    this.frameHead.appendChild(style);
  }

  setHtml(html: string): void {
    if (!this.frameDoc) return;

    this.frameDoc.open();
    this.frameDoc.write(html);
    this.frameDoc.close();

    this.frameHead = this.frameDoc.head;
    this.frameBody = this.frameDoc.body;
    styleManager.setDocument(this.frameDoc);

    this.injectBaseStyles();
    this.bindCanvasEvents();
  }

  getHtml(): string {
    if (!this.frameDoc) return "";
    // Remove editor-only UI nodes from the export
    this.frameDoc
      .querySelectorAll("[data-goke-ui]")
      .forEach((n) => n.remove());
    // Keep template CSS; drop editor chrome-only style tag
    this.frameDoc.getElementById("goke-editor-chrome")?.remove();
    this.hideDropIndicator();
    // Bake responsive + hover CSS into the document before serialize
    applyResponsiveStylesToDocument(this.frameDoc);
    return "<!DOCTYPE html>\n" + this.frameDoc.documentElement.outerHTML;
  }

  getBodyHtml(): string {
    return this.frameBody?.innerHTML ?? "";
  }

  destroy(): void {
    this.highlightBox?.remove();
    this.selectBox?.remove();
    this.listeners = {};
    this.selectedEl = null;
    this.iframe = null;
    this.frameDoc = null;
    this.frameBody = null;
  }

  // ── Selection ──────────────────────────────────

  selectNode(element: HTMLElement | null): void {
    if (
      !element ||
      element === this.frameDoc?.documentElement ||
      element === this.frameBody
    ) {
      this.selectedEl = null;
      this.hideSelectBox();
      this.emit("select", { element: null, component: null });
      return;
    }

    this.selectedEl = element;
    this.showSelectBox(element);
    const component = registry.matchNode(element);
    this.emit("select", { element, component });
  }

  highlightNode(element: HTMLElement | null): void {
    this.highlightEl = element;
    if (element) this.showHighlightBox(element);
    else this.hideHighlightBox();
  }

  // ── Overlay boxes (live outside the iframe) ────

  private createOverlayBoxes(): void {
    if (typeof document === "undefined") return;

    this.highlightBox = document.createElement("div");
    this.highlightBox.className = "goke-highlight-box";
    document.body.appendChild(this.highlightBox);

    this.selectBox = document.createElement("div");
    this.selectBox.className = "goke-select-box";
    document.body.appendChild(this.selectBox);
  }

  private positionBox(box: HTMLElement, el: HTMLElement): void {
    if (!this.iframe) return;
    const iframeRect = this.iframe.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    Object.assign(box.style, {
      display: "block",
      top: `${iframeRect.top + rect.top + window.scrollY}px`,
      left: `${iframeRect.left + rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
  }

  private showHighlightBox(el: HTMLElement): void {
    if (this.highlightBox) this.positionBox(this.highlightBox, el);
  }

  private hideHighlightBox(): void {
    if (this.highlightBox) this.highlightBox.style.display = "none";
  }

  private showSelectBox(el: HTMLElement): void {
    if (this.selectBox) this.positionBox(this.selectBox, el);
  }

  private hideSelectBox(): void {
    if (this.selectBox) this.selectBox.style.display = "none";
  }

  // ── Canvas events ──────────────────────────────

  private bindCanvasEvents(): void {
    if (!this.frameBody) return;

    this.frameBody.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.selectNode(e.target as HTMLElement);
      },
      true
    );

    // Inline text edit — double-click text nodes
    this.frameBody.addEventListener(
      "dblclick",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLElement;
        this.startInlineEdit(target);
      },
      true
    );

    this.frameBody.addEventListener(
      "mousemove",
      delay((e: MouseEvent) => {
        if (this.isDragging) return;
        const target = e.target as HTMLElement;
        if (target !== this.highlightEl) {
          this.highlightNode(target);
        }
      }, 20),
      true
    );

    this.frameBody.addEventListener("mouseleave", () => {
      this.highlightNode(null);
    });

    this.frameBody.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = "copy";
      this.isDragging = true;
      const type =
        e.dataTransfer?.types.includes("text/goke-component")
          ? "widget"
          : "widget";
      const target = e.target as HTMLElement;
      // Use last dragged type stored on instance
      const compType = this._dragType || "content/text";
      const resolved = resolveDropTarget(target, compType);
      this.showDropIndicator(resolved.parent, resolved.position, e as DragEvent);
    });

    this.frameBody.addEventListener("dragleave", (e) => {
      // Only hide when leaving the body entirely
      if (e.target === this.frameBody) this.hideDropIndicator();
    });

    this.frameBody.addEventListener("drop", (e) => {
      e.preventDefault();
      this.hideDropIndicator();
      const type =
        e.dataTransfer?.getData("text/goke-component") || this._dragType;
      if (!type) return;
      const target = e.target as HTMLElement;
      const resolved = resolveDropTarget(target, type);
      this.dropComponent(type, resolved.parent, resolved.position);
      this._dragType = null;
      this.isDragging = false;
    });
  }

  private _dragType: string | null = null;
  private dropIndicator: HTMLElement | null = null;

  private ensureDropIndicator(): HTMLElement {
    if (this.dropIndicator && this.dropIndicator.isConnected) {
      return this.dropIndicator;
    }
    const el = this.frameDoc!.createElement("div");
    el.className = "goke-drop-indicator";
    el.setAttribute("data-goke-ui", "drop-indicator");
    Object.assign(el.style, {
      position: "absolute",
      height: "4px",
      background: "#3b82f6",
      borderRadius: "2px",
      pointerEvents: "none",
      zIndex: "99999",
      boxShadow: "0 0 0 2px rgba(59,130,246,0.35)",
      transition: "top 0.05s ease, left 0.05s ease, width 0.05s ease",
    });
    this.frameBody!.appendChild(el);
    this.dropIndicator = el;
    return el;
  }

  private showDropIndicator(
    parent: HTMLElement,
    position: "before" | "after" | "inside",
    e: DragEvent
  ): void {
    if (!this.frameBody || !this.frameDoc) return;
    const ind = this.ensureDropIndicator();
    const bodyRect = this.frameBody.getBoundingClientRect();

    // Highlight drop parent
    this.frameBody
      .querySelectorAll(".goke-drop-target")
      .forEach((n) => n.classList.remove("goke-drop-target"));
    parent.classList.add("goke-drop-target");

    if (position === "inside") {
      const rect = parent.getBoundingClientRect();
      // Line at bottom of container to suggest append
      const top = rect.bottom - bodyRect.top + this.frameBody.scrollTop - 2;
      const left = rect.left - bodyRect.left + this.frameBody.scrollLeft + 8;
      const width = Math.max(rect.width - 16, 40);
      Object.assign(ind.style, {
        display: "block",
        top: top + "px",
        left: left + "px",
        width: width + "px",
      });
    } else {
      const rect = parent.getBoundingClientRect();
      const top =
        (position === "before" ? rect.top : rect.bottom) -
        bodyRect.top +
        this.frameBody.scrollTop -
        2;
      const left = rect.left - bodyRect.left + this.frameBody.scrollLeft;
      Object.assign(ind.style, {
        display: "block",
        top: top + "px",
        left: left + "px",
        width: Math.max(rect.width, 40) + "px",
      });
    }
  }

  private hideDropIndicator(): void {
    if (this.dropIndicator) this.dropIndicator.style.display = "none";
    this.frameBody
      ?.querySelectorAll(".goke-drop-target")
      .forEach((n) => n.classList.remove("goke-drop-target"));
  }


  private injectBaseStyles(): void {
    if (!this.frameHead) return;
    // Minimal reset so the canvas looks clean without Bootstrap
    const style = this.frameDoc!.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      body {
        margin: 0;
        position: relative;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        line-height: 1.5;
        color: #111;
        background: #fff;
      }
      img { max-width: 100%; height: auto; display: block; }
      a { color: inherit; }
      [data-goke-empty] {
        min-height: 96px;
        border: 2px dashed #cbd5e1;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #94a3b8;
        font-size: 14px;
        background: repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 8px,
          rgba(148,163,184,0.08) 8px,
          rgba(148,163,184,0.08) 16px
        );
      }
      [data-goke-empty]::before {
        content: "Drop a component here";
      }
      .goke-drop-target {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px;
      }
    `;
    this.frameHead.appendChild(style);
  }

  // ── Drag & drop ────────────────────────────────

  startDrag(componentType: string, event: DragEvent): void {
    const component = registry.get(componentType);
    if (!component) return;

    this.isDragging = true;
    this._dragType = componentType;
    event.dataTransfer?.setData("text/goke-component", componentType);
    event.dataTransfer!.effectAllowed = "copy";
  }

  dropComponent(
    componentType: string,
    target: HTMLElement,
    position: "before" | "after" | "inside" = "inside"
  ): HTMLElement | null {
    const component = registry.get(componentType);
    if (!component?.html) return null;

    const elements = generateElements(component.html);
    const node = elements[0];
    if (!node) return null;

    // Ensure stable id for navigator
    if (!node.id) {
      node.dataset.gokeId = `goke_${Math.random().toString(36).slice(2, 9)}`;
    }

    if (position === "before") {
      target.parentNode?.insertBefore(node, target);
    } else if (position === "after") {
      target.parentNode?.insertBefore(node, target.nextSibling);
    } else {
      if (target.hasAttribute("data-goke-empty")) {
        target.replaceWith(node);
      } else {
        target.appendChild(node);
      }
    }

    Undo.addMutation({
      type: "childList",
      target,
      addedNodes: [node],
      removedNodes: [],
      parentNode: target.parentNode ?? target,
    });

    component.afterDrop?.(node);
    component.init?.(node);

    this.selectNode(node);
    this.isDragging = false;
    this.emit("change");
    this.emit("tree");
    return node;
  }

  // ── Structure operations ───────────────────────

  duplicateNode(el: HTMLElement | null = this.selectedEl): HTMLElement | null {
    if (!el || el === this.frameBody) return null;
    const clone = el.cloneNode(true) as HTMLElement;
    clone.dataset.gokeId = `goke_${Math.random().toString(36).slice(2, 9)}`;
    el.parentNode?.insertBefore(clone, el.nextSibling);
    Undo.addMutation({
      type: "childList",
      target: el.parentElement!,
      addedNodes: [clone],
      removedNodes: [],
      parentNode: el.parentNode,
    });
    this.selectNode(clone);
    this.emit("change");
    this.emit("tree");
    return clone;
  }

  deleteNode(el: HTMLElement | null = this.selectedEl): void {
    if (!el || el === this.frameBody || el === this.frameDoc?.documentElement)
      return;
    const parent = el.parentElement;
    const next = (el.nextElementSibling ||
      el.previousElementSibling ||
      parent) as HTMLElement | null;
    Undo.addMutation({
      type: "childList",
      target: parent!,
      addedNodes: [],
      removedNodes: [el],
      parentNode: parent,
      nextSibling: el.nextSibling,
      previousSibling: el.previousSibling,
    });
    el.remove();
    this.selectNode(next && next !== this.frameBody ? next : null);
    this.emit("change");
    this.emit("tree");
  }

  moveNode(
    el: HTMLElement | null = this.selectedEl,
    direction: "up" | "down"
  ): void {
    if (!el || !el.parentNode) return;
    if (direction === "up" && el.previousElementSibling) {
      el.parentNode.insertBefore(el, el.previousElementSibling);
    } else if (direction === "down" && el.nextElementSibling) {
      el.parentNode.insertBefore(el.nextElementSibling, el);
    } else {
      return;
    }
    this.selectNode(el);
    this.emit("change");
    this.emit("tree");
  }

  /** Build navigator tree from body */
  getTree(): NavNode[] {
    if (!this.frameBody) return [];
    const walk = (parent: HTMLElement, depth: number): NavNode[] => {
      const nodes: NavNode[] = [];
      for (const child of Array.from(parent.children) as HTMLElement[]) {
        if (child.tagName === "SCRIPT" || child.tagName === "STYLE") continue;
        const kind = getKind(child);
        // Show sections, containers, and direct widgets
        if (kind === "unknown" && depth > 2) continue;
        const id =
          child.dataset.gokeId ||
          child.id ||
          `anon_${nodes.length}_${depth}`;
        if (!child.dataset.gokeId && !child.id) {
          child.dataset.gokeId = id;
        }
        nodes.push({
          id,
          label: labelForElement(child),
          tag: child.tagName.toLowerCase(),
          icon: iconForElement(child),
          depth,
          element: child,
          children: walk(child, depth + 1),
        });
      }
      return nodes;
    };
    return walk(this.frameBody, 0);
  }

  // ── Inline text editing ────────────────────────

  private inlineEl: HTMLElement | null = null;
  private inlineOriginal = "";

  startInlineEdit(el: HTMLElement): void {
    const tag = el.tagName;
    const editable = [
      "H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN", "A", "BUTTON", "LI", "LABEL",
    ].includes(tag);
    if (!editable) return;
    if (this.inlineEl) this.commitInlineEdit();

    this.inlineEl = el;
    this.inlineOriginal = el.textContent || "";
    el.contentEditable = "true";
    el.focus();
    this.selectNode(el);

    const onBlur = () => {
      el.removeEventListener("blur", onBlur);
      this.commitInlineEdit();
    };
    el.addEventListener("blur", onBlur);
  }

  commitInlineEdit(): void {
    const el = this.inlineEl;
    if (!el) return;
    el.contentEditable = "false";
    const next = el.textContent || "";
    if (next !== this.inlineOriginal) {
      Undo.addMutation({
        type: "characterData",
        target: el,
        oldValue: this.inlineOriginal,
        newValue: next,
      });
      this.emit("change");
    }
    this.inlineEl = null;
    this.inlineOriginal = "";
  }

  // ── Property updates ───────────────────────────

  setAttribute(
    element: HTMLElement,
    name: string,
    value: string,
    recordUndo = true
  ): void {
    const oldValue = element.getAttribute(name);
    if (value == null || value === "") {
      element.removeAttribute(name);
    } else {
      element.setAttribute(name, value);
    }
    if (recordUndo) {
      Undo.addMutation({
        type: "attributes",
        target: element,
        attributeName: name,
        oldValue,
        newValue: value,
      });
    }
    this.emit("change");
  }

  setText(element: HTMLElement, text: string, recordUndo = true): void {
    const oldValue = element.textContent;
    element.textContent = text;
    if (recordUndo) {
      Undo.addMutation({
        type: "characterData",
        target: element,
        oldValue,
        newValue: text,
      });
    }
    this.emit("change");
  }

  // ── Event bus ──────────────────────────────────

  on(event: string, fn: Listener): void {
    (this.listeners[event] ||= []).push(fn);
  }

  off(event: string, fn: Listener): void {
    this.listeners[event] = (this.listeners[event] || []).filter(
      (f) => f !== fn
    );
  }

  private emit(event: string, payload?: any): void {
    (this.listeners[event] || []).forEach((fn) => fn(payload));
  }
}

export default Builder;
