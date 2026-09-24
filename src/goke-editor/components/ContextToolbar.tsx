/**
 * Floating context toolbar on the selected element
 * Duplicate · Delete · Move up/down
 */

"use client";

import React, { useEffect, useState } from "react";

interface ContextToolbarProps {
  element: HTMLElement | null;
  iframe: HTMLIFrameElement | null;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function ContextToolbar({
  element,
  iframe,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: ContextToolbarProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!element || !iframe) {
      setPos(null);
      return;
    }
    const update = () => {
      const iframeRect = iframe.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      setPos({
        top: iframeRect.top + rect.top + window.scrollY - 36,
        left: iframeRect.left + rect.left + window.scrollX,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [element, iframe]);

  if (!pos || !element) return null;

  return (
    <div
      className="goke-context-toolbar"
      style={{ top: pos.top, left: pos.left }}
    >
      <button type="button" title="Move up" onClick={onMoveUp}>
        ↑
      </button>
      <button type="button" title="Move down" onClick={onMoveDown}>
        ↓
      </button>
      <button type="button" title="Duplicate" onClick={onDuplicate}>
        Duplicate
      </button>
      <button
        type="button"
        title="Delete"
        className="goke-ctx-danger"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
}

export default ContextToolbar;
