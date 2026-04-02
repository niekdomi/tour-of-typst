import { describe, it, expect } from "bun:test";
import { findFile, flattenChapters, findTourForLocale } from "./utils";
import type { TourModule } from "./types";

// --- findFile ---

const mockFiles = {
  "/foo/content/en/basics/01-hello-world/index.md": "hello content",
  "/foo/content/en/basics/02-text-formatting/index.md": "formatting content",
  "/foo/content/de/basics/01-hello-world/index.md": "hallo inhalt",
  "/foo/content/en/scripting/01-c++/index.md": "cpp content",
  "/foo/content/en/basics/99-extra/index.txt": "not an index",
  "/foo/other/en/basics/01-off-path/index.md": "wrong root",
};

describe("findFile", () => {
  it("finds file by locale and key even with a leading path prefix", () => {
    expect(findFile(mockFiles, "en", "hello-world")).toBe("hello content");
  });

  it("respects locale separation", () => {
    expect(findFile(mockFiles, "de", "hello-world")).toBe("hallo inhalt");
    expect(findFile(mockFiles, "de", "text-formatting")).toBeUndefined();
  });

  it("requires an index.md filename inside the chapter directory", () => {
    expect(findFile(mockFiles, "en", "extra")).toBeUndefined();
  });

  it("ignores paths that do not include the /content/ root segment", () => {
    expect(findFile(mockFiles, "en", "off-path")).toBeUndefined();
  });

  it("returns undefined for unknown key or locale", () => {
    expect(findFile(mockFiles, "en", "missing")).toBeUndefined();
    expect(findFile(mockFiles, "fr", "hello-world")).toBeUndefined();
  });

  it("does not match partial keys (hello does not match hello-world)", () => {
    expect(findFile(mockFiles, "en", "hello")).toBeUndefined();
  });

  it("handles keys with regex special characters", () => {
    expect(findFile(mockFiles, "en", "c++")).toBe("cpp content");
  });

  it("returns undefined for empty file maps", () => {
    expect(findFile({}, "en", "hello-world")).toBeUndefined();
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

  it("returns chapters in part order", () => {
    expect(flattenChapters(tour).map((c) => c.key)).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for tour with no parts", () => {
    const empty: TourModule = { meta: { locale: "en", label: "English" }, parts: [] };
    expect(flattenChapters(empty)).toEqual([]);
  });

  it("skips parts with empty chapter arrays", () => {
    const sparse: TourModule = {
      meta: { locale: "en", label: "English" },
      parts: [
        { title: "Empty", chapters: [] },
        { title: "Part 2", chapters: [{ key: "c", title: "C" }] },
      ],
    };
    expect(flattenChapters(sparse).map((c) => c.key)).toEqual(["c"]);
  });

  it("preserves chapter properties", () => {
    expect(flattenChapters(tour)[0]).toEqual({ key: "a", title: "A" });
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
});
