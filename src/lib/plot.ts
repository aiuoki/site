// Geometry of the 700×700 interactive canvas: unit 1 = S pixels, origin at (C, C).
import { rad } from "./trig";

export const S = 140;
export const C = 350;
export const SIZE = 700;
// Labels are hidden beyond this distance from the origin (in units).
export const LIM = 2.5;

export const u = (x: number) => C + x * S;
export const v = (y: number) => C - y * S;

export const polar = (deg: number, r = 1): [number, number] => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];

// Angle of a canvas point, or null when it is on the centre.
export function pointToDeg(px: number, py: number): number | null {
  const x = (px - C) / S;
  const y = (C - py) / S;
  if (Math.hypot(x, y) < 0.02) return null;
  const d = (Math.atan2(y, x) * 180) / Math.PI;
  return d < 0 ? d + 360 : d;
}

// Arc of radius r (units) from a0 to a1 degrees; wedge closes it at the origin.
export function arcPath(r: number, a0: number, a1: number, wedge = false): string {
  const d = a1 - a0;
  if (Math.abs(d) < 1e-9) return "";
  const R = r * S;
  const p = (a: number) => [u(r * Math.cos(rad(a))), v(r * Math.sin(rad(a)))] as const;
  const [x0, y0] = p(a0);
  if (Math.abs(d) >= 359.999) {
    const [xm, ym] = p(a0 + 180);
    return `M${x0} ${y0} A${R} ${R} 0 1 0 ${xm} ${ym} A${R} ${R} 0 1 0 ${x0} ${y0}`;
  }
  const [x1, y1] = p(a1);
  const arc = `A${R} ${R} 0 ${Math.abs(d) > 180 ? 1 : 0} ${d > 0 ? 0 : 1} ${x1} ${y1}`;
  return wedge ? `M${C} ${C} L${x0} ${y0} ${arc} Z` : `M${x0} ${y0} ${arc}`;
}

export const clampValue = (x: number) => Math.max(-60, Math.min(60, x));
