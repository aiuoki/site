// X = Xp + t₁·v₁ + t₂·v₂ + …, with exact fractions.
import { ZERO, add, frac, mul, type Frac } from "../../../../lib/fraction";
import { flatten, column } from "../../../../lib/systems";
import { product, type Matrix } from "../../../../lib/matrix";
import { subscript } from "../rank/row-op-text";

export function combine(particular: Frac[], basis: Frac[][], t: Frac[]): Frac[] {
  return particular.map((x, i) => basis.reduce((acc, v, k) => add(acc, mul(t[k] ?? ZERO, v[i]!)), x));
}

// A·x for a vector x.
export const matVec = (A: Matrix, x: Frac[]): Frac[] => flatten(product(A, column(x))!);

// "t" when there is a single parameter, "t₁", "t₂"... otherwise.
export const paramName = (index: number, count: number): string => (count === 1 ? "t" : `t${subscript(index + 1)}`);

// The sliders move in halves: 7 -> 7/2.
export const halves = (steps: number): Frac => frac(steps, 2);
