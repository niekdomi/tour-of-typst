<script lang="ts">
  import Header from "./components/Header.svelte";
  import ResizeHandle from "./components/ResizeHandle.svelte";
  import Workspace from "./editor/Workspace.svelte";
  import { getTourForLocale } from "./content";
  import LessonContent from "./components/LessonContent.svelte";
  import { defaultLocale } from "./lib/i18n";
  import type { Locale } from "./lib/i18n";
  import type { Chapter } from "./content/types";

  let locale = $state<Locale>((localStorage.getItem("locale") as Locale) ?? defaultLocale);

  const chapters: Chapter[] = $derived(getTourForLocale(locale)?.chapters ?? []);

  let currentIndex = $state(0);

  function navigate(index: number) {
    currentIndex = index;
  }

  let contentFraction = $state(0.5);
  let tocDropdownOpen = $state(false);
</script>

<div class="app">
  <Header
    bind:locale
    {chapters}
    {currentIndex}
    {contentFraction}
    bind:tocDropdownOpen
    onnavigate={navigate}
  />

  <div class="layout">
    <div class="content-side" style="flex: {contentFraction}">
      <main class="content-panel" class:blurred={tocDropdownOpen}>
        <LessonContent chapter={chapters[currentIndex]} index={currentIndex} {locale} />
      </main>
    </div>

    <ResizeHandle
      direction="horizontal"
      fraction={contentFraction}
      onchange={(f) => (contentFraction = f)}
    />

    <div class="workspace-side" style="flex: {1 - contentFraction}">
      <Workspace />
    </div>
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    font-family: var(--font-sans);
  }

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
