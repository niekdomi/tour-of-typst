import { defaultLocale } from "../../content/i18n";
import type { Locale } from "../../content/i18n";

function createLocale() {
  let value = $state<Locale>((localStorage.getItem("locale") as Locale) ?? defaultLocale);

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
