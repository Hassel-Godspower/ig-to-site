/**
 * Goke Visual Editor – public API
 */

export { default as GokeEditor } from "./components/Editor";
export type { GokeEditorProps } from "./components/Editor";

export { Builder } from "./core/builder";
export { Undo, UndoManager } from "./core/undo";
export { registry, ComponentRegistry } from "./core/registry";
export { styleManager, StyleManager } from "./core/style-manager";
export { styleEngine } from "./core/style-engine";
export * from "./core/structure";
export {
  buildResponsiveCss,
  applyResponsiveStylesToDocument,
  applyBreakpointPreview,
} from "./core/responsive-export";
export {
  applyTokensToDocument,
  documentFromDom,
  serializeDocument,
  parseDocument,
  emptyDocument,
  captureSectionTemplate,
  readTokensFromDocument,
} from "./core/document-io";
export {
  copyStyles,
  pasteStyles,
  hasStyleClipboard,
} from "./core/style-clipboard";

export { useEditor } from "./hooks/useEditor";
export type { UseEditorOptions } from "./hooks/useEditor";

export { Navigator } from "./components/Navigator";
export { ContextToolbar } from "./components/ContextToolbar";
export { StylePanel } from "./components/StylePanel";
export { GlobalsPanel } from "./components/GlobalsPanel";
export { TemplatesPanel } from "./components/TemplatesPanel";
export { ComponentPalette } from "./components/ComponentPalette";
export { PropertiesPanel } from "./components/PropertiesPanel";

export type {
  ComponentDefinition,
  ComponentProperty,
  UndoMutation,
  EditorState,
  BuilderOptions,
  InputType,
  PropertyOption,
} from "./types";

export type {
  GokeDocument,
  GokeNode,
  DesignTokens,
  ResponsiveStyles,
  Breakpoint,
  NavNode,
  SectionTemplate,
} from "./types/document";

export {
  STARTER_TEMPLATES,
  starterCategories,
  startersByCategory,
  findStarter,
} from "./data/starter-templates";
export type { StarterTemplate } from "./data/starter-templates";
export { loadStarterHtml, bodyInnerFromHtml } from "./core/load-starter";
