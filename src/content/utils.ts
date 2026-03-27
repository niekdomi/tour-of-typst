import type { TourModule, Chapter } from "./types";

export function findFile(
  files: Record<string, string>,
  locale: string,
  key: string
): string | undefined {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`/content/${locale}/[^/]+/[^/]+-${escapedKey}/`);
  return Object.entries(files).find(([p]) => pattern.test(p))?.[1];
}

export function flattenChapters(tour: TourModule): Chapter[] {
  return tour.parts.flatMap((p) => p.chapters);
}

export function findTourForLocale(modules: TourModule[], locale: string): TourModule | undefined {
  return modules.find((m) => m.meta.locale === locale);
}
