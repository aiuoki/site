import { describe, expect, it } from "vitest";
import {
  angDist,
  angleText,
  compute,
  exact,
  isInt,
  norm,
  parseAngle,
  quadrant,
  refAngle,
  signedDeg,
  snap,
  toDegrees,
  wrapDeg,
} from "./trig";

describe("angle normalisation", () => {
  it("norm maps any angle to [0, 360)", () => {
    expect(norm(370)).toBe(10);
    expect(norm(-30)).toBe(330);
    expect(norm(360)).toBe(0);
  });

  it("wrapDeg keeps exactly 360 so the input can show a full turn", () => {
    expect(wrapDeg(360)).toBe(360);
    expect(wrapDeg(720)).toBe(0);
    expect(wrapDeg(-90)).toBe(270);
  });

  it("signedDeg maps to (−180, 180]", () => {
    expect(signedDeg(270)).toBe(-90);
    expect(signedDeg(180)).toBe(180);
  });

  it("isInt tolerates float noise", () => {
    expect(isInt(59.9999999)).toBe(true);
    expect(isInt(59.5)).toBe(false);
  });
});

describe("compute", () => {
  it("returns exact zeros on the axes", () => {
    const v = compute(90);
    expect(v.cos).toBe(0);
    expect(v.sin).toBe(1);
    expect(v.tan).toBeNull();
    expect(v.sec).toBeNull();
    expect(v.cot).toBe(0);
  });

  it("leaves cot and csc undefined at 0°", () => {
    const v = compute(0);
    expect(v.cot).toBeNull();
    expect(v.csc).toBeNull();
    expect(v.sec).toBe(1);
  });
});

describe("exact", () => {
  it("returns the notable values with the quadrant sign", () => {
    expect(exact(30)?.sin).toBe("1/2");
    expect(exact(150)?.cos).toBe("−√3/2");
    expect(exact(135)?.tan).toBe("−1");
    expect(exact(225)?.sin).toBe("−√2/2");
    expect(exact(300)?.cot).toBe("−√3/3");
  });

  it("handles 15° multiples with compound expressions", () => {
    expect(exact(105)?.cos).toBe("−(√6−√2)/4");
    expect(exact(105)?.tan).toBe("−(2+√3)");
  });

  it("marks undefined ratios with null", () => {
    expect(exact(90)?.tan).toBeNull();
    expect(exact(180)?.csc).toBeNull();
  });

  it("returns null for non notable angles", () => {
    expect(exact(37)).toBeNull();
    expect(exact(60.5)).toBeNull();
  });
});

describe("quadrant and reference angle", () => {
  it("returns 0 on the axes", () => {
    expect(quadrant(90)).toBe(0);
    expect(quadrant(0)).toBe(0);
  });

  it("numbers the quadrants counter-clockwise", () => {
    expect(quadrant(45)).toBe(1);
    expect(quadrant(100)).toBe(2);
    expect(quadrant(200)).toBe(3);
    expect(quadrant(359)).toBe(4);
  });

  it("computes the acute reference angle", () => {
    expect(refAngle(150)).toBe(30);
    expect(refAngle(200)).toBe(20);
    expect(refAngle(330)).toBe(30);
  });
});

describe("snap", () => {
  it("snaps to multiples of 15° within 3°", () => {
    expect(snap(43.2, true)).toBe(45);
    expect(snap(40, true)).toBe(40);
    expect(snap(359.6, true)).toBe(0);
  });

  it("rounds to one decimal without the magnet", () => {
    expect(snap(12.34, false)).toBe(12.3);
  });
});

describe("angDist", () => {
  it("measures the shortest way round", () => {
    expect(angDist(10, 350)).toBe(20);
  });
});

describe("parseAngle", () => {
  it("parses degrees and decimal commas", () => {
    expect(parseAngle("60°")).toEqual({ val: 60, hasPi: false });
    expect(parseAngle("1,5")).toEqual({ val: 1.5, hasPi: false });
  });

  it("parses expressions with π and implicit products", () => {
    expect(parseAngle("2π/3")?.val).toBeCloseTo((2 * Math.PI) / 3);
    expect(parseAngle("-pi/4")?.val).toBeCloseTo(-Math.PI / 4);
    expect(parseAngle("−π/2")?.hasPi).toBe(true);
    expect(parseAngle("3(π/6)")?.val).toBeCloseTo(Math.PI / 2);
    expect(parseAngle("π/3 rad")?.val).toBeCloseTo(Math.PI / 3);
  });

  it("accepts a trailing decimal point while typing", () => {
    expect(parseAngle("5.")).toEqual({ val: 5, hasPi: false });
  });

  it("rejects numbers separated by spaces", () => {
    expect(parseAngle("3 4")).toBeNull();
  });

  it("rejects values too large to be an angle", () => {
    expect(parseAngle("9".repeat(400))).toBeNull();
    expect(parseAngle("1e400")).toBeNull();
  });

  it("rejects anything that is not arithmetic", () => {
    expect(parseAngle("")).toBeNull();
    expect(parseAngle("abc")).toBeNull();
    expect(parseAngle("2*(3")).toBeNull();
    expect(parseAngle("1/0")).toBeNull();
    expect(parseAngle("alert(1)")).toBeNull();
  });
});

describe("toDegrees", () => {
  it("treats the value as radians in radian mode or when π is used", () => {
    expect(toDegrees({ val: Math.PI, hasPi: true }, "deg")).toBeCloseTo(180);
    expect(toDegrees({ val: 1, hasPi: false }, "rad")).toBeCloseTo(57.2958, 3);
    expect(toDegrees({ val: 400, hasPi: false }, "deg")).toBe(40);
  });
});

describe("angleText", () => {
  it("writes degrees with a plain minus for the input field", () => {
    expect(angleText(12.34, "deg", "es-ES")).toBe("12,3");
  });

  it("writes radians as a multiple of π when possible", () => {
    expect(angleText(300, "rad", "es-ES")).toBe("−π/3");
    expect(angleText(10.5, "rad", "es-ES")).toBe("0.1833");
  });
});
