<script lang="ts">
  import Header from "./components/Header.svelte";
  import TourLayout from "./TourLayout.svelte";
  import { getTourForLocale, flattenChapters } from "./content";
  import { locale } from "./lib/locale.svelte";
  import { theme } from "./lib/theme.svelte";

  // --- Navigation ---
  const tour = $derived(getTourForLocale(locale.value));
  const parts = $derived(tour?.parts ?? []);
  const chapters = $derived(tour ? flattenChapters(tour) : []);

  let currentKey = $state(localStorage.getItem("tour-of-typst-chapter") ?? "");
  const currentIndex = $derived(
    Math.max(
      0,
      chapters.findIndex((c) => c.key === currentKey)
    )
  );

  $effect(() => {
    if ((!currentKey || !chapters.some((c) => c.key === currentKey)) && chapters.length > 0) {
      currentKey = chapters[0].key;
    }
  });

  $effect(() => {
    if (currentKey) {
      localStorage.setItem("tour-of-typst-chapter", currentKey);
    }
  });

  function navigate(index: number) {
    currentKey = chapters[index]?.key ?? "";
  }

  // --- Layout ---
  let contentFraction = $state(0.5);
  let tocDropdownOpen = $state(false);

  // Bump to force Workspace to remount and reload edits from (cleared) localStorage
  let resetGeneration = $state(0);

  function resetAll() {
    if (!confirm("Reset all chapters to their original templates?")) return;
    localStorage.removeItem("tour-of-typst-edits");
    resetGeneration++;
  }
</script>

<div class="app">
  <Header
    {parts}
    {chapters}
    {currentIndex}
    {contentFraction}
    bind:tocDropdownOpen
    onnavigate={navigate}
    onresetall={resetAll}
  />
  {#key resetGeneration}
    <TourLayout
      locale={locale.value}
      theme={theme.resolved}
      {chapters}
      {currentIndex}
      {currentKey}
      bind:contentFraction
      {tocDropdownOpen}
    />
  {/key}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    font-family: var(--font-sans);
  }
</style>
