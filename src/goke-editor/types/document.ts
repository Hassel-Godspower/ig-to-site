/**
 * Structured document model for the live builder.
 * HTML remains the publish artifact; this is the edit-time shape.
 */

export type Breakpoint = "desktop" | "tablet" | "mobile";

export type CSSProps = Record<string, string>;

export type ResponsiveStyles = {
  desktop?: CSSProps;
  tablet?: CSSProps;
  mobile?: CSSProps;
};

export type DesignTokens = {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    muted: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
};

export type NodeKind = "section" | "container" | "widget";

export type GokeNode = {
  id: string;
  type: string;
  kind: NodeKind;
  props: Record<string, unknown>;
  styles: ResponsiveStyles;
  children?: GokeNode[];
};

export type GokeDocument = {
  version: 1;
  tokens: DesignTokens;
  tree: GokeNode[];
  meta: {
    title?: string;
    jobId?: string;
  };
};

export const DEFAULT_TOKENS: DesignTokens = {
  colors: {
    primary: "#3b82f6",
    secondary: "#1e293b",
    text: "#111827",
    muted: "#6b7280",
    background: "#ffffff",
  },
  fonts: {
    heading: "system-ui, -apple-system, sans-serif",
    body: "system-ui, -apple-system, sans-serif",
  },
};

/** Tree node for the Navigator UI (derived from live DOM) */
export type NavNode = {
  id: string;
  label: string;
  tag: string;
  depth: number;
  element: HTMLElement;
  children: NavNode[];
};
