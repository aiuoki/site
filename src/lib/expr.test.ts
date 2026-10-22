import { describe, expect, it } from "vitest";
import { evaluate } from "./expr";

describe("evaluate", () => {
  it("supports square roots, also with implicit products", () => {
    expect(evaluate("√3/2")?.val).toBeCloseTo(Math.sqrt(3) / 2);
    expect(evaluate("2√3")?.val).toBeCloseTo(2 * Math.sqrt(3));
    expect(evaluate("-√(2)")?.val).toBeCloseTo(-Math.SQRT2);
  });

  it("returns NaN-free results only", () => {
    expect(evaluate("√-1")).toBeNull();
    expect(evaluate("1/0")).toBeNull();
  });

  it("flags expressions that use π", () => {
    expect(evaluate("-3π/4")).toEqual({ val: (-3 * Math.PI) / 4, hasPi: true });
  });
});
