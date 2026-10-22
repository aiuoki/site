// Geometry of the 700×700 complex plane: unit 1 = S pixels, origin at (C, C),
// drawable values within ±R.
import { abs, type Complex } from "./complex";
import { rad } from "./trig";

export const S = 60;
export const C = 350;
export const R = 5.5;

export const X = (x: number) => C + x * S;
export const Y = (y: number) => C - y * S;

// Straight shaft plus a triangular head ending at (x2, y2), in pixels.
// Null when the arrow is too short to draw.
export function arrow(x1: number, y1: number, x2: number, y2: number, head = 17) {
  const [a, b, c, d] = [X(x1), Y(y1), X(x2), Y(y2)];
  const len = Math.hypot(c - a, d - b);
  if (len < 4) return null;
  const ux = (c - a) / len;
  const uy = (d - b) / len;
  const hl = Math.min(head, len * 0.45);
  const hw = hl * 0.5;
  const bx = c - ux * hl;
  const by = d - uy * hl;
  return {
    shaft: { x1: a, y1: b, x2: bx + ux * 2, y2: by + uy * 2 },
    head: `M${c} ${d} L${bx - uy * hw} ${by + ux * hw} L${bx + uy * hw} ${by - ux * hw} Z`,
  };
}

// Arc of radius rpx pixels between angles a0 and a1 (radians). Full turns
// are split in two so the path never collapses. Empty under 0.3 rad.
export function arc(rpx: number, a0: number, a1: number): string {
  if (Math.abs(a1 - a0) < 0.3) return "";
  const p = (a: number) => [C + rpx * Math.cos(a), C - rpx * Math.sin(a)] as const;
  const [x0, y0] = p(a0);
  const ends = Math.abs(a1 - a0) >= 2 * Math.PI - 1e-6 ? [a0 + (a1 - a0) / 2, a1] : [a1];
  let d = `M${x0} ${y0}`;
  let prev = a0;
  for (const e of ends) {
    const [x1, y1] = p(e);
    d += ` A${rpx} ${rpx} 0 ${Math.abs(e - prev) > Math.PI ? 1 : 0} ${e > prev ? 0 : 1} ${x1} ${y1}`;
    prev = e;
  }
  return d;
}

// Same arc closed through the origin, for a filled sector.
export const sector = (rpx: number, a0: number, a1: number) => {
  const d = arc(rpx, a0, a1);
  return d ? `M${C} ${C} L${d.slice(1, d.indexOf(" A"))} ${d.slice(d.indexOf("A"))} Z` : "";
};

// Where to put the label of a point: a little further from the origin.
export function labelPos(z: Complex, off = 0.42): [number, number] {
  const r = abs(z);
  return r < 1e-9 ? [off * 0.7, off * 0.7] : [z.re + (z.re / r) * off, z.im + (z.im / r) * off];
}

export const anchorFor = (z: Complex) => (Math.abs(z.re) < 0.15 ? "middle" : z.re > 0 ? "start" : "end");

// Clamps to the plane and, with the magnet, snaps to the half-unit grid or
// to notable points of the unit circle (multiples of 30° and 45°).
export function snapPoint(x: number, y: number, magnet: boolean): [number, number] {
  const cx = Math.max(-R, Math.min(R, x));
  const cy = Math.max(-R, Math.min(R, y));
  if (!magnet) return [Math.round(cx * 100) / 100, Math.round(cy * 100) / 100];
  let best: [number, number] | null = null;
  let bestDist = 0.2;
  const gx = Math.round(cx * 2) / 2;
  const gy = Math.round(cy * 2) / 2;
  if (Math.hypot(cx - gx, cy - gy) < bestDist) {
    best = [gx, gy];
    bestDist = Math.hypot(cx - gx, cy - gy);
  }
  for (let a = 0; a < 360; a += 15) {
    if (a % 45 && a % 30) continue;
    const [qx, qy] = [Math.cos(rad(a)), Math.sin(rad(a))];
    const d = Math.hypot(cx - qx, cy - qy);
    if (d < bestDist) {
      best = [qx, qy];
      bestDist = d;
    }
  }
  return best ?? [Math.round(cx * 20) / 20, Math.round(cy * 20) / 20];
}

// True when some point falls outside the drawable plane.
export const outside = (points: Complex[]) => points.some((p) => Math.abs(p.re) > R + 0.3 || Math.abs(p.im) > R + 0.3);
