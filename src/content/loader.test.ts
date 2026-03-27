import { describe, it, expect } from "bun:test";
import { findFile, flattenChapters, findTourForLocale } from "./utils";
import type { TourModule } from "./types";

// --- findFile ---

const mockFiles = {
  "/content/en/basics/01-hello-world/index.md": "hello content",
  "/content/en/basics/02-text-formatting/index.md": "formatting content",
  "/content/de/basics/01-hello-world/index.md": "hallo inhalt",
};

describe("findFile", () => {
  it("finds file by locale and key", () => {
    expect(findFile(mockFiles, "en", "hello-world")).toBe("hello content");
  });

  it("respects locale", () => {
    expect(findFile(mockFiles, "de", "hello-world")).toBe("hallo inhalt");
  });

  it("does not return file from wrong locale", () => {
    expect(findFile(mockFiles, "de", "text-formatting")).toBeUndefined();
  });

  it("returns undefined for unknown key", () => {
    expect(findFile(mockFiles, "en", "missing")).toBeUndefined();
  });

  it("returns undefined for unknown locale", () => {
    expect(findFile(mockFiles, "fr", "hello-world")).toBeUndefined();
  });

  it("does not match partial key (hello does not match hello-world)", () => {
    expect(findFile(mockFiles, "en", "hello")).toBeUndefined();
  });

  it("returns undefined for empty file map", () => {
    expect(findFile({}, "en", "hello-world")).toBeUndefined();
  });

  it("handles keys with regex special characters", () => {
    const files = { "/content/en/scripting/01-c++/index.md": "cpp content" };
    expect(findFile(files, "en", "c++")).toBe("cpp content");
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
