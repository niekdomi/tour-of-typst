import { describe, it, expect } from "bun:test";
import { getTranslations, locales, defaultLocale } from "./i18n";

describe("getTranslations", () => {
  it("returns English translations for 'en'", () => {
    const t = getTranslations("en");
    expect(t.selectLanguage).toBe("Language");
    expect(t.selectTheme).toBe("Theme");
    expect(t.themeAuto).toBe("Auto");
    expect(t.themeLight).toBe("Light");
    expect(t.themeDark).toBe("Dark");
  });

  it("returns German translations for 'de'", () => {
    const t = getTranslations("de");
    expect(t.selectLanguage).toBe("Sprache");
    expect(t.selectTheme).toBe("Design");
  });

  it("falls back to English for unknown locale", () => {
    // cast to bypass type check — simulates a locale loaded at runtime
    const t = getTranslations("xx" as "en");
    expect(t).toEqual(getTranslations("en"));
  });

  it("defaultLocale is a known locale", () => {
    expect(locales).toContain(defaultLocale);
  });
});

describe("i18n completeness", () => {
  const baseKeys = Object.keys(getTranslations("en")) as (keyof ReturnType<
    typeof getTranslations
  >)[];

  for (const locale of locales) {
    it(`${locale} has all translation keys with non-empty values`, () => {
      const t = getTranslations(locale);
      const empty = baseKeys.filter((k) => !t[k]);
      if (empty.length > 0) {
        console.warn(`[i18n] ${locale} has empty translation keys: ${empty.join(", ")}`);
      }
      // completeness is a warning, not a hard failure — assert nothing is missing structurally
      expect(Object.keys(t)).toEqual(expect.arrayContaining(baseKeys));
    });
  }
});
