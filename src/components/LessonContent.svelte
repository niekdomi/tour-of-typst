<script lang="ts">
  import { Marked, Renderer } from "marked";
  import markedAlert from "marked-alert";
  import { getChapterMarkdown } from "../content";
  import type { Chapter } from "../content/types";
  import { highlighterReady } from "../lib/highlighter";
  import type { Highlighter } from "shiki";
  import copyIcon from "../assets/icons/copy.svg?raw";
  import checkIcon from "../assets/icons/check.svg?raw";

  interface Props {
    chapter: Chapter;
    index: number;
    locale: string;
  }

  let { chapter, index, locale }: Props = $props();

  let highlighter = $state<Highlighter | null>(null);
  void highlighterReady.then((h) => (highlighter = h));

  function handleClick(e: MouseEvent) {
    const btn = (e.target as Element).closest<HTMLButtonElement>(".copy-btn");
    if (!btn) {
      return;
    }

    const code = decodeURIComponent(btn.dataset.code ?? "");

    void navigator.clipboard.writeText(code).then(() => {
      btn.innerHTML = checkIcon;
      setTimeout(() => (btn.innerHTML = copyIcon), 1500);
    });
  }

  const html = $derived.by(() => {
    const raw = getChapterMarkdown(locale, chapter.key);
    if (!raw) {
      return null;
    }

    const renderer = new Renderer();
    renderer.code = ({ text, lang }) => {
      const highlighted = highlighter
        ? highlighter.codeToHtml(text, {
            lang: lang && highlighter.getLoadedLanguages().includes(lang) ? lang : "text",
            themes: { light: "github-light", dark: "github-dark-dimmed" },
            defaultColor: false,
          })
        : `<pre><code>${text}</code></pre>`;
      return `<div class="code-block">${highlighted}<button class="copy-btn" data-code="${encodeURIComponent(text)}" title="Copy">${copyIcon}</button></div>`;
    };

    return new Marked({ renderer }).use(markedAlert()).parse(raw) as string;
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article class="lesson" onclick={handleClick}>
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

  /* Code, inline only; pre code inherits nothing from this rule */
  .lesson :global(:not(pre) > code) {
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

  .lesson :global(pre.shiki) {
    background: transparent;
  }

  /* Copy button */
  .lesson :global(.code-block) {
    position: relative;
  }

  .lesson :global(.copy-btn) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-surface);
    color: var(--color-text-muted);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .lesson :global(.code-block:hover .copy-btn) {
    opacity: 1;
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

  /* Alerts */
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
