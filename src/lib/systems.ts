// Linear systems AX = b with the pseudoinverses of the notes:
// right R = Aᵗ(AAᵗ)⁻¹ (full row rank) and left L = (AᵗA)⁻¹Aᵗ (full column rank).
import { isZero, type Frac } from "./fraction";
import { eliminate, inverse, nullBasis, rank } from "./gauss";
import { cols, equals, product, rows, transpose, type Matrix } from "./matrix";

export const column = (v: Frac[]): Matrix => v.map((x) => [x]);
export const flatten = (M: Matrix): Frac[] => M.map((row) => row[0]!);

export function pseudoRight(A: Matrix): Matrix | null {
  if (rank(A) !== rows(A)) return null;
  const At = transpose(A);
  return product(At, inverse(product(A, At)!)!);
}

export function pseudoLeft(A: Matrix): Matrix | null {
  if (rank(A) !== cols(A)) return null;
  const At = transpose(A);
  return product(inverse(product(At, A)!)!, At);
}

// The four cases of the summary table of the notes.
export type SystemCase = "both" | "right" | "left" | "none";

export interface Solution {
  case: SystemCase;
  rank: number;
  // Inverse or pseudoinverse used, if any.
  pseudo: Matrix | null;
  // Particular solution (A⁻¹b, Rb or Lb), when the system has one.
  particular: Frac[] | null;
  // Basis of Nul(A): the homogeneous solutions Xh.
  nullBasis: Frac[][];
  // Whether AX = b has at least one solution.
  consistent: boolean;
}

export function solve(A: Matrix, b: Frac[]): Solution {
  const r = rank(A);
  const [m, n] = [rows(A), cols(A)];
  const basis = nullBasis(A);
  const B = column(b);
  const verify = (X: Matrix | null) => (X && equals(product(A, X)!, B) ? flatten(X) : null);

  if (r === m && r === n) {
    const inv = inverse(A)!;
    return { case: "both", rank: r, pseudo: inv, particular: flatten(product(inv, B)!), nullBasis: basis, consistent: true };
  }
  if (r === m) {
    const R = pseudoRight(A)!;
    return { case: "right", rank: r, pseudo: R, particular: flatten(product(R, B)!), nullBasis: basis, consistent: true };
  }
  if (r === n) {
    const L = pseudoLeft(A)!;
    // X = Lb only solves the system when b is in Col(A).
    const X = verify(product(L, B));
    return { case: "left", rank: r, pseudo: L, particular: X, nullBasis: basis, consistent: X !== null };
  }
  // Neither pseudoinverse exists (Moore-Penrose is out of the notes):
  // still say whether the system is consistent, from [A | b].
  const augmented = eliminate(A.map((row, i) => [...row, b[i]!]));
  const consistent = !augmented.result.some((row) => row.slice(0, n).every(isZero) && !isZero(row[n]!));
  return { case: "none", rank: r, pseudo: null, particular: null, nullBasis: basis, consistent };
}
