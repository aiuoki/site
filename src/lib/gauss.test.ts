import { describe, expect, it } from "vitest";
import { frac } from "./fraction";
import { applyOp, eliminate, inverse, inverseElimination, nullBasis, rank } from "./gauss";
import { fromNumbers, identity, product, toText } from "./matrix";
import { pseudoLeft, pseudoRight, solve } from "./systems";

const vec = (xs: number[]) => xs.map((x) => frac(x));

describe("row operations", () => {
  it("swaps, scales and adds rows", () => {
    const A = fromNumbers([[1, 2], [3, 4]]);
    expect(toText(applyOp(A, { kind: "swap", i: 0, j: 1 }))).toEqual([["3", "4"], ["1", "2"]]);
    expect(toText(applyOp(A, { kind: "scale", i: 1, k: frac(1, 2) }))).toEqual([["1", "2"], ["3/2", "2"]]);
    expect(toText(applyOp(A, { kind: "add", i: 1, j: 0, k: frac(-3) }))).toEqual([["1", "2"], ["0", "−2"]]);
  });
});

describe("eliminate", () => {
  it("reaches the echelon form recording every step", () => {
    const run = eliminate(fromNumbers([[0, 1, 2], [1, 1, 1], [2, 3, 4]]));
    expect(run.steps[0]!.op).toEqual({ kind: "swap", i: 0, j: 1 });
    expect(toText(run.result)).toEqual([["1", "1", "1"], ["0", "1", "2"], ["0", "0", "0"]]);
    expect(run.pivots).toEqual([[0, 0], [1, 1]]);
  });

  it("reduces to the form of the notes with Gauss-Jordan", () => {
    const run = eliminate(fromNumbers([[1, 1, 0], [0, 1, 1]]), { reduced: true });
    expect(toText(run.result)).toEqual([["1", "0", "−1"], ["0", "1", "1"]]);
  });
});

describe("rank", () => {
  it("counts the non-zero rows of the echelon form", () => {
    expect(rank(fromNumbers([[1, 2], [2, 4]]))).toBe(1);
    expect(rank(fromNumbers([[1, 2], [3, 4]]))).toBe(2);
    expect(rank(fromNumbers([[0, 0], [0, 0]]))).toBe(0);
  });

  it("never exceeds min(rows, columns)", () => {
    expect(rank(fromNumbers([[1, 2, 3, 4, 5], [5, 4, 3, 2, 1], [1, 1, 1, 1, 1], [0, 1, 0, 1, 0]]))).toBeLessThanOrEqual(4);
  });
});

describe("inverse", () => {
  it("is found with [A | I] ~ [I | A⁻¹]", () => {
    const A = fromNumbers([[2, 1], [1, 1]]);
    const run = inverseElimination(A)!;
    expect(toText(run.inverse!)).toEqual([["1", "−1"], ["−1", "2"]]);
    expect(toText(run.result.map((row) => row.slice(0, 2)))).toEqual(toText(identity(2)));
    expect(product(A, run.inverse!)).toEqual(identity(2));
  });

  it("does not exist for singular or rectangular matrices", () => {
    expect(inverse(fromNumbers([[1, 2], [2, 4]]))).toBeNull();
    expect(inverseElimination(fromNumbers([[1, 2, 3]]))).toBeNull();
  });
});

describe("null space", () => {
  it("matches the example of the notes, Nul(A) = t(−1, 1, −1)", () => {
    expect(nullBasis(fromNumbers([[1, 1, 0], [0, 1, 1]]))).toEqual([vec([1, -1, 1])]);
  });

  it("is only the zero vector for invertible matrices", () => {
    expect(nullBasis(fromNumbers([[1, 2], [3, 4]]))).toEqual([]);
  });
});

describe("pseudoinverses and systems", () => {
  const A = fromNumbers([[1, 1, 0], [0, 1, 1]]);

  it("finds R = Aᵗ(AAᵗ)⁻¹ and the particular solution Rb = (1, 2, 1) of the notes", () => {
    expect(product(A, pseudoRight(A)!)).toEqual(identity(2));
    const s = solve(A, vec([3, 3]));
    expect(s.case).toBe("right");
    expect(s.particular).toEqual(vec([1, 2, 1]));
    expect(s.nullBasis).toHaveLength(1);
  });

  it("uses L = (AᵗA)⁻¹Aᵗ when columns are independent", () => {
    const T = fromNumbers([[1, 0], [0, 1], [1, 1]]);
    expect(product(pseudoLeft(T)!, T)).toEqual(identity(2));
    expect(solve(T, vec([1, 2, 3]))).toMatchObject({ case: "left", consistent: true, particular: vec([1, 2]) });
    expect(solve(T, vec([1, 2, 0]))).toMatchObject({ case: "left", consistent: false, particular: null });
  });

  it("solves square regular systems with the inverse", () => {
    expect(solve(fromNumbers([[2, 1], [1, 1]]), vec([3, 2]))).toMatchObject({ case: "both", particular: vec([1, 1]) });
  });

  it("detects the case outside the notes and still checks consistency", () => {
    const S = fromNumbers([[1, 2], [2, 4]]);
    expect(solve(S, vec([1, 2]))).toMatchObject({ case: "none", consistent: true });
    expect(solve(S, vec([1, 3]))).toMatchObject({ case: "none", consistent: false });
  });
});

describe("large intermediate values", () => {
  it("stays exact when cross products pass 2^53", () => {
    const A = fromNumbers([[-8, -7, -10, 11], [5, 12, -9, 5], [-12, -7, 6, 10]]);
    expect(product(A, pseudoRight(A)!)).toEqual(identity(3));
  });
});
