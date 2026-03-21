<script lang="ts">
  interface Props {
    svg?: string;
  }

  let { svg }: Props = $props();
</script>

<div class="preview">
  {#if svg}
    <div class="preview-content">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html svg}
    </div>
  {:else}
    <div class="empty">
      <p>No preview available</p>
    </div>
  {/if}
</div>

<style>
  .preview {
    height: 100%;
    overflow: auto;
    background: white;
  }

  .preview-content {
    padding: 1rem;
  }

  .preview-content :global(svg) {
    width: 100%;
    height: auto;
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
    font-size: 0.85rem;
  }
</style>
