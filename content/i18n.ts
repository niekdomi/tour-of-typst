export interface Translations {
  selectLanguage: string;
  selectTheme: string;
  themeAuto: string;
  themeLight: string;
  themeDark: string;
  tocHint: string;
  resetTooltip: string;
  formatTooltip: string;
  resetAllTooltip: string;
  reset: string;
  resetAll: string;
  format: string;
  showSolution: string;
  hideSolution: string;
}

const translations = {
  en: {
    selectLanguage: "Language",
    selectTheme: "Theme",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    tocHint: "(You can click me)",
    resetTooltip: "Reset this exercise to its starting code",
    formatTooltip: "Auto-format the code in the editor",
    resetAllTooltip: "Reset every exercise back to its starting code",
    reset: "Reset",
    resetAll: "Reset All",
    format: "Format",
    showSolution: "Show Solution",
    hideSolution: "Hide Solution",
  },
  de: {
    selectLanguage: "Sprache",
    selectTheme: "Design",
    themeAuto: "Automatisch",
    themeLight: "Hell",
    themeDark: "Dunkel",
    tocHint: "(Du kannst mich anklicken)",
    resetTooltip: "Diese Übung auf den Ausgangscode zurücksetzen",
    formatTooltip: "Den Code im Editor automatisch formatieren",
    resetAllTooltip: "Alle Übungen auf den Ausgangscode zurücksetzen",
    reset: "Zurücksetzen",
    resetAll: "Alle zurücksetzen",
    format: "Formatieren",
    showSolution: "Lösung anzeigen",
    hideSolution: "Lösung ausblenden",
  },
} as const satisfies Record<string, Translations>;

export type Locale = keyof typeof translations;

/**
 * Returns the translations for the given locale
 */
export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export const defaultLocale: Locale = "en";
export const locales = Object.keys(translations) as Locale[];
