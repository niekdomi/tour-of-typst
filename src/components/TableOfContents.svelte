<script lang="ts">
  import type { Chapter } from "../content/types";

  interface Props {
    chapters: Chapter[];
    currentIndex: number;
    open: boolean;
    onnavigate?: (index: number) => void;
  }

  let { chapters, currentIndex, open = $bindable(false), onnavigate }: Props = $props();

  function select(index: number) {
    onnavigate?.(index);
    open = false;
  }
</script>

<div class="toc">
  <button class="trigger" onclick={() => (open = !open)}>
    {chapters[currentIndex]?.title ?? ""}
  </button>

  {#if open}
    <button class="overlay" onclick={() => (open = false)} aria-label="Close menu"></button>
    <ul class="menu">
      {#each chapters as chapter, i (chapter.key)}
        <li class:active={i === currentIndex}>
          <button onclick={() => select(i)}>{chapter.title}</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .toc {
    position: relative;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
    display: block;
    transition: background 0.15s;
    font-size: 1rem;
    font-family: inherit;
  }

  .trigger:hover {
    background: var(--color-surface-hover);
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 99;
    background: transparent;
    border: none;
    cursor: default;
    width: 100vw;
    height: 100vh;
  }

  .menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.5rem 0;
    list-style: none;
    margin: 0;
    z-index: 100;
    min-width: 240px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 70vh;
    overflow-y: auto;
  }

  .menu li button {
    width: 100%;
    text-align: left;
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.875rem;
    transition: background 0.1s;
  }

  .menu li.active button {
    color: var(--color-text);
    font-weight: 600;
  }

  .menu li:hover button {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }
</style>
