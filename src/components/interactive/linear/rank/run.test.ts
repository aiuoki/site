import { describe, expect, it } from "vitest";
import { fracText } from "../../../../lib/fraction";
import { fromNumbers, toText } from "../../../../lib/matrix";
import { buildRun, maxRank } from "./run";

describe("buildRun", () => {
  it("records the echelon elimination and the rank", () => {
    const A = fromNumbers([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    const run = buildRun(A, "echelon", false);
    expect(run.matrices).toHaveLength(run.ops.length + 1);
    expect(run.rank).toBe(2);
    expect(run.pivots).toEqual([[0, 0], [1, 1]]);
    expect(run.divider).toBeUndefined();
    expect(fracText(run.det!)).toBe("0");
    expect(maxRank(A)).toBe(3);
  });

  it("starts [A | I] and ends with the inverse", () => {
    const run = buildRun(fromNumbers([[2, 1], [1, 1]]), "inverse", false);
    expect(toText(run.matrices[0]!)).toEqual([["2", "1", "1", "0"], ["1", "1", "0", "1"]]);
    expect(run.divider).toBe(2);
    expect(toText(run.inverse!)).toEqual([["1", "−1"], ["−1", "2"]]);
    expect(run.inverseChecks).toBe(true);
  });

  it("has no inverse when the rank drops or the matrix is not square", () => {
    const singular = buildRun(fromNumbers([[1, 2], [2, 4]]), "inverse", false);
    expect(singular.inverse).toBeNull();
    expect(singular.rank).toBe(1);
    const wide = buildRun(fromNumbers([[1, 1, 0], [0, 1, 1]]), "inverse", false);
    expect(wide.notSquare).toBe(true);
    expect(wide.rank).toBe(2);
    expect(wide.matrices).toHaveLength(1);
  });
});
