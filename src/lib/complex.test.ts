import { describe, expect, it } from "vitest";
import { abs, add, arg, conj, cx, div, exp, log, mul, pow, reduceAngle, roots } from "./complex";

describe("complex arithmetic", () => {
  it("follows i² = −1", () => {
    expect(mul(cx(0, 1), cx(0, 1))).toEqual({ re: -1, im: 0 });
  });

  it("adds, multiplies and divides like the notes", () => {
    expect(add(cx(2, -1), cx(1, 2))).toEqual({ re: 3, im: 1 });
    expect(mul(cx(1, 1), cx(1, -1))).toEqual({ re: 2, im: 0 });
    const q = div(cx(2, 3), cx(1, 2));
    expect(q.re).toBeCloseTo(8 / 5);
    expect(q.im).toBeCloseTo(-1 / 5);
  });

  it("computes powers and conjugates", () => {
    expect(pow(cx(1, 1), 4)).toEqual({ re: -4, im: 0 });
    expect(conj(cx(2, 3))).toEqual({ re: 2, im: -3 });
    expect(abs(cx(3, 4))).toBe(5);
  });
});

describe("arg", () => {
  it("returns the principal argument in (−π, π]", () => {
    expect(arg(cx(-1, 0))).toBe(Math.PI);
    expect(arg(cx(-1, -1))).toBeCloseTo((-3 * Math.PI) / 4);
    expect(arg(cx(0, 1))).toBeCloseTo(Math.PI / 2);
  });

  it("reduces angles into (−π, π]", () => {
    expect(reduceAngle(3 * Math.PI)).toBeCloseTo(Math.PI);
    expect(reduceAngle(-Math.PI)).toBeCloseTo(Math.PI);
  });
});

describe("roots, exp and log", () => {
  it("finds the three cube roots of 8", () => {
    const r = roots(cx(8, 0), 3);
    expect(r).toHaveLength(3);
    expect(r[0]!.re).toBeCloseTo(2);
    expect(r[1]!.re).toBeCloseTo(-1);
    expect(r[1]!.im).toBeCloseTo(Math.sqrt(3));
  });

  it("has no roots of 0", () => {
    expect(roots(cx(0, 0), 3)).toEqual([]);
  });

  it("satisfies e^{iπ} = −1 and Log(−1) = iπ", () => {
    expect(exp(cx(0, Math.PI))).toEqual({ re: -1, im: 0 });
    expect(log(cx(-1, 0))).toEqual({ re: 0, im: Math.PI });
    expect(log(cx(0, 0))).toBeNull();
  });
});
