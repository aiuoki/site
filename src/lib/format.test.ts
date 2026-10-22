import { describe, expect, it } from "vitest";
import { fmt, fmtDeg, fmtP, minus, neg, paren, piFrac } from "./format";

describe("minus", () => {
  it("uses the typographic minus sign", () => {
    expect(minus("-3-2")).toBe("−3−2");
  });
});

describe("fmt", () => {
  it("formats with the locale decimal separator and fixed digits", () => {
    expect(fmt(0.5, "es-ES")).toBe("0,5000");
    expect(fmt(0.5, "en-GB")).toBe("0.5000");
    expect(fmt(Math.PI, "en-GB", 2)).toBe("3.14");
  });

  it("uses the typographic minus and never prints −0", () => {
    expect(fmt(-1.5, "en-GB")).toBe("−1.5000");
    expect(fmt(-0.00001, "en-GB")).toBe("0.0000");
  });

  it("does not group thousands", () => {
    expect(fmt(12345.5, "en-GB", 1)).toBe("12345.5");
  });
});

describe("fmtP", () => {
  it("wraps negative numbers in parentheses", () => {
    expect(fmtP(-0.5, "en-GB")).toBe("(−0.5000)");
    expect(fmtP(0.5, "en-GB")).toBe("0.5000");
  });
});

describe("fmtDeg", () => {
  it("keeps at most one decimal", () => {
    expect(fmtDeg(12.34, "es-ES")).toBe("12,3");
    expect(fmtDeg(45, "es-ES")).toBe("45");
    expect(fmtDeg(-30, "es-ES")).toBe("−30");
  });
});

describe("piFrac", () => {
  it("writes whole degrees as a reduced multiple of π", () => {
    expect(piFrac(0)).toBe("0");
    expect(piFrac(60)).toBe("π/3");
    expect(piFrac(180)).toBe("π");
    expect(piFrac(270)).toBe("3π/2");
    expect(piFrac(-90)).toBe("−π/2");
    expect(piFrac(-180)).toBe("−π");
    expect(piFrac(1)).toBe("π/180");
  });
});

describe("neg and paren", () => {
  it("negates simple and compound expressions", () => {
    expect(neg("√3/2")).toBe("−√3/2");
    expect(neg("2+√3")).toBe("−(2+√3)");
    expect(neg("(√6−√2)/4")).toBe("−(√6−√2)/4");
  });

  it("adds parentheses only when needed", () => {
    expect(paren("−1/2")).toBe("(−1/2)");
    expect(paren("2+√3")).toBe("(2+√3)");
    expect(paren("√2/2")).toBe("√2/2");
  });
});
