<script lang="ts">
  export interface DropdownOption {
    value: string;
    label: string;
  }

  interface Props {
    options: DropdownOption[];
    value: string;
    label: string;
  }

  let { options, value = $bindable(), label }: Props = $props();

  let open = $state(false);
  const selectedOption = $derived(options.find((o) => o.value === value));

  function select(val: string) {
    value = val;
    open = false;
  }
</script>

<div class="dropdown">
  <button
    type="button"
    class="trigger"
    aria-haspopup="true"
    aria-expanded={open}
    aria-label={label}
    onclick={() => (open = !open)}
  >
    <span>{selectedOption?.label ?? label}</span>
    <span class="arrow" aria-hidden="true">{open ? "▲" : "▼"}</span>
  </button>

  {#if open}
    <button class="overlay" onclick={() => (open = false)} aria-label="Close menu"></button>
    <ul class="menu" role="menu">
      {#each options as option (option.value)}
        <li role="none">
          <button
            type="button"
            role="menuitem"
            class="menu-item"
            class:selected={option.value === value}
            onclick={() => select(option.value)}
          >
            {option.label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .trigger {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: transparent;
    color: var(--color-text);
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.15s;
  }

  .trigger:hover {
    background: var(--color-surface-hover);
  }

  .arrow {
    font-size: 0.6rem;
    opacity: 0.6;
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
    right: 0;
    top: calc(100% + 4px);
    min-width: 100%;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    list-style: none;
    margin: 0;
    padding: 0.25rem 0;
    z-index: 100;
  }

  .menu-item {
    display: block;
    width: 100%;
    padding: 0.35rem 0.75rem;
    background: transparent;
    border: none;
    color: var(--color-text);
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .menu-item:hover {
    background: var(--color-surface-hover);
  }

  .menu-item.selected {
    font-weight: 600;
    color: var(--color-accent);
  }
</style>
