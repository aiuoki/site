import { describe, expect, it } from "vitest";
import { arcShape, arrowShape, fmtAngle, plane, points, svgT } from "./complex-figure";

describe("plane", () => {
  it("maps plane units to pixels with the y axis flipped", () => {
    const m = plane({ s: 50, ox: 150, oy: 120 });
    expect([m.px(1), m.py(1)]).toEqual([200, 70]);
    expect(m.viewBox).toBe("0 0 300 240");
  });

  it("defaults to a 300x240 canvas", () => {
    const m = plane();
    expect([m.s, m.ox, m.oy, m.w, m.h]).toEqual([50, 150, 120, 300, 240]);
  });
});

describe("svgT", () => {
  it("converts grouped and bare superscripts", () => {
    expect(svgT("e^(iθ)")).toBe('e<tspan baseline-shift="super" font-size="72%">iθ</tspan>');
    expect(svgT("e^z")).toBe('e<tspan baseline-shift="super" font-size="72%">z</tspan>');
  });

  it("converts subscripts and keeps nested parentheses in a group", () => {
    expect(svgT("1_θ")).toBe('1<tspan baseline-shift="sub" font-size="72%">θ</tspan>');
    expect(svgT("e^(i(θ+ω))")).toContain(">i(θ+ω)</tspan>");
  });

  it("leaves plain labels untouched", () => {
    expect(svgT("a = Re(z)")).toBe("a = Re(z)");
  });
});

describe("arrowShape", () => {
  const m = plane({ s: 10, ox: 0, oy: 0 });

  it("skips arrows shorter than two pixels", () => {
    expect(arrowShape(m, 0, 0, 0.1, 0)).toBeNull();
  });

  it("ends the shaft inside a head of at most 11px", () => {
    const a = arrowShape(m, 0, 0, 10, 0);
    expect(a?.line).toEqual([0, 0, 90, 0]);
    expect(a?.head).toBe("M100 0 L89 5.5 L89 -5.5 Z");
  });
});

describe("arcShape", () => {
  const m = plane({ s: 100, ox: 100, oy: 100 });

  it("returns null for a negligible span", () => {
    expect(arcShape(m, 1, 0, 0.2)).toBeNull();
  });

  it("builds a counter-clockwise arc and a clockwise one", () => {
    expect(arcShape(m, 1, 0, 90)).toBe("M200 100 A100 100 0 0 0 100 0");
    expect(arcShape(m, 1, 0, -90)).toBe("M200 100 A100 100 0 0 1 100 200");
  });

  it("closes a filled arc through the origin", () => {
    expect(arcShape(m, 1, 0, 90, true)).toBe("M100 100 L200 100 A100 100 0 0 0 100 0 Z");
  });
});

describe("fmtAngle", () => {
  it("uses the locale separator and the typographic minus", () => {
    expect(fmtAngle(-0.5880026, "es")).toBe("−0,588");
    expect(fmtAngle(2.5535900, "en")).toBe("2.554");
  });

  it("never prints negative zero", () => {
    expect(fmtAngle(-0.00001, "en")).toBe("0");
  });
});

describe("points", () => {
  it("joins plane points as pixel pairs", () => {
    expect(points(plane({ s: 10, ox: 0, oy: 0 }), [[1, 1], [2, 0]])).toBe("10,-10 20,0");
  });
});
