# Tour of Typst — Implementation Plan & Architecture

## Folder Structure

```
tour-of-typst/
├── content/                        # pure content, no code — translators only touch this
│   ├── de/
│   │   ├── 00-welcome/
│   │   │   └── index.md
│   │   ├── 03-hello-world/
│   │   │   ├── index.md
│   │   │   ├── solution.typ
│   │   │   └── template.typ
│   │   └── tour.ts                 # ordered list of chapters + metadata for this locale
│   ├── en/
│   └── fr/
│
├── public/                         # static assets served as-is (fonts, images, wasm)
│   ├── ost-logo.svg
│   └── fonts/
│
├── src/
│   ├── components/                 # generic reusable UI components
│   │   ├── Header.svelte
│   │   ├── Dropdown.svelte
│   │   ├── TableOfContents.svelte
│   │   └── ResizeHandle.svelte
│   │
│   ├── editor/                     # editor/preview experience
│   │   ├── Editor.svelte
│   │   ├── Preview.svelte
│   │   └── Workspace.svelte
│   │
│   ├── content/                    # code that loads/parses the content/ folder
│   │   ├── loader.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── i18n/                       # locale detection, language switching
│   │   └── index.ts
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.svelte
│   └── main.ts
│
├── index.html
├── package.json
└── tsconfig.json
```

## Component Tree

```
App
├── Header
│   ├── Dropdown (theme)
│   └── Dropdown (language)
├── TableOfContents (floating panel, conditionally shown)
└── layout
    ├── left panel (lesson markdown content)
    └── Workspace
        ├── Editor
        ├── ResizeHandle
        └── Preview
```

## Layout

- Top header bar, full width, fixed height (`3rem`)
- Two-column grid below: left = lesson content, right = editor + preview
- Editor and preview stacked vertically in right column, each taking 50% height
- ResizeHandle between left/right panels and between editor/preview for draggable resizing

## Header

- **Left**: TOC button, "Tour of Typst" title
- **Right**: language dropdown, theme dropdown, OST logo (links to ost.ch)

## Table of Contents

- Triggered by TOC button in header
  - Shows ordered chapter list with active chapter highlighted
- Closes on `Escape` or click outside

## Theme System

- Three modes: `auto`, `light`, `dark`
- `auto` reads `prefers-color-scheme` from the OS via `window.matchMedia`
- Manual override stored in `localStorage`
- Applied via `data-theme` attribute on `document.documentElement`
- CSS variables defined in `global.css` under `:root` (light) and `[data-theme="dark"]`
