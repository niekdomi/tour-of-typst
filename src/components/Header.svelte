<script lang="ts">
  type Theme = "auto" | "light" | "dark";

  let theme = $state<Theme>((localStorage.getItem("theme") as Theme) ?? "auto");

  function applyTheme(t: Theme) {
    let resolved: "dark" | "light";

    if (t === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      resolved = prefersDark ? "dark" : "light";
    } else {
      resolved = t;
    }

    document.documentElement.setAttribute("data-theme", resolved);
  }

  $effect(() => {
    applyTheme(theme);
  });
</script>

<header>
  <div class="left">
    <button>TOC</button>
    <button>language</button>
    <span>Tour of Typst</span>
  </div>
  <div class="right">
    <a href="https://www.ost.ch" target="_blank">
      <img src="../../static/ost-logo.svg" alt="OST Logo" />
    </a>
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    height: 4rem;
    border-bottom: 1px solid var(--color-border);
    background-color: var(--color-surface);
  }

  .left {
    display: flex;
    align-items: center;
  }
</style>
