import {
  type Accessor,
  createContext,
  createSignal,
  type JSX,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const FADE_MS = 200;

function systemTheme(): Theme {
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function detectInitial(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : systemTheme();
}

function applyTheme(t: Theme): void {
  document.documentElement.dataset["theme"] = t;
}

interface ThemeContextValue {
  theme: Accessor<Theme>;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>();

export function ThemeProvider(props: { children: JSX.Element }) {
  const [theme, setTheme] = createSignal<Theme>(detectInitial());

  // Apply synchronously in the body so children render against the right
  // data-theme on first paint.
  applyTheme(theme());

  const setThemeWithFade = (next: Theme) => {
    const root = document.documentElement;
    root.classList.add("theme-fade");
    applyTheme(next);
    setTheme(next);
    setTimeout(() => {
      root.classList.remove("theme-fade");
    }, FADE_MS);
  };

  onMount(() => {
    const mql = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (localStorage.getItem(STORAGE_KEY)) {
        return;
      }
      setThemeWithFade(systemTheme());
    };

    mql.addEventListener("change", handler);
    onCleanup(() => {
      mql.removeEventListener("change", handler);
    });
  });

  const value: ThemeContextValue = {
    theme,
    toggle: () => {
      const next: Theme = theme() === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      setThemeWithFade(next);
    },
  };

  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
