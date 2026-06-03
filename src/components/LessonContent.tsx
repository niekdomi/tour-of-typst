import type { Highlighter } from "shiki";
import { createEffect, createMemo, createSignal, onCleanup, onMount, Show } from "solid-js";
import { render } from "solid-js/web";

import { getChapterMarkdown } from "../content";
import { renderLessonHtml } from "../content/render-lesson";
import type { Chapter } from "../content/types";
import { highlighterReady } from "../lib/highlighter";
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
    return renderLessonHtml(raw, highlighter());
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
