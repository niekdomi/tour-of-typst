<script lang="ts">
  import { EditorView, basicSetup } from "codemirror";
  import { EditorState, Compartment, Transaction } from "@codemirror/state";
  import { keymap } from "@codemirror/view";
  import { cmBaseTheme } from "./theme";
  import diagnosticCopyPlugin from "./diagnosticCopyPlugin";
  import {
    createTypstExtensions,
    createTypstShikiHighlighting,
    TypstCompiler,
    TypstRenderer,
    TypstFormatter,
  } from "@vedivad/codemirror-typst";
  import type { TypstShikiHighlighting } from "@vedivad/codemirror-typst";
  import type { CompileResult } from "@vedivad/typst-web-service";

  interface Props {
    doc?: string;
    template?: string;
    docKey?: string;
    solution?: string;
    auxFiles?: Record<string, string>;
    theme?: "light" | "dark";
    onchange?: (content: string) => void;
    oncompile?: (svg: string) => void;
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
  let effectGeneration = 0;

  const highlightCompartment = new Compartment();

  let shikiHighlighting: TypstShikiHighlighting | undefined;
  // index 0 of createTypstExtensions is the built-in shiki, we replace it with our compartment
  let compilerExtensions: Awaited<ReturnType<typeof createTypstExtensions>> | undefined;
  let formatter: TypstFormatter | undefined;

  /**
   * Initialize Typst compiler/renderer/formatter and Shiki highlighting.
   * Must run before creating a view so extensions are available.
   */
  async function init() {
    const compiler = await TypstCompiler.create();
    const renderer = TypstRenderer.create();
    formatter = TypstFormatter.create({ max_width: 80, wrap_text: true });

    shikiHighlighting = await createTypstShikiHighlighting({
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: theme,
    });
    const typstExtension = await createTypstExtensions({
      getFiles: () => auxFiles,
      compiler: {
        instance: compiler,
        throttleDelay: 50,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onCompile: async (result: CompileResult) => {
          if (result.vector) {
            oncompile?.(await renderer.renderSvg(result.vector));
          }
        },
      },
      highlighting: { theme: "light" },
    });
    compilerExtensions = typstExtension.slice(1);
  }

  const ready = init();

  /**
   * Build a fresh CodeMirror view with current theme/highlighting and trigger an initial compile.
   */
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
            { key: "Mod-f", run: () => true },
            { key: "F3", run: () => true },
            { key: "Shift-F3", run: () => true },
            { key: "F2", run: () => true },
          ]),
          basicSetup,
          cmBaseTheme,
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
        changes: { from: 0, to: view.state.doc.length, insert: initialDoc },
        annotations: Transaction.addToHistory.of(false),
      });
    }
  }

  $effect(() => {
    // Destructure to read both doc and docKey synchronously, Svelte tracks both.
    // docKey ensures the effect re-runs on chapter/locale change even if doc content is identical.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [initialDoc, _key] = [doc, docKey];
    const gen = ++effectGeneration;
    showingSolution = false;
    savedCode = undefined;
    // Clear container immediately so stale content from previous chapter is never visible
    // eslint-disable-next-line svelte/no-dom-manipulating, @typescript-eslint/no-unnecessary-condition
    editorContainer?.replaceChildren();
    void ready.then(() => {
      // Skip if a newer effect has already fired (e.g. user switched chapters while init was pending)
      if (gen !== effectGeneration) return;
      createView(initialDoc);
    });

    return () => view?.destroy();
  });

  $effect(() => {
    if (view && shikiHighlighting) {
      // Reconfigure compartment + force docChanged so Shiki re-decorates existing tokens
      view.dispatch({
        effects: highlightCompartment.reconfigure(shikiHighlighting.getTheme(theme)),
        changes: { from: 0, to: view.state.doc.length, insert: view.state.doc.toString() },
        annotations: Transaction.addToHistory.of(false),
      });
    }
  });

  /**
   * Restore the template, clear saved solution state, and rebuild the view.
   */
  function reset() {
    showingSolution = false;
    savedCode = undefined;
    createView(template);
    onchange?.(template);
  }

  /**
   * Format the current document with the Typst formatter and apply changes if different.
   */
  async function format() {
    if (!view || !formatter) {
      return;
    }

    const source = view.state.doc.toString();
    const formatted = await formatter.format(source);

    if (formatted !== source) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: formatted },
      });
    }
  }

  /**
   * Toggle between user code and solution, preserving user edits when showing the solution.
   */
  function toggleSolution() {
    if (!solution) {
      return;
    }

    if (showingSolution) {
      showingSolution = false;
      createView(savedCode ?? doc);
      savedCode = undefined;
      return;
    }

    savedCode = view?.state.doc.toString() ?? doc;
    showingSolution = true;
    createView(solution);
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
  }

  .editor-container :global(.cm-scroller) {
    overflow: auto;
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
