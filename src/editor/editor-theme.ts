import { type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { createTypstHighlighting } from "@vedivad/codemirror-typst";
import { githubDark } from "@fsegurai/codemirror-theme-github-dark";
import { githubLight } from "@fsegurai/codemirror-theme-github-light";

import { type Theme } from "../lib/ThemeContext";

// Lazy-load the Typst highlighting controller on first editor mount. The
// `initial` theme is only the controller's starting state — the editor calls
// `controller.setTheme(view, theme())` on mount and on every theme change.
let highlightingPromise: ReturnType<typeof createTypstHighlighting> | undefined;
export const getHighlighting = (initial: Theme) => {
  highlightingPromise ??= createTypstHighlighting({ theme: initial });
  return highlightingPromise;
};

export const editorTheme = (t: Theme): Extension => (t === "dark" ? githubDark : githubLight);

export const fillHeight = EditorView.theme({
  "&": { height: "100%" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { overflow: "auto" },
});

// Unify autocomplete / hover / lint popups with the app's popover styling.
export const popupTheme = EditorView.theme({
  ".cm-tooltip": {
    backgroundColor: "var(--popover)",
    color: "var(--popover-foreground)",
    border: "1px solid color-mix(in oklch, var(--border) 60%, transparent)",
    borderRadius: "calc(var(--radius) - 2px)",
    boxShadow: "0 4px 12px -2px oklch(0 0 0 / 12%), 0 2px 4px -1px oklch(0 0 0 / 8%)",
    fontFamily: "var(--sans)",
    fontSize: "13px",
    overflow: "hidden",
  },
  ".cm-tooltip-arrow:before, .cm-tooltip-arrow:after": { display: "none" },

  ".cm-tooltip.cm-tooltip-autocomplete > ul": {
    fontFamily: "var(--mono)",
    fontSize: "12.5px",
    maxHeight: "16rem",
    padding: "4px",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 8px",
    borderRadius: "calc(var(--radius) - 4px)",
    lineHeight: "1.4",
  },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: "var(--accent)",
    color: "var(--accent-foreground)",
  },
  ".cm-completionLabel": { color: "inherit" },
  ".cm-completionMatchedText": {
    textDecoration: "none",
    color: "var(--brand)",
    fontWeight: "600",
  },
  ".cm-completionDetail": {
    color: "var(--muted-foreground)",
    fontStyle: "normal",
    marginLeft: "auto",
    paddingLeft: "12px",
  },
  ".cm-completionIcon": { opacity: "0.7", paddingRight: "0" },
  ".cm-completionInfo": {
    marginLeft: "6px",
    padding: "8px 10px",
    maxWidth: "28rem",
    backgroundColor: "var(--popover)",
    color: "var(--popover-foreground)",
    border: "1px solid color-mix(in oklch, var(--border) 60%, transparent)",
    borderRadius: "calc(var(--radius) - 2px)",
    boxShadow: "0 4px 12px -2px oklch(0 0 0 / 12%), 0 2px 4px -1px oklch(0 0 0 / 8%)",
  },

  ".cm-tooltip.cm-tooltip-hover, .cm-tooltip-section": { padding: "0" },
  ".cm-tooltip-hover > div, .cm-tooltip-section > div": { padding: "8px 10px" },
  ".cm-tooltip-hover p, .cm-tooltip-section p": { margin: "0 0 6px" },
  ".cm-tooltip-hover p:last-child, .cm-tooltip-section p:last-child": { marginBottom: "0" },
  ".cm-tooltip-hover code, .cm-tooltip-section code": {
    fontFamily: "var(--mono)",
    fontSize: "12px",
    padding: "1px 4px",
    borderRadius: "4px",
    backgroundColor: "var(--muted)",
  },

  // Typst function/symbol hover popup (custom DOM from @vedivad/codemirror-typst).
  ".cm-typst-hover": { maxWidth: "32rem", padding: "0" },
  ".cm-typst-hover-content": { padding: "0" },
  ".cm-typst-hover-header": {
    padding: "6px 10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  ".cm-typst-hover-header-main": { display: "flex", flexDirection: "column", gap: "6px" },

  // Shiki-rendered code. Since @vedivad/codemirror-typst@0.12, the wrapper
  // class lives directly on shiki's <pre> and its inline background-color is
  // stripped — we own the bg here.
  ".cm-typst-hover-code": {
    margin: "0",
    padding: "6px 8px",
    borderRadius: "calc(var(--radius) - 4px)",
    backgroundColor: "var(--muted)",
    fontSize: "12px",
    overflowX: "auto",
  },
  // Fallback (no shiki): a single styled box.
  ".cm-typst-hover-pre": {
    margin: "0",
    padding: "6px 8px",
    backgroundColor: "var(--muted)",
    borderRadius: "calc(var(--radius) - 4px)",
    fontFamily: "var(--mono)",
    fontSize: "12px",
    overflowX: "auto",
  },

  ".cm-typst-hover-summary": { fontSize: "12.5px" },
  ".cm-typst-hover-summary p": { margin: "0 0 4px" },
  ".cm-typst-hover-summary p:last-child": { marginBottom: "0" },
  ".cm-typst-hover-open-docs": {
    fontSize: "12px",
    color: "var(--brand)",
    textDecoration: "none",
  },
  ".cm-typst-hover-open-docs:hover": { textDecoration: "underline" },

  // Collapsible sections — visible toggle with rotating chevron.
  ".cm-typst-hover-section": {
    borderTop: "1px solid color-mix(in oklch, var(--border) 60%, transparent)",
  },
  ".cm-typst-hover-section > summary": {
    listStyle: "none",
    cursor: "pointer",
    userSelect: "none",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "500",
    color: "var(--muted-foreground)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  ".cm-typst-hover-section > summary::-webkit-details-marker": { display: "none" },
  ".cm-typst-hover-section > summary::before": {
    content: '"›"',
    display: "inline-block",
    fontSize: "13px",
    lineHeight: "1",
    transition: "transform 120ms ease",
    color: "var(--muted-foreground)",
  },
  ".cm-typst-hover-section[open] > summary::before": { transform: "rotate(90deg)" },
  ".cm-typst-hover-section > summary:hover": { color: "var(--foreground)" },
  ".cm-typst-hover-section > *:not(summary)": { margin: "0 10px" },
  ".cm-typst-hover-section > *:not(summary):last-child": { marginBottom: "8px" },
  ".cm-typst-hover-section > *:not(summary) + *:not(summary)": { marginTop: "8px" },
  ".cm-typst-hover-section h2": {
    fontSize: "12.5px",
    fontWeight: "600",
    color: "var(--foreground)",
  },
  ".cm-typst-hover-section p": { fontSize: "12.5px" },
  ".cm-typst-hover-section code": {
    fontFamily: "var(--mono)",
    fontSize: "12px",
    padding: "1px 4px",
    borderRadius: "4px",
    backgroundColor: "var(--muted)",
  },

  ".cm-diagnostic": {
    padding: "8px 10px",
    borderLeft: "3px solid var(--border)",
    fontSize: "12.5px",
  },
  ".cm-diagnostic-error": { borderLeftColor: "var(--destructive)" },
  ".cm-diagnostic-warning": { borderLeftColor: "oklch(0.78 0.16 85)" },
  ".cm-diagnostic-info": { borderLeftColor: "var(--brand)" },
});
