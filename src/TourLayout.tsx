import { Show } from "solid-js";

import LessonContent from "./components/LessonContent";
import ResizeHandle from "./components/ResizeHandle";
import type { Chapter } from "./content/types";
import Workspace from "./editor/Workspace";

interface Props {
  locale: string;
  chapters: Chapter[];
  currentIndex: number;
  currentKey: string;
  contentFraction: number;
  resetGeneration: number;
  onContentFractionChange: (f: number) => void;
}

export default function TourLayout(props: Props) {
  const currentChapter = () => props.chapters[props.currentIndex];

  return (
    <div
      class="flex min-h-0 flex-1"
      style={{ "max-width": "1600px", width: "100%", margin: "0 auto" }}
    >
      <div
        class="border-border flex min-w-0 flex-col overflow-hidden border-r"
        style={{ flex: props.contentFraction }}
      >
        <main class="flex-1 overflow-y-auto px-12 py-8">
          <Show when={currentChapter()}>
            {(chapter) => (
              <LessonContent chapter={chapter()} index={props.currentIndex} locale={props.locale} />
            )}
          </Show>
        </main>
      </div>

      <ResizeHandle
        direction="horizontal"
        fraction={props.contentFraction}
        min={0.25}
        max={0.75}
        onChange={props.onContentFractionChange}
      />

      <div
        class="flex min-w-0 flex-col overflow-hidden"
        style={{ flex: 1 - props.contentFraction }}
      >
        <Workspace
          locale={props.locale}
          chapterKey={props.currentKey}
          resetGeneration={props.resetGeneration}
        />
      </div>
    </div>
  );
}
