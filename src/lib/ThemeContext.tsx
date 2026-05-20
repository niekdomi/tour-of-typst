import {
  type Accessor,
  createContext,
  createRenderEffect,
  createSignal,
  type JSX,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function systemTheme(): Theme {
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function detectInitial(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : systemTheme();
}

interface ThemeContextValue {
  theme: Accessor<Theme>;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>();

export function ThemeProvider(props: { children: JSX.Element }) {
  const [theme, setTheme] = createSignal<Theme>(detectInitial());

  // Sync the document theme on initial setup and any future change.
  createRenderEffect(() => {
    document.documentElement.dataset["theme"] = theme();
  });

  function applyWithTransition(next: Theme) {
    if (typeof document.startViewTransition === "function") {
      void document.startViewTransition(() => setTheme(next));
    } else {
      setTheme(next);
    }
  }

  onMount(() => {
    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyWithTransition(systemTheme());
      }
    };
    mediaQuery.addEventListener("change", handler);
    onCleanup(() => mediaQuery.removeEventListener("change", handler));
  });

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => {
          const next: Theme = theme() === "dark" ? "light" : "dark";
          localStorage.setItem(STORAGE_KEY, next);
          applyWithTransition(next);
        },
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
