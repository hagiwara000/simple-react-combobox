import { describe, it, expect } from "vitest";
import { canSelect } from "../src/selection";

describe("canSelect", () => {
  it("returns false when closed", () => {
    expect(canSelect(false, 0, 3)).toBe(false);
  });

  it("returns false for negative index", () => {
    expect(canSelect(true, -1, 3)).toBe(false);
  });

  it("returns false when index is out of range", () => {
    expect(canSelect(true, 3, 3)).toBe(false);
  });

  it("returns false when list is empty", () => {
    expect(canSelect(true, 0, 0)).toBe(false);
  });

  it("returns true when open and index is valid", () => {
    expect(canSelect(true, 1, 3)).toBe(true);
  });
});
