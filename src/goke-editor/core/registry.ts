/**
 * Component Registry – pure TypeScript
 * No Bootstrap. Register your own gòke components here.
 */

import type { ComponentDefinition } from "../types";

export class ComponentRegistry {
  private components = new Map<string, ComponentDefinition>();
  private categories = new Map<string, string[]>();

  register(def: ComponentDefinition): void {
    this.components.set(def.type, def);
    const list = this.categories.get(def.category) ?? [];
    if (!list.includes(def.type)) {
      list.push(def.type);
      this.categories.set(def.category, list);
    }
  }

  registerMany(defs: ComponentDefinition[]): void {
    defs.forEach((d) => this.register(d));
  }

  get(type: string): ComponentDefinition | undefined {
    return this.components.get(type);
  }

  getAll(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  getByCategory(category: string): ComponentDefinition[] {
    const types = this.categories.get(category) ?? [];
    return types
      .map((t) => this.components.get(t))
      .filter(Boolean) as ComponentDefinition[];
  }

  /**
   * Match a DOM node to the most specific registered component.
   * Order: attributes → exact classes → tag names → class regex
   */
  matchNode(node: HTMLElement): ComponentDefinition | null {
    const all = this.getAll();

    // Prefer data-goke="heading|text|image|button|…" → component type
    const goke = node.getAttribute("data-goke");
    if (goke) {
      const candidates = [
        `content/${goke}`,
        `layout/${goke}`,
        `form/${goke}`,
        `media/${goke}`,
        `business/${goke}`,
        goke,
      ];
      for (const type of candidates) {
        const hit = this.components.get(type);
        if (hit) return hit;
      }
    }

    for (const comp of all) {
      if (comp.attributes?.length) {
        for (const attr of comp.attributes) {
          // Skip bare "data-goke" — handled above by value
          if (attr === "data-goke") continue;
          if (node.hasAttribute(attr)) return comp;
        }
      }
    }

    for (const comp of all) {
      if (comp.classes?.length) {
        for (const cls of comp.classes) {
          if (node.classList.contains(cls)) return comp;
        }
      }
    }

    for (const comp of all) {
      if (comp.tags?.length) {
        const tag = node.tagName.toLowerCase();
        if (comp.tags.includes(tag)) return comp;
      }
    }

    for (const comp of all) {
      if (comp.classesRegex?.length) {
        for (const re of comp.classesRegex) {
          for (const cls of Array.from(node.classList)) {
            if (new RegExp(re).test(cls)) return comp;
          }
        }
      }
    }

    return null;
  }
}

export const registry = new ComponentRegistry();
export default registry;
