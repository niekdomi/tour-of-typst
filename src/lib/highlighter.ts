import { createHighlighter, type Highlighter } from "shiki";

// Initialized once, shared across the app
export const highlighterReady: Promise<Highlighter> = createHighlighter({
  themes: ["github-light", "github-dark-dimmed"],
  langs: ["typst", "yaml"],
});
