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
  let buttonEl = $state<HTMLButtonElement | null>(null);
  let menuEl = $state<HTMLUListElement | null>(null);

  const selectedOption = $derived(options.find((o) => o.value === value));

  function select(val: string) {
    value = val;
    open = false;
    buttonEl?.focus();
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open) {
      return;
    }

    if (e.key === "Escape") {
      open = false;
      buttonEl?.focus();
      e.stopPropagation();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const items = menuEl?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? [];
      const idx = Array.from(items).indexOf(document.activeElement as HTMLElement);
      const next = e.key === "ArrowDown" ? idx + 1 : idx - 1;
      items[Math.max(0, Math.min(next, items.length - 1))]?.focus();
    }
  }

  function onClickOutside(e: MouseEvent) {
    const target = e.target as Node;
    const outsideButton = !buttonEl?.contains(target);
    const outsideMenu = !menuEl?.contains(target);
    if (outsideButton && outsideMenu) {
      open = false;
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener("click", onClickOutside);
      document.addEventListener("keydown", onKeydown);
    } else {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("keydown", onKeydown);
    }

    return () => {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("keydown", onKeydown);
    };
  });
</script>

<div class="dropdown">
  <button
    bind:this={buttonEl}
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
    <ul bind:this={menuEl} class="menu" role="menu" aria-label={label}>
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

  .trigger,
  .menu-item {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--color-text);
    font-family: inherit;
    text-align: left;
    white-space: nowrap;
  }

  .trigger {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    transition: background 0.15s;
  }

  .trigger:hover {
    background: var(--color-surface-hover);
  }

  .arrow {
    font-size: 0.6rem;
    opacity: 0.6;
  }

  .menu {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    min-width: 100%;
    background: var(--color-surface);
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
  }

  .menu-item:hover,
  .menu-item:focus {
    background: var(--color-surface-hover);
    outline: none;
  }

  .menu-item.selected {
    font-weight: 600;
    color: var(--color-accent);
  }
</style>
