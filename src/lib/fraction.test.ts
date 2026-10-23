import { describe, expect, it } from "vitest";
import { add, div, frac, fracText, mul, parseFrac, sub } from "./fraction";

describe("frac", () => {
  it("reduces and keeps the denominator positive", () => {
    expect(frac(4, 6)).toEqual({ n: 2n, d: 3n });
    expect(frac(3, -6)).toEqual({ n: -1n, d: 2n });
    expect(frac(0, 5)).toEqual({ n: 0n, d: 1n });
  });

  it("does exact arithmetic", () => {
    expect(add(frac(1, 2), frac(1, 3))).toEqual(frac(5, 6));
    expect(sub(frac(1, 2), frac(1, 2))).toEqual(frac(0));
    expect(mul(frac(2, 3), frac(3, 4))).toEqual(frac(1, 2));
    expect(div(frac(1, 3), frac(2))).toEqual(frac(1, 6));
  });

  it("refuses to divide by zero", () => {
    expect(() => div(frac(1), frac(0))).toThrow();
  });
});

describe("fracText", () => {
  it("writes integers and fractions with the typographic minus", () => {
    expect(fracText(frac(3))).toBe("3");
    expect(fracText(frac(-2, 3))).toBe("−2/3");
  });
});

describe("parseFrac", () => {
  it("reads integers, decimals and fractions", () => {
    expect(parseFrac("-4")).toEqual(frac(-4));
    expect(parseFrac("0,5")).toEqual(frac(1, 2));
    expect(parseFrac("1.25")).toEqual(frac(5, 4));
    expect(parseFrac("−2/6")).toEqual(frac(-1, 3));
  });

  it("rejects anything else", () => {
    expect(parseFrac("")).toBeNull();
    expect(parseFrac("1/0")).toBeNull();
    expect(parseFrac("2x")).toBeNull();
    expect(parseFrac("1/2/3")).toBeNull();
    expect(parseFrac("9999999")).toBeNull();
  });
});
