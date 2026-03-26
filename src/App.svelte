<script lang="ts">
  import Header from "./components/Header.svelte";
  import ResizeHandle from "./components/ResizeHandle.svelte";
  import Workspace from "./editor/Workspace.svelte";
  import { getTourForLocale, flattenChapters } from "./content";
  import LessonContent from "./components/LessonContent.svelte";
  import { defaultLocale } from "../content/i18n";
  import type { Locale } from "../content/i18n";

  let locale = $state<Locale>((localStorage.getItem("locale") as Locale) ?? defaultLocale);

  const tour = $derived(getTourForLocale(locale));
  const parts = $derived(tour?.parts ?? []);
  const chapters = $derived(tour ? flattenChapters(tour) : []);

  // Key is the stable identity — survives locale switches
  let currentKey = $state(chapters[0]?.key ?? "");

  // Index is derived: find key in current locale's chapters, fall back to 0
  const currentIndex = $derived(
    Math.max(
      0,
      chapters.findIndex((c) => c.key === currentKey)
    )
  );

  function navigate(index: number) {
    currentKey = chapters[index]?.key ?? "";
  }

  let contentFraction = $state(0.5);
  let tocDropdownOpen = $state(false);
</script>

<div class="app">
  <Header
    bind:locale
    {parts}
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
      <Workspace {locale} chapterKey={currentKey} />
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
