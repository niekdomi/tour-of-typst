export interface Translations {
  selectLanguage: string;
  selectTheme: string;
  themeAuto: string;
  themeLight: string;
  themeDark: string;
  tocHint: string;
}

const translations = {
  en: {
    selectLanguage: "Language",
    selectTheme: "Theme",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    tocHint: "(You can click me)",
  },
  de: {
    selectLanguage: "Sprache",
    selectTheme: "Design",
    themeAuto: "Automatisch",
    themeLight: "Hell",
    themeDark: "Dunkel",
    tocHint: "(Du kannst mich anklicken)",
  },
} as const satisfies Record<string, Translations>;

export type Locale = keyof typeof translations;

/** Returns the translations for the given locale */
export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export const defaultLocale: Locale = "en";
export const locales = Object.keys(translations) as Locale[];
