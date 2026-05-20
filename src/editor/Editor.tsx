import { indentWithTab } from "@codemirror/commands";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
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
          ...["Mod-f", "F3", "Shift-F3", "F2"].map((key) => ({ key, run: () => true })),
        ]),
        basicSetup,
        fillHeight,
        popupTheme,
        themeCompartment.of(editorTheme(theme())),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            props.onChange?.(u.state.doc.toString());
          }
        }),
        ...typstExtensions,
        typstFilePath.of(MAIN_PATH),
        diagnosticCopyPlugin,
      ],
    });
  }

  onMount(() => {
    void (async () => {
      /* oxlint-disable typescript/no-unnecessary-condition -- `cancelled` is mutated by onCleanup */
      await project.clear();
      if (cancelled) {
        return;
      }
      await project.setMany({ ...props.auxFiles, [MAIN_PATH]: props.doc });
      if (cancelled) {
        return;
      }
      await project.compile();
      if (cancelled) {
        return;
      }
      /* oxlint-enable typescript/no-unnecessary-condition */
      unsubscribe = project.onCompile((result) => {
        if (!result.vector) {
          return;
        }
        void (async () => {
          const pages = await renderer.renderSvgPages(result.vector!);
          props.onCompile?.(pages);
        })();
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

  // Swap the editor's document and return the scroll position from before the swap,
  // so callers can stash it for later restoration.
  function swapDoc(nextDoc: string): number {
    const previousScroll = view?.scrollDOM.scrollTop ?? 0;
    view?.setState(buildState(nextDoc));
    return previousScroll;
  }

  function restoreScroll(top: number) {
    requestAnimationFrame(() => {
      if (view) {
        view.scrollDOM.scrollTop = top;
      }
    });
  }

  function reset() {
    setShowingSolution(false);
    savedCode = undefined;
    view?.setState(buildState(props.template));
    props.onChange?.(props.template);
  }

  function format() {
    if (!view) {
      return;
    }
    const source = view.state.doc.toString();
    void (async () => {
      const formatted = await formatter.format(source);
      if (formatted !== source) {
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: formatted } });
      }
    })();
  }

  function toggleSolution() {
    if (!props.solution) {
      return;
    }
    if (showingSolution()) {
      solutionScrollTop = swapDoc(savedCode ?? props.doc);
      savedCode = undefined;
      setShowingSolution(false);
      restoreScroll(userScrollTop);
    } else {
      savedCode = view?.state.doc.toString();
      userScrollTop = swapDoc(props.solution);
      setShowingSolution(true);
      restoreScroll(solutionScrollTop);
    }
  }

  return (
    <div class="flex h-full flex-col overflow-hidden">
      <div class="border-border/60 bg-background flex shrink-0 items-center gap-1 border-b px-2 py-1">
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
