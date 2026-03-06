# Architecture

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
├── src/
│   ├── editor/                     # everything related to the editor/preview experience
│   │   ├── Editor.svelte           # code input
│   │   ├── Preview.svelte          # renders the compiled Typst output
│   │   ├── Workspace.svelte        # orchestrates Editor + Preview + resizing
│   │   └── index.ts                # public API of this module
│   │
│   ├── components/                 # generic, reusable UI components
│   │   ├── TableOfContents.svelte
│   │   ├── ResizeHandle.svelte
│   │   └── index.ts
│   │
│   ├── content/                    # code that loads/parses the content/ folder
│   │   ├── loader.ts               # reads tour.ts + markdown files at build time
│   │   ├── types.ts                # Chapter, Lesson, Locale etc.
│   │   └── index.ts
│   │
│   ├── i18n/                       # locale detection, language switching
│   │   └── index.ts
│   │
│   ├── App.svelte                  # root component, wires everything together
│   └── main.ts                     # entry point, mounts App
│
├── static/                         # copied as-is to dist/ (favicon, fonts, etc.)
├── index.html
├── package.json
└── tsconfig.json
```

- **`src/editor/index.ts`** — each feature folder exports a public API. Other parts of the app
  import from `./editor` not from `./editor/Editor.svelte` directly. This lets you refactor
  internals freely.

- **`src/content/`** vs **`content/`** — the raw content lives in `content/`, but the code that
  knows how to load and parse it lives in `src/content/`. Translators never need to open `src/`.

- **`tour.ts` per locale** — good call keeping this per language, since chapter order or
  availability might differ between translations.

- **`Workspace.svelte`** — I'd separate the layout/resize logic from the individual editor and
  preview panes. Makes each piece independently testable.

- **`static/`** — Vite (or Bun once ready) copies this folder verbatim to `dist/`, good for assets
  that shouldn't be hashed.
