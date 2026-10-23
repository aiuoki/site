// What a 2×2 matrix does to the plane: the unit square goes to the
// parallelogram spanned by the columns of A. Signed area = det(A).
import { toNumber, type Frac } from "../../../../lib/fraction";
import { det, type Matrix } from "../../../../lib/matrix";
import { rank } from "../../../../lib/gauss";

export type Point = [number, number];

export interface Plane {
  // Vertices in counterclockwise order, starting at the origin.
  unit: Point[];
  image: Point[];
  // Images of e₁ and e₂: the columns of A.
  e1: Point;
  e2: Point;
  det: Frac;
  // full: a parallelogram; segment: rank 1; point: rank 0.
  kind: "full" | "segment" | "point";
  // The view is [−extent, extent] on both axes.
  extent: number;
  // Distance between grid lines.
  step: number;
}

export function planeOf(A: Matrix): Plane | null {
  if (A.length !== 2 || A[0]?.length !== 2) return null;
  const [[a, b], [c, d]] = A.map((row) => row.map(toNumber)) as [[number, number], [number, number]];
  const e1: Point = [a, c];
  const e2: Point = [b, d];
  const image: Point[] = [[0, 0], e1, [a + b, c + d], e2];
  const unit: Point[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const biggest = Math.max(1, ...image.flat().map(Math.abs));
  const extent = Math.max(2, Math.ceil(biggest + 0.5));
  const r = rank(A);
  return {
    unit,
    image,
    e1,
    e2,
    det: det(A)!,
    kind: r === 2 ? "full" : r === 1 ? "segment" : "point",
    extent,
    step: Math.max(1, Math.ceil(extent / 6)),
  };
}

// Grid line positions inside the view, multiples of the step.
export function gridLines({ extent, step }: Pick<Plane, "extent" | "step">): number[] {
  const out: number[] = [];
  for (let x = step; x <= extent; x += step) out.push(-x, x);
  return out.sort((p, q) => p - q);
}

// SVG y points down; the maths y points up.
export const svgPoints = (points: Point[]): string => points.map(([x, y]) => `${x},${y === 0 ? 0 : -y}`).join(" ");
