import type { TypstProject } from "@vedivad/codemirror-typst";
import { createContext, useContext } from "solid-js";

export interface TypstResources {
  project: TypstProject;
}

export const TypstResourcesContext = createContext<TypstResources>();

export function useTypstResources(): TypstResources {
  const ctx = useContext(TypstResourcesContext);
  if (!ctx) throw new Error("useTypstResources called outside <EditorShell>");
  return ctx;
}
