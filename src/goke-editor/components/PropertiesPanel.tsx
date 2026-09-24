/**
 * Right sidebar – properties of the selected element
 */

"use client";

import React, { useMemo } from "react";
import type { ComponentDefinition, ComponentProperty } from "../types";
import { styleManager } from "../core/style-manager";
import { PropertyField } from "./PropertyField";

interface PropertiesPanelProps {
  element: HTMLElement | null;
  component: ComponentDefinition | null;
  onUpdate: (
    key: string,
    value: string | number | boolean,
    property: ComponentProperty
  ) => void;
}

function readValue(
  el: HTMLElement,
  prop: ComponentProperty
): string {
  let target = el;
  if (prop.child) {
    const child = el.querySelector(prop.child) as HTMLElement | null;
    if (child) target = child;
  }

  if (prop.htmlAttr) {
    return target.getAttribute(prop.htmlAttr) ?? "";
  }
  if (prop.cssProperty) {
    return styleManager.getStyle(target, prop.cssProperty, true) ||
      styleManager.getStyle(target, prop.cssProperty) ||
      "";
  }
  if (prop.key === "text" || prop.inputType === "textarea") {
    return target.textContent ?? "";
  }
  return String(prop.defaultValue ?? "");
}

export function PropertiesPanel({
  element,
  component,
  onUpdate,
}: PropertiesPanelProps) {
  const properties = component?.properties ?? [];

  const values = useMemo(() => {
    if (!element) return {};
    const map: Record<string, string> = {};
    for (const p of properties) {
      map[p.key] = readValue(element, p);
    }
    return map;
  }, [element, properties]);

  if (!element || !component) {
    return (
      <aside className="goke-properties">
        <div className="goke-properties-header">
          <h2>Properties</h2>
        </div>
        <div className="goke-properties-empty">
          Select an element on the canvas
        </div>
      </aside>
    );
  }

  return (
    <aside className="goke-properties">
      <div className="goke-properties-header">
        <h2>{component.name}</h2>
        <span className="goke-properties-type">{component.type}</span>
      </div>
      <div className="goke-properties-body">
        {properties.length === 0 && (
          <p className="goke-properties-empty">No editable properties</p>
        )}
        {properties.map((prop) => (
          <PropertyField
            key={prop.key}
            property={prop}
            value={values[prop.key] ?? ""}
            onChange={(val) => onUpdate(prop.key, val, prop)}
          />
        ))}
      </div>
    </aside>
  );
}

export default PropertiesPanel;
