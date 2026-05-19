import { Marked, Renderer } from "marked";
import markedAlert from "marked-alert";
import type { Highlighter } from "shiki";
import { createMemo, createSignal, onMount } from "solid-js";

import { getChapterMarkdown } from "../content";
import type { Chapter } from "../content/types";
import { highlighterReady } from "../lib/highlighter";
import { checkIcon, copyIcon } from "../lib/Icons";

interface Props {
  chapter: Chapter;
  index: number;
  locale: string;
}

function handleClick(e: MouseEvent) {
  const btn = (e.target as Element).closest<HTMLButtonElement>(".copy-btn");
  if (!btn) return;
  const code = decodeURIComponent(btn.dataset["code"] ?? "");
  void (async () => {
    await navigator.clipboard.writeText(code);
    btn.innerHTML = checkIcon;
    setTimeout(() => {
      btn.innerHTML = copyIcon;
    }, 1500);
  })();
}

export default function LessonContent(props: Props) {
  const [highlighter, setHighlighter] = createSignal<Highlighter | null>(null);
  onMount(() => {
    void (async () => {
      setHighlighter(await highlighterReady);
    })();
  });

  const html = createMemo(() => {
    const raw = getChapterMarkdown(props.locale, props.chapter.key);
    if (!raw) return null;

    const hl = highlighter();
    const renderer = new Renderer();
    renderer.code = ({ text, lang }) => {
      const highlighted = hl
        ? hl.codeToHtml(text, {
            lang: lang && hl.getLoadedLanguages().includes(lang) ? lang : "text",
            themes: { light: "github-light", dark: "github-dark-dimmed" },
            defaultColor: false,
          })
        : `<pre><code>${text}</code></pre>`;
      return `<div class="code-block">${highlighted}<button class="copy-btn" data-code="${encodeURIComponent(text)}" title="Copy">${copyIcon}</button></div>`;
    };

    return new Marked({ renderer }).use(markedAlert()).parse(raw) as string;
  });

  return (
    <article class="lesson" onClick={handleClick}>
      <div class="lesson-chapter-label">
        {props.chapter.key === "welcome" ? "" : `Chapter ${String(props.index)}`}
      </div>
      {html() ? (
        <div innerHTML={html()!} />
      ) : (
        <>
          <h1>{props.chapter.title}</h1>
          <p class="placeholder">
            Content for <em>{props.chapter.title}</em> is coming soon.
          </p>
        </>
      )}
    </article>
  );
}
