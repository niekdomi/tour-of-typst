<script lang="ts">
  import Editor from "./Editor.svelte";
  import Preview from "./Preview.svelte";
  import ResizeHandle from "../components/ResizeHandle.svelte";

  let editorFraction = $state(0.5);
</script>

<div class="workspace">
  <div class="pane" style="flex: {editorFraction}">
    <Editor />
  </div>

  <ResizeHandle
    direction="vertical"
    fraction={editorFraction}
    onchange={(f) => (editorFraction = f)}
  />

  <div class="pane" style="flex: {1 - editorFraction}">
    <Preview />
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
