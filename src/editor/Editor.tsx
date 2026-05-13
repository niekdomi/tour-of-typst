import { indentWithTab } from "@codemirror/commands";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap, runScopeHandlers } from "@codemirror/view";
import { createTypstSetup, typstFilePath } from "@vedivad/codemirror-typst";
import type { RenderedSvgPage } from "@vedivad/typst-web-service";
import { basicSetup } from "codemirror";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { Button } from "../components/ui/button";
import { useTheme } from "../lib/ThemeContext";
import diagnosticCopyPlugin from "./diagnostic-copy-plugin";
import { editorTheme, fillHeight, popupTheme } from "./editor-theme";
import { useTypstResources } from "./typst-resources";

interface Props {
  doc: string;
  template: string;
  solution?: string;
  auxFiles?: Record<string, string>;
  onChange?: (content: string) => void;
  onCompile?: (pages: RenderedSvgPage[]) => void;
}

const MAIN_PATH = "/main.typ";

export default function Editor(props: Props) {
  const { project, highlighting, formatter, renderer } = useTypstResources();
  const { theme } = useTheme();

  const typstExtensions = createTypstSetup({
    project,
    sync: "editor-driven",
    highlighting,
    formatter: { instance: formatter },
  });

  let container: HTMLDivElement | undefined;
  let view: EditorView | undefined;
  let unsubscribe: (() => void) | undefined;
  let cancelled = false;

  const [showingSolution, setShowingSolution] = createSignal(false);
  let savedCode: string | undefined;
  let userScrollTop = 0;
  let solutionScrollTop = 0;

  const themeCompartment = new Compartment();

  function buildState(doc: string) {
    return EditorState.create({
      doc,
      extensions: [
        keymap.of([
          indentWithTab,
          { key: "Mod-f", run: () => true },
          { key: "F3", run: () => true },
          { key: "Shift-F3", run: () => true },
          { key: "F2", run: () => true },
        ]),
        basicSetup,
        fillHeight,
        popupTheme,
        themeCompartment.of(editorTheme(theme())),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) props.onChange?.(u.state.doc.toString());
        }),
        ...typstExtensions,
        typstFilePath.of(MAIN_PATH),
        diagnosticCopyPlugin,
      ],
    });
  }

  onMount(() => {
    void (async () => {
      for (const step of [
        () => project.clear(),
        () => project.setMany({ ...props.auxFiles, [MAIN_PATH]: props.doc }),
        () => project.compile(),
      ]) {
        if (cancelled) return;
        await step();
      }
      if (cancelled) return;

      unsubscribe = project.onCompile((result) => {
        if (result.vector) {
          void (async () => {
            const pages = await renderer.renderSvgPages(result.vector!);
            props.onCompile?.(pages);
          })();
        }
      });

      view = new EditorView({ parent: container!, state: buildState(props.doc) });
    })();
  });

  onCleanup(() => {
    cancelled = true;
    unsubscribe?.();
    view?.destroy();
  });

  createEffect(() => {
    const t = theme();
    if (view) {
      view.dispatch({ effects: themeCompartment.reconfigure(editorTheme(t)) });
      highlighting.setTheme(view, t);
    }
  });

  function reset() {
    setShowingSolution(false);
    savedCode = undefined;
    view?.setState(buildState(props.template));
    props.onChange?.(props.template);
  }

  function format() {
    if (!view) return;
    runScopeHandlers(
      view,
      new KeyboardEvent("keydown", { key: "f", shiftKey: true, altKey: true, bubbles: true }),
      "editor"
    );
  }

  function toggleSolution() {
    if (!props.solution) return;
    if (showingSolution()) {
      solutionScrollTop = view?.scrollDOM.scrollTop ?? 0;
      setShowingSolution(false);
      view?.setState(buildState(savedCode ?? props.doc));
      savedCode = undefined;
      const top = userScrollTop;
      requestAnimationFrame(() => {
        if (view) view.scrollDOM.scrollTop = top;
      });
    } else {
      userScrollTop = view?.scrollDOM.scrollTop ?? 0;
      savedCode = view?.state.doc.toString();
      setShowingSolution(true);
      view?.setState(buildState(props.solution));
      const top = solutionScrollTop;
      requestAnimationFrame(() => {
        if (view) view.scrollDOM.scrollTop = top;
      });
    }
  }

  return (
    <div class="flex h-full flex-col overflow-hidden">
      <div class="flex shrink-0 items-center gap-1 border-b border-border/60 bg-background px-2 py-1">
        <Button variant="outline" size="sm" onClick={reset}>
          Reset
        </Button>
        {props.solution && (
          <Button variant="outline" size="sm" onClick={toggleSolution}>
            {showingSolution() ? "Hide Solution" : "Show Solution"}
          </Button>
        )}
        <Button variant="outline" size="sm" class="ml-auto" onClick={format}>
          Format
        </Button>
      </div>
      <div
        ref={(el) => {
          container = el;
        }}
        class="min-h-0 flex-1 overflow-auto"
      />
    </div>
  );
}
