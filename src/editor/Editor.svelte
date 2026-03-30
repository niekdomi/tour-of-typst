<script lang="ts">
  import { EditorView, basicSetup } from "codemirror";
  import { EditorState, Compartment, Transaction } from "@codemirror/state";
  import { keymap } from "@codemirror/view";
  import { cmBaseTheme } from "./theme";
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
    theme?: "light" | "dark";
    onchange?: (content: string) => void;
    oncompile?: (svg: string) => void;
  }

  let {
    doc = "",
    template = "",
    docKey = "",
    solution,
    theme = "light",
    onchange,
    oncompile,
  }: Props = $props();

  let editorContainer: HTMLDivElement;
  let view: EditorView | undefined = $state();
  let showingSolution = $state(false);
  let savedCode: string | undefined;

  const highlightCompartment = new Compartment();

  let shikiHighlighting: TypstShikiHighlighting | undefined;
  // index 0 of createTypstExtensions is the built-in shiki, we replace it with our compartment
  let compilerExtensions: Awaited<ReturnType<typeof createTypstExtensions>> | undefined;
  let formatter: TypstFormatter | undefined;

  async function init() {
    const compiler = await TypstCompiler.create();
    const renderer = TypstRenderer.create();
    formatter = TypstFormatter.create({ max_width: 80, wrap_text: true });

    shikiHighlighting = await createTypstShikiHighlighting({
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: theme,
    });
    const all = await createTypstExtensions({
      compiler: {
        instance: compiler,
        throttleDelay: 100,
        onCompile: async (result: CompileResult) => {
          if (result.vector) oncompile?.(await renderer.renderSvg(result.vector));
        },
      },
      highlighting: { theme: "light" },
    });
    compilerExtensions = all.slice(1);
  }

  const ready = init();

  function createView(initialDoc: string) {
    view?.destroy();
    if (!shikiHighlighting || !compilerExtensions || !editorContainer) return;

    view = new EditorView({
      parent: editorContainer,
      state: EditorState.create({
        doc: initialDoc,
        extensions: [
          keymap.of([{ key: "Mod-f", run: () => true }]),
          basicSetup,
          cmBaseTheme,
          highlightCompartment.of(shikiHighlighting.getTheme(theme)),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onchange?.(u.state.doc.toString());
          }),
          ...compilerExtensions,
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
    const [initialDoc] = [doc, docKey];
    ready.then(() => {
      showingSolution = false;
      savedCode = undefined;
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

  function reset() {
    showingSolution = false;
    savedCode = undefined;
    createView(template);
    onchange?.(template);
  }

  async function format() {
    if (!view || !formatter) return;
    const source = view.state.doc.toString();
    const formatted = await formatter.format(source);
    if (formatted !== source) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: formatted },
      });
    }
  }

  function toggleSolution() {
    if (showingSolution) {
      showingSolution = false;
      createView(savedCode ?? doc);
      savedCode = undefined;
    } else if (solution) {
      savedCode = view?.state.doc.toString() ?? doc;
      showingSolution = true;
      createView(solution);
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
  }

  .editor-container :global(.cm-scroller) {
    overflow: auto;
  }
</style>
