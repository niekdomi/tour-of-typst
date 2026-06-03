import { useNavigate, useParams } from "@solidjs/router";
import { type Accessor, createEffect, createMemo } from "solid-js";

import type { Chapter } from "../content/types";

const STORAGE_KEY = "tour-of-typst-chapter";

export function useChapterRoute(chapters: Accessor<Chapter[]>) {
  const params = useParams<{ chapter?: string }>();
  const navigate = useNavigate();

  const currentIndex = createMemo(() => {
    const key = params.chapter ?? "";
    const index = chapters().findIndex((c) => c.key === key);
    return Math.max(index, 0);
  });

  const currentKey = createMemo(() => chapters()[currentIndex()]?.key ?? "");

  createEffect(() => {
    const chs = chapters();
    if (chs.length === 0) {
      return;
    }
    const current = params.chapter;
    if (!current || !chs.some((c) => c.key === current)) {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedIsValid = saved !== null && chs.some((c) => c.key === saved);

      const initial = savedIsValid ? saved : (chs[0]?.key ?? "");
      if (initial) {
        navigate(`/${initial}`, { replace: true });
      }
    }
  });

  createEffect(() => {
    const key = currentKey();
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    }
  });

  function goToIndex(index: number) {
    const key = chapters()[index]?.key;
    if (key) {
      navigate(`/${key}`);
    }
  }

  return { currentIndex, currentKey, navigate: goToIndex };
}
