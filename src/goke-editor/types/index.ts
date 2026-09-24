/**
 * Goke Visual Editor – Type Definitions
 * Pure TypeScript, no Bootstrap, designed for Next.js App Router
 */

export type MutationType =
  | "attributes"
  | "characterData"
  | "childList"
  | "style"
  | "move";

export interface UndoMutation {
  type: MutationType;
  target: Node | HTMLElement | null;
  oldValue?: string | null;
  newValue?: string | null;
  attributeName?: string | null;
  addedNodes?: Node[];
  removedNodes?: Node[];
  previousSibling?: Node | null;
  nextSibling?: Node | null;
  parentNode?: Node | null;
  styleName?: string;
  html?: string;
  data?: Record<string, unknown>;
}

export type InputType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "color"
  | "checkbox"
  | "radio"
  | "range"
  | "image"
  | "link"
  | "css-unit"
  | "section"
  | "spacing-box";

export interface PropertyOption {
  value: string;
  label: string;
  icon?: string;
}

export interface ComponentProperty {
  name: string;
  key: string;
  /** HTML attribute to read/write, e.g. "href", "src", "class" */
  htmlAttr?: string;
  /** CSS property to read/write, e.g. "font-size", "color" */
  cssProperty?: string;
  /** Child selector relative to the selected node */
  child?: string;
  inputType: InputType;
  options?: PropertyOption[];
  placeholder?: string;
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  units?: string[];
  section?: string;
  onChange?: (node: HTMLElement, value: string | number | boolean) => HTMLElement | void;
}

export interface ComponentDefinition {
  /** Unique type id, e.g. "layout/section", "content/heading" */
  type: string;
  name: string;
  category: string;
  icon?: string;
  /** HTML snippet inserted when the component is dropped */
  html: string;
  /** Optional simpler HTML used while dragging */
  dragHtml?: string;
  /** Match rules */
  tags?: string[];
  classes?: string[];
  attributes?: string[];
  classesRegex?: string[];
  properties?: ComponentProperty[];
  resizable?: boolean;
  afterDrop?: (node: HTMLElement) => void;
  init?: (node: HTMLElement) => void;
}

export interface BuilderOptions {
  baseUrl?: string;
  canvasClassName?: string;
}

export interface EditorState {
  selectedElement: HTMLElement | null;
  selectedComponent: ComponentDefinition | null;
  canUndo: boolean;
  canRedo: boolean;
  device: "desktop" | "tablet" | "mobile";
  mode: "edit" | "preview";
}

export type DevicePreset = {
  id: "desktop" | "tablet" | "mobile";
  label: string;
  width: number | string;
};
