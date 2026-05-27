import { describe, expect, it } from "bun:test";

import { defaultLocale, getTranslations, locales } from "./i18n";

describe("locales", () => {
  it("is non-empty", () => {
    expect(locales.length).toBeGreaterThan(0);
  });

  it("contains the defaultLocale", () => {
    expect(locales).toContain(defaultLocale);
  });
});

describe("getTranslations", () => {
  const referenceKeys = Object.keys(getTranslations(defaultLocale)) as (keyof ReturnType<
    typeof getTranslations
  >)[];

  for (const locale of locales) {
    it(`returns a complete, non-empty Translations object for '${locale}'`, () => {
      const t = getTranslations(locale);
      for (const key of referenceKeys) {
        expect(t).toHaveProperty(key);
        expect(t[key]).toBeTruthy();
      }
    });
  }

  // Catches copy-paste bugs where another locale was left identical to the default.
  for (const locale of locales.filter((l) => l !== defaultLocale)) {
    it(`'${locale}' is not a verbatim copy of '${defaultLocale}'`, () => {
      const reference = getTranslations(defaultLocale);
      const translated = getTranslations(locale);
      const allIdentical = referenceKeys.every((k) => reference[k] === translated[k]);
      expect(allIdentical).toBe(false);
    });
  }
});
