<script lang="ts">
  import { EditorView, basicSetup } from "codemirror";
  import { EditorState, Compartment } from "@codemirror/state";
  import {
    createTypstExtensions,
    createTypstShikiHighlighting,
    TypstCompiler,
    TypstRenderer,
  } from "@vedivad/codemirror-typst";
  import type { TypstShikiHighlighting } from "@vedivad/codemirror-typst";
  import type { CompileResult } from "@vedivad/typst-web-service";

  interface Props {
    template?: string;
    solution?: string;
    oncompile?: (svg: string) => void;
  }

  let { template = "", solution, oncompile }: Props = $props();

  let editorContainer: HTMLDivElement;
  let view: EditorView | undefined = $state();
  let showingSolution = $state(false);
  let savedCode: string | undefined = $state();

  const compiler = new TypstCompiler();
  const renderer = new TypstRenderer();

  const highlightCompartment = new Compartment();

  function getResolvedTheme(): "light" | "dark" {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  // Base CM theme that uses CSS variables for all chrome
  const cmBaseTheme = EditorView.theme({
    "&": {
      backgroundColor: "var(--color-bg)",
      color: "var(--color-text)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text-muted)",
      borderRight: "1px solid var(--color-border)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--color-surface-hover)",
    },
    ".cm-activeLine": {
      backgroundColor: "var(--color-surface)",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "var(--color-text)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "var(--color-surface-hover) !important",
    },
    ".cm-content": {
      caretColor: "var(--color-text)",
    },
    // Diagnostics tooltip
    ".cm-tooltip": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
      border: "1px solid var(--color-border)",
    },
    ".cm-tooltip-lint": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
    },
    ".cm-diagnostic": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
    },
    ".cm-panel": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
    },
    ".cm-tooltip-autocomplete": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
      border: "1px solid var(--color-border)",
    },
  });

  let shikiHighlighting: TypstShikiHighlighting | undefined;
  // Extensions from createTypstExtensions minus the built-in shiki (index 0)
  let compilerExtensions: Awaited<ReturnType<typeof createTypstExtensions>> | undefined;

  async function init() {
    // Create highlighting with both themes available
    shikiHighlighting = await createTypstShikiHighlighting({
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: getResolvedTheme(),
    });

    // createTypstExtensions returns [shiki.extension, lintGutter, ...compiler/linter plugins]
    // We skip index 0 (the built-in shiki) and use our own via compartment
    const allExtensions = await createTypstExtensions({
      compiler: {
        instance: compiler,
        delay: 300,
        onCompile: async (result: CompileResult) => {
          if (result.vector) {
            const svg = await renderer.renderSvg(result.vector);
            oncompile?.(svg);
          }
        },
      },
      highlighting: { theme: "light" },
    });
    compilerExtensions = allExtensions.slice(1);
  }

  const ready = init();

  function createView(doc: string) {
    view?.destroy();
    if (!shikiHighlighting || !compilerExtensions || !editorContainer) return;

    const theme = getResolvedTheme();
    view = new EditorView({
      parent: editorContainer,
      state: EditorState.create({
        doc,
        extensions: [
          basicSetup,
          cmBaseTheme,
          highlightCompartment.of(shikiHighlighting.getTheme(theme)),
          ...compilerExtensions,
        ],
      }),
    });
  }

  function getEditorContent(): string {
    return view?.state.doc.toString() ?? template ?? "";
  }

  // React to template changes (chapter navigation)
  $effect(() => {
    ready.then(() => {
      const doc = template ?? "";
      showingSolution = false;
      savedCode = undefined;
      createView(doc);
    });

    return () => view?.destroy();
  });

  // Watch for theme changes on <html> data-theme attribute
  $effect(() => {
    if (!editorContainer) return;

    const observer = new MutationObserver(() => {
      if (view && shikiHighlighting) {
        const theme = getResolvedTheme();
        view.dispatch({
          effects: highlightCompartment.reconfigure(shikiHighlighting.getTheme(theme)),
        });
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  });

  function reset() {
    showingSolution = false;
    savedCode = undefined;
    createView(template ?? "");
  }

  function toggleSolution() {
    if (showingSolution) {
      showingSolution = false;
      createView(savedCode ?? template ?? "");
      savedCode = undefined;
    } else if (solution) {
      savedCode = getEditorContent();
      showingSolution = true;
      createView(solution);
    }
  }
</script>

<div class="editor-wrapper">
  <div class="toolbar">
    <button class="toolbar-btn" onclick={reset} title="Reset to template">Reset</button>
    {#if solution}
      <button class="toolbar-btn" onclick={toggleSolution} title={showingSolution ? "Back to your code" : "Show solution"}>
        {showingSolution ? "Hide Solution" : "Show Solution"}
      </button>
    {/if}
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
