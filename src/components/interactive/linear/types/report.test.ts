import { describe, expect, it } from "vitest";
import { fromNumbers } from "../../../../lib/matrix";
import { entryName, subscript } from "./entry";
import { typeReport, TYPE_IDS } from "./report";

const row = (data: number[][], id: string) => typeReport(fromNumbers(data)).find((r) => r.id === id)!;

describe("typeReport", () => {
  it("answers every type once, in order", () => {
    expect(typeReport(fromNumbers([[1]])).map((r) => r.id)).toEqual(TYPE_IDS);
  });

  it("explains why the matrix of the notes is not symmetric", () => {
    const r = row([[1, 4], [2, 3]], "symmetric");
    expect(r.yes).toBe(false);
    expect(r.why).toBe("whySymmetricNo");
    expect(r.vars).toMatchObject({ a: "a₁₂", v: "4", b: "a₂₁", w: "2", opp: "−4" });
  });

  it("recognises symmetric, antisymmetric, diagonal and identity", () => {
    expect(row([[1, 3], [3, 3]], "symmetric").yes).toBe(true);
    expect(row([[0, 1], [-1, 0]], "antisymmetric").yes).toBe(true);
    expect(row([[2, 0], [0, 5]], "diagonal").yes).toBe(true);
    expect(row([[2, 0], [0, 5]], "identity").why).toBe("whyDiagonalNotOne");
    expect(row([[1, 0], [0, 1]], "identity").yes).toBe(true);
  });

  it("asks for a zero diagonal in antisymmetric matrices", () => {
    expect(row([[1, 0], [0, 1]], "antisymmetric").why).toBe("whyAntiDiagonal");
    expect(row([[0, 2], [3, 0]], "antisymmetric").why).toBe("whyAntiNo");
  });

  it("handles triangular matrices, also the non-square ones", () => {
    expect(row([[1, 2], [0, 3]], "upper")).toMatchObject({ yes: true, why: "whyUpperYes" });
    expect(row([[1, 2, 3], [0, 4, 5]], "upper")).toMatchObject({ yes: true, why: "whyUpperYesRect" });
    expect(row([[1, 2], [3, 4]], "lower")).toMatchObject({ yes: false, why: "whyAbove" });
    expect(row([[1, 2], [3, 4]], "upper")).toMatchObject({ yes: false, why: "whyBelow" });
  });

  it("only allows the square-only types on square matrices", () => {
    for (const id of ["identity", "diagonal", "symmetric", "antisymmetric"]) {
      expect(row([[1, 2, 3], [4, 5, 6]], id)).toMatchObject({ yes: false, why: "whyNeedSquare" });
    }
    expect(row([[1, 2, 3], [4, 5, 6]], "square")).toMatchObject({ yes: false, why: "whySquareNo" });
  });

  it("detects the zero matrix", () => {
    expect(row([[0, 0], [0, 0]], "zero").yes).toBe(true);
    expect(row([[0, 0], [0, 7]], "zero").vars).toMatchObject({ a: "a₂₂", v: "7" });
  });
});

describe("entry names", () => {
  it("writes subscripts", () => {
    expect(subscript(12)).toBe("₁₂");
    expect(entryName("c", 1, 2)).toBe("c₂₃");
  });
});
