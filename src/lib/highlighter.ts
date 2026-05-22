import { createHighlighter, type Highlighter } from "shiki";

export const shikiThemes = { light: "github-light", dark: "github-dark-dimmed" } as const;

export const highlighterReady: Promise<Highlighter> = createHighlighter({
  themes: Object.values(shikiThemes),
  langs: ["typst", "yaml"],
});
