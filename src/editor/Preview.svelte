<script lang="ts">
  interface Props {
    pages?: string[];
  }

  let { pages = [] }: Props = $props();

  let prevPages = $state<string[]>([]);
  $effect(() => {
    if (pages.length > 0) prevPages = pages;
  });

  const displayPages = $derived(pages.length > 0 ? pages : prevPages);
  const loading = $derived(pages.length === 0);

  let previewEl: HTMLDivElement;
  let dropdownWrapEl: HTMLDivElement;

  const ZOOM_STEP = 0.1;
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 3.0;
  // Sum of left + right (or top + bottom) padding on .preview, used for fit calculations.
  const PREVIEW_PADDING = 32;

  let zoom = $state(1.0);
  let showDropdown = $state(false);

  function setZoom(value: number) {
    zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 10) / 10));
    showDropdown = false;
  }

  function zoomIn() {
    setZoom(zoom + ZOOM_STEP);
  }
  function zoomOut() {
    setZoom(zoom - ZOOM_STEP);
  }

  function fitDimension(dim: "width" | "height") {
    const svgEl = previewEl.querySelector<SVGSVGElement>(".page svg");
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const natural = (dim === "width" ? rect.width : rect.height) / zoom;
    const available =
      (dim === "width" ? previewEl.clientWidth : previewEl.clientHeight) - PREVIEW_PADDING;
    setZoom(available / natural);
  }

  function handleWindowClick(e: MouseEvent) {
    if (showDropdown && !dropdownWrapEl.contains(e.target as Node)) {
      showDropdown = false;
    }
  }

  // The typst renderer injects onclick="handleTypstLocation(el, page, x, y)" into SVG links.
  // Scroll the preview to the target page and y-position.
  function handleTypstLocation(_el: unknown, page: number, _x: number, y: number) {
    const pageEls = previewEl.querySelectorAll<HTMLElement>(".page");
    const target = pageEls[page - 1];
    if (!target) return;
    const svgEl = target.querySelector("svg");
    const scale = svgEl ? target.clientHeight / svgEl.viewBox.baseVal.height : 1;
    previewEl.scrollTo({
      top: target.offsetTop - previewEl.offsetTop + y * scale - 40,
      behavior: "smooth",
    });
  }

  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (window as any).handleTypstLocation = handleTypstLocation;
  }
</script>

<svelte:window onclick={handleWindowClick} />

<div class="preview-wrapper">
  <div class="preview-toolbar">
    <button class="zoom-btn" onclick={zoomIn} disabled={zoom >= MAX_ZOOM}>+</button>

    <div class="zoom-label-wrap" bind:this={dropdownWrapEl}>
      <button class="zoom-label" onclick={() => (showDropdown = !showDropdown)}>
        {Math.round(zoom * 100)}%
      </button>

      {#if showDropdown}
        <div class="zoom-dropdown">
          <button onclick={() => fitDimension("width")}>Fit Width</button>
          <button onclick={() => fitDimension("height")}>Fit Height</button>
          <hr />
          <button onclick={() => setZoom(0.5)}>50%</button>
          <button onclick={() => setZoom(0.75)}>75%</button>
          <button onclick={() => setZoom(1.0)}>100%</button>
          <button onclick={() => setZoom(2.0)}>200%</button>
        </div>
      {/if}
    </div>

    <button class="zoom-btn" onclick={zoomOut} disabled={zoom <= MIN_ZOOM}>−</button>
  </div>

  <div class="preview" bind:this={previewEl}>
    <div class="pages" style="zoom: {zoom}">
      {#each displayPages as page, i (i)}
        <div class="page" class:loading>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html page}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .preview-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .preview-toolbar {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.35rem 0.5rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .zoom-btn {
    font-size: 0.85rem;
    width: 1.4rem;
    height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg);
    color: var(--color-text);
    cursor: pointer;
    line-height: 1;
    padding: 0;
  }

  .zoom-btn:hover:not(:disabled) {
    background: var(--color-surface-hover);
  }

  .zoom-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .zoom-label-wrap {
    position: relative;
  }

  .zoom-label {
    font-size: 0.75rem;
    min-width: 3rem;
    height: 1.4rem;
    text-align: center;
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg);
    cursor: pointer;
    padding: 0 0.25rem;
  }

  .zoom-label:hover {
    background: var(--color-surface-hover);
  }

  .zoom-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    min-width: 7rem;
    z-index: 100;
    overflow: hidden;
  }

  .zoom-dropdown button {
    font-size: 0.75rem;
    padding: 0.35rem 0.75rem;
    text-align: left;
    background: none;
    border: none;
    color: var(--color-text);
    cursor: pointer;
    white-space: nowrap;
  }

  .zoom-dropdown button:hover {
    background: var(--color-surface-hover);
  }

  .zoom-dropdown hr {
    margin: 0.2rem 0;
    border: none;
    border-top: 1px solid var(--color-border);
  }

  .preview {
    flex: 1;
    overflow: auto;
    background: var(--color-surface, #f0f0f0);
    padding: 1rem;
  }

  .pages {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    transform-origin: top center;
  }

  .page {
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    width: fit-content;
    flex-shrink: 0;
  }

  .page.loading :global(svg) {
    visibility: hidden;
  }

  .page :global(svg) {
    display: block;
    max-width: none;
  }
</style>
