import { useSearchParams } from "@solidjs/router";
import { type Accessor, createEffect, createMemo } from "solid-js";

import type { Chapter } from "../content/types";

const STORAGE_KEY = "tour-of-typst-chapter";

export function useChapterRoute(chapters: Accessor<Chapter[]>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentIndex = createMemo(() => {
    const key = searchParams["chapter"] ?? "";
    const index = chapters().findIndex((c) => c.key === key);
    return Math.max(index, 0);
  });

  const currentKey = createMemo(() => chapters()[currentIndex()]?.key ?? "");

  createEffect(() => {
    const chs = chapters();
    if (chs.length === 0) {
      return;
    }
    const current = searchParams["chapter"];
    if (!current || !chs.some((c) => c.key === current)) {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedIsValid = saved !== null && chs.some((c) => c.key === saved);

      const initial = savedIsValid ? saved : (chs[0]?.key ?? "");
      setSearchParams({ chapter: initial }, { replace: true });
    }
  });

  createEffect(() => {
    const key = currentKey();
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    }
  });

  function navigate(index: number) {
    const key = chapters()[index]?.key;
    if (key) {
      setSearchParams({ chapter: key });
    }
  }

  return { currentIndex, currentKey, navigate };
}
