import type { TourModule, LocaleMeta, Chapter } from "./types";

const tourModules = import.meta.glob<TourModule>("../../content/*/tour.ts", { eager: true });
const markdownFiles = import.meta.glob<string>("../../content/*/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const allModules: TourModule[] = Object.values(tourModules);

export const availableLocales: LocaleMeta[] = allModules.map((m) => m.meta);

export function getTourForLocale(locale: string): TourModule | undefined {
  return allModules.find((m) => m.meta.locale === locale);
}

export function flattenChapters(tour: TourModule): Chapter[] {
  return tour.parts.flatMap((p) => p.chapters);
}

/**
 * Returns the raw markdown string for a given locale + chapter key, or undefined
 * if no matching file was found.
 *
 * Files are expected at: content/{locale}/{nn}-{key}/index.md
 * The glob key looks like:  ../../content/en/00-welcome/index.md
 */
export function getChapterMarkdown(locale: string, key: string): string | undefined {
  const entry = Object.entries(markdownFiles).find(([path]) => {
    // Match  .../content/{locale}/{anything}-{key}/index.md
    const pattern = new RegExp(`/content/${locale}/[^/]+-${key}/index\\.md$`);
    return pattern.test(path);
  });

  return entry?.[1];
}
