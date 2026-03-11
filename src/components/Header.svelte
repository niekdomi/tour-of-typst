<script lang="ts">
  import Dropdown from "./Dropdown.svelte";
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

  $effect(() => localStorage.setItem("locale", locale));

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
      resolved = value;
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

  // --- Chapter nav ---
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let menuEl = $state<HTMLUListElement | null>(null);

  // Position of the fixed dropdown, computed from trigger bounds
  let dropdownLeft = $state(0);
  let dropdownTop = $state(0);

  const current = $derived(chapters[currentIndex]);
  const hasPrev = $derived(currentIndex > 0);
  const hasNext = $derived(currentIndex < chapters.length - 1);

  function prev() {
    if (hasPrev) {
      onnavigate?.(currentIndex - 1);
    }
  }

  function next() {
    if (hasNext) {
      onnavigate?.(currentIndex + 1);
    }
  }

  function openDropdown() {
    if (!triggerEl) {
      return;
    }
    const rect = triggerEl.getBoundingClientRect();
    dropdownLeft = rect.left;
    dropdownTop = rect.bottom + 6;
    tocDropdownOpen = true;
  }

  function selectChapter(index: number) {
    onnavigate?.(index);
    tocDropdownOpen = false;
    triggerEl?.focus();
  }

  function onTocKeyDown(e: KeyboardEvent) {
    if (!tocDropdownOpen) {
      return;
    }

    if (e.key === "Escape") {
      tocDropdownOpen = false;
      triggerEl?.focus();
      e.stopPropagation();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const items = menuEl?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? [];
      const idx = Array.from(items).indexOf(document.activeElement as HTMLElement);
      const next = e.key === "ArrowDown" ? idx + 1 : idx - 1;
      items[Math.max(0, Math.min(next, items.length - 1))]?.focus();
    }
  }

  function onClickOutside(e: MouseEvent) {
    const target = e.target as Node;
    const outsideTrigger = !triggerEl?.contains(target);
    const outsideMenu = !menuEl?.contains(target);
    if (outsideTrigger && outsideMenu) {
      tocDropdownOpen = false;
    }
  }

  $effect(() => {
    if (tocDropdownOpen) {
      document.addEventListener("click", onClickOutside);
      document.addEventListener("keydown", onTocKeyDown);
      requestAnimationFrame(() => {
        const items = menuEl?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? [];
        items[currentIndex]?.focus();
        items[currentIndex]?.scrollIntoView({ block: "nearest" });
      });
    } else {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("keydown", onTocKeyDown);
    }
    return () => {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("keydown", onTocKeyDown);
    };
  });
</script>

<header>
  <div class="inner">
    <div class="header-left" style="flex: {contentFraction}">
      <div class="title-area">
        <span class="title">Tour of Typst</span>

        {#if chapters.length > 0}
          <div class="divider" aria-hidden="true"></div>

          <button
            bind:this={triggerEl}
            type="button"
            class="chapter-trigger"
            aria-haspopup="true"
            aria-expanded={tocDropdownOpen}
            onclick={openDropdown}
          >
            <span class="chapter-title">{current?.title ?? ""}</span>
          </button>
        {/if}
      </div>

      {#if chapters.length > 0}
        <div class="nav-btns">
          <button
            class="nav-btn"
            type="button"
            aria-label="Previous chapter"
            disabled={!hasPrev}
            onclick={prev}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            class="nav-btn"
            type="button"
            aria-label="Next chapter"
            disabled={!hasNext}
            onclick={next}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      {/if}
    </div>

    <div class="handle-gap" aria-hidden="true"></div>

    <div class="header-right" style="flex: {1 - contentFraction}">
      <div class="settings">
        <Dropdown options={localeOptions} bind:value={locale} label={t.selectLanguage} />
        <Dropdown options={themeOptions} bind:value={theme} label={t.selectTheme} />
        <a
          class="ost-link"
          href="https://www.ost.ch"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="OST - Ostschweizer Fachhochschule"
        >
          <img src="/ost-logo.svg" alt="OST Logo" />
        </a>
      </div>
    </div>
  </div>
</header>

<!-- Rendered in a portal-like fixed position so no ancestor clips it -->
{#if tocDropdownOpen}
  <div class="dropdown-overlay" aria-hidden="true" onclick={() => (tocDropdownOpen = false)}></div>

  <ul
    bind:this={menuEl}
    class="dropdown"
    role="menu"
    aria-label="All chapters"
    style="left: {dropdownLeft}px; top: {dropdownTop}px"
  >
    {#each chapters as chapter, i (chapter.key)}
      <li role="none" class="dropdown-row">
        <!-- Vertical track line, full item height -->
        <span class="track" aria-hidden="true">
          {#if i === currentIndex}
            <span class="track-active" aria-hidden="true"></span>
          {/if}
        </span>

        <button
          type="button"
          role="menuitem"
          class="dropdown-item"
          class:active={i === currentIndex}
          onclick={() => selectChapter(i)}
        >
          {chapter.title}
        </button>
      </li>
    {/each}
  </ul>
{/if}

<style>
  header {
    flex-shrink: 0;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  .inner {
    display: flex;
    align-items: center;
    max-width: 1600px;
    margin: 0 auto;
    height: 3.5rem;
  }

  /* ── Left half ── */
  .header-left {
    display: flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    height: 100%;
  }

  .title-area {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 3rem;
    /* no overflow:hidden here — let the fixed dropdown escape */
    min-width: 0;
  }

  .title {
    font-size: 1.125rem;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .divider {
    width: 1px;
    height: 1.5rem;
    background: var(--color-border);
    flex-shrink: 0;
  }

  .chapter-trigger {
    display: flex;
    align-items: center;
    padding: 0.2rem 0.5rem;
    max-width: 320px;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s;
    min-width: 0;
  }

  .chapter-title {
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Nav buttons ── */
  .nav-btns {
    display: flex;
    gap: 0.25rem;
    margin-left: auto;
  }

  .nav-btn {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    cursor: pointer;
    color: var(--color-text);
    padding: 0;
    transition: background 0.15s;
  }

  /* ── Handle gap ── */
  .handle-gap {
    width: 5px;
    flex-shrink: 0;
  }

  /* ── Right half ── */
  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
    height: 100%;
    padding: 0 1rem;
  }

  .settings {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  /* ── Shared interactive states ── */
  .chapter-trigger:hover,
  .nav-btn:hover:not(:disabled) {
    background: var(--color-surface-hover);
  }

  .chapter-trigger:focus-visible,
  .nav-btn:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .nav-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  /* ── OST logo ── */
  .ost-link img {
    height: 2rem;
    display: block;
  }

  /* ── Dropdown (fixed, escapes all clip ancestors) ── */
  .dropdown-overlay {
    position: fixed;
    inset: 0;
    z-index: 98;
  }

  .dropdown {
    position: fixed;
    width: 280px;
    max-width: calc(100vw - 2rem);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    list-style: none;
    margin: 0;
    padding: 0.5rem 0;
    z-index: 99;
    max-height: 70vh;
    overflow-y: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  }

  /* ── Each row: track line + button side by side ── */
  .dropdown-row {
    display: flex;
    align-items: stretch;
  }

  /* The vertical gray track */
  .track {
    position: relative;
    width: 20px; /* space for the line + some breathing room */
    flex-shrink: 0;
    display: flex;
    justify-content: center;
  }

  /* The actual gray line, runs the full height of the row */
  .track::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    background: var(--color-border);
    border-radius: 1px;
  }

  /* Accent segment — only rendered for the active item */
  .track-active {
    position: absolute;
    top: 20%;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    background: var(--color-accent);
    border-radius: 1px;
    z-index: 1; /* sits on top of the gray ::before line */
  }

  .dropdown-item {
    flex: 1;
    padding: 0.5rem 0.75rem 0.5rem 0;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    font-family: inherit;
    color: var(--color-text-muted);
    transition:
      background 0.1s,
      color 0.1s;
    border-radius: 0 4px 4px 0;
  }

  .dropdown-item:hover,
  .dropdown-item:focus {
    background: var(--color-surface);
    color: var(--color-text);
    outline: none;
  }

  .dropdown-item.active {
    color: var(--color-text);
    font-weight: 600;
  }
</style>
