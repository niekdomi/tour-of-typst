import { TypstProject } from "@vedivad/codemirror-typst";
import { createSignal, onMount, Show, type JSX } from "solid-js";

import { TypstResourcesContext } from "./typst-resources";
import type { TypstResources } from "./typst-resources";

export default function EditorShell(props: { children: JSX.Element }) {
  const [resources, setResources] = createSignal<TypstResources>();

  onMount(() => {
    void (async () => {
      // One project owns the wasm worker and VFS, and runs every compile,
      // render, format, and highlight pass. Editors share it through context.
      const project = await TypstProject.create({
        autoCompile: { debounceMs: 50, maxWaitMs: 300 },
      });
      setResources({ project });
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
