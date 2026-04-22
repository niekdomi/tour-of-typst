<script lang="ts">
  import { EditorView, basicSetup } from "codemirror";
  import { EditorState, Compartment, Transaction } from "@codemirror/state";
  import { keymap } from "@codemirror/view";
  import { indentWithTab } from "@codemirror/commands";
  import diagnosticCopyPlugin from "./diagnosticCopyPlugin";
  import {
    createTypstExtensions,
    createTypstShikiHighlighting,
    TypstCompiler,
    TypstProject,
    TypstRenderer,
    TypstFormatter,
  } from "@vedivad/codemirror-typst";
  import type { TypstShikiHighlighting } from "@vedivad/codemirror-typst";

  interface Props {
    doc?: string;
    template?: string;
    docKey?: string;
    solution?: string;
    auxFiles?: Record<string, string>;
    theme?: "light" | "dark";
    onchange?: (content: string) => void;
    oncompile?: (pages: string[]) => void;
  }

  let {
    doc = "",
    template = "",
    docKey = "",
    solution,
    auxFiles = {},
    theme = "light",
    onchange,
    oncompile,
  }: Props = $props();

  let editorContainer: HTMLDivElement;
  let view: EditorView | undefined = $state();
  let showingSolution = $state(false);
  let savedCode: string | undefined;
  let userScrollTop = 0;
  let solutionScrollTop = 0;
  let effectGeneration = 0;

  const highlightCompartment = new Compartment();

  let shikiHighlighting: TypstShikiHighlighting | undefined;
  // index 0 of createTypstExtensions is the built-in shiki, we replace it with our compartment
  let compilerExtensions: Awaited<ReturnType<typeof createTypstExtensions>> | undefined;
  let formatter: TypstFormatter | undefined;
  let project: TypstProject | undefined;

  async function init() {
    const renderer = TypstRenderer.create();
    formatter = TypstFormatter.create({ max_width: 80, wrap_text: true });

    // Compiler WASM load and Shiki language pack are independent — run in parallel
    const [compiler, shiki] = await Promise.all([
      TypstCompiler.create(),
      createTypstShikiHighlighting({
        themes: { light: "github-light", dark: "github-dark-dimmed" },
        defaultColor: theme,
      }),
    ]);

    shikiHighlighting = shiki;
    project = new TypstProject({ compiler, compileDebounceMs: 30, compileThrottleMs: 50 });
    project.onCompile((result) => {
      if (result.vector) {
        void renderer
          .renderSvgPages(result.vector)
          .then((pages) => oncompile?.(pages.map((p) => p.svg)));
      }
    });

    const typstExtension = await createTypstExtensions({
      project,
      highlighting: { theme: "light" },
    });
    compilerExtensions = typstExtension.slice(1);
  }

  const ready = init();

  /** Returns a CodeMirror ChangeSpec that replaces the entire document. */
  function fullDocChange(v: EditorView, content: string) {
    return { from: 0, to: v.state.doc.length, insert: content };
  }

  /** Build a fresh CodeMirror view for the given document and trigger an initial compile. */
  function createView(initialDoc: string) {
    view?.destroy();
    if (!shikiHighlighting || !compilerExtensions) {
      return;
    }

    view = new EditorView({
      parent: editorContainer,
      state: EditorState.create({
        doc: initialDoc,
        extensions: [
          keymap.of([
            indentWithTab,
            { key: "Mod-f", run: () => true },
            { key: "F3", run: () => true },
            { key: "Shift-F3", run: () => true },
            { key: "F2", run: () => true },
          ]),
          basicSetup,
          highlightCompartment.of(shikiHighlighting.getTheme(theme)),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) {
              onchange?.(u.state.doc.toString());
            }
          }),
          ...compilerExtensions,
          diagnosticCopyPlugin,
        ],
      }),
    });

    // Trigger initial compile, replace doc with itself so compiler sees docChanged
    if (initialDoc.length > 0) {
      view.dispatch({
        changes: fullDocChange(view, initialDoc),
        annotations: Transaction.addToHistory.of(false),
      });
    }
  }

  $effect(() => {
    // Destructure to read doc, docKey, and auxFiles synchronously so Svelte tracks all three.
    // docKey ensures the effect re-runs on chapter/locale change even if doc content is identical.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [initialDoc, _key, files] = [doc, docKey, auxFiles];
    const gen = ++effectGeneration;
    showingSolution = false;
    savedCode = undefined;
    // Clear container immediately so stale content from previous chapter is never visible
    // eslint-disable-next-line svelte/no-dom-manipulating, @typescript-eslint/no-unnecessary-condition
    editorContainer?.replaceChildren();
    void ready.then(async () => {
      // Skip if a newer effect has already fired (e.g. user switched chapters while init was pending)
      if (gen !== effectGeneration) return;
      await project?.clear();
      if (Object.keys(files).length > 0) await project?.setMany(files);
      createView(initialDoc);
    });

    return () => view?.destroy();
  });

  $effect(() => {
    if (view && shikiHighlighting) {
      // Reconfigure compartment + force docChanged so Shiki re-decorates existing tokens
      view.dispatch({
        effects: highlightCompartment.reconfigure(shikiHighlighting.getTheme(theme)),
        changes: fullDocChange(view, view.state.doc.toString()),
        annotations: Transaction.addToHistory.of(false),
      });
    }
  });

  /** Restore the template, clear saved solution state, and rebuild the view. */
  function reset() {
    showingSolution = false;
    savedCode = undefined;
    createView(template);
    onchange?.(template);
  }

  /** Format the current document with the Typst formatter and apply changes if different. */
  async function format() {
    if (!view || !formatter) {
      return;
    }

    const source = view.state.doc.toString();
    const formatted = await formatter.format(source);

    if (formatted !== source) {
      view.dispatch({ changes: fullDocChange(view, formatted) });
    }
  }

  /** Toggle between user code and solution, preserving user edits when showing the solution. */
  function toggleSolution() {
    if (!solution) {
      return;
    }

    if (showingSolution) {
      solutionScrollTop = view?.scrollDOM.scrollTop ?? 0;
      showingSolution = false;
      createView(savedCode ?? doc);
      savedCode = undefined;
    } else {
      userScrollTop = view?.scrollDOM.scrollTop ?? 0;
      savedCode = view?.state.doc.toString();
      showingSolution = true;
      createView(solution);
    }

    const restoreTop = showingSolution ? solutionScrollTop : userScrollTop;
    if (view) {
      const v = view;
      requestAnimationFrame(() => {
        v.scrollDOM.scrollTop = restoreTop;
      });
    }
  }
</script>

<div class="editor-wrapper">
  <div class="toolbar">
    <button class="toolbar-btn" onclick={reset} title="Reset to template">Reset</button>
    {#if solution}
      <button
        class="toolbar-btn"
        onclick={toggleSolution}
        title={showingSolution ? "Back to your code" : "Show solution"}
      >
        {showingSolution ? "Hide Solution" : "Show Solution"}
      </button>
    {/if}
    <button class="toolbar-btn toolbar-btn--right" onclick={format} title="Format document"
      >Format</button
    >
  </div>
  <div class="editor-container" bind:this={editorContainer}></div>
</div>

<style>
  .editor-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .toolbar {
    display: flex;
    gap: 0.5rem;
    padding: 0.35rem 0.5rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .toolbar-btn--right {
    margin-left: auto;
  }

  .toolbar-btn {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg);
    color: var(--color-text);
    cursor: pointer;
  }

  .toolbar-btn:hover {
    background: var(--color-surface-hover);
  }

  .editor-container {
    flex: 1;
    overflow: auto;
  }

  .editor-container :global(.cm-editor) {
    height: 100%;
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  .editor-container :global(.cm-scroller) {
    overflow: auto;
  }

  .editor-container :global(.cm-content) {
    caret-color: var(--color-text);
  }

  .editor-container :global(.cm-cursor),
  .editor-container :global(.cm-dropCursor) {
    border-left-color: var(--color-text);
  }

  .editor-container :global(.cm-gutters) {
    background-color: var(--color-surface);
    color: var(--color-text-muted);
    border-right: 1px solid var(--color-border);
  }

  .editor-container :global(.cm-activeLine),
  .editor-container :global(.cm-activeLineGutter) {
    background-color: transparent;
  }

  .editor-container :global(.cm-selectionMatch) {
    background-color: transparent;
  }

  .editor-container :global(.cm-selectionLayer .cm-selectionBackground) {
    background: color-mix(in srgb, var(--color-accent) 30%, transparent) !important;
  }

  .editor-container :global(.cm-tooltip),
  .editor-container :global(.cm-tooltip-lint),
  .editor-container :global(.cm-diagnostic),
  .editor-container :global(.cm-panel),
  .editor-container :global(.cm-tooltip-autocomplete) {
    background-color: var(--color-surface);
    color: var(--color-text);
  }

  .editor-container :global(.cm-tooltip),
  .editor-container :global(.cm-tooltip-autocomplete) {
    border: 1px solid var(--color-border);
  }

  .editor-container :global(.cm-tooltip-lint) {
    max-width: calc(100% - 2rem);
    overflow-wrap: break-word;
    word-break: break-word;
    box-sizing: border-box;
  }

  /* Lint gutter: filled circle markers */
  .editor-container :global(.cm-lint-marker-error),
  .editor-container :global(.cm-lint-marker-warning),
  .editor-container :global(.cm-lint-marker-info) {
    content: none;
    background: none !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .editor-container :global(.cm-lint-marker-error::after) {
    content: "\2B24";
    font-size: 0.55em;
    color: #e45649;
  }
  .editor-container :global(.cm-lint-marker-warning::after) {
    content: "\2B24";
    font-size: 0.55em;
    color: #d19a66;
  }
  .editor-container :global(.cm-lint-marker-info::after) {
    content: "\2B24";
    font-size: 0.55em;
    color: var(--color-accent);
  }

  /* Diagnostic tooltip */
  .editor-container :global(.cm-diagnostic) {
    position: relative;
    padding-right: 2rem;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  /* Copy button inside diagnostics */
  .editor-container :global(.diag-copy-btn) {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-surface);
    color: var(--color-text-muted);
    cursor: pointer;
  }
  .editor-container :global(.diag-copy-btn:hover) {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }
  .editor-container :global(.diag-copy-btn svg) {
    width: 14px;
    height: 14px;
  }
</style>
