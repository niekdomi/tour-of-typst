import type { Chapter, TourModule } from "./types";

const CHAPTER_DIR_PREFIX = /^\d+-/;

function parseContentPath(
  path: string
): { locale: string; key: string; filename: string } | undefined {
  const segments = path.split("/").filter(Boolean);
  const i = segments.indexOf("content");
  if (i === -1 || segments.length - i < 5) {
    return undefined;
  }
  const locale = segments[i + 1]!;
  const chapterDir = segments[i + 3]!;
  const filename = segments[i + 4]!;
  const key = chapterDir.replace(CHAPTER_DIR_PREFIX, "");
  return { locale, key, filename };
}

/**
 * Build a `locale:key → contents` index from a Vite glob record.
 *
 * Expected path shape (with any leading prefix allowed):
 *   /.../content/{locale}/{part}/{number}-{key}/{filename}
 *
 * Entries that don't match the shape, or have a different filename than
 * `expectedFilename`, are skipped.
 */
export function buildFileIndex(
  files: Record<string, string>,
  expectedFilename: string
): Map<string, string> {
  const index = new Map<string, string>();
  for (const [path, contents] of Object.entries(files)) {
    const entry = parseContentPath(path);
    if (!entry || entry.filename !== expectedFilename) {
      continue;
    }
    index.set(`${entry.locale}:${entry.key}`, contents);
  }
  return index;
}

/**
 * Build a `locale:key → (filename → contents)` index from a Vite glob record.
 * Used for chapter auxiliary files where multiple files per chapter coexist.
 */
export function buildAuxIndex(files: Record<string, string>): Map<string, Record<string, string>> {
  const index = new Map<string, Record<string, string>>();
  for (const [path, contents] of Object.entries(files)) {
    const entry = parseContentPath(path);
    if (!entry) {
      continue;
    }
    const composite = `${entry.locale}:${entry.key}`;
    let bucket = index.get(composite);
    if (!bucket) {
      bucket = {};
      index.set(composite, bucket);
    }
    bucket[`/${entry.filename}`] = contents;
  }
  return index;
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
