import { describe, expect, it } from "bun:test";

import { changedSolutionLines } from "./solution-focus";

describe("changedSolutionLines", () => {
  it("marks no lines when template and solution are identical", () => {
    const src = "a\nb\nc";
    expect(changedSolutionLines(src, src)).toEqual(new Set());
  });

  it("marks appended lines as changed", () => {
    const template = "a\nb";
    const solution = "a\nb\nc\nd";
    expect(changedSolutionLines(template, solution)).toEqual(new Set([3, 4]));
  });

  it("marks lines inserted in the middle", () => {
    const template = "a\nc";
    const solution = "a\nb\nc";
    expect(changedSolutionLines(template, solution)).toEqual(new Set([2]));
  });

  it("marks a modified line as changed while leaving its neighbours alone", () => {
    const template = "a\nb\nc";
    const solution = "a\nB\nc";
    expect(changedSolutionLines(template, solution)).toEqual(new Set([2]));
  });

  it("treats every solution line as changed when the template is empty", () => {
    expect(changedSolutionLines("", "x\ny")).toEqual(new Set([1, 2]));
  });

  it("keeps unchanged lines unmarked even when content moves down", () => {
    const template = "header\nbody";
    const solution = "header\nintro\nbody";
    expect(changedSolutionLines(template, solution)).toEqual(new Set([2]));
  });
});
