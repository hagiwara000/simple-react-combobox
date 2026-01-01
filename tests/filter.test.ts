import { describe, it, expect } from "vitest";
import { defaultFilter } from "../src/filter";

describe("defaultFilter", () => {
  it("returns all items when input is empty", () => {
    const items = ["Apple", "Banana"];
    const result = defaultFilter(items, "", String);
    expect(result).toBe(items); // 同一参照でOK
  });

  it("filters items by substring (case-insensitive)", () => {
    const items = ["Apple", "Banana", "Grape"];
    const result = defaultFilter(items, "ap", String);
    expect(result).toEqual(["Apple", "Grape"]);
  });

  it("returns empty array when no items match", () => {
    const items = ["Apple", "Banana"];
    const result = defaultFilter(items, "zzz", String);
    expect(result).toEqual([]);
  });

  it("works with custom itemToString", () => {
    const items = [
      { id: 1, label: "Foo" },
      { id: 2, label: "Bar" },
    ];
    const result = defaultFilter(items, "ba", (item) => item.label);
    expect(result).toEqual([{ id: 2, label: "Bar" }]);
  });
});
