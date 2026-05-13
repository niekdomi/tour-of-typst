import { useSearchParams } from "@solidjs/router";
import { createEffect, createMemo, createSignal } from "solid-js";

import Header from "./components/Header";
import { flattenChapters, getTourForLocale } from "./content";
import { locale } from "./lib/locale";
import { ThemeProvider } from "./lib/ThemeContext";
import TourLayout from "./TourLayout";

function TourApp() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contentFraction, setContentFraction] = createSignal(0.5);
  const [resetGeneration, setResetGeneration] = createSignal(0);

  const tour = createMemo(() => getTourForLocale(locale()));
  const parts = createMemo(() => tour()?.parts ?? []);
  const chapters = createMemo(() => {
    const t = tour();
    return t ? flattenChapters(t) : [];
  });

  const currentIndex = createMemo(() => {
    const key = searchParams["chapter"] ?? "";
    const idx = chapters().findIndex((c) => c.key === key);
    return Math.max(idx, 0);
  });

  const currentKey = createMemo(() => chapters()[currentIndex()]?.key ?? "");

  createEffect(() => {
    const chs = chapters();
    if (chs.length === 0) return;
    if (!searchParams["chapter"] || !chs.some((c) => c.key === searchParams["chapter"])) {
      const saved = localStorage.getItem("tour-of-typst-chapter");
      const initial = (saved && chs.some((c) => c.key === saved) ? saved : chs[0]?.key) ?? "";
      setSearchParams({ chapter: initial }, { replace: true });
    }
  });

  createEffect(() => {
    const key = currentKey();
    if (key) localStorage.setItem("tour-of-typst-chapter", key);
  });

  function navigate(index: number) {
    const key = chapters()[index]?.key;
    if (key) setSearchParams({ chapter: key });
  }

  function resetAll() {
    if (!confirm("Reset all chapters to their original templates?")) return;
    localStorage.removeItem("tour-of-typst-edits");
    setResetGeneration((g) => g + 1);
  }

  return (
    <div class="flex h-screen flex-col overflow-hidden" style={{ "font-family": "var(--sans)" }}>
      <Header
        parts={parts()}
        chapters={chapters()}
        currentIndex={currentIndex()}
        contentFraction={contentFraction()}
        onNavigate={navigate}
        onResetAll={resetAll}
      />
      <TourLayout
        locale={locale()}
        chapters={chapters()}
        currentIndex={currentIndex()}
        currentKey={currentKey()}
        contentFraction={contentFraction()}
        resetGeneration={resetGeneration()}
        onContentFractionChange={setContentFraction}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TourApp />
    </ThemeProvider>
  );
}
