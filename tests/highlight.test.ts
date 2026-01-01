import { describe, it, expect } from "vitest";
import { moveHighlight } from "../src/highlight";

describe("moveHighlight", () => {
  it("returns -1 when list is empty", () => {
    expect(moveHighlight(0, 1, 0)).toBe(-1);
  });

  it("moves down within bounds", () => {
    expect(moveHighlight(0, 1, 3)).toBe(1);
    expect(moveHighlight(1, 1, 3)).toBe(2);
  });

  it("clamps to last index when moving past end", () => {
    expect(moveHighlight(2, 1, 3)).toBe(2);
  });

  it("moves up within bounds", () => {
    expect(moveHighlight(2, -1, 3)).toBe(1);
  });

  it("clamps to zero when moving past start", () => {
    expect(moveHighlight(0, -1, 3)).toBe(0);
  });

  it("handles initial -1 index", () => {
    expect(moveHighlight(-1, 1, 3)).toBe(0);
  });
});
