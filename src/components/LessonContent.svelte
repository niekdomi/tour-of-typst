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
    {@html html}
  {:else}
    <h1>{chapter.title}</h1>
    <p class="placeholder">Content for <em>{chapter.title}</em> is coming soon.</p>
  {/if}
</article>

<style>
  .lesson {
    max-width: 68ch;
    width: 100%;
    color: var(--color-text);
  }

  .chapter-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-accent);
    margin-bottom: 0.5rem;
  }

  .lesson :global(h1) {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 1.25rem;
  }

  .lesson :global(h2) {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.3;
    margin: 2rem 0 0.75rem;
  }

  .lesson :global(h3) {
    font-size: 1rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem;
  }

  .lesson :global(p) {
    font-size: 0.9375rem;
    line-height: 1.75;
    margin: 0 0 1rem;
  }

  .lesson :global(h1 + p) {
    font-size: 1.0625rem;
    line-height: 1.7;
    margin-bottom: 1.25rem;
  }

  .lesson :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .lesson :global(a:hover) {
    opacity: 0.8;
  }

  /* Inline code */
  .lesson :global(code) {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 3px;
    padding: 0.1em 0.35em;
  }

  /* Fenced code blocks */
  .lesson :global(pre) {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0 1.5rem;
  }

  .lesson :global(pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.8125rem;
    line-height: 1.6;
  }

  /* Blockquotes — tips */
  .lesson :global(blockquote) {
    background: color-mix(in srgb, var(--color-accent) 8%, transparent);
    border-left: 3px solid var(--color-accent);
    border-radius: 0 6px 6px 0;
    margin: 1.25rem 0;
    padding: 0.75rem 1rem;
  }

  .lesson :global(blockquote p) {
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0;
  }

  /* Lists */
  .lesson :global(ul),
  .lesson :global(ol) {
    padding-left: 1.5rem;
    margin: 0 0 1rem;
  }

  .lesson :global(li) {
    font-size: 0.9375rem;
    line-height: 1.75;
    margin-bottom: 0.25rem;
  }

  /* Tables */
  .lesson :global(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0 1.5rem;
    font-size: 0.875rem;
  }

  .lesson :global(th),
  .lesson :global(td) {
    padding: 0.45rem 0.75rem;
    border: 1px solid var(--color-border);
    text-align: left;
    vertical-align: top;
  }

  .lesson :global(th) {
    font-weight: 600;
    background: var(--color-surface);
  }

  .lesson :global(tr:nth-child(even) td) {
    background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  }

  .placeholder {
    color: var(--color-text-muted);
    font-style: italic;
  }
</style>
