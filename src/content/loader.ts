import type { TourModule, LocaleMeta, Chapter } from "./types";

const tourModules = import.meta.glob<TourModule>("../../content/*/tour.ts", { eager: true });

const markdownFiles = import.meta.glob<string>("../../content/*/*/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const templateFiles = import.meta.glob<string>("../../content/*/*/*/template.typ", {
  eager: true,
  query: "?raw",
  import: "default",
});

const solutionFiles = import.meta.glob<string>("../../content/*/*/*/solution.typ", {
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

function findFile(files: Record<string, string>, locale: string, key: string): string | undefined {
  const pattern = new RegExp(`/content/${locale}/[^/]+/[^/]+-${key}/`);
  return Object.entries(files).find(([p]) => pattern.test(p))?.[1];
}

export const getChapterMarkdown = (l: string, k: string) => findFile(markdownFiles, l, k);
export const getChapterTemplate = (l: string, k: string) => findFile(templateFiles, l, k);
export const getChapterSolution = (l: string, k: string) => findFile(solutionFiles, l, k);
