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

  let currentKey = $state("");
  const currentIndex = $derived(
    Math.max(
      0,
      chapters.findIndex((c) => c.key === currentKey)
    )
  );

  $effect(() => {
    if (!currentKey && chapters.length > 0) currentKey = chapters[0].key;
  });

  function navigate(index: number) {
    currentKey = chapters[index]?.key ?? "";
  }

  // --- Layout ---
  let contentFraction = $state(0.5);
  let tocDropdownOpen = $state(false);
</script>

<div class="app">
  <Header
    {parts}
    {chapters}
    {currentIndex}
    {contentFraction}
    bind:tocDropdownOpen
    onnavigate={navigate}
  />
  <TourLayout
    locale={locale.value}
    theme={theme.resolved}
    {chapters}
    {currentIndex}
    {currentKey}
    bind:contentFraction
    {tocDropdownOpen}
  />
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
