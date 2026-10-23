// What ProductLab computes: the operation chosen, the matrices involved and
// the step-by-step reading of one entry. Pure functions, no DOM.
import { eq, fracText, isNegative, type Frac } from "../../../../lib/fraction";
import { cols, product, rows, scale, sum, trace, type Matrix } from "../../../../lib/matrix";
import { entryName } from "../types/entry";

export type Mode = "sum" | "scale" | "AB" | "BA" | "trace";
export type Vars = Record<string, string | number>;

export interface Operand {
  name: "A" | "B";
  matrix: Matrix;
  // Theme token of the matrix.
  color: "--a" | "--b";
}

export type Outcome =
  | { ok: true; mode: "sum" | "scale" | "AB" | "BA"; left: Operand; right: Operand | null; result: Matrix; k: Frac | null }
  | { ok: false; why: string; vars: Vars };

export const sizeText = (M: Matrix) => `${rows(M)} × ${cols(M)}`;
// Negative numbers go in brackets when they are multiplied or added.
export const bracket = (x: Frac) => (isNegative(x) ? `(${fracText(x)})` : fracText(x));

export function compute(mode: Exclude<Mode, "trace">, A: Matrix, B: Matrix, k: Frac | null): Outcome {
  const a: Operand = { name: "A", matrix: A, color: "--a" };
  const b: Operand = { name: "B", matrix: B, color: "--b" };
  if (mode === "scale") {
    return k ? { ok: true, mode, left: a, right: null, result: scale(k, A), k } : { ok: false, why: "whyBadScalar", vars: {} };
  }
  if (mode === "sum") {
    const result = sum(A, B);
    return result ? { ok: true, mode, left: a, right: b, result, k: null } : { ok: false, why: "whySumSize", vars: { a: sizeText(A), b: sizeText(B) } };
  }
  const [left, right] = mode === "AB" ? [a, b] : [b, a];
  const result = product(left.matrix, right.matrix);
  if (!result) {
    return {
      ok: false,
      why: "whyProductSize",
      vars: { left: left.name, right: right.name, c: cols(left.matrix), r: rows(right.matrix), ls: sizeText(left.matrix), rs: sizeText(right.matrix) },
    };
  }
  return { ok: true, mode, left, right, result, k: null };
}

export interface CellReading {
  // c₁₂ = a₁₁·b₁₂ + a₁₂·b₂₂
  symbolic: string;
  // = 1·0 + 2·1
  numeric: string;
  value: string;
}

// How the entry (i, j) of the result is obtained.
export function readCell(out: Extract<Outcome, { ok: true }>, i: number, j: number): CellReading {
  const c = entryName("c", i, j);
  const value = fracText(out.result[i]![j]!);
  const L = out.left;
  if (out.mode === "scale") {
    const x = L.matrix[i]![j]!;
    return { symbolic: `${c} = λ·${entryName("a", i, j)}`, numeric: `= ${bracket(out.k!)}·${bracket(x)}`, value };
  }
  if (out.mode === "sum") {
    const x = L.matrix[i]![j]!;
    const y = out.right!.matrix[i]![j]!;
    return { symbolic: `${c} = ${entryName("a", i, j)} + ${entryName("b", i, j)}`, numeric: `= ${bracket(x)} + ${bracket(y)}`, value };
  }
  const R = out.right!;
  const l = L.name.toLowerCase();
  const r = R.name.toLowerCase();
  const ks = Array.from({ length: cols(L.matrix) }, (_, t) => t);
  return {
    symbolic: `${c} = ${ks.map((t) => `${entryName(l, i, t)}·${entryName(r, t, j)}`).join(" + ")}`,
    numeric: `= ${ks.map((t) => `${bracket(L.matrix[i]![t]!)}·${bracket(R.matrix[t]![j]!)}`).join(" + ")}`,
    value,
  };
}

export type OrderKind = "onlyAB" | "onlyBA" | "neither" | "sizes" | "equal" | "differ";

// AB against BA: which exist and whether they are the same matrix.
export function compareOrder(A: Matrix, B: Matrix): { kind: OrderKind; vars: Vars } {
  const ab = product(A, B);
  const ba = product(B, A);
  const vars: Vars = { ar: rows(A), ac: cols(A), br: rows(B), bc: cols(B) };
  if (!ab && !ba) return { kind: "neither", vars };
  if (!ba) return { kind: "onlyAB", vars };
  if (!ab) return { kind: "onlyBA", vars };
  if (rows(ab) !== rows(ba) || cols(ab) !== cols(ba)) return { kind: "sizes", vars: { ab: sizeText(ab), ba: sizeText(ba) } };
  for (let i = 0; i < rows(ab); i++) {
    for (let j = 0; j < cols(ab); j++) {
      if (!eq(ab[i]![j]!, ba[i]![j]!)) {
        return { kind: "differ", vars: { c: entryName("c", i, j), x: fracText(ab[i]![j]!), y: fracText(ba[i]![j]!) } };
      }
    }
  }
  return { kind: "equal", vars: {} };
}

export interface TraceReading {
  symbolic: string;
  numeric: string;
  value: string;
}

// tr(M) = m₁₁ + m₂₂ + ...; null when M is not square.
export function readTrace(M: Matrix, name: string): TraceReading | null {
  const t = trace(M);
  if (!t) return null;
  const ids = M.map((_, i) => i);
  return {
    symbolic: `tr(${name}) = ${ids.map((i) => entryName(name.toLowerCase(), i, i)).join(" + ")}`,
    numeric: `= ${ids.map((i) => bracket(M[i]![i]!)).join(" + ")}`,
    value: fracText(t),
  };
}

// tr(AB) and tr(BA) when both products exist (they are always square then).
export function traceOfProducts(A: Matrix, B: Matrix): { ab: string; ba: string; same: boolean } | null {
  const ab = product(A, B);
  const ba = product(B, A);
  if (!ab || !ba) return null;
  const x = trace(ab)!;
  const y = trace(ba)!;
  return { ab: fracText(x), ba: fracText(y), same: eq(x, y) };
}
