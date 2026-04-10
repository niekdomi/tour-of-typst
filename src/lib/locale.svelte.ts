import { defaultLocale, locales } from "../../content/i18n";
import type { Locale } from "../../content/i18n";

function detectBrowserLocale(): Locale {
  for (const lang of navigator.languages) {
    const prefix = lang.split("-")[0].toLowerCase() as Locale;
    if (locales.includes(prefix)) return prefix;
  }
  return defaultLocale;
}

function createLocale() {
  let value = $state<Locale>(
    (localStorage.getItem("locale") as Locale | null) ?? detectBrowserLocale()
  );

  $effect.root(() => {
    $effect(() => {
      localStorage.setItem("locale", value);
    });
  });

  return {
    get value() {
      return value;
    },
    set value(v: Locale) {
      value = v;
    },
  };
}

export const locale = createLocale();
