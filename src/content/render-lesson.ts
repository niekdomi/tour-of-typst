import { Marked, Renderer } from "marked";
import markedAlert from "marked-alert";
import { createHighlighter, type Highlighter } from "shiki";

/**
 * Shiki light/dark theme names used for lesson code blocks.
 */
export const shikiThemes = { light: "github-light", dark: "github-dark-dimmed" } as const;

/**Languages preloaded into the lesson highlighter.
 */
const shikiLangs = ["typst", "yaml"];

/**
 * Create a Shiki highlighter configured for lessons. Runs in the browser and in Node (build-time prerender).
 */
export function createLessonHighlighter(): Promise<Highlighter> {
  return createHighlighter({ themes: Object.values(shikiThemes), langs: shikiLangs });
}

/**
 * Render a chapter's raw markdown to HTML. Pass `null` for `highlighter` to fall back to plain `<pre><code>` blocks.
 */
export function renderLessonHtml(raw: string, highlighter: Highlighter | null): string {
  const renderer = new Renderer();

  renderer.code = ({ text, lang }) => {
    const highlighted = highlighter
      ? highlighter.codeToHtml(text, {
          lang: lang && highlighter.getLoadedLanguages().includes(lang) ? lang : "text",
          themes: shikiThemes,
          defaultColor: false,
        })
      : `<pre><code>${text}</code></pre>`;

    return `<div class="code-block" data-code="${encodeURIComponent(text)}">${highlighted}</div>`;
  };

  return new Marked({ renderer }).use(markedAlert()).parse(raw) as string;
}
