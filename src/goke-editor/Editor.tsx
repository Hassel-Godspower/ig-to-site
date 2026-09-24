/**
 * Main Goke Editor – drop this into any Next.js page
 * 'use client' – all DOM / iframe logic runs on the client
 */

"use client";

import React, { useCallback } from "react";
import { useEditor } from "../hooks/useEditor";
import { Toolbar } from "./Toolbar";
import { ComponentPalette } from "./ComponentPalette";
import { PropertiesPanel } from "./PropertiesPanel";

// Side-effect: register all gòke components
import "./goke-components";

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Goke Page</title>
</head>
<body>
  <section data-goke="section" style="padding: 64px 24px;">
    <div data-goke="container" style="max-width: 1120px; margin: 0 auto;">
      <h1 data-goke="heading" style="font-size: 2.5rem; font-weight: 800; margin: 0 0 16px;">
        Welcome to Goke
      </h1>
      <p data-goke="text" style="font-size: 1.125rem; color: #4b5563; margin: 0 0 24px;">
        Drag components from the left panel onto the canvas. Click any element to edit its properties.
      </p>
      <div data-goke-empty>Drop more components here</div>
    </div>
  </section>
</body>
</html>`;

export interface GokeEditorProps {
  initialHtml?: string;
  onChange?: (html: string) => void;
  onSave?: (html: string) => void | Promise<void>;
  className?: string;
}

export default function GokeEditor({
  initialHtml = DEFAULT_HTML,
  onChange,
  onSave,
  className,
}: GokeEditorProps) {
  const {
    iframeRef,
    state,
    undo,
    redo,
    getHtml,
    startDrag,
    setDevice,
    setMode,
    updateProperty,
  } = useEditor({ initialHtml, onChange });

  const handleSave = useCallback(async () => {
    const html = getHtml();
    await onSave?.(html);
  }, [getHtml, onSave]);

  const deviceWidths: Record<string, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
  };

  return (
    <div className={`goke-editor ${className ?? ""}`}>
      <Toolbar
        canUndo={state.canUndo}
        canRedo={state.canRedo}
        device={state.device}
        mode={state.mode}
        onUndo={undo}
        onRedo={redo}
        onDevice={setDevice}
        onMode={setMode}
        onSave={handleSave}
      />

      <div className="goke-workspace">
        <ComponentPalette onDragStart={startDrag} />

        <main className="goke-canvas-wrap">
          <div
            className="goke-canvas-frame"
            style={{
              width: deviceWidths[state.device],
              maxWidth: "100%",
              margin: "0 auto",
              transition: "width 0.25s ease",
            }}
          >
            <iframe
              ref={iframeRef}
              title="Goke Canvas"
              className="goke-canvas"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </main>

        <PropertiesPanel
          element={state.selectedElement}
          component={state.selectedComponent}
          onUpdate={updateProperty}
        />
      </div>
    </div>
  );
}
