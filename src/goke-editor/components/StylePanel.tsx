/**
 * Elementor-style grouped design controls (layout, spacing, type, bg, border)
 * Driven by the active breakpoint.
 */

"use client";

import React, { useMemo } from "react";
import {
  STYLE_GROUPS,
  getStyle,
  setStyle,
  type StyleGroupId,
} from "../core/style-engine";
import type { Breakpoint } from "../types/document";
import { PropertyField } from "./PropertyField";
import type { ComponentProperty } from "../types";

interface StylePanelProps {
  element: HTMLElement | null;
  breakpoint: Breakpoint;
  onChange: () => void;
}

const GROUP_ORDER: StyleGroupId[] = [
  "layout",
  "spacing",
  "typography",
  "background",
  "border",
];

export function StylePanel({
  element,
  breakpoint,
  onChange,
}: StylePanelProps) {
  const values = useMemo(() => {
    if (!element) return {} as Record<string, string>;
    const map: Record<string, string> = {};
    for (const gid of GROUP_ORDER) {
      for (const c of STYLE_GROUPS[gid].controls) {
        map[c.cssProperty] = getStyle(element, c.cssProperty, breakpoint);
      }
    }
    return map;
  }, [element, breakpoint]);

  if (!element) return null;

  function handleChange(cssProperty: string, value: string | number | boolean) {
    if (!element) return;
    setStyle(element, cssProperty, String(value), breakpoint);
    onChange();
  }

  return (
    <div className="goke-style-panel">
      <div className="goke-field-section">
        <h4>Design · {breakpoint}</h4>
      </div>
      {GROUP_ORDER.map((gid) => {
        const group = STYLE_GROUPS[gid];
        return (
          <div key={gid} className="goke-style-group">
            <div className="goke-style-group-title">{group.label}</div>
            {group.controls.map((control) => {
              const prop: ComponentProperty = {
                name: control.label,
                key: control.key,
                cssProperty: control.cssProperty,
                inputType: control.inputType as ComponentProperty["inputType"],
                options: control.options,
                units: control.units,
              };
              return (
                <PropertyField
                  key={control.cssProperty}
                  property={prop}
                  value={values[control.cssProperty] ?? ""}
                  onChange={(val) => handleChange(control.cssProperty, val)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default StylePanel;
