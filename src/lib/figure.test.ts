import { describe, expect, it } from "vitest";
import { arcPath, pointOn, polar, px, py, round, tint, unitAngle } from "./figure";

describe("unit plane transforms", () => {
  it("maps the origin and the unit point to the legacy pixels", () => {
    expect([px(0), py(0)]).toEqual([50, 190]);
    expect([px(1), py(1)]).toEqual([190, 50]);
  });
});

describe("polar", () => {
  it("returns cartesian coordinates of a point at an angle", () => {
    const [x, y] = polar(90, 2);
    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(2, 10);
  });
});

describe("arcPath", () => {
  it("builds an open counter-clockwise arc", () => {
    expect(arcPath(1, 0, 90)).toBe("M190 190 A140 140 0 0 0 50 50");
  });

  it("closes through the origin when filled", () => {
    expect(arcPath(1, 0, 90, true)).toBe("M50 190 L190 190 A140 140 0 0 0 50 50 Z");
  });
});

describe("tint", () => {
  it("mixes a theme variable with transparent", () => {
    expect(tint("a")).toBe("color-mix(in srgb, var(--a) 18%, transparent)");
    expect(tint("g", 15)).toBe("color-mix(in srgb, var(--g) 15%, transparent)");
  });
});

describe("round", () => {
  it("keeps three decimals", () => {
    expect(round(1.23456)).toBe(1.235);
  });
});

describe("unitAngle", () => {
  it("returns the trigonometric values of the reference angle", () => {
    const { c, s, tn, ct } = unitAngle(45);
    expect(c).toBeCloseTo(Math.SQRT1_2, 10);
    expect(s).toBeCloseTo(Math.SQRT1_2, 10);
    expect(tn).toBeCloseTo(1, 10);
    expect(ct).toBeCloseTo(1, 10);
  });
});

describe("pointOn", () => {
  it("flips the vertical axis around the centre", () => {
    const [x, y] = pointOn(100, 100, 90, 10);
    expect(x).toBeCloseTo(100, 10);
    expect(y).toBeCloseTo(90, 10);
  });
});
