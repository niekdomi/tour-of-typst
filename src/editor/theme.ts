import { EditorView } from "codemirror";

/**
 * CodeMirror base theme that delegates all colors to CSS custom properties,
 * so the editor follows light/dark mode without JS intervention.
 */
export const cmBaseTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--color-bg)",
    color: "var(--color-text)",
  },
  ".cm-content": {
    caretColor: "var(--color-text)",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--color-text)",
  },
  ".cm-gutters": {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text-muted)",
    borderRight: "1px solid var(--color-border)",
  },
  // Disable active-line highlighting so it doesn't obscure selections
  // (CodeMirror's selection layer renders behind the active-line background)
  ".cm-activeLine, .cm-activeLineGutter": {
    backgroundColor: "transparent",
  },
  ".cm-selectionMatch": {
    backgroundColor: "transparent",
  },
  ".cm-selectionLayer .cm-selectionBackground": {
    background: "color-mix(in srgb, var(--color-accent) 30%, transparent) !important",
  },
  ".cm-tooltip, .cm-tooltip-lint, .cm-diagnostic, .cm-panel, .cm-tooltip-autocomplete": {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text)",
  },
  ".cm-tooltip, .cm-tooltip-autocomplete": {
    border: "1px solid var(--color-border)",
  },
});
