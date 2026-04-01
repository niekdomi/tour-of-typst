import type { TourModule, Chapter } from "./types";

/**
 * Locate a chapter's markdown contents by locale and chapter key.
 *
 * Expected path shape (with any leading prefix allowed):
 *   /.../content/{locale}/{part}/{chapterDir}/index.md
 *
 * The chapterDir must end with `-{key}`.
 */
export function findFile(
  files: Record<string, string>,
  locale: string,
  key: string
): string | undefined {
  for (const [path, contents] of Object.entries(files)) {
    const segments = path.split("/").filter(Boolean);
    const contentIndex = segments.indexOf("content");

    // Require: content/{locale}/.../{chapterDir}/index.md (at least 5 segments from "content")
    if (contentIndex === -1 || segments.length - contentIndex < 5) {
      continue;
    }

    const localeSegment = segments[contentIndex + 1];
    const chapterDir = segments[contentIndex + 3];
    const filename = segments[contentIndex + 4];

    if (localeSegment !== locale || filename !== "index.md") {
      continue;
    }

    if (chapterDir.endsWith(`-${key}`)) {
      return contents;
    }
  }

  return undefined;
}

/**
 * Flatten parts into a single chapter list while preserving part order.
 * Parts with empty chapter arrays contribute nothing.
 */
export function flattenChapters(tour: TourModule): Chapter[] {
  return tour.parts.flatMap((p) => p.chapters);
}

/**
 * Find a tour whose locale matches exactly (case-sensitive).
 */
export function findTourForLocale(modules: TourModule[], locale: string): TourModule | undefined {
  return modules.find((m) => m.meta.locale === locale);
}
