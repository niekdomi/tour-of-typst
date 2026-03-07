<script lang="ts">
  interface Option {
    value: string;
    label: string;
  }

  interface Props {
    options: Option[];
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

  function onKeyEsc(e: KeyboardEvent) {
    if (e.key === "Escape") {
      open = false;
    }
  }

  function onClickOutside(e: MouseEvent) {
    // TODO
  }

  $effect(() => {
    document.addEventListener("keydown", onKeyEsc);

    return () => {
      document.removeEventListener("keydown", onKeyEsc);
    };
  });
</script>

<div class="dropdown">
  <button type="button" aria-label={label} onclick={() => (open = !open)}>
    <span>{label}</span>
  </button>
</div>
