<script lang="ts">
  import Dropdown from "./Dropdown.svelte";
  import TableOfContents from "./TableOfContents.svelte";
  import { getTranslations, defaultLocale, localeLabels } from "../lib/i18n";
  import type { Locale } from "../lib/i18n";
  import type { Chapter } from "../content/types";

  type Theme = "auto" | "light" | "dark";

  interface Props {
    locale: Locale;
    chapters?: Chapter[];
    currentIndex?: number;
    contentFraction?: number;
    tocDropdownOpen?: boolean;
    onnavigate?: (index: number) => void;
  }

  let {
    locale = $bindable(defaultLocale),
    chapters = [],
    currentIndex = 0,
    contentFraction = 0.5,
    tocDropdownOpen = $bindable(false),
    onnavigate,
  }: Props = $props();

  const t = $derived(getTranslations(locale));
  const localeOptions = Object.entries(localeLabels).map(([value, label]) => ({ value, label }));

  // --- Theme ---
  let theme = $state<Theme>((localStorage.getItem("theme") as Theme) ?? "auto");
  let resolvedTheme = $state<"light" | "dark">("light");

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
    resolvedTheme = resolved;
    document.documentElement.setAttribute("data-theme", resolved);
  }

  $effect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    localStorage.setItem("locale", locale);

    if (theme === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("auto");
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  });

  const hasPrev = $derived(currentIndex > 0);
  const hasNext = $derived(currentIndex < chapters.length - 1);
</script>

<header>
  <div class="header-inner">
    <div class="left" style="flex: {contentFraction}">
      <span class="brand">Tour of Typst</span>

      {#if chapters.length > 0}
        <div class="divider"></div>
        <TableOfContents {chapters} {currentIndex} bind:open={tocDropdownOpen} {onnavigate} />

        <div class="nav-arrows">
          <button disabled={!hasPrev} onclick={() => onnavigate?.(currentIndex - 1)}>←</button>
          <button disabled={!hasNext} onclick={() => onnavigate?.(currentIndex + 1)}>→</button>
        </div>
      {/if}
    </div>

    <div class="right" style="flex: {1 - contentFraction}">
      <Dropdown options={localeOptions} bind:value={locale} label={t.selectLanguage} />
      <Dropdown options={themeOptions} bind:value={theme} label={t.selectTheme} />
      <a href="https://www.ost.ch" target="_blank" class="logo">
        <img src={resolvedTheme === "dark" ? "/ost-logo-dark.svg" : "/ost-logo.svg"} alt="OST" />
      </a>
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
  }

  .right {
    justify-content: flex-end;
  }

  .brand {
    font-weight: 600;
    white-space: nowrap;
  }
  .divider {
    width: 1px;
    height: 1.25rem;
    background: var(--color-border);
  }

  .brand {
    font-weight: 600;
    white-space: nowrap;
  }
  .divider {
    width: 1px;
    height: 1.25rem;
    background: var(--color-border);
  }

  .nav-arrows {
    display: flex;
    gap: 0.25rem;
  }
  .nav-arrows button {
    width: 2rem;
    height: 2rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text);
    cursor: pointer;
  }
  .nav-arrows button:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .logo img {
    height: 1.75rem;
    display: block;
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
