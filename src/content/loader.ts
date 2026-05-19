import type { LocaleMeta, TourModule } from "./types";
import { buildAuxIndex, buildFileIndex, findTourForLocale, flattenChapters } from "./utils";

export { findTourForLocale, flattenChapters };

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

const auxFilesRaw = import.meta.glob<string>("../../content/*/*/*/*.yaml", {
  eager: true,
  query: "?raw",
  import: "default",
});

const allModules: TourModule[] = Object.values(tourModules);
const markdownIndex = buildFileIndex(markdownFiles, "index.md");
const templateIndex = buildFileIndex(templateFiles, "template.typ");
const solutionIndex = buildFileIndex(solutionFiles, "solution.typ");
const auxIndex = buildAuxIndex(auxFilesRaw);

export const availableLocales: LocaleMeta[] = allModules.map((m) => m.meta);

export function getTourForLocale(locale: string): TourModule | undefined {
  return findTourForLocale(allModules, locale);
}

export const getChapterMarkdown = (locale: string, key: string) =>
  markdownIndex.get(`${locale}:${key}`);
export const getChapterTemplate = (locale: string, key: string) =>
  templateIndex.get(`${locale}:${key}`);
export const getChapterSolution = (locale: string, key: string) =>
  solutionIndex.get(`${locale}:${key}`);

export function getChapterAuxFiles(locale: string, key: string): Record<string, string> {
  return auxIndex.get(`${locale}:${key}`) ?? {};
}
