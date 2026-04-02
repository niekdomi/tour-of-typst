import type { TourModule, Chapter } from "./types";

/**
 * Locate a chapter file's contents by locale, chapter key, and filename.
 *
 * Expected path shape (with any leading prefix allowed):
 *   /.../content/{locale}/{part}/{chapterDir}/{filename}
 *
 * The chapterDir must end with `-{key}`.
 */
export function findFile(
  files: Record<string, string>,
  locale: string,
  key: string,
  expectedFilename = "index.md"
): string | undefined {
  for (const [path, contents] of Object.entries(files)) {
    const segments = path.split("/").filter(Boolean);
    const contentIndex = segments.indexOf("content");

    // Require: content/{locale}/.../{chapterDir}/{filename} (at least 5 segments from "content")
    if (contentIndex === -1 || segments.length - contentIndex < 5) {
      continue;
    }

    const localeSegment = segments[contentIndex + 1];
    const chapterDir = segments[contentIndex + 3];
    const filename = segments[contentIndex + 4];

    if (localeSegment !== locale || filename !== expectedFilename) {
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
