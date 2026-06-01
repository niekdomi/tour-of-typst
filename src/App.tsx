import { createMemo, createSignal } from "solid-js";

import Header from "./components/Header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { flattenChapters, getTourForLocale } from "./content";
import { clearAllEdits } from "./editor/edits-store";
import { useChapterRoute } from "./lib/chapter-route";
import { locale } from "./lib/locale";
import { ThemeProvider } from "./lib/ThemeContext";
import TourLayout from "./TourLayout";

function TourApp() {
  const [contentFraction, setContentFraction] = createSignal(0.5);
  const [globalReset, setGlobalReset] = createSignal(0);
  const [resetDialogOpen, setResetDialogOpen] = createSignal(false);
  const [tocOpen, setTocOpen] = createSignal(false);

  const tour = createMemo(() => getTourForLocale(locale()));
  const parts = createMemo(() => tour()?.parts ?? []);
  const chapters = createMemo(() => {
    const t = tour();
    return t ? flattenChapters(t) : [];
  });

  const { currentIndex, currentKey, navigate } = useChapterRoute(chapters);

  /** Will set all chapters to their initial state */
  function confirmResetAll() {
    clearAllEdits();
    setGlobalReset((g) => g + 1);
  }

  return (
    <div class="flex h-screen flex-col overflow-hidden" style={{ "font-family": "var(--sans)" }}>
      <Header
        parts={parts()}
        chapters={chapters()}
        currentIndex={currentIndex()}
        contentFraction={contentFraction()}
        onNavigate={navigate}
        onResetAll={() => setResetDialogOpen(true)}
        onTocOpenChange={setTocOpen}
      />
      <TourLayout
        locale={locale()}
        chapters={chapters()}
        currentIndex={currentIndex()}
        currentKey={currentKey()}
        contentFraction={contentFraction()}
        resetGeneration={globalReset()}
        onContentFractionChange={setContentFraction}
        contentBlurred={tocOpen()}
      />
      <AlertDialog open={resetDialogOpen()} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all chapters?</AlertDialogTitle>
            <AlertDialogDescription>
              This will discard all your edits and restore every chapter to its original template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmResetAll}>
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
