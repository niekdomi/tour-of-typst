<script lang="ts">
  import ResizeHandle from "./components/ResizeHandle.svelte";
  import Workspace from "./editor/Workspace.svelte";
  import LessonContent from "./components/LessonContent.svelte";
  import type { Chapter } from "./content/types";

  interface Props {
    locale: string;
    theme: "light" | "dark";
    chapters: Chapter[];
    currentIndex: number;
    currentKey: string;
    contentFraction: number;
    tocDropdownOpen: boolean;
  }

  let {
    locale,
    theme,
    chapters,
    currentIndex,
    currentKey,
    // eslint-disable-next-line @typescript-eslint/no-useless-default-assignment
    contentFraction = $bindable(),
    tocDropdownOpen,
  }: Props = $props();
</script>

<div class="layout">
  <div class="content-side" style="flex: {contentFraction}">
    <main class="content-panel" class:blurred={tocDropdownOpen}>
      <LessonContent chapter={chapters[currentIndex]} index={currentIndex} {locale} />
    </main>
  </div>

  <ResizeHandle
    direction="horizontal"
    fraction={contentFraction}
    min={0.25}
    max={0.75}
    onchange={(f: number) => (contentFraction = f)}
  />

  <div class="workspace-side" style="flex: {1 - contentFraction}">
    <Workspace {locale} chapterKey={currentKey} {theme} />
  </div>
</div>

<style>
  .layout {
    display: flex;
    flex: 1;
    min-height: 0;
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
  }

  .content-side,
  .workspace-side {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    border-right: 1px solid var(--color-border);
  }

  .content-panel {
    flex: 1;
    overflow-y: auto;
    padding: 2rem 3rem;
    transition: filter 0.2s ease;
  }

  .content-panel.blurred {
    filter: blur(3px);
    pointer-events: none;
    user-select: none;
  }
</style>
