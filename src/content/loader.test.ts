import { describe, expect, it } from "bun:test";

import type { TourModule } from "./types";
import { buildAuxIndex, buildFileIndex, findTourForLocale, flattenChapters } from "./utils";

// --- buildFileIndex ---

const mockFiles = {
  "/foo/content/en/basics/01-hello-world/index.md": "hello content",
  "/foo/content/en/basics/02-text-formatting/index.md": "formatting content",
  "/foo/content/de/basics/01-hello-world/index.md": "hallo inhalt",
  "/foo/content/en/basics/99-extra/index.txt": "not an index",
  "/foo/other/en/basics/01-off-path/index.md": "wrong root",
};

describe("buildFileIndex", () => {
  const index = buildFileIndex(mockFiles, "index.md");

  it("indexes file by locale and key even with a leading path prefix", () => {
    expect(index.get("en:hello-world")).toBe("hello content");
  });

  it("respects locale separation", () => {
    expect(index.get("de:hello-world")).toBe("hallo inhalt");
    expect(index.get("de:text-formatting")).toBeUndefined();
  });

  it("skips files whose name does not match the expected filename", () => {
    expect(index.get("en:extra")).toBeUndefined();
  });

  it("ignores paths that do not include the /content/ root segment", () => {
    expect(index.get("en:off-path")).toBeUndefined();
  });

  it("returns undefined for unknown key or locale", () => {
    expect(index.get("en:missing")).toBeUndefined();
    expect(index.get("fr:hello-world")).toBeUndefined();
  });

  it("does not match partial keys (hello does not match hello-world)", () => {
    expect(index.get("en:hello")).toBeUndefined();
  });

  it("returns an empty index for empty file maps", () => {
    expect(buildFileIndex({}, "index.md").size).toBe(0);
  });

  it("strips multi-digit numeric prefixes from chapter dirs", () => {
    const i = buildFileIndex({ "/c/content/en/part/100-advanced/index.md": "ok" }, "index.md");
    expect(i.get("en:advanced")).toBe("ok");
  });

  it("uses the chapter dir verbatim when it has no numeric prefix", () => {
    const i = buildFileIndex({ "/c/content/en/part/intro/index.md": "ok" }, "index.md");
    expect(i.get("en:intro")).toBe("ok");
  });
});

// --- buildAuxIndex ---

describe("buildAuxIndex", () => {
  const auxFiles = {
    "/foo/content/en/basics/01-hello-world/data.yaml": "key: value",
    "/foo/content/en/basics/01-hello-world/extra.yaml": "key: other",
    "/foo/content/en/basics/02-text-formatting/data.yaml": "key: different-chapter",
    "/foo/content/de/basics/01-hello-world/data.yaml": "schlüssel: wert",
    "/foo/other/en/basics/01-off-path/data.yaml": "wrong root",
  };
  const index = buildAuxIndex(auxFiles);

  it("groups multiple files per chapter under the leading-slash filename", () => {
    expect(index.get("en:hello-world")).toEqual({
      "/data.yaml": "key: value",
      "/extra.yaml": "key: other",
    });
  });

  it("does not conflate files with the same name across chapters", () => {
    expect(index.get("en:text-formatting")).toEqual({
      "/data.yaml": "key: different-chapter",
    });
  });

  it("respects locale separation", () => {
    expect(index.get("de:hello-world")).toEqual({ "/data.yaml": "schlüssel: wert" });
  });

  it("ignores paths outside /content/", () => {
    expect(index.get("en:off-path")).toBeUndefined();
  });

  it("returns undefined for chapters with no aux files", () => {
    expect(index.get("en:missing")).toBeUndefined();
  });
});

// --- flattenChapters ---

describe("flattenChapters", () => {
  const tour: TourModule = {
    meta: { locale: "en", label: "English" },
    parts: [
      {
        title: "Part 1",
        chapters: [
          { key: "a", title: "A" },
          { key: "b", title: "B" },
        ],
      },
      { title: "Part 2", chapters: [{ key: "c", title: "C" }] },
    ],
  };

  it("returns chapters in part order with full properties preserved", () => {
    expect(flattenChapters(tour)).toEqual([
      { key: "a", title: "A" },
      { key: "b", title: "B" },
      { key: "c", title: "C" },
    ]);
  });

  it("returns an empty array for tours with no parts", () => {
    expect(flattenChapters({ meta: { locale: "en", label: "English" }, parts: [] })).toEqual([]);
  });

  it("treats parts with empty chapter arrays as no-ops", () => {
    const sparse: TourModule = {
      meta: { locale: "en", label: "English" },
      parts: [
        { title: "Empty", chapters: [] },
        { title: "Part 2", chapters: [{ key: "c", title: "C" }] },
      ],
    };
    expect(flattenChapters(sparse).map((c) => c.key)).toEqual(["c"]);
  });
});

// --- findTourForLocale ---

const mockModules: TourModule[] = [
  { meta: { locale: "en", label: "English" }, parts: [] },
  { meta: { locale: "de", label: "Deutsch" }, parts: [] },
];

describe("findTourForLocale", () => {
  it("returns the matching tour", () => {
    expect(findTourForLocale(mockModules, "en")?.meta.locale).toBe("en");
    expect(findTourForLocale(mockModules, "de")?.meta.locale).toBe("de");
  });

  it("returns undefined for unknown locale", () => {
    expect(findTourForLocale(mockModules, "fr")).toBeUndefined();
  });

  it("is case-sensitive (EN does not match en)", () => {
    expect(findTourForLocale(mockModules, "EN")).toBeUndefined();
  });

  it("returns undefined for empty module list", () => {
    expect(findTourForLocale([], "en")).toBeUndefined();
  });

  it("returns the first match when duplicate locales are present", () => {
    const duplicates: TourModule[] = [
      { meta: { locale: "en", label: "First" }, parts: [] },
      { meta: { locale: "en", label: "Second" }, parts: [] },
    ];
    expect(findTourForLocale(duplicates, "en")?.meta.label).toBe("First");
  });
});
