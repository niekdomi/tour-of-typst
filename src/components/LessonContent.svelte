<script lang="ts">
  import { Marked, Renderer } from "marked";
  import markedAlert from "marked-alert";
  import { getChapterMarkdown } from "../content";
  import type { Chapter } from "../content/types";
  import { highlighterReady } from "../lib/highlighter";
  import type { Highlighter } from "shiki";

  interface Props {
    chapter: Chapter;
    index: number;
    locale: string;
  }

  let { chapter, index, locale }: Props = $props();

  let highlighter = $state<Highlighter | null>(null);
  highlighterReady.then((h) => (highlighter = h));

  const html = $derived.by(() => {
    const raw = getChapterMarkdown(locale, chapter.key);
    if (!raw) return null;

    const renderer = new Renderer();

    const hl = highlighter;
    if (hl) {
      renderer.code = ({ text, lang }) => {
        const l = lang && hl.getLoadedLanguages().includes(lang) ? lang : "text";
        return hl.codeToHtml(text, {
          lang: l,
          themes: { light: "github-light", dark: "github-dark-dimmed" },
          defaultColor: false,
        });
      };
    }

    return new Marked({ renderer }).use(markedAlert()).parse(raw) as string;
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
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  /* Shiki-highlighted blocks override background via inline styles — keep structure only */
  .lesson :global(pre.shiki) {
    background: transparent;
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

  /* Alerts (marked-alert) */
  .lesson :global(.markdown-alert) {
    border-left: 4px solid var(--color-border);
    background: var(--color-surface);
    margin: 1.5rem 0;
    padding: 0.5rem 1rem;
    border-radius: 0 4px 4px 0;
  }

  .lesson :global(.markdown-alert-title) {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .lesson :global(.markdown-alert-title svg) {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    fill: currentColor;
  }

  .lesson :global(.markdown-alert-note) {
    border-left-color: #239dad;
  }
  .lesson :global(.markdown-alert-note .markdown-alert-title) {
    color: #239dad;
  }

  .lesson :global(.markdown-alert-tip) {
    border-left-color: #3fb950;
  }
  .lesson :global(.markdown-alert-tip .markdown-alert-title) {
    color: #3fb950;
  }

  .lesson :global(.markdown-alert-important) {
    border-left-color: #ab7df8;
  }
  .lesson :global(.markdown-alert-important .markdown-alert-title) {
    color: #ab7df8;
  }

  .lesson :global(.markdown-alert-warning) {
    border-left-color: #d29922;
  }
  .lesson :global(.markdown-alert-warning .markdown-alert-title) {
    color: #d29922;
  }

  .lesson :global(.markdown-alert-caution) {
    border-left-color: #f85149;
  }
  .lesson :global(.markdown-alert-caution .markdown-alert-title) {
    color: #f85149;
  }

  .placeholder {
    color: var(--color-text-muted);
    font-style: italic;
  }
</style>
