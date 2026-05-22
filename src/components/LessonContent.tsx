import { Marked, Renderer } from "marked";
import markedAlert from "marked-alert";
import type { Highlighter } from "shiki";
import { createEffect, createMemo, createSignal, onCleanup, onMount, Show } from "solid-js";
import { render } from "solid-js/web";

import { getChapterMarkdown } from "../content";
import type { Chapter } from "../content/types";
import { highlighterReady, shikiThemes } from "../lib/highlighter";
import { CopyButton } from "./CopyButton";

interface Props {
  chapter: Chapter;
  index: number;
  locale: string;
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
    if (!raw) {
      return null;
    }

    const hl = highlighter();
    const renderer = new Renderer();
    renderer.code = ({ text, lang }) => {
      const highlighted = hl
        ? hl.codeToHtml(text, {
            lang: lang && hl.getLoadedLanguages().includes(lang) ? lang : "text",
            themes: shikiThemes,
            defaultColor: false,
          })
        : `<pre><code>${text}</code></pre>`;
      return `<div class="code-block" data-code="${encodeURIComponent(text)}">${highlighted}</div>`;
    };

    return new Marked({ renderer }).use(markedAlert()).parse(raw) as string;
  });

  let contentRef: HTMLDivElement | undefined;
  const disposers: (() => void)[] = [];

  createEffect(() => {
    const content = html();

    for (const disposer of disposers) {
      disposer();
    }

    disposers.length = 0;

    if (!contentRef || !content) {
      return;
    }

    contentRef.innerHTML = content;

    for (const block of contentRef.querySelectorAll<HTMLElement>(".code-block[data-code]")) {
      const code = decodeURIComponent(block.dataset["code"] ?? "");
      const anchor = document.createElement("span");

      block.append(anchor);
      disposers.push(render(() => <CopyButton code={code} />, anchor));
    }
  });

  onCleanup(() => {
    for (const disposer of disposers) {
      disposer();
    }
  });

  return (
    <article class="lesson">
      <div class="lesson-chapter-label">
        {props.chapter.key === "welcome" ? "" : `Chapter ${String(props.index)}`}
      </div>
      <Show
        when={html()}
        fallback={
          <>
            <h1>{props.chapter.title}</h1>
            <p class="placeholder">
              Content for <em>{props.chapter.title}</em> is coming soon.
            </p>
          </>
        }
      >
        <div
          ref={(el) => {
            contentRef = el;
          }}
        />
      </Show>
    </article>
  );
}
