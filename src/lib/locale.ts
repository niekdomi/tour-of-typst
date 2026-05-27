import { createSignal } from "solid-js";

import { defaultLocale, type Locale } from "../../content/i18n";

const [locale, setLocaleInternal] = createSignal<Locale>(
  (localStorage.getItem("locale") as Locale | null) ?? defaultLocale
);

export function setLocale(v: Locale) {
  localStorage.setItem("locale", v);
  setLocaleInternal(v);
}

export { locale };
