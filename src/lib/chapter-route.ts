import { useNavigate, useParams } from "@solidjs/router";
import { type Accessor, createEffect, createMemo } from "solid-js";

import type { Chapter } from "../content/types";

export function useChapterRoute(chapters: Accessor<Chapter[]>) {
  const params = useParams<{ chapter?: string }>();
  const navigate = useNavigate();

  const currentIndex = createMemo(() => {
    const key = params.chapter ?? "";
    const index = chapters().findIndex((c) => c.key === key);
    return Math.max(index, 0);
  });

  const currentKey = createMemo(() => chapters()[currentIndex()]?.key ?? "");

  // A chapter was named in the URL but matches no loaded chapter.
  const notFound = createMemo(() => {
    const chs = chapters();
    const current = params.chapter;
    return chs.length > 0 && !!current && !chs.some((c) => c.key === current);
  });

  // The bare root path (no chapter in the URL) redirects to the first chapter.
  // A named chapter is left in place; invalid ones surface the not-found screen.
  createEffect(() => {
    const chs = chapters();
    if (chs.length === 0 || params.chapter) {
      return;
    }

    const first = chs[0]?.key ?? "";
    if (first) {
      navigate(`/${first}`, { replace: true });
    }
  });

  function goToIndex(index: number) {
    const key = chapters()[index]?.key;
    if (key) {
      navigate(`/${key}`);
    }
  }

  return { currentIndex, currentKey, notFound, navigate: goToIndex };
}
