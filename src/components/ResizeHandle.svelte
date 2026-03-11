<script lang="ts">
  interface Props {
    direction: "horizontal" | "vertical";
    fraction: number;
    min?: number;
    max?: number;
    onchange: (fraction: number) => void;
  }

  let { direction, fraction, min = 0.15, max = 0.85, onchange }: Props = $props();

  let dragging = $state(false);
  let el = $state<HTMLDivElement | null>(null);

  function onPointerDown(e: PointerEvent) {
    dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging || !el) {
      return;
    }

    const parent = el.parentElement;
    if (!parent) {
      return;
    }

    const rect = parent.getBoundingClientRect();
    const raw =
      direction === "horizontal"
        ? (e.clientX - rect.left) / rect.width
        : (e.clientY - rect.top) / rect.height;

    onchange(Math.min(Math.max(raw, min), max));
  }

  function onPointerUp() {
    dragging = false;
  }

  function onKeyDown(e: KeyboardEvent) {
    const step = 0.05;
    const back = direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const forward = direction === "horizontal" ? "ArrowRight" : "ArrowDown";

    if (e.key === back) {
      e.preventDefault();
      onchange(Math.max(fraction - step, min));
    } else if (e.key === forward) {
      e.preventDefault();
      onchange(Math.min(fraction + step, max));
    }
  }
</script>

<svelte:window onpointermove={onPointerMove} onpointerup={onPointerUp} />

<div
  bind:this={el}
  class="resize-handle"
  class:horizontal={direction === "horizontal"}
  class:vertical={direction === "vertical"}
  class:dragging
  role="slider"
  aria-orientation={direction}
  aria-label={direction === "horizontal"
    ? "Resize panels left and right"
    : "Resize panels up and down"}
  aria-valuemin={Math.round(min * 100)}
  aria-valuemax={Math.round(max * 100)}
  aria-valuenow={Math.round(fraction * 100)}
  tabindex="0"
  onpointerdown={onPointerDown}
  onkeydown={onKeyDown}
></div>

<style>
  .resize-handle {
    flex-shrink: 0;
    background: var(--color-border);
    transition: background 0.15s;
    touch-action: none;
    position: relative;
    z-index: 10;
  }

  /* Expand the hit area without affecting layout size */
  .resize-handle::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  .resize-handle.horizontal {
    width: 5px;
    cursor: col-resize;
    height: 100%;
  }

  .resize-handle.horizontal::after {
    inset: 0 -4px;
  }

  .resize-handle.vertical {
    height: 5px;
    cursor: row-resize;
    width: 100%;
  }

  .resize-handle.vertical::after {
    inset: -4px 0;
  }

  .resize-handle:hover,
  .resize-handle:focus-visible,
  .resize-handle.dragging {
    background: var(--color-accent);
    outline: none;
  }
</style>
