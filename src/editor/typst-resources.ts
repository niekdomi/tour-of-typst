import { getContext, setContext } from "svelte";
import type {
  TypstProject,
  TypstFormatter,
  TypstRenderer,
  TypstHighlightingController,
} from "@vedivad/codemirror-typst";

export interface TypstResources {
  project: TypstProject;
  highlighting: TypstHighlightingController;
  formatter: TypstFormatter;
  renderer: TypstRenderer;
}

interface Container {
  current: TypstResources | undefined;
}

const KEY = Symbol("typst-resources");

export function provideTypstResources(): Container {
  const container: Container = { current: undefined };
  setContext(KEY, container);
  return container;
}

export function useTypstResources(): TypstResources {
  const container = getContext<Container | undefined>(KEY);
  if (!container?.current) {
    throw new Error("useTypstResources called outside <EditorShell> or before resources are ready");
  }
  return container.current;
}
