/**
 * Undo / Redo engine – pure TypeScript
 * Mutation-based history for the visual editor
 */

import type { UndoMutation } from "../types";

export class UndoManager {
  private mutations: UndoMutation[] = [];
  private undoIndex = -1;
  private enabled = true;
  private maxHistory = 120;

  setEnabled(value: boolean): void {
    this.enabled = value;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  addMutation(mutation: UndoMutation | MutationRecord | any): void {
    if (!this.enabled) return;

    const m = this.normalize(mutation);

    if (this.undoIndex < this.mutations.length - 1) {
      this.mutations.splice(this.undoIndex + 1);
    }

    this.mutations.push(m);
    this.undoIndex++;

    if (this.mutations.length > this.maxHistory) {
      this.mutations.shift();
      this.undoIndex--;
    }

    this.dispatchChange();
  }

  undo(): boolean {
    if (this.undoIndex < 0) return false;
    const mutation = this.mutations[this.undoIndex];
    this.applyMutation(mutation, true);
    this.undoIndex--;
    this.dispatchChange();
    return true;
  }

  redo(): boolean {
    if (this.undoIndex >= this.mutations.length - 1) return false;
    this.undoIndex++;
    const mutation = this.mutations[this.undoIndex];
    this.applyMutation(mutation, false);
    this.dispatchChange();
    return true;
  }

  canUndo(): boolean {
    return this.undoIndex >= 0;
  }

  canRedo(): boolean {
    return this.undoIndex < this.mutations.length - 1;
  }

  clear(): void {
    this.mutations = [];
    this.undoIndex = -1;
    this.dispatchChange();
  }

  getHistory(): readonly UndoMutation[] {
    return this.mutations;
  }

  getIndex(): number {
    return this.undoIndex;
  }

  private normalize(m: any): UndoMutation {
    if (m && typeof m === "object" && "type" in m) {
      return {
        type: m.type,
        target: m.target ?? null,
        oldValue: m.oldValue ?? null,
        newValue: m.newValue ?? null,
        attributeName: m.attributeName ?? null,
        addedNodes: m.addedNodes ? Array.from(m.addedNodes) : undefined,
        removedNodes: m.removedNodes ? Array.from(m.removedNodes) : undefined,
        previousSibling: m.previousSibling ?? null,
        nextSibling: m.nextSibling ?? null,
        parentNode:
          m.parentNode ?? (m.target as Node)?.parentNode ?? null,
        styleName: m.styleName,
        html: m.html,
        data: m.data,
      };
    }
    return m as UndoMutation;
  }

  private applyMutation(mutation: UndoMutation, reverse: boolean): void {
    const target = mutation.target as HTMLElement | null;

    switch (mutation.type) {
      case "attributes": {
        if (!target) return;
        const name = mutation.attributeName!;
        const value = reverse ? mutation.oldValue : mutation.newValue;
        if (value == null || value === "") {
          target.removeAttribute(name);
        } else {
          target.setAttribute(name, value);
        }
        break;
      }

      case "characterData": {
        if (!target) return;
        (target as unknown as CharacterData).data =
          (reverse ? mutation.oldValue : mutation.newValue) ?? "";
        break;
      }

      case "childList": {
        if (reverse) {
          mutation.addedNodes?.forEach((n) => n.parentNode?.removeChild(n));
          mutation.removedNodes?.forEach((n) => {
            const parent = mutation.parentNode ?? target;
            if (!parent) return;
            if (mutation.nextSibling && parent.contains(mutation.nextSibling)) {
              parent.insertBefore(n, mutation.nextSibling);
            } else if (
              mutation.previousSibling &&
              parent.contains(mutation.previousSibling)
            ) {
              parent.insertBefore(
                n,
                (mutation.previousSibling as Node).nextSibling
              );
            } else {
              parent.appendChild(n);
            }
          });
        } else {
          mutation.removedNodes?.forEach((n) => n.parentNode?.removeChild(n));
          mutation.addedNodes?.forEach((n) => {
            const parent = mutation.parentNode ?? target;
            if (!parent) return;
            if (mutation.nextSibling && parent.contains(mutation.nextSibling)) {
              parent.insertBefore(n, mutation.nextSibling);
            } else {
              parent.appendChild(n);
            }
          });
        }
        break;
      }

      case "style": {
        if (!target) return;
        const prop = mutation.styleName!;
        const value = reverse ? mutation.oldValue : mutation.newValue;
        if (value == null || value === "") {
          target.style.removeProperty(prop);
        } else {
          target.style.setProperty(prop, value);
        }
        break;
      }

      default:
        console.warn("[UndoManager] Unknown mutation type:", mutation.type);
    }
  }

  private dispatchChange(): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("goke.undo.change", {
        detail: {
          canUndo: this.canUndo(),
          canRedo: this.canRedo(),
          index: this.undoIndex,
          length: this.mutations.length,
        },
      })
    );
  }
}

/** Singleton used across the editor */
export const Undo = new UndoManager();
export default Undo;
