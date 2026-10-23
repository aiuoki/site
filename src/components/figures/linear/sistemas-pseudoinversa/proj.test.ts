import { describe, expect, it } from "vitest";
import { linePath, projector } from "./proj";

describe("oblique projection", () => {
  const p = projector({ s: 10, ox: 100, oy: 100 });

  it("puts the origin at the chosen pixel", () => {
    expect(p.pt(0, 0, 0)).toEqual([100, 100]);
  });

  it("sends x2 right, x3 up and x1 towards the lower left", () => {
    expect(p.pt(0, 1, 0)).toEqual([110, 100]);
    expect(p.pt(0, 0, 1)).toEqual([100, 90]);
    const [x, y] = p.pt(1, 0, 0);
    expect(x).toBeLessThan(100);
    expect(y).toBeGreaterThan(100);
  });

  it("draws a segment between two parameters", () => {
    expect(linePath(p, [0, 0, 0], [0, 1, 0], 0, 2)).toBe("M100 100 L120 100");
  });
});
