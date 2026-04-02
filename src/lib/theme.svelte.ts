export type Theme = "auto" | "light" | "dark";

function createTheme() {
  let value = $state<Theme>((localStorage.getItem("theme") as Theme) ?? "auto");
  let theme = $state<"light" | "dark">("light");

  function apply(v: Theme) {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    const resolvedTheme = v === "auto" ? systemTheme : v;

    document.documentElement.setAttribute("data-theme", resolvedTheme);
    theme = resolvedTheme;
  }

  $effect.root(() => {
    $effect(() => {
      apply(value);
      localStorage.setItem("theme", value);
      if (value === "auto") {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const listener = () => { apply("auto"); };

        mq.addEventListener("change", listener);
        return () => { mq.removeEventListener("change", listener); };
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
      return theme;
    },
  };
}

export const theme = createTheme();
