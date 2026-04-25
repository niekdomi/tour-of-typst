<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import {
    createTypstHighlighting,
    TypstCompiler,
    TypstProject,
    TypstRenderer,
    TypstFormatter,
  } from "@vedivad/codemirror-typst";
  import { provideTypstResources } from "./typst-resources";

  interface Props {
    theme: "light" | "dark";
    children: Snippet;
  }

  let { theme, children }: Props = $props();

  const container = provideTypstResources();
  let ready = $state(false);

  onMount(async () => {
    const renderer = TypstRenderer.create();
    const formatter = TypstFormatter.create({ max_width: 80, wrap_text: true });
    const [compiler, highlighting] = await Promise.all([
      TypstCompiler.create(),
      createTypstHighlighting({
        themes: { light: "github-light", dark: "github-dark-dimmed" },
        theme,
      }),
    ]);
    const project = new TypstProject({
      compiler,
      autoCompile: { debounceMs: 50, maxWaitMs: 300 },
    });
    container.current = { project, highlighting, formatter, renderer };
    ready = true;
  });
</script>

{#if ready}
  {@render children()}
{/if}
