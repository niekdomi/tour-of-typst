<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { EditorState } from "@codemirror/state";
  import { keymap } from "@codemirror/view";
  import { indentWithTab } from "@codemirror/commands";
  import diagnosticCopyPlugin from "./diagnosticCopyPlugin";
  import { createTypstSetup, typstFilePath } from "@vedivad/codemirror-typst";
  import { useTypstResources } from "./typst-resources";

  interface Props {
    doc?: string;
    template?: string;
    solution?: string;
    auxFiles?: Record<string, string>;
    theme?: "light" | "dark";
    onchange?: (content: string) => void;
    oncompile?: (pages: string[]) => void;
  }

  let {
    doc = "",
    template = "",
    solution,
    auxFiles = {},
    theme = "light",
    onchange,
    oncompile,
  }: Props = $props();

  const { project, highlighting, formatter, renderer } = useTypstResources();
  const mainPath = "/main.typ";

  let editorContainer: HTMLDivElement;
  let view: EditorView | undefined = $state();
  let showingSolution = $state(false);
  let savedCode: string | undefined;
  let userScrollTop = 0;
  let solutionScrollTop = 0;

  const typstExtensions = createTypstSetup({
    project,
    sync: "editor-driven",
    highlighting,
    formatter: { instance: formatter },
  });

  /** Build a fresh CodeMirror view for the given document. */
  function createView(initialDoc: string, initialScrollTop = 0) {
    view?.destroy();
    const v = new EditorView({
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
          EditorView.updateListener.of((u) => {
            if (u.docChanged) {
              onchange?.(u.state.doc.toString());
            }
          }),
          ...typstExtensions,
          typstFilePath.of(mainPath),
          diagnosticCopyPlugin,
        ],
      }),
    });
    view = v;

    if (initialScrollTop > 0) {
      requestAnimationFrame(() => {
        v.scrollDOM.scrollTop = initialScrollTop;
      });
    }
  }

  let cancelled = false;
  let unsub: (() => void) | undefined;

  onMount(async () => {
    for (const step of [
      () => project.clear(),
      () => project.setMany({ ...auxFiles, [mainPath]: doc }),
      () => project.compile(),
    ]) {
      if (cancelled) return;
      await step();
    }
    if (cancelled) return;

    // Subscribe after compile() — onCompile synchronously replays the cached
    // result, so this hands us the fresh render without flashing the previous
    // chapter's pages, and still catches future autoCompiles from edits.
    unsub = project.onCompile((result) => {
      if (result.vector) {
        void renderer
          .renderSvgPages(result.vector)
          .then((pages) => oncompile?.(pages.map((p) => p.svg)));
      }
    });
    createView(doc);
  });

  onDestroy(() => {
    cancelled = true;
    unsub?.();
    view?.destroy();
  });

  $effect(() => {
    if (view) {
      highlighting.setTheme(view, theme);
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
    if (!view) return;

    const source = view.state.doc.toString();
    const formatted = await formatter.format(source);

    if (formatted !== source) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: formatted } });
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
      createView(savedCode ?? doc, userScrollTop);
      savedCode = undefined;
    } else {
      userScrollTop = view?.scrollDOM.scrollTop ?? 0;
      savedCode = view?.state.doc.toString();
      showingSolution = true;
      createView(solution, solutionScrollTop);
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
