import type { RenderedSvgPage } from "@vedivad/typst-web-service";
import { createEffect, createMemo, createSignal, For, on } from "solid-js";

import ResizeHandle from "../components/ResizeHandle";
import { getChapterAuxFiles, getChapterSolution, getChapterTemplate } from "../content";
import Editor from "./Editor";
import EditorShell from "./EditorShell";
import Preview from "./Preview";

interface Props {
  locale: string;
  chapterKey: string;
  resetGeneration: number;
}

const STORAGE_KEY = "tour-of-typst-edits";
const editsKey = (loc: string, key: string) => `${loc}:${key}`;

function loadEditsMap(): Map<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Map(JSON.parse(raw) as [string, string][]);
  } catch {
    // corrupt data, start fresh
  }
  return new Map();
}

function saveEditsMap(map: Map<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...map.entries()]));
  } catch {
    // storage full or unavailable
  }
}

export default function Workspace(props: Props) {
  const [editorFraction, setEditorFraction] = createSignal(0.5);
  const [pages, setPages] = createSignal<RenderedSvgPage[]>([]);
  const [editorId, setEditorId] = createSignal(0);

  const editsMap = loadEditsMap();
  const solution = createMemo(() => getChapterSolution(props.locale, props.chapterKey));
  const template = createMemo(() => getChapterTemplate(props.locale, props.chapterKey) ?? "");
  const auxFiles = createMemo(() => getChapterAuxFiles(props.locale, props.chapterKey));
  const doc = createMemo(
    () => editsMap.get(editsKey(props.locale, props.chapterKey)) ?? template()
  );

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
    editsMap.set(editsKey(props.locale, props.chapterKey), content);
    saveEditsMap(editsMap);
  }

  return (
    <div class="flex h-full flex-col overflow-hidden">
      <div class="min-h-0 overflow-hidden" style={{ flex: editorFraction() }}>
        <EditorShell>
          <For each={[editorId()]}>
            {() => (
              <Editor
                doc={doc()}
                template={template()}
                solution={solution()}
                auxFiles={auxFiles()}
                onChange={handleChange}
                onCompile={setPages}
              />
            )}
          </For>
        </EditorShell>
      </div>

      <ResizeHandle direction="vertical" fraction={editorFraction()} onChange={setEditorFraction} />

      <div class="min-h-0 overflow-hidden" style={{ flex: 1 - editorFraction() }}>
        <Preview pages={pages()} />
      </div>
    </div>
  );
}
