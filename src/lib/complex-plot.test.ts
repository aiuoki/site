import { describe, expect, it } from "vitest";
import { cx } from "./complex";
import { C, S, X, Y, arc, arrow, labelPos, outside, sector, snapPoint } from "./complex-plot";

describe("plane transform", () => {
  it("maps units to pixels", () => {
    expect(X(1)).toBe(C + S);
    expect(Y(1)).toBe(C - S);
  });
});

describe("arrow", () => {
  it("ends the head exactly at the target", () => {
    expect(arrow(0, 0, 2, 0)?.head.startsWith(`M${X(2)} ${Y(0)}`)).toBe(true);
  });

  it("skips arrows too short to see", () => {
    expect(arrow(0, 0, 0.01, 0)).toBeNull();
  });
});

describe("arc", () => {
  it("is empty for tiny angles", () => {
    expect(arc(40, 0, 0.1)).toBe("");
  });

  it("splits a full turn in two arcs", () => {
    expect(arc(40, 0, 2 * Math.PI).match(/A/g)).toHaveLength(2);
  });

  it("closes sectors through the origin", () => {
    expect(sector(40, 0, Math.PI / 2)).toMatch(new RegExp(`^M${C} ${C} L.* Z$`));
  });
});

describe("snapPoint", () => {
  it("snaps to the half grid", () => {
    expect(snapPoint(1.47, 2.03, true)).toEqual([1.5, 2]);
  });

  it("snaps to notable points of the unit circle", () => {
    const [x, y] = snapPoint(0.52, 0.85, true);
    expect(x).toBeCloseTo(0.5);
    expect(y).toBeCloseTo(Math.sqrt(3) / 2);
  });

  it("clamps to the plane and rounds without the magnet", () => {
    expect(snapPoint(9, -1.234, false)).toEqual([5.5, -1.23]);
  });
});

describe("labels and bounds", () => {
  it("pushes labels away from the origin", () => {
    expect(labelPos(cx(2, 0))).toEqual([2.42, 0]);
  });

  it("detects points outside the plane", () => {
    expect(outside([cx(1, 1), cx(7, 0)])).toBe(true);
    expect(outside([cx(1, 1)])).toBe(false);
  });
});
