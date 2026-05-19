import { createSignal, For, Show } from "solid-js";

import type { Chapter, Part } from "../content/types";

interface Props {
  parts: Part[];
  chapters: Chapter[];
  currentIndex: number;
  onNavigate?: (index: number) => void;
}

export default function TableOfContents(props: Props) {
  const [open, setOpen] = createSignal(false);

  function select(index: number) {
    props.onNavigate?.(index);
    setOpen(false);
  }

  function flatIndex(partIndex: number, chapterIndex: number): number {
    return (
      props.parts.slice(0, partIndex).reduce((sum, part) => sum + part.chapters.length, 0) +
      chapterIndex
    );
  }

  return (
    <div class="relative min-w-0 flex-1">
      <button
        type="button"
        class="hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1 text-base font-semibold"
        onClick={() => setOpen((o) => !o)}
      >
        <span class="min-w-0 flex-1 truncate text-left">
          {props.chapters[props.currentIndex]?.title ?? ""}
        </span>
        <svg
          class="size-3 shrink-0 opacity-60 transition-transform"
          classList={{ "rotate-180": open() }}
          aria-hidden="true"
          viewBox="0 0 10 6"
          fill="none"
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <Show when={open()}>
        <button
          type="button"
          class="fixed inset-0 z-40 cursor-default bg-transparent"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
        <ul class="toc-menu border-border bg-popover absolute top-full right-0 left-0 z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border py-1.5 shadow-lg">
          <For each={props.parts}>
            {(part, pi) => (
              <>
                <li class="toc-part-header text-muted-foreground [&:not(:first-child)]:border-border px-4 pt-2 pb-2 text-[0.7rem] font-bold tracking-widest uppercase first:pt-1.5 [&:not(:first-child)]:mt-3 [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-3">
                  {part.title}
                </li>
                <For each={part.chapters}>
                  {(chapter, ci) => {
                    const idx = flatIndex(pi(), ci());
                    return (
                      <li classList={{ "toc-active": idx === props.currentIndex }}>
                        <button
                          type="button"
                          class="text-muted-foreground hover:text-foreground w-full py-2 pr-4 pl-8 text-left text-base transition-colors"
                          classList={{
                            "font-semibold text-brand! hover:text-brand!":
                              idx === props.currentIndex,
                          }}
                          onClick={() => {
                            select(idx);
                          }}
                        >
                          {chapter.title}
                        </button>
                      </li>
                    );
                  }}
                </For>
              </>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}
