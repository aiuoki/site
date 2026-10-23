// Matrices of exact fractions: operations, types and the symmetric /
// antisymmetric split. Pure functions; matrices are never mutated.
import { ONE, ZERO, add, div, eq, frac, fracText, isZero, mul, neg, sub, type Frac } from "./fraction";

export type Matrix = Frac[][];

export const rows = (A: Matrix) => A.length;
export const cols = (A: Matrix) => A[0]?.length ?? 0;
export const isSquare = (A: Matrix) => rows(A) > 0 && rows(A) === cols(A);

export const fromNumbers = (data: number[][]): Matrix => data.map((row) => row.map((x) => frac(x)));
export const toText = (A: Matrix): string[][] => A.map((row) => row.map(fracText));
export const zeros = (m: number, n: number): Matrix => Array.from({ length: m }, () => Array.from({ length: n }, () => ZERO));
export const identity = (n: number): Matrix =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? ONE : ZERO)));

export const equals = (A: Matrix, B: Matrix) =>
  rows(A) === rows(B) && cols(A) === cols(B) && A.every((row, i) => row.every((x, j) => eq(x, B[i]![j]!)));

export const transpose = (A: Matrix): Matrix => Array.from({ length: cols(A) }, (_, j) => A.map((row) => row[j]!));

const sameSize = (A: Matrix, B: Matrix) => rows(A) === rows(B) && cols(A) === cols(B);

// Null when the sizes do not allow the operation.
export const sum = (A: Matrix, B: Matrix): Matrix | null => (sameSize(A, B) ? A.map((row, i) => row.map((x, j) => add(x, B[i]![j]!))) : null);
export const difference = (A: Matrix, B: Matrix): Matrix | null => (sameSize(A, B) ? A.map((row, i) => row.map((x, j) => sub(x, B[i]![j]!))) : null);
export const scale = (k: Frac, A: Matrix): Matrix => A.map((row) => row.map((x) => mul(k, x)));

// c_ij = Σ_k a_ik b_kj; null unless columns of A = rows of B.
export function product(A: Matrix, B: Matrix): Matrix | null {
  if (cols(A) !== rows(B)) return null;
  return A.map((row) => Array.from({ length: cols(B) }, (_, j) => row.reduce((acc, a, k) => add(acc, mul(a, B[k]![j]!)), ZERO)));
}

// The terms a_i1·b_1j, a_i2·b_2j... that add up to c_ij (for step-by-step views).
export const productTerms = (A: Matrix, B: Matrix, i: number, j: number): [Frac, Frac][] =>
  A[i]!.map((a, k) => [a, B[k]![j]!]);

export function trace(A: Matrix): Frac | null {
  if (!isSquare(A)) return null;
  return A.reduce((acc, row, i) => add(acc, row[i]!), ZERO);
}

// Determinant by cofactor expansion along the first row (matrices up to 5×5).
export function det(A: Matrix): Frac | null {
  if (!isSquare(A)) return null;
  const n = rows(A);
  if (n === 1) return A[0]![0]!;
  let total = ZERO;
  for (let j = 0; j < n; j++) {
    const a = A[0]![j]!;
    if (isZero(a)) continue;
    const minor = A.slice(1).map((row) => row.filter((_, c) => c !== j));
    const term = mul(a, det(minor)!);
    total = j % 2 ? sub(total, term) : add(total, term);
  }
  return total;
}

export interface MatrixTypes {
  square: boolean;
  zero: boolean;
  identity: boolean;
  diagonal: boolean;
  symmetric: boolean;
  antisymmetric: boolean;
  upper: boolean;
  lower: boolean;
}

// Every type of the notes the matrix belongs to. Types defined only for
// square matrices are false otherwise, except triangular (zeros below or
// above the diagonal also make sense for rectangular matrices).
export function classify(A: Matrix): MatrixTypes {
  const all = (test: (x: Frac, i: number, j: number) => boolean) => A.every((row, i) => row.every((x, j) => test(x, i, j)));
  const square = isSquare(A);
  const upper = all((x, i, j) => j >= i || isZero(x));
  const lower = all((x, i, j) => j <= i || isZero(x));
  const diagonal = square && upper && lower;
  const t = transpose(A);
  return {
    square,
    zero: all((x) => isZero(x)),
    identity: diagonal && A.every((row, i) => eq(row[i]!, ONE)),
    diagonal,
    symmetric: square && equals(A, t),
    antisymmetric: square && equals(A, scale(frac(-1), t)),
    upper,
    lower,
  };
}

// A = (A + Aᵗ)/2 + (A − Aᵗ)/2: symmetric part plus antisymmetric part.
export function splitSymmetric(A: Matrix): { symmetric: Matrix; antisymmetric: Matrix } | null {
  if (!isSquare(A)) return null;
  const t = transpose(A);
  const half = frac(1, 2);
  return { symmetric: scale(half, sum(A, t)!), antisymmetric: scale(half, difference(A, t)!) };
}

export const negate = (A: Matrix): Matrix => A.map((row) => row.map(neg));
export const divideAll = (A: Matrix, k: Frac): Matrix => A.map((row) => row.map((x) => div(x, k)));
