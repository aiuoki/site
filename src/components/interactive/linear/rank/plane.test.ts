import { describe, expect, it } from "vitest";
import { fracText } from "../../../../lib/fraction";
import { fromNumbers } from "../../../../lib/matrix";
import { gridLines, planeOf, svgPoints } from "./plane";

describe("planeOf", () => {
  it("only exists for 2×2 matrices", () => {
    expect(planeOf(fromNumbers([[1, 2, 3], [4, 5, 6]]))).toBeNull();
    expect(planeOf(fromNumbers([[1]]))).toBeNull();
  });

  it("maps the unit square to the parallelogram of the columns, area = det", () => {
    const plane = planeOf(fromNumbers([[2, 1], [0, 3]]))!;
    expect(plane.e1).toEqual([2, 0]);
    expect(plane.e2).toEqual([1, 3]);
    expect(plane.image).toEqual([[0, 0], [2, 0], [3, 3], [1, 3]]);
    expect(fracText(plane.det)).toBe("6");
    expect(plane.kind).toBe("full");
  });

  it("keeps the sign of the determinant when the figure flips", () => {
    expect(fracText(planeOf(fromNumbers([[0, 1], [1, 0]]))!.det)).toBe("−1");
  });

  it("collapses to a segment with rank 1 and to a point with rank 0", () => {
    expect(planeOf(fromNumbers([[1, 2], [2, 4]]))!.kind).toBe("segment");
    expect(planeOf(fromNumbers([[0, 0], [0, 0]]))!.kind).toBe("point");
  });

  it("scales the view so the whole image fits", () => {
    expect(planeOf(fromNumbers([[1, 0], [0, 1]]))!.extent).toBe(2);
    const big = planeOf(fromNumbers([[10, 0], [0, 10]]))!;
    expect(big.extent).toBeGreaterThanOrEqual(10);
    expect(big.step).toBeGreaterThan(1);
  });
});

describe("drawing helpers", () => {
  it("lists the grid lines on both sides of the origin", () => {
    expect(gridLines({ extent: 2, step: 1 })).toEqual([-2, -1, 1, 2]);
  });

  it("flips y for SVG without producing -0", () => {
    expect(svgPoints([[0, 0], [1, 2]])).toBe("0,0 1,-2");
  });
});
