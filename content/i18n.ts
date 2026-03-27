export type Locale = "en" | "de";

export interface Translations {
  selectLanguage: string;
  selectTheme: string;
  themeAuto: string;
  themeLight: string;
  themeDark: string;
}

const translations: Record<Locale, Translations> = {
  en: {
    selectLanguage: "Language",
    selectTheme: "Theme",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
  },
  de: {
    selectLanguage: "Sprache",
    selectTheme: "Design",
    themeAuto: "Automatisch",
    themeLight: "Hell",
    themeDark: "Dunkel",
  },
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.en;
}

export const defaultLocale: Locale = "en";
export const locales = Object.keys(translations) as Locale[];
