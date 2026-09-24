/**
 * Goke Visual Editor – public API
 * Pure Next.js / TypeScript – zero Bootstrap
 */

export { default as GokeEditor } from "./components/Editor";
export type { GokeEditorProps } from "./components/Editor";

export { Builder } from "./core/builder";
export { Undo, UndoManager } from "./core/undo";
export { registry, ComponentRegistry } from "./core/registry";
export { styleManager, StyleManager } from "./core/style-manager";

export { useEditor } from "./hooks/useEditor";
export type { UseEditorOptions } from "./hooks/useEditor";

export type {
  ComponentDefinition,
  ComponentProperty,
  UndoMutation,
  EditorState,
  BuilderOptions,
  InputType,
  PropertyOption,
} from "./types";
