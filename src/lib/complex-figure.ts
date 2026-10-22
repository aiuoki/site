// Geometry shared by the complex-number figures. Each figure picks its own
// scale and origin (a "plane"); coordinates passed around are plane units.

import { round } from "./figure";
import { fmtMax } from "./format";
import { rad } from "./trig";

export interface Plane {
  s: number;
  ox: number;
  oy: number;
  w: number;
  h: number;
  viewBox: string;
  px: (x: number) => number;
  py: (y: number) => number;
}

export function plane(o: { s?: number; ox?: number; oy?: number; w?: number; h?: number } = {}): Plane {
  const { s = 50, ox = 150, oy = 120, w = 300, h = 240 } = o;
  return {
    s,
    ox,
    oy,
    w,
    h,
    viewBox: `0 0 ${w} ${h}`,
    px: (x) => ox + x * s,
    py: (y) => oy - y * s,
  };
}

// Turns ^x, ^(...), _x and _(...) into real superscripts and subscripts.
// The input is always a constant label, so nothing is escaped.
const tspan = (shift: "super" | "sub") => `<tspan baseline-shift="${shift}" font-size="72%">$1</tspan>`;

export const svgT = (s: string): string =>
  s
    .replace(/\^\(((?:[^()]|\([^()]*\))*)\)/g, tspan("super"))
    .replace(/\^([^\s()<]+)/g, tspan("super"))
    .replace(/_\(((?:[^()]|\([^()]*\))*)\)/g, tspan("sub"))
    .replace(/_([^\s()<]+)/g, tspan("sub"));

export interface ArrowShape {
  // Shaft from the tail to just inside the head, and the head triangle.
  line: [number, number, number, number];
  head: string;
}

export function arrowShape(m: Plane, x1: number, y1: number, x2: number, y2: number): ArrowShape | null {
  const a = m.px(x1);
  const b = m.py(y1);
  const c = m.px(x2);
  const d = m.py(y2);
  const len = Math.hypot(c - a, d - b);
  if (len < 2) return null;
  const ux = (c - a) / len;
  const uy = (d - b) / len;
  const hl = Math.min(11, len * 0.45);
  const hw = hl * 0.5;
  const bx = c - ux * hl;
  const by = d - uy * hl;
  const [p1x, p1y, p2x, p2y] = [bx - uy * hw, by + ux * hw, bx + uy * hw, by - ux * hw].map(round);
  return {
    line: [round(a), round(b), round(bx + ux), round(by + uy)],
    head: `M${round(c)} ${round(d)} L${p1x} ${p1y} L${p2x} ${p2y} Z`,
  };
}

// Circular arc of radius r (plane units) from a0 to a1 degrees; filled closes it through the origin.
export function arcShape(m: Plane, r: number, a0: number, a1: number, filled = false): string | null {
  if (Math.abs(a1 - a0) < 0.5) return null;
  const R = r * m.s;
  const at = (deg: number) => `${round(m.ox + R * Math.cos(rad(deg)))} ${round(m.oy - R * Math.sin(rad(deg)))}`;
  const big = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 0 : 1;
  const arc = `A${round(R)} ${round(R)} 0 ${big} ${sweep} ${at(a1)}`;
  return filled ? `M${m.ox} ${m.oy} L${at(a0)} ${arc} Z` : `M${at(a0)} ${arc}`;
}

// Legacy fT: up to 3 decimals in the content language.
export const fmtAngle = (x: number, locale: string, digits = 3) => fmtMax(x, locale, digits);

export const points = (m: Plane, pts: [number, number][]) =>
  pts.map(([x, y]) => `${round(m.px(x))},${round(m.py(y))}`).join(" ");
