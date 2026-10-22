import { describe, expect, it } from "vitest";
import { cx } from "./complex";
import { angOf, binH, binOf, expH, modOf, nq, parseNum, partsOf, piQ, polH, scaleEx, sqrtEx, sup, trigH } from "./complex-format";

const es = "es-ES";

describe("real numbers", () => {
  it("writes short decimals, then fractions, then rounded values", () => {
    expect(nq(0.5, es)).toEqual({ s: "0,5", ex: true });
    expect(nq(1 / 3, es)).toEqual({ s: "1/3", ex: true });
    expect(nq(-2 / 3, es)).toEqual({ s: "−2/3", ex: true });
    expect(nq(Math.PI, es)).toEqual({ s: "3,142", ex: false });
  });

  it("simplifies square roots", () => {
    expect(sqrtEx(12, es)).toBe("2√3");
    expect(sqrtEx(3 / 4, es)).toBe("√3/2");
    expect(sqrtEx(25, es)).toBe("5");
    expect(sqrtEx(Math.PI, es)).toBeNull();
  });

  it("scales exact values", () => {
    expect(scaleEx("√3/2", [2, 1])).toBe("√3");
    expect(scaleEx("−1/2", [4, 1])).toBe("−2");
  });

  it("writes multiples of π", () => {
    expect(piQ(0.75)).toBe("3π/4");
    expect(piQ(-1)).toBe("−π");
    expect(piQ(Math.SQRT2)).toBeNull();
  });
});

describe("binomial form", () => {
  it("joins real and imaginary parts", () => {
    expect(binOf(cx(2, -1), es, false).s).toBe("2 − i");
    expect(binOf(cx(0, 1), es).s).toBe("<i>i</i>");
    expect(binOf(cx(-1, 0), es).s).toBe("−1");
  });

  it("recovers exact parts from notable angles", () => {
    const z = cx(0.5, Math.sqrt(3) / 2);
    expect(partsOf(z, es)).toEqual({ a: "1/2", b: "√3/2", ex: true });
    expect(binOf(cx(-1, Math.sqrt(3)), es, false).s).toBe("−1 + √3\u2009i");
  });

  it("marks rounded values with ≈", () => {
    expect(binH(cx(Math.PI, 0), es)).toBe("≈ 3,142");
  });
});

describe("other forms", () => {
  it("writes modulus and argument exactly when possible", () => {
    expect(modOf(cx(3, 4), es).s).toBe("5");
    expect(modOf(cx(1, 1), es).s).toBe("√2");
    expect(angOf((-3 * Math.PI) / 4, "rad", es).s).toBe("−3π/4");
    expect(angOf(Math.PI / 4, "deg", es).s).toBe("45°");
  });

  it("writes polar, exponential and trigonometric forms", () => {
    expect(polH(cx(1, 1), "rad", es)).toBe("√2<sub>π/4</sub>");
    expect(expH(cx(0, 1), es)).toBe("<i>e</i><sup><i>i</i>π/2</sup>");
    expect(trigH(cx(1, -1), "rad", es, { sin: "sen", cos: "cos" })).toBe("√2(cos (−π/4) + <i>i</i> sen (−π/4))");
  });
});

describe("parseNum", () => {
  it("accepts fractions, roots and π", () => {
    expect(parseNum("1/2")?.val).toBe(0.5);
    expect(parseNum("sqrt3/2")?.val).toBeCloseTo(Math.sqrt(3) / 2);
    expect(parseNum("-3pi/4")).toEqual({ val: (-3 * Math.PI) / 4, hasPi: true });
    expect(parseNum("1,5")?.val).toBe(1.5);
  });

  it("rejects empty or non numeric input", () => {
    expect(parseNum("")).toBeNull();
    expect(parseNum("2+")).toBeNull();
    expect(parseNum("x")).toBeNull();
  });
});

describe("sup", () => {
  it("writes superscript digits", () => {
    expect(sup(12)).toBe("¹²");
  });
});
