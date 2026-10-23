// The replayable run behind RankLab: every matrix of the elimination, the
// operation that led to it, and what the end of the run means.
import { cols, det, equals, identity, product, rows, type Matrix } from "../../../../lib/matrix";
import { eliminate, inverseElimination, type RowOp } from "../../../../lib/gauss";
import type { Frac } from "../../../../lib/fraction";

export type Mode = "echelon" | "inverse";

export interface Run {
  mode: Mode;
  // matrices[0] is the starting one; matrices[k] comes from ops[k - 1].
  matrices: Matrix[];
  ops: RowOp[];
  // [row, column] of the pivots found at the end.
  pivots: [number, number][];
  rank: number;
  // Column where the bar of [A | I] goes.
  divider: number | undefined;
  // Inverse mode only: A is not square, so there is nothing to eliminate.
  notSquare: boolean;
  inverse: Matrix | null;
  // A · A⁻¹ = I, computed (not assumed).
  inverseChecks: boolean;
  det: Frac | null;
}

export function buildRun(A: Matrix, mode: Mode, reduced: boolean): Run {
  const base = { mode, det: det(A), notSquare: false, inverse: null, inverseChecks: false, divider: undefined };
  if (mode === "echelon") {
    const run = eliminate(A, { reduced });
    return {
      ...base,
      matrices: [A, ...run.steps.map((s) => s.matrix)],
      ops: run.steps.map((s) => s.op),
      pivots: run.pivots,
      rank: run.pivots.length,
    };
  }
  const run = inverseElimination(A);
  if (!run) {
    const echelon = eliminate(A);
    return { ...base, matrices: [A], ops: [], pivots: [], rank: echelon.pivots.length, notSquare: true };
  }
  const n = rows(A);
  const augmented = A.map((row, i) => [...row, ...identity(n)[i]!]);
  const check = run.inverse ? product(A, run.inverse) : null;
  return {
    ...base,
    matrices: [augmented, ...run.steps.map((s) => s.matrix)],
    ops: run.steps.map((s) => s.op),
    pivots: run.pivots,
    rank: run.pivots.length,
    divider: n,
    inverse: run.inverse,
    inverseChecks: check !== null && equals(check, identity(n)),
  };
}

// Largest rank a matrix of this size can have.
export const maxRank = (A: Matrix) => Math.min(rows(A), cols(A));
