// Oblique projection used by the 3D-looking figures: x1 comes out of the
// page towards the lower left, x2 goes right and x3 goes up.
import { round } from "../../../../lib/figure";

export interface Projector {
  s: number;
  pt: (x: number, y: number, z: number) => [number, number];
}

export function projector(o: { s: number; ox: number; oy: number }): Projector {
  return {
    s: o.s,
    pt: (x, y, z) => [round(o.ox + o.s * (y - 0.5 * x)), round(o.oy + o.s * (0.35 * x - z))],
  };
}

// Points of the line p + t·v for t between t0 and t1, as an SVG path.
export function linePath(p: Projector, from: [number, number, number], v: [number, number, number], t0: number, t1: number): string {
  const at = (t: number) => p.pt(from[0] + t * v[0], from[1] + t * v[1], from[2] + t * v[2]);
  const [a, b] = [at(t0), at(t1)];
  return `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
}
