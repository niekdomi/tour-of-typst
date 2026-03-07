<script lang="ts">
  import Dropdown from "./Dropdown.svelte";
  import { availableLocales } from "../content";

  type Theme = "auto" | "light" | "dark";

  interface Props {
    onTocToggle?: () => void;
  }

  let { onTocToggle }: Props = $props();

  // --- Theme -------------------------------------------------------------------------------------
  let theme = $state<Theme>((localStorage.getItem("theme") as Theme) ?? "auto");

  function applyTheme(t: Theme) {
    let resolved: "dark" | "light";

    if (t === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      resolved = prefersDark ? "dark" : "light";
    } else {
      resolved = t;
    }

    document.documentElement.setAttribute("data-theme", resolved);
  }

  $effect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const Listener = () => applyTheme("auto");

      mediaQuery.addEventListener("change", Listener);
      return () => mediaQuery.removeEventListener("change", Listener);
    }
  });

  // --- Locale ------------------------------------------------------------------------------------
  const localeOptions = availableLocales.map((l) => ({
    value: l.locale,
    label: l.label,
  }));

  // NOTE: This hardcodes english as default. If the browser default should be
  // respected, this needs to be changed.
  let locale = $state(localStorage.getItem("locale") ?? "en");

  $effect(() => localStorage.setItem("locale", locale));
</script>

<header>
  <div class="left">
    <button
      class="toc-btn"
      type="button"
      aria-label="Toggle table of contents"
      onclick={onTocToggle}>☰</button
    >
    <span class="title">Tour of Typst</span>
  </div>

  <div class="right">
      <Dropdown
        options={localeOptions}
        bind:value={locale}
        aria-label="Select language"
      >
    <Dropdown
        options={themeOptions}
        bind:value={theme}
        aria-label="Select Theme">
<a
        href="https://www.ost.ch"
        target="_blank"
        aria-label="Ost - Ostschweizer Fachhochschule"
    >
      <img src="../../public/ost-logo.svg" alt="OST Logo" />
    </a>
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    height: 4rem;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-surface);
  }

  .left, .right {
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 500;
  }

  .toc-btn {

  }

  .toc-btn:hover {

  }

  .right img {
      height: 2rem;
      display: block;
  }
</style>
