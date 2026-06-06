import type { RenderedSvgPage } from "@vedivad/typst-web-service";
import { createEffect, createMemo, createSignal, on, Show } from "solid-js";

import ResizeHandle from "../components/ResizeHandle";
import { getChapterAuxFiles, getChapterSolution, getChapterTemplate } from "../content";
import Editor from "./Editor";
import EditorShell from "./EditorShell";
import { getEdit, setEdit } from "./edits-store";
import Preview from "./Preview";

interface Props {
  locale: string;
  chapterKey: string;
  resetGeneration: number;
}

export default function Workspace(props: Props) {
  const [editorFraction, setEditorFraction] = createSignal(0.5);
  const [pages, setPages] = createSignal<RenderedSvgPage[]>([]);

  const solution = createMemo(() => getChapterSolution(props.locale, props.chapterKey));
  const template = createMemo(() => getChapterTemplate(props.locale, props.chapterKey) ?? "");
  const auxFiles = createMemo(() => getChapterAuxFiles(props.locale, props.chapterKey));
  const doc = createMemo(() => getEdit(props.locale, props.chapterKey) ?? template());

  // Identity of the active chapter; a change remounts the editor (keyed <Show>)
  // and clears the stale preview.
  const editorKey = createMemo(
    () => `${props.locale}:${props.chapterKey}:${String(props.resetGeneration)}`
  );

  createEffect(on(editorKey, () => setPages([]), { defer: true }));

  function handleChange(content: string) {
    setEdit(props.locale, props.chapterKey, content);
  }

  return (
    <div class="flex h-full flex-col overflow-hidden">
      {/* One shell wraps both panes so the editor and preview share the same
          TypstProject (the preview resolves link clicks through it). */}
      <EditorShell>
        <div class="min-h-0 overflow-hidden" style={{ flex: editorFraction() }}>
          <Show when={editorKey()} keyed>
            <Editor
              doc={doc()}
              template={template()}
              solution={solution()}
              auxFiles={auxFiles()}
              onChange={handleChange}
              onCompile={setPages}
            />
          </Show>
        </div>

        <ResizeHandle
          direction="vertical"
          fraction={editorFraction()}
          onChange={setEditorFraction}
        />

        <div class="min-h-0 overflow-hidden" style={{ flex: 1 - editorFraction() }}>
          <Preview pages={pages()} />
        </div>
      </EditorShell>
    </div>
  );
}
