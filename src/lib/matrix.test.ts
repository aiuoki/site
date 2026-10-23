import { describe, expect, it } from "vitest";
import { frac } from "./fraction";
import { classify, det, fromNumbers, identity, product, productTerms, splitSymmetric, sum, toText, trace, transpose } from "./matrix";

describe("basic operations", () => {
  const A = fromNumbers([[1, 2], [3, 4]]);
  const B = fromNumbers([[0, 1], [1, 0]]);

  it("transposes, adds and multiplies", () => {
    expect(toText(transpose(fromNumbers([[1, 2, 3]])))).toEqual([["1"], ["2"], ["3"]]);
    expect(toText(sum(A, B)!)).toEqual([["1", "3"], ["4", "4"]]);
    expect(toText(product(A, B)!)).toEqual([["2", "1"], ["4", "3"]]);
  });

  it("shows that AB ≠ BA", () => {
    expect(toText(product(B, A)!)).toEqual([["3", "4"], ["1", "2"]]);
  });

  it("refuses sizes that do not match", () => {
    expect(sum(A, fromNumbers([[1, 2, 3]]))).toBeNull();
    expect(product(fromNumbers([[1, 2, 3]]), A)).toBeNull();
  });

  it("lists the terms of one entry of a product", () => {
    expect(productTerms(A, B, 1, 0)).toEqual([[frac(3), frac(0)], [frac(4), frac(1)]]);
  });

  it("computes trace and determinant", () => {
    expect(trace(A)).toEqual(frac(5));
    expect(det(A)).toEqual(frac(-2));
    expect(det(fromNumbers([[2, 0, 1], [1, 3, 2], [1, 1, 2]]))).toEqual(frac(6));
    expect(det(fromNumbers([[2, 0, 1], [1, 3, 2], [1, 1, 1]]))).toEqual(frac(0));
    expect(det(identity(4))).toEqual(frac(1));
    expect(trace(fromNumbers([[1, 2, 3]]))).toBeNull();
  });
});

describe("classify", () => {
  it("recognises the types of the notes", () => {
    expect(classify(identity(3))).toMatchObject({ identity: true, diagonal: true, symmetric: true, upper: true, lower: true });
    expect(classify(fromNumbers([[1, 2], [2, 5]]))).toMatchObject({ symmetric: true, antisymmetric: false, diagonal: false });
    expect(classify(fromNumbers([[0, 3], [-3, 0]]))).toMatchObject({ antisymmetric: true, symmetric: false });
    expect(classify(fromNumbers([[1, 2], [0, 3]]))).toMatchObject({ upper: true, lower: false });
  });

  it("keeps square-only types false for rectangular matrices", () => {
    expect(classify(fromNumbers([[1, 2, 3], [0, 4, 5]]))).toMatchObject({ square: false, symmetric: false, diagonal: false, upper: true });
  });
});

describe("splitSymmetric", () => {
  it("reproduces the example of the notes", () => {
    const parts = splitSymmetric(fromNumbers([[1, 4], [2, 3]]))!;
    expect(toText(parts.symmetric)).toEqual([["1", "3"], ["3", "3"]]);
    expect(toText(parts.antisymmetric)).toEqual([["0", "1"], ["−1", "0"]]);
  });

  it("does not apply to rectangular matrices", () => {
    expect(splitSymmetric(fromNumbers([[1, 2, 3]]))).toBeNull();
  });
});
