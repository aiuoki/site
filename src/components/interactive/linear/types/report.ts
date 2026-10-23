// Which types of the notes a matrix belongs to, with the reason for each
// answer. Reasons are dictionary keys plus the values that fill them in.
import { eq, fracText, isZero, neg, ONE, type Frac } from "../../../../lib/fraction";
import { cols, isSquare, rows, type Matrix } from "../../../../lib/matrix";
import { entryName } from "./entry";

export type TypeId = "square" | "zero" | "identity" | "diagonal" | "symmetric" | "antisymmetric" | "upper" | "lower";

export interface TypeRow {
  id: TypeId;
  yes: boolean;
  // Key of the reason in the topic dictionary.
  why: string;
  vars: Record<string, string | number>;
}

export const TYPE_IDS: TypeId[] = ["square", "zero", "identity", "diagonal", "symmetric", "antisymmetric", "upper", "lower"];

// First entry (row by row) that fails the test.
function firstWhere(A: Matrix, bad: (x: Frac, i: number, j: number) => boolean): [number, number] | null {
  for (let i = 0; i < rows(A); i++) for (let j = 0; j < cols(A); j++) if (bad(A[i]![j]!, i, j)) return [i, j];
  return null;
}

const one = (A: Matrix, [i, j]: [number, number]) => ({ a: entryName("a", i, j), v: fracText(A[i]![j]!) });
const pair = (A: Matrix, [i, j]: [number, number]) => ({
  ...one(A, [i, j]),
  b: entryName("a", j, i),
  w: fracText(A[j]![i]!),
  opp: fracText(neg(A[i]![j]!)),
});

export function typeReport(A: Matrix): TypeRow[] {
  const m = rows(A);
  const n = cols(A);
  const square = isSquare(A);
  const row = (id: TypeId, yes: boolean, why: string, vars: TypeRow["vars"] = {}): TypeRow => ({ id, yes, why, vars });
  const needSquare = (id: TypeId) => row(id, false, "whyNeedSquare", { m, n });

  const offDiagonal = firstWhere(A, (x, i, j) => i !== j && !isZero(x));
  const diagonalNotOne = firstWhere(A, (x, i, j) => i === j && !eq(x, ONE));
  const asymmetric = firstWhere(A, (x, i, j) => square && i < j && !eq(x, A[j]![i]!));
  const notOpposite = firstWhere(A, (x, i, j) => square && i < j && !eq(x, neg(A[j]![i]!)));
  const diagonalNotZero = firstWhere(A, (x, i, j) => i === j && !isZero(x));
  const below = firstWhere(A, (x, i, j) => i > j && !isZero(x));
  const above = firstWhere(A, (x, i, j) => i < j && !isZero(x));
  const nonZero = firstWhere(A, (x) => !isZero(x));

  const triangular = (id: TypeId, bad: [number, number] | null, badKey: string, yesKey: string): TypeRow =>
    bad ? row(id, false, badKey, one(A, bad)) : row(id, true, square ? yesKey : `${yesKey}Rect`);

  return [
    square ? row("square", true, "whySquareYes", { m, n }) : row("square", false, "whySquareNo", { m, n }),
    nonZero ? row("zero", false, "whyZeroNo", one(A, nonZero)) : row("zero", true, "whyZeroYes"),
    !square
      ? needSquare("identity")
      : offDiagonal
        ? row("identity", false, "whyOffDiagonal", one(A, offDiagonal))
        : diagonalNotOne
          ? row("identity", false, "whyDiagonalNotOne", one(A, diagonalNotOne))
          : row("identity", true, "whyIdentityYes"),
    !square
      ? needSquare("diagonal")
      : offDiagonal
        ? row("diagonal", false, "whyOffDiagonal", one(A, offDiagonal))
        : row("diagonal", true, "whyDiagonalYes"),
    !square
      ? needSquare("symmetric")
      : asymmetric
        ? row("symmetric", false, "whySymmetricNo", pair(A, asymmetric))
        : row("symmetric", true, "whySymmetricYes"),
    !square
      ? needSquare("antisymmetric")
      : diagonalNotZero
        ? row("antisymmetric", false, "whyAntiDiagonal", one(A, diagonalNotZero))
        : notOpposite
          ? row("antisymmetric", false, "whyAntiNo", pair(A, notOpposite))
          : row("antisymmetric", true, "whyAntiYes"),
    triangular("upper", below, "whyBelow", "whyUpperYes"),
    triangular("lower", above, "whyAbove", "whyLowerYes"),
  ];
}
