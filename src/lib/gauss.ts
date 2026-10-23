// Gaussian elimination with every elementary row operation recorded, so the
// islands can replay it step by step. Rank, inverse and null space follow.
import { ONE, ZERO, add, div, eq, isZero, mul, neg, type Frac } from "./fraction";
import { cols, identity, isSquare, rows, type Matrix } from "./matrix";

export type RowOp =
  | { kind: "swap"; i: number; j: number } // R_i ↔ R_j
  | { kind: "scale"; i: number; k: Frac } // R_i ← k·R_i
  | { kind: "add"; i: number; j: number; k: Frac }; // R_i ← R_i + k·R_j

export interface Step {
  op: RowOp;
  // Matrix after applying the operation.
  matrix: Matrix;
}

export interface Elimination {
  steps: Step[];
  result: Matrix;
  // [row, column] of every pivot, top to bottom.
  pivots: [number, number][];
}

export function applyOp(A: Matrix, op: RowOp): Matrix {
  const B = A.map((row) => [...row]);
  if (op.kind === "swap") [B[op.i], B[op.j]] = [B[op.j]!, B[op.i]!];
  else if (op.kind === "scale") B[op.i] = B[op.i]!.map((x) => mul(op.k, x));
  else B[op.i] = B[op.i]!.map((x, c) => add(x, mul(op.k, A[op.j]![c]!)));
  return B;
}

// Echelon form (Gauss) or reduced echelon form (Gauss-Jordan). Pivots are
// only searched in the first `pivotCols` columns, so [A | I] or [A | b] keep
// their right part as passengers.
export function eliminate(A: Matrix, opts: { reduced?: boolean; pivotCols?: number } = {}): Elimination {
  const { reduced = false, pivotCols = cols(A) } = opts;
  let M = A;
  const steps: Step[] = [];
  const pivots: [number, number][] = [];
  const run = (op: RowOp) => {
    M = applyOp(M, op);
    steps.push({ op, matrix: M });
  };

  let r = 0;
  for (let c = 0; c < pivotCols && r < rows(M); c++) {
    const p = M.findIndex((row, i) => i >= r && !isZero(row[c]!));
    if (p < 0) continue;
    if (p !== r) run({ kind: "swap", i: r, j: p });
    if (reduced && !eq(M[r]![c]!, ONE)) run({ kind: "scale", i: r, k: div(ONE, M[r]![c]!) });
    for (let i = reduced ? 0 : r + 1; i < rows(M); i++) {
      if (i === r || isZero(M[i]![c]!)) continue;
      run({ kind: "add", i, j: r, k: neg(div(M[i]![c]!, M[r]![c]!)) });
    }
    pivots.push([r, c]);
    r++;
  }
  return { steps, result: M, pivots };
}

export const rank = (A: Matrix) => eliminate(A).pivots.length;

// [A | Iₙ] ~ [Iₙ | A⁻¹]. Null when A is not square or not invertible.
export function inverseElimination(A: Matrix): (Elimination & { inverse: Matrix | null }) | null {
  if (!isSquare(A)) return null;
  const n = rows(A);
  const I = identity(n);
  const run = eliminate(A.map((row, i) => [...row, ...I[i]!]), { reduced: true, pivotCols: n });
  const inverse = run.pivots.length === n ? run.result.map((row) => row.slice(n)) : null;
  return { ...run, inverse };
}

export const inverse = (A: Matrix) => inverseElimination(A)?.inverse ?? null;

// Basis of Nul(A) = { x : Ax = 0 }: one vector per free unknown, read from
// the reduced echelon form.
export function nullBasis(A: Matrix): Frac[][] {
  const { result, pivots } = eliminate(A, { reduced: true });
  const pivotCols = new Set(pivots.map(([, c]) => c));
  const basis: Frac[][] = [];
  for (let free = 0; free < cols(A); free++) {
    if (pivotCols.has(free)) continue;
    const x = Array.from({ length: cols(A) }, (_, j) => (j === free ? ONE : ZERO));
    for (const [r, c] of pivots) x[c] = neg(result[r]![free]!);
    basis.push(x);
  }
  return basis;
}
