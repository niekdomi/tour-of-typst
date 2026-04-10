<script lang="ts">
  import Editor from "./Editor.svelte";
  import Preview from "./Preview.svelte";
  import ResizeHandle from "../components/ResizeHandle.svelte";
  import { getChapterTemplate, getChapterSolution, getChapterAuxFiles } from "../content";

  interface Props {
    locale: string;
    chapterKey: string;
    theme: "light" | "dark";
  }

  let { locale, chapterKey, theme }: Props = $props();

  let editorFraction = $state(0.5);
  let svg = $state<string | undefined>();

  const STORAGE_KEY = "tour-of-typst-edits";

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

  // Persist edits to localStorage so they survive page refresh.
  // Plain Map intentionally, SvelteMap would make doc reactive on every keystroke.
  const editsMap = loadEditsMap();
  const editsKey = (loc: string, key: string) => `${loc}:${key}`;

  const solution = $derived(getChapterSolution(locale, chapterKey));
  const template = $derived(getChapterTemplate(locale, chapterKey) ?? "");
  const auxFiles = $derived(getChapterAuxFiles(locale, chapterKey));

  // Resolve the document for the current chapter: saved edit > template > empty
  let doc = $state("");

  $effect(() => {
    doc = editsMap.get(editsKey(locale, chapterKey)) ?? template;
    svg = undefined;
  });

  // Update persisted edits for the current locale+chapter pair.
  function handleChange(content: string) {
    editsMap.set(editsKey(locale, chapterKey), content);
    saveEditsMap(editsMap);
  }
</script>

<div class="workspace">
  <div class="pane" style="flex: {editorFraction}">
    <Editor
      {doc}
      {template}
      {solution}
      {auxFiles}
      {theme}
      docKey="{locale}:{chapterKey}"
      onchange={handleChange}
      oncompile={(s: string) => (svg = s)}
    />
  </div>

  <ResizeHandle
    direction="vertical"
    fraction={editorFraction}
    onchange={(f: number) => (editorFraction = f)}
  />

  <div class="pane" style="flex: {1 - editorFraction}">
    <Preview {svg} />
  </div>
</div>

<style>
  .workspace {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .pane {
    min-height: 0;
    overflow: hidden;
  }
</style>
