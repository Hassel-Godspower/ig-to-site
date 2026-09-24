/**
 * React hook that owns a Builder instance
 * Use inside client components only
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Builder } from "../core/builder";
import { Undo } from "../core/undo";
import { styleManager } from "../core/style-manager";
import type { ComponentDefinition, EditorState } from "../types";

export interface UseEditorOptions {
  initialHtml?: string;
  onChange?: (html: string) => void;
}

export function useEditor(options: UseEditorOptions = {}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const builderRef = useRef<Builder | null>(null);

  const [state, setState] = useState<EditorState>({
    selectedElement: null,
    selectedComponent: null,
    canUndo: false,
    canRedo: false,
    device: "desktop",
    mode: "edit",
  });

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const builder = new Builder();
    builderRef.current = builder;

    builder.init(iframe, options.initialHtml).then(() => {
      builder.on("select", ({ element, component }) => {
        setState((s) => ({
          ...s,
          selectedElement: element,
          selectedComponent: component ?? null,
        }));
      });

      builder.on("change", () => {
        options.onChange?.(builder.getHtml());
      });
    });

    const onUndoChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setState((s) => ({
        ...s,
        canUndo: detail.canUndo,
        canRedo: detail.canRedo,
      }));
    };
    window.addEventListener("goke.undo.change", onUndoChange);

    return () => {
      window.removeEventListener("goke.undo.change", onUndoChange);
      builder.destroy();
      builderRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const undo = useCallback(() => {
    Undo.undo();
    options.onChange?.(builderRef.current?.getHtml() ?? "");
  }, [options]);

  const redo = useCallback(() => {
    Undo.redo();
    options.onChange?.(builderRef.current?.getHtml() ?? "");
  }, [options]);

  const getHtml = useCallback(() => {
    return builderRef.current?.getHtml() ?? "";
  }, []);

  const setHtml = useCallback((html: string) => {
    builderRef.current?.setHtml(html);
  }, []);

  const startDrag = useCallback((type: string, e: React.DragEvent) => {
    builderRef.current?.startDrag(type, e.nativeEvent);
  }, []);

  const setDevice = useCallback((device: EditorState["device"]) => {
    setState((s) => ({ ...s, device }));
  }, []);

  const setMode = useCallback((mode: EditorState["mode"]) => {
    setState((s) => ({ ...s, mode }));
  }, []);

  const updateProperty = useCallback(
    (
      key: string,
      value: string | number | boolean,
      property: import("../types").ComponentProperty
    ) => {
      const el = builderRef.current?.selectedEl;
      if (!el || !builderRef.current) return;

      let target = el;
      if (property.child) {
        const child = el.querySelector(property.child) as HTMLElement | null;
        if (child) target = child;
      }

      if (property.onChange) {
        const result = property.onChange(target, value);
        if (result instanceof HTMLElement) {
          builderRef.current.selectNode(result);
        }
      } else if (property.htmlAttr) {
        builderRef.current.setAttribute(
          target,
          property.htmlAttr,
          String(value)
        );
      } else if (property.cssProperty) {
        styleManager.setStyle(target, property.cssProperty, String(value));
      }

      options.onChange?.(builderRef.current.getHtml());
    },
    [options]
  );

  return {
    iframeRef,
    builder: builderRef,
    state,
    undo,
    redo,
    getHtml,
    setHtml,
    startDrag,
    setDevice,
    setMode,
    updateProperty,
  };
}

export default useEditor;
