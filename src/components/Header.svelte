<script lang="ts">
  import Dropdown from "./Dropdown.svelte";
  import TableOfContents from "./TableOfContents.svelte";
  import { getTranslations, defaultLocale } from "../../content/i18n";
  import type { Locale } from "../../content/i18n";
  import { availableLocales } from "../content";
  import type { Chapter, Part } from "../content/types";

  type Theme = "auto" | "light" | "dark";

  interface Props {
    locale: Locale;
    parts?: Part[];
    chapters?: Chapter[];
    currentIndex?: number;
    contentFraction?: number;
    tocDropdownOpen?: boolean;
    onnavigate?: (index: number) => void;
  }

  let {
    locale = $bindable(defaultLocale),
    parts = [],
    chapters = [],
    currentIndex = 0,
    contentFraction = 0.5,
    tocDropdownOpen = $bindable(false),
    onnavigate,
  }: Props = $props();

  const t = $derived(getTranslations(locale));
  const localeOptions = availableLocales.map(({ locale, label }) => ({ value: locale, label }));

  // --- Theme ---
  let theme = $state<Theme>((localStorage.getItem("theme") as Theme) ?? "auto");

  const themeOptions = $derived([
    { value: "auto", label: t.themeAuto },
    { value: "light", label: t.themeLight },
    { value: "dark", label: t.themeDark },
  ]);

  function applyTheme(value: Theme) {
    let resolved: "dark" | "light";
    if (value === "auto") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      resolved = value as "dark" | "light";
    }
    document.documentElement.setAttribute("data-theme", resolved);
  }

  $effect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("auto");
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  });

  $effect(() => {
    localStorage.setItem("locale", locale);
  });

  const hasPrev = $derived(currentIndex > 0);
  const hasNext = $derived(currentIndex < chapters.length - 1);
</script>

<header>
  <div class="header-inner">
    <div class="left" style="flex: {contentFraction}">
      <span class="brand">
        <span class="brand-tour">Tour of</span>
        <a href="https://typst.app/" target="_blank" rel="noopener noreferrer" class="brand-typst"
          >typst</a
        >
      </span>

      {#if parts.length > 0}
        <div class="divider"></div>
        <TableOfContents
          {parts}
          {chapters}
          {currentIndex}
          bind:open={tocDropdownOpen}
          {onnavigate}
        />

        <div class="nav-arrows" aria-label="Chapter navigation">
          <button
            disabled={!hasPrev}
            aria-label="Previous chapter"
            onclick={() => onnavigate?.(currentIndex - 1)}>←</button
          >
          <button
            disabled={!hasNext}
            aria-label="Next chapter"
            onclick={() => onnavigate?.(currentIndex + 1)}>→</button
          >
        </div>
      {/if}
    </div>

    <div class="right" style="flex: {1 - contentFraction}">
      <Dropdown options={localeOptions} bind:value={locale} label={t.selectLanguage} />
      <Dropdown options={themeOptions} bind:value={theme} label={t.selectTheme} />
    </div>
  </div>
</header>

<style>
  header {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    height: 3.5rem;
  }

  .header-inner {
    display: flex;
    align-items: center;
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 100%;
  }

  .left,
  .right {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
    position: relative;
  }


  .right {
    justify-content: flex-end;
  }

  .brand {
    display: flex;
    align-items: baseline;
    gap: 0.3em;
    flex-shrink: 0;
    font-family: "Buenard", serif;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1;
    white-space: nowrap;
    color: var(--brand-color);
  }

  .brand-typst {
    color: var(--brand-color);
    text-decoration: none;
  }

  .brand-typst:hover {
    text-decoration: underline;
  }

  .divider {
    width: 1px;
    height: 1.25rem;
    background: var(--color-border);
    flex-shrink: 0;
  }

  .nav-arrows {
    display: flex;
    gap: 0.25rem;
    margin-left: auto;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .nav-arrows button {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 6px;
    border: none;
    background: var(--btn-fill);
    color: var(--btn-text);
    cursor: pointer;
    transition: background 0.15s;
    font-size: 1rem;
    line-height: 1;
  }

  .nav-arrows button:hover:not(:disabled) {
    background: var(--btn-fill-hover);
  }

  .nav-arrows button:disabled {
    opacity: 0.25;
    cursor: default;
  }

  @media (max-width: 800px) {
    .brand {
      display: none;
    }
    .divider {
      display: none;
    }
  }
</style>
