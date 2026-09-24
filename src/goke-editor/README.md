# Goke Editor

**Pure Next.js + TypeScript visual page builder.**  
Zero Bootstrap. Zero jQuery. Zero legacy Vvveb globals.

## What you get

| Feature | Implementation |
|---------|----------------|
| Canvas | Isolated iframe |
| Drag & drop components | Native HTML5 drag |
| Properties panel | Fully typed React controls |
| Undo / Redo | Mutation-based history |
| Responsive preview | Desktop / Tablet / Mobile |
| Components | Layout, Content, Business, Commerce (gòke-native) |
| Styling | Pure CSS (dark chrome) |

## Install into your Next.js project

1. Copy the entire `goke-editor` folder into your project, e.g.:

```
your-nextjs-app/
  src/
    goke-editor/     ← paste here
  app/
    editor/
      page.tsx       ← see example below
```

2. Import the CSS once (in `app/layout.tsx` or the editor page):

```tsx
import "@/goke-editor/styles/editor.css";
```

3. Create the editor page:

```tsx
// app/editor/page.tsx
"use client";

import dynamic from "next/dynamic";

const GokeEditor = dynamic(
  () => import("@/goke-editor/src/components/Editor"),
  { ssr: false }
);

export default function EditorPage() {
  return (
    <GokeEditor
      onSave={async (html) => {
        await fetch("/api/pages/save", {
          method: "POST",
          body: JSON.stringify({ html }),
        });
      }}
    />
  );
}
```

## Project structure

```
goke-editor/
├── src/
│   ├── core/
│   │   ├── builder.ts        # iframe canvas engine
│   │   ├── undo.ts           # undo/redo
│   │   ├── registry.ts       # component registry
│   │   └── style-manager.ts  # CSS get/set + undo
│   ├── components/
│   │   ├── Editor.tsx        # main UI shell
│   │   ├── Toolbar.tsx
│   │   ├── ComponentPalette.tsx
│   │   ├── PropertiesPanel.tsx
│   │   ├── PropertyField.tsx
│   │   └── goke-components.ts  # all built-in components
│   ├── hooks/
│   │   └── useEditor.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── dom.ts
│   └── index.ts
├── styles/
│   └── editor.css
├── app/editor/page.tsx       # example route
└── package.json
```

## Adding your own components

```ts
// anywhere in your app (runs once)
import { registry } from "@/goke-editor/src/core/registry";

registry.register({
  type: "business/faq",
  name: "FAQ",
  category: "Business",
  icon: "?",
  html: `<div data-goke="faq">…</div>`,
  attributes: ["data-goke"],
  properties: [
    {
      name: "Question",
      key: "question",
      inputType: "text",
      onChange(node, value) {
        node.querySelector("h3")!.textContent = String(value);
      },
    },
  ],
});
```

## Saving pages

The editor gives you the full HTML string. Store it however you like:

```ts
// app/api/pages/[id]/route.ts
export async function POST(req: Request, { params }) {
  const { html } = await req.json();
  // → Supabase, S3, filesystem, Prisma, etc.
  return Response.json({ ok: true });
}
```

## License

Apache-2.0 for the converted engine concepts.  
Your gòke components and UI are yours.
