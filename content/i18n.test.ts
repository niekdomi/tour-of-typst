import { describe, it, expect } from "bun:test";
import { getTranslations, locales, defaultLocale } from "./i18n";

const localeCases = [
  {
    locale: "en",
    expected: {
      selectLanguage: "Language",
      selectTheme: "Theme",
      themeAuto: "Auto",
      themeLight: "Light",
      themeDark: "Dark",
    },
  },
  {
    locale: "de",
    expected: {
      selectLanguage: "Sprache",
      selectTheme: "Design",
      themeAuto: "Automatisch",
      themeLight: "Hell",
      themeDark: "Dunkel",
    },
  },
] as const;

describe("getTranslations", () => {
  for (const { locale, expected } of localeCases) {
    it(`returns translations for '${locale}'`, () => {
      const t = getTranslations(locale);
      for (const [key, value] of Object.entries(expected)) {
        expect(t[key as keyof typeof t]).toBe(value);
      }
    });
  }

  it("falls back to English for unknown locale", () => {
    const t = getTranslations("xx" as "en");
    expect(t).toEqual(getTranslations("en"));
  });

  it("defaultLocale is a known locale", () => {
    expect(locales).toContain(defaultLocale);
  });
});

describe("i18n completeness", () => {
  const reference = getTranslations("en");
  const requiredKeys = Object.keys(reference) as (keyof typeof reference)[];

  for (const locale of locales) {
    it(`${locale} has all translation keys with non-empty values`, () => {
      const t = getTranslations(locale);
      expect(Object.keys(t)).toEqual(expect.arrayContaining(requiredKeys));
      const empty = requiredKeys.filter((k) => !t[k]);
      expect(empty).toEqual([]);
    });
  }
});
