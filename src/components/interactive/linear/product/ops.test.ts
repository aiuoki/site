import { describe, expect, it } from "vitest";
import { frac } from "../../../../lib/fraction";
import { fromNumbers } from "../../../../lib/matrix";
import { compareOrder, compute, readCell, readTrace, traceOfProducts } from "./ops";

const A = fromNumbers([[1, 2], [3, 4]]);
const B = fromNumbers([[0, 1], [1, 0]]);
const wide = fromNumbers([[1, 2, 3], [4, 5, 6]]);
const tall = fromNumbers([[1, 0], [0, 1], [2, 2]]);

describe("compute", () => {
  it("adds and scales", () => {
    const sum = compute("sum", A, B, null);
    expect(sum.ok && sum.result[0]![1]).toEqual(frac(3));
    const scaled = compute("scale", A, B, frac(1, 2));
    expect(scaled.ok && scaled.result[1]![0]).toEqual(frac(3, 2));
  });

  it("multiplies in both orders", () => {
    const ab = compute("AB", A, B, null);
    const ba = compute("BA", A, B, null);
    expect(ab.ok && ab.result).toEqual(fromNumbers([[2, 1], [4, 3]]));
    expect(ba.ok && ba.result).toEqual(fromNumbers([[3, 4], [1, 2]]));
  });

  it("explains the size mismatches", () => {
    expect(compute("sum", wide, A, null)).toMatchObject({ ok: false, why: "whySumSize", vars: { a: "2 × 3", b: "2 × 2" } });
    expect(compute("AB", wide, wide, null)).toMatchObject({ ok: false, why: "whyProductSize", vars: { left: "A", right: "B", c: 3, r: 2 } });
    expect(compute("BA", wide, tall, null)).toMatchObject({ ok: true });
    expect(compute("scale", A, B, null)).toMatchObject({ ok: false, why: "whyBadScalar" });
  });
});

describe("readCell", () => {
  it("writes the terms of c_ij", () => {
    const out = compute("AB", A, B, null);
    if (!out.ok) throw new Error("expected a product");
    expect(readCell(out, 0, 1)).toEqual({ symbolic: "c₁₂ = a₁₁·b₁₂ + a₁₂·b₂₂", numeric: "= 1·1 + 2·0", value: "1" });
  });

  it("swaps the letters in BA and brackets negatives", () => {
    const out = compute("BA", A, fromNumbers([[-1, 2], [0, 1]]), null);
    if (!out.ok) throw new Error("expected a product");
    expect(readCell(out, 0, 0).symbolic).toBe("c₁₁ = b₁₁·a₁₁ + b₁₂·a₂₁");
    expect(readCell(out, 0, 0).numeric).toBe("= (−1)·1 + 2·3");
  });

  it("reads sums and scalar products", () => {
    const sum = compute("sum", A, B, null);
    const scaled = compute("scale", A, B, frac(-2));
    if (!sum.ok || !scaled.ok) throw new Error("expected results");
    expect(readCell(sum, 1, 0)).toEqual({ symbolic: "c₂₁ = a₂₁ + b₂₁", numeric: "= 3 + 1", value: "4" });
    expect(readCell(scaled, 0, 1)).toEqual({ symbolic: "c₁₂ = λ·a₁₂", numeric: "= (−2)·2", value: "−4" });
  });
});

describe("compareOrder", () => {
  it("tells apart the cases", () => {
    expect(compareOrder(A, B)).toMatchObject({ kind: "differ", vars: { c: "c₁₁", x: "2", y: "3" } });
    expect(compareOrder(A, A).kind).toBe("equal");
    expect(compareOrder(wide, tall)).toMatchObject({ kind: "sizes", vars: { ab: "2 × 2", ba: "3 × 3" } });
    expect(compareOrder(wide, A).kind).toBe("onlyBA");
    expect(compareOrder(A, wide).kind).toBe("onlyAB");
    expect(compareOrder(wide, wide).kind).toBe("neither");
  });
});

describe("trace", () => {
  it("reads tr(A) and refuses non-square matrices", () => {
    expect(readTrace(A, "A")).toEqual({ symbolic: "tr(A) = a₁₁ + a₂₂", numeric: "= 1 + 4", value: "5" });
    expect(readTrace(wide, "A")).toBeNull();
  });

  it("tr(AB) = tr(BA) even with different shapes", () => {
    expect(traceOfProducts(wide, tall)).toEqual({ ab: "24", ba: "24", same: true });
    expect(traceOfProducts(wide, wide)).toBeNull();
  });
});
