import { cx, type Complex } from "../../../lib/complex";
import type { Op } from "../../../lib/complex-panel";

export interface Example {
  // HTML label of the button.
  label: string;
  z: Complex;
  w?: Complex;
  op: Op;
  n?: number;
}

// Worked examples of the notes; the guide loads them by index.
export const EXAMPLES: Example[] = [
  { label: "1 + <i>i</i>", z: cx(1, 1), op: "none" },
  { label: "(2 − <i>i</i>) + (1 + 2<i>i</i>)", z: cx(2, -1), w: cx(1, 2), op: "sum" },
  { label: "(1 + <i>i</i>)(1 − <i>i</i>)", z: cx(1, 1), w: cx(1, -1), op: "prod" },
  { label: "(2 + 3<i>i</i>)/(1 + 2<i>i</i>)", z: cx(2, 3), w: cx(1, 2), op: "quot" },
  { label: "(1 + <i>i</i>)⁴", z: cx(1, 1), op: "pow", n: 4 },
  { label: "<i>i</i>²", z: cx(0, 1), op: "pow", n: 2 },
  { label: "∛1", z: cx(1, 0), op: "root", n: 3 },
  { label: "<i>z</i>³ = 8", z: cx(8, 0), op: "root", n: 3 },
  { label: "<i>e</i><sup><i>iπ</i></sup> = −1", z: cx(-1, 0), op: "none" },
];

export function loadExample(state: { z: Complex; w: Complex; op: Op; n: number }, index: number) {
  const ex = EXAMPLES[index];
  if (!ex) return;
  state.z = ex.z;
  if (ex.w) state.w = ex.w;
  state.op = ex.op;
  if (ex.n) state.n = ex.n;
}
