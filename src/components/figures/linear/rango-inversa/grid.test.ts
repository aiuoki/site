import { describe, expect, it } from "vitest";
import { colX, gridWidth, layout, pick } from "./grid";

describe("grid layout", () => {
  it("leaves a gap after the divider only", () => {
    const l = layout({ divider: 2 });
    expect(colX(1, l)).toBe(34);
    expect(colX(2, l)).toBe(2 * 34 + 12);
    expect(gridWidth(4, l)).toBe(4 * 34 + 12);
    expect(gridWidth(4, layout())).toBe(4 * 34);
  });

  it("prefers the most specific highlight", () => {
    const map = { r1: "row", c0: "col", "1,0": "cell" };
    expect(pick(map, 1, 0)).toBe("cell");
    expect(pick(map, 1, 2)).toBe("row");
    expect(pick(map, 0, 0)).toBe("col");
    expect(pick(map, 0, 1)).toBeUndefined();
  });
});
