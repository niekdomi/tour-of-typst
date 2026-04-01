import { EditorView } from "codemirror";

/**
 * CodeMirror base theme that delegates all colors to CSS custom properties,
 * so the editor automatically follows light/dark mode without JS intervention.
 * This keeps palette control in CSS and lets the editor follow the site's theme
 * without extra JS toggles.
 */
export const cmBaseTheme = EditorView.theme({
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
    // CodeMirror applies inline styles for selections, !important is required to override them
    backgroundColor: "var(--color-surface-hover) !important",
  },
  ".cm-content": {
    caretColor: "var(--color-text)",
  },
  ".cm-tooltip, .cm-tooltip-lint, .cm-diagnostic, .cm-panel, .cm-tooltip-autocomplete": {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text)",
  },
  ".cm-tooltip, .cm-tooltip-autocomplete": {
    border: "1px solid var(--color-border)",
  },
});
