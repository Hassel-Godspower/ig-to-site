/**
 * Core Builder engine – pure TypeScript / Next.js
 * Manages the iframe canvas, selection, drag & drop, HTML get/set
 */

import { Undo } from "./undo";
import { registry } from "./registry";
import { styleManager } from "./style-manager";
import { generateElements, delay } from "../utils/dom";
import type { BuilderOptions, ComponentDefinition } from "../types";

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

    // Allow dropping components
    this.frameBody.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = "copy";
    });

    this.frameBody.addEventListener("drop", (e) => {
      e.preventDefault();
      const type = e.dataTransfer?.getData("text/goke-component");
      if (!type) return;
      const target = e.target as HTMLElement;
      this.dropComponent(type, target, "inside");
    });
  }

  private injectBaseStyles(): void {
    if (!this.frameHead) return;
    // Minimal reset so the canvas looks clean without Bootstrap
    const style = this.frameDoc!.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        line-height: 1.5;
        color: #111;
        background: #fff;
      }
      img { max-width: 100%; height: auto; display: block; }
      a { color: inherit; }
      [data-goke-empty] {
        min-height: 80px;
        border: 2px dashed #d1d5db;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
        font-size: 14px;
      }
    `;
    this.frameHead.appendChild(style);
  }

  // ── Drag & drop ────────────────────────────────

  startDrag(componentType: string, event: DragEvent): void {
    const component = registry.get(componentType);
    if (!component) return;

    this.isDragging = true;
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

    if (position === "before") {
      target.parentNode?.insertBefore(node, target);
    } else if (position === "after") {
      target.parentNode?.insertBefore(node, target.nextSibling);
    } else {
      // If target has data-goke-empty, replace it
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
    return node;
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
