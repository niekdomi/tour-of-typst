import {
  createTypstHighlighting,
  TypstCompiler,
  TypstFormatter,
  TypstProject,
  TypstRenderer,
} from "@vedivad/codemirror-typst";
import { createSignal, onMount, Show, type JSX } from "solid-js";

import { shikiThemes } from "../lib/highlighter";
import { useTheme } from "../lib/ThemeContext";
import { TypstResourcesContext } from "./typst-resources";
import type { TypstResources } from "./typst-resources";

export default function EditorShell(props: { children: JSX.Element }) {
  const { theme } = useTheme();
  const [resources, setResources] = createSignal<TypstResources>();

  onMount(() => {
    void (async () => {
      const renderer = TypstRenderer.create();

      const formatter = TypstFormatter.create({ max_width: 80, wrap_text: true });

      const [compiler, highlighting] = await Promise.all([
        TypstCompiler.create(),
        createTypstHighlighting({
          themes: shikiThemes,
          theme: theme(),
        }),
      ]);

      const project = new TypstProject({
        compiler,
        autoCompile: { debounceMs: 50, maxWaitMs: 300 },
      });

      setResources({ project, highlighting, formatter, renderer });
    })();
  });

  return (
    <Show when={resources()}>
      {(res) => (
        <TypstResourcesContext.Provider value={res()}>
          {props.children}
        </TypstResourcesContext.Provider>
      )}
    </Show>
  );
}
