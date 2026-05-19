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
  const [editorId, setEditorId] = createSignal(1);

  const solution = createMemo(() => getChapterSolution(props.locale, props.chapterKey));
  const template = createMemo(() => getChapterTemplate(props.locale, props.chapterKey) ?? "");
  const auxFiles = createMemo(() => getChapterAuxFiles(props.locale, props.chapterKey));
  const doc = createMemo(() => getEdit(props.locale, props.chapterKey) ?? template());

  createEffect(
    on(
      [() => props.locale, () => props.chapterKey, () => props.resetGeneration],
      () => {
        setPages([]);
        setEditorId((n) => n + 1);
      },
      { defer: true }
    )
  );

  function handleChange(content: string) {
    setEdit(props.locale, props.chapterKey, content);
  }

  return (
    <div class="flex h-full flex-col overflow-hidden">
      <div class="min-h-0 overflow-hidden" style={{ flex: editorFraction() }}>
        <EditorShell>
          <Show when={editorId()} keyed>
            <Editor
              doc={doc()}
              template={template()}
              solution={solution()}
              auxFiles={auxFiles()}
              onChange={handleChange}
              onCompile={setPages}
            />
          </Show>
        </EditorShell>
      </div>

      <ResizeHandle direction="vertical" fraction={editorFraction()} onChange={setEditorFraction} />

      <div class="min-h-0 overflow-hidden" style={{ flex: 1 - editorFraction() }}>
        <Preview pages={pages()} />
      </div>
    </div>
  );
}
