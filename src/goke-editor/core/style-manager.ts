/**
 * StyleManager – read / write CSS on elements inside the canvas iframe
 */

import { Undo } from "./undo";
import type { UndoMutation } from "../types";

export class StyleManager {
  private doc: Document | null = null;

  setDocument(doc: Document): void {
    this.doc = doc;
  }

  getStyle(
    element: HTMLElement,
    property: string,
    declaredOnly = false
  ): string {
    if (!element) return "";

    if (declaredOnly) {
      const inline = element.style.getPropertyValue(property);
      if (inline) return inline;

      const sheets = this.doc?.styleSheets ?? [];
      for (const sheet of Array.from(sheets)) {
        try {
          const rules = sheet.cssRules;
          if (!rules) continue;
          for (const rule of Array.from(rules) as CSSStyleRule[]) {
            if (rule.style && element.matches(rule.selectorText)) {
              const val = rule.style.getPropertyValue(property);
              if (val) return val;
            }
          }
        } catch {
          // cross-origin stylesheet
        }
      }
      return "";
    }

    return getComputedStyle(element).getPropertyValue(property).trim();
  }

  setStyle(
    element: HTMLElement,
    property: string,
    value: string,
    recordUndo = true
  ): void {
    if (!element) return;

    const oldValue = element.style.getPropertyValue(property);

    if (value == null || value === "") {
      element.style.removeProperty(property);
    } else {
      element.style.setProperty(property, value);
    }

    if (recordUndo && oldValue !== value) {
      const mutation: UndoMutation = {
        type: "style",
        target: element,
        styleName: property,
        oldValue,
        newValue: value,
      };
      Undo.addMutation(mutation);
    }
  }

  setStyles(
    element: HTMLElement,
    styles: Record<string, string>,
    recordUndo = true
  ): void {
    for (const [prop, val] of Object.entries(styles)) {
      this.setStyle(element, prop, val, recordUndo);
    }
  }

  removeStyle(
    element: HTMLElement,
    property: string,
    recordUndo = true
  ): void {
    this.setStyle(element, property, "", recordUndo);
  }
}

export const styleManager = new StyleManager();
export default styleManager;
