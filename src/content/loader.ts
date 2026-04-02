import type { TourModule, LocaleMeta } from "./types";
import { findFile, flattenChapters, findTourForLocale } from "./utils";

export { findFile, flattenChapters, findTourForLocale };

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
  return findTourForLocale(allModules, locale);
}

export const getChapterMarkdown = (l: string, k: string) => findFile(markdownFiles, l, k);
export const getChapterTemplate = (l: string, k: string) =>
  findFile(templateFiles, l, k, "template.typ");
export const getChapterSolution = (l: string, k: string) =>
  findFile(solutionFiles, l, k, "solution.typ");
