import { describe, expect, it } from "vitest";
import { frac, fracText, type Frac } from "../../../../lib/fraction";
import { fromNumbers } from "../../../../lib/matrix";
import { solve } from "../../../../lib/systems";
import { combine, halves, matVec, paramName } from "./combine";

const vec = (xs: number[]) => xs.map((x) => frac(x));
const text = (v: Frac[]) => v.map(fracText);

describe("combine", () => {
  const A = fromNumbers([[1, 1, 0], [0, 1, 1]]);
  const b = vec([3, 3]);
  const sol = solve(A, b);

  it("adds multiples of the null space to the particular solution", () => {
    expect(text(sol.particular!)).toEqual(["1", "2", "1"]);
    // The notes write Nul(A) = t(−1, 1, −1); the basis returned here is (1, −1, 1), so t = −1 gives (0, 3, 0).
    expect(text(combine(sol.particular!, sol.nullBasis, [halves(-2)]))).toEqual(["0", "3", "0"]);
  });

  it("keeps A·X = b for any parameter", () => {
    for (const t of [-6, -1, 0, 1, 7]) {
      const X = combine(sol.particular!, sol.nullBasis, [halves(t)]);
      expect(text(matVec(A, X))).toEqual(["3", "3"]);
    }
  });

  it("works with fractional parameters", () => {
    expect(text(combine(vec([0, 0, 0]), [vec([2, 2, 2])], [halves(1)]))).toEqual(["1", "1", "1"]);
  });
});

describe("paramName", () => {
  it("numbers the parameters only when there are several", () => {
    expect(paramName(0, 1)).toBe("t");
    expect(paramName(1, 2)).toBe("t₂");
  });
});
