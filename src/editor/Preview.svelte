<script lang="ts">
  import { splitPages } from "./svgUtils";

  interface Props {
    svg?: string;
  }

  let { svg }: Props = $props();

  const pages = $derived(svg ? splitPages(svg) : []);

  let previewEl: HTMLDivElement;

  // The typst renderer injects onclick="handleTypstLocation(el, page, x, y)" into SVG links.
  // Scroll the preview to the target page and y-position.
  function handleTypstLocation(_el: unknown, page: number, _x: number, y: number) {
    const container = previewEl;
    const pageEls = container.querySelectorAll<HTMLElement>(".page");
    const target = pageEls[page - 1] as HTMLElement | undefined;
    if (!target) {
      return;
    }
    const svgEl = target.querySelector("svg");
    const scale = svgEl ? target.clientHeight / svgEl.viewBox.baseVal.height : 1;
    container.scrollTo({
      top: target.offsetTop - container.offsetTop + y * scale - 40,
      behavior: "smooth",
    });
  }

  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (window as any).handleTypstLocation = handleTypstLocation;
  }
</script>

<div class="preview" bind:this={previewEl}>
  {#each pages as page, i (i)}
    <div class="page">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html page}
    </div>
  {/each}
</div>

<style>
  .preview {
    height: 100%;
    overflow: auto;
    background: var(--color-surface, #f0f0f0);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .page {
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    width: fit-content;
    flex-shrink: 0;
  }

  .page :global(svg) {
    display: block;
    max-width: none;
  }
</style>
