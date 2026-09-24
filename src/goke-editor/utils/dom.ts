/**
 * DOM helpers – pure TypeScript
 */

export function generateElements(html: string): HTMLElement[] {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return Array.from(template.content.children) as HTMLElement[];
}

export function offset(el: HTMLElement): { top: number; left: number } {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
}

export function isElement(obj: unknown): obj is HTMLElement {
  return (
    obj instanceof HTMLElement ||
    (typeof obj === "object" &&
      obj !== null &&
      (obj as Node).nodeType === 1)
  );
}

export function delay<T extends (...args: any[]) => void>(
  fn: T,
  ms = 0
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Deep clone a node without event listeners */
export function cloneNodeDeep(node: HTMLElement): HTMLElement {
  return node.cloneNode(true) as HTMLElement;
}

/** Walk up the tree until a matching selector or body */
export function closest(
  el: HTMLElement | null,
  selector: string
): HTMLElement | null {
  while (el && el !== document.body) {
    if (el.matches?.(selector)) return el;
    el = el.parentElement;
  }
  return null;
}
