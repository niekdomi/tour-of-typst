<script lang="ts">
  import Editor from "./Editor.svelte";
  import Preview from "./Preview.svelte";
  import ResizeHandle from "../components/ResizeHandle.svelte";
  import { getChapterTemplate, getChapterSolution } from "../content";

  interface Props {
    locale: string;
    chapterKey: string;
    theme: "light" | "dark";
  }

  let { locale, chapterKey, theme }: Props = $props();

  let editorFraction = $state(0.5);
  let svg = $state<string | undefined>();

  // Plain Map intentionally, SvelteMap would make doc reactive on every keystroke.
  // Persists edits per locale+chapter so navigation restores the last draft.
  // eslint-disable-next-line svelte/prefer-svelte-reactivity
  const editsMap = new Map<string, string>();
  const editsKey = (loc: string, key: string) => `${loc}:${key}`;

  const solution = $derived(getChapterSolution(locale, chapterKey));
  const template = $derived(getChapterTemplate(locale, chapterKey) ?? "");

  // Persist user edits per locale+chapter; restores them on navigation
  let doc = $state("");

  $effect(() => {
    doc = editsMap.get(editsKey(locale, chapterKey)) ?? template;
    svg = undefined;
  });

  // Update persisted edits for the current locale+chapter pair.
  function handleChange(content: string) {
    editsMap.set(editsKey(locale, chapterKey), content);
  }
</script>

<div class="workspace">
  <div class="pane" style="flex: {editorFraction}">
    <Editor
      {doc}
      {template}
      {solution}
      {theme}
      docKey="{locale}:{chapterKey}"
      onchange={handleChange}
      oncompile={(s) => (svg = s)}
    />
  </div>

  <ResizeHandle
    direction="vertical"
    fraction={editorFraction}
    onchange={(f) => (editorFraction = f)}
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
