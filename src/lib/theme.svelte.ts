export type Theme = "auto" | "light" | "dark";

function createTheme() {
  let value = $state<Theme>((localStorage.getItem("theme") as Theme) ?? "auto");
  let resolved = $state<"light" | "dark">("light");

  function apply(v: Theme) {
    const r: "light" | "dark" =
      v === "auto"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : v;
    document.documentElement.setAttribute("data-theme", r);
    resolved = r;
  }

  $effect.root(() => {
    $effect(() => {
      apply(value);
      localStorage.setItem("theme", value);
      if (value === "auto") {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const listener = () => apply("auto");
        mq.addEventListener("change", listener);
        return () => mq.removeEventListener("change", listener);
      }
    });
  });

  return {
    get value() {
      return value;
    },
    set value(v: Theme) {
      value = v;
    },
    get resolved() {
      return resolved;
    },
  };
}

export const theme = createTheme();
