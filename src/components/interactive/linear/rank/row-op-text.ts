// Row operations written the way the notes do: F₂ ← F₂ − 3·F₁, F₁ ↔ F₂.
import { ONE, absFrac, eq, fracText, isInteger, isNegative, type Frac } from "../../../../lib/fraction";
import type { RowOp } from "../../../../lib/gauss";

const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";

// 12 -> "₁₂"
export const subscript = (n: number): string => [...String(n)].map((digit) => SUBSCRIPTS[Number(digit)] ?? digit).join("");

// "F₂" for the row index 1 (0-based) and the letter of the language.
export const rowName = (letter: string, index: number): string => `${letter}${subscript(index + 1)}`;

// A coefficient before "·": whole positive numbers are bare, anything else in parentheses.
const factor = (k: Frac): string => (isInteger(k) && !isNegative(k) ? fracText(k) : `(${fracText(k)})`);

export function rowOpText(op: RowOp, letter: string): string {
  const row = (index: number) => rowName(letter, index);
  if (op.kind === "swap") return `${row(op.i)} ↔ ${row(op.j)}`;
  if (op.kind === "scale") return `${row(op.i)} ← ${factor(op.k)}·${row(op.i)}`;
  const sign = isNegative(op.k) ? "−" : "+";
  const size = absFrac(op.k);
  const multiple = eq(size, ONE) ? row(op.j) : `${factor(size)}·${row(op.j)}`;
  return `${row(op.i)} ← ${row(op.i)} ${sign} ${multiple}`;
}
