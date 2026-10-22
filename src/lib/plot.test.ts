import { describe, expect, it } from "vitest";
import { C, S, arcPath, clampValue, pointToDeg, u, v } from "./plot";

describe("canvas transform", () => {
  it("maps unit coordinates to the 700×700 canvas", () => {
    expect(u(0)).toBe(C);
    expect(u(1)).toBe(C + S);
    expect(v(1)).toBe(C - S);
  });
});

describe("pointToDeg", () => {
  it("returns the angle of a canvas point in [0, 360)", () => {
    expect(pointToDeg(u(1), v(0))).toBeCloseTo(0);
    expect(pointToDeg(u(0), v(1))).toBeCloseTo(90);
    expect(pointToDeg(u(0), v(-1))).toBeCloseTo(270);
  });

  it("ignores points too close to the centre", () => {
    expect(pointToDeg(C + 1, C)).toBeNull();
  });
});

describe("arcPath", () => {
  it("is empty for a zero angle", () => {
    expect(arcPath(0.5, 0, 0)).toBe("");
  });

  it("draws a wedge from the centre", () => {
    expect(arcPath(1, 0, 90, true)).toBe(`M${C} ${C} L${u(1)} ${v(0)} A${S} ${S} 0 0 0 ${u(0)} ${v(1)} Z`);
  });

  it("uses the large-arc flag beyond 180°", () => {
    expect(arcPath(1, 0, 270)).toContain(`A${S} ${S} 0 1 0`);
  });

  it("sweeps clockwise for negative angles", () => {
    expect(arcPath(1, 90, 0)).toContain(`A${S} ${S} 0 0 1`);
  });
});

describe("clampValue", () => {
  it("keeps huge tangents inside the drawable range", () => {
    expect(clampValue(1e6)).toBe(60);
    expect(clampValue(-1e6)).toBe(-60);
    expect(clampValue(2)).toBe(2);
  });
});
