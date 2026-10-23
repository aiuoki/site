import { describe, expect, it } from "vitest";
import { frac } from "../../../../lib/fraction";
import { rowName, rowOpText, subscript } from "./row-op-text";

describe("subscript", () => {
  it("writes every digit as a subscript", () => {
    expect(subscript(1)).toBe("₁");
    expect(subscript(12)).toBe("₁₂");
    expect(rowName("R", 3)).toBe("R₄");
  });
});

describe("rowOpText", () => {
  it("writes a swap", () => {
    expect(rowOpText({ kind: "swap", i: 0, j: 1 }, "F")).toBe("F₁ ↔ F₂");
  });

  it("writes a scaling, with fractions and negatives in parentheses", () => {
    expect(rowOpText({ kind: "scale", i: 0, k: frac(1, 2) }, "F")).toBe("F₁ ← (1/2)·F₁");
    expect(rowOpText({ kind: "scale", i: 2, k: frac(3) }, "R")).toBe("R₃ ← 3·R₃");
    expect(rowOpText({ kind: "scale", i: 1, k: frac(-1) }, "F")).toBe("F₂ ← (−1)·F₂");
  });

  it("writes adding a multiple of another row with the sign outside", () => {
    expect(rowOpText({ kind: "add", i: 1, j: 0, k: frac(-3) }, "F")).toBe("F₂ ← F₂ − 3·F₁");
    expect(rowOpText({ kind: "add", i: 2, j: 0, k: frac(2) }, "R")).toBe("R₃ ← R₃ + 2·R₁");
    expect(rowOpText({ kind: "add", i: 1, j: 0, k: frac(-1) }, "F")).toBe("F₂ ← F₂ − F₁");
    expect(rowOpText({ kind: "add", i: 1, j: 0, k: frac(1) }, "F")).toBe("F₂ ← F₂ + F₁");
    expect(rowOpText({ kind: "add", i: 0, j: 1, k: frac(-1, 2) }, "F")).toBe("F₁ ← F₁ − (1/2)·F₂");
  });
});
