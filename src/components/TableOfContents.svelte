<script lang="ts">
  import type { Chapter, Part } from "../content/types";

  interface Props {
    parts: Part[];
    chapters: Chapter[];
    currentIndex: number;
    open: boolean;
    onnavigate?: (index: number) => void;
  }

  let { parts, chapters, currentIndex, open, onnavigate }: Props = $props();

  function select(index: number) {
    onnavigate?.(index);
    open = false;
  }

  // Linearize part/chapter indices into a single flattened chapter index.
  function flatIndex(partIndex: number, chapterIndex: number): number {
    return (
      parts.slice(0, partIndex).reduce((sum, part) => sum + part.chapters.length, 0) + chapterIndex
    );
  }
</script>

<div class="toc">
  <button class="trigger" onclick={() => (open = !open)}>
    <span class="trigger-label">{chapters[currentIndex]?.title ?? ""}</span>
    <svg class="chevron" class:open aria-hidden="true" viewBox="0 0 10 6" fill="none">
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  {#if open}
    <button class="overlay" onclick={() => (open = false)} aria-label="Close menu"></button>
    <ul class="menu">
      {#each parts as part, pi (part.title)}
        <li class="part-header">{part.title}</li>
        {#each part.chapters as chapter, ci (chapter.key)}
          {@const idx = flatIndex(pi, ci)}
          <li class:active={idx === currentIndex}>
            <button onclick={() => { select(idx); }}>{chapter.title}</button>
          </li>
        {/each}
      {/each}
    </ul>
  {/if}
</div>

<style>
  .toc {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  .trigger {
    border: none;
    background: transparent;
    font-weight: 600;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    color: var(--color-text);
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 1.05rem;
    font-family: inherit;
    text-align: left;
  }

  .trigger-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chevron {
    flex-shrink: 0;
    width: 10px;
    height: 6px;
    color: var(--color-text-muted);
    transition: transform 0.2s ease;
  }

  .chevron.open {
    transform: rotate(180deg);
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 99;
    background: transparent;
    border: none;
    cursor: default;
  }

  .menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.375rem 0;
    list-style: none;
    margin: 0;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Contiguous gutter on every row */
  .menu li {
    position: relative;
  }

  /* Gutter only on chapter rows, breaks at each part header to visually group */
  .menu li:not(.part-header)::before {
    content: "";
    position: absolute;
    left: 1rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-border);
    transition: background 0.15s;
  }

  /* Extend gutter to cover the gap at the top of the first chapter in each group */
  .menu li:not(.part-header):first-of-type::before,
  .menu .part-header + li::before {
    top: -0.25rem;
  }

  /* Part header rows */
  .menu .part-header {
    padding: 0.5rem 1rem 0.7rem;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--color-text-muted);
  }

  .menu .part-header:not(:first-child) {
    margin-top: 1rem;
    padding-top: 0.75rem;
  }

  /* Chapter rows */
  .menu li:not(.part-header) button {
    width: 100%;
    text-align: left;
    padding: 0.5rem 1rem 0.5rem 2rem;
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.925rem;
    transition: color 0.1s;
  }

  .menu li.active::before {
    background: var(--color-accent);
  }

  .menu li.active button {
    color: var(--color-accent);
    font-weight: 600;
  }

  .menu li:not(.part-header):not(.active):hover::before {
    background: var(--color-text-muted);
  }

  .menu li:not(.part-header):hover button {
    color: var(--color-text);
  }
</style>
