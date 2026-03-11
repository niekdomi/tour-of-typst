<script lang="ts">
  import { marked } from "marked";
  import { getChapterMarkdown } from "../content";
  import type { Chapter } from "../content/types";

  interface Props {
    chapter: Chapter;
    index: number;
    locale: string;
  }

  let { chapter, index, locale }: Props = $props();

  const html = $derived.by(() => {
    const raw = getChapterMarkdown(locale, chapter.key);
    if (!raw) {
      return null;
    }
    return marked.parse(raw) as string;
  });
</script>

<article class="lesson">
  <div class="chapter-label">Chapter {index + 1}</div>

  {#if html}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
  {:else}
    <h1>{chapter.title}</h1>
    <p class="placeholder">Content for <em>{chapter.title}</em> is coming soon.</p>
  {/if}
</article>

<style>
  .lesson {
    max-width: 70ch;
    line-height: 1.6;
    color: var(--color-text);
  }

  .chapter-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-accent);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  /* Typography */
  .lesson :global(:is(h1, h2, h3)) {
    margin: 1.5rem 0 0.75rem;
    line-height: 1.25;
  }
  .lesson :global(h1) {
    font-size: 1.75rem;
    margin-top: 0;
  }
  .lesson :global(h2) {
    font-size: 1.35rem;
  }
  .lesson :global(h3) {
    font-size: 1.15rem;
  }

  .lesson :global(p) {
    margin-bottom: 1rem;
  }
  .lesson :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
  }

  /* Code */
  .lesson :global(code) {
    font-family: var(--font-mono);
    font-size: 0.85em;
    background: var(--color-surface);
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
  }

  .lesson :global(pre) {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  .lesson :global(pre code) {
    background: none;
    border: none;
    padding: 0;
  }

  /* Misc Elements */
  .lesson :global(blockquote) {
    border-left: 4px solid var(--color-accent);
    background: var(--color-surface);
    margin: 1.5rem 0;
    padding: 0.5rem 1rem;
    border-radius: 0 4px 4px 0;
  }

  .lesson :global(:is(ul, ol)) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  .lesson :global(li) {
    margin-bottom: 0.4rem;
  }

  .lesson :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.9rem;
  }

  .lesson :global(:is(th, td)) {
    border: 1px solid var(--color-border);
    padding: 0.5rem;
    text-align: left;
  }

  .lesson :global(th) {
    background: var(--color-surface);
    font-weight: 600;
  }

  .placeholder {
    color: var(--color-text-muted);
    font-style: italic;
  }
</style>
