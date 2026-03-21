<script lang="ts">
  import Editor from "./Editor.svelte";
  import Preview from "./Preview.svelte";
  import ResizeHandle from "../components/ResizeHandle.svelte";
  import { getChapterTemplate, getChapterSolution } from "../content";

  interface Props {
    locale: string;
    chapterKey: string;
  }

  let { locale, chapterKey }: Props = $props();

  let editorFraction = $state(0.5);
  let svg = $state<string | undefined>();

  const template = $derived(getChapterTemplate(locale, chapterKey));
  const solution = $derived(getChapterSolution(locale, chapterKey));

  // Clear preview when chapter changes
  $effect(() => {
    chapterKey;
    svg = undefined;
  });
</script>

<div class="workspace">
  <div class="pane" style="flex: {editorFraction}">
    <Editor {template} {solution} oncompile={(s) => (svg = s)} />
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
