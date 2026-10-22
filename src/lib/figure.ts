// Coordinate math shared by the SVG figures. The "unit plane" is the
// 300x230 canvas where the unit circle has radius 140 and its centre is (50, 190).

import { rad } from "./trig";

export const px = (x: number) => 50 + x * 140;
export const py = (y: number) => 190 - y * 140;

// Keeps the markup short; 0.001 px is invisible.
export const round = (v: number) => Math.round(v * 1000) / 1000;

export function polar(deg: number, r = 1): [number, number] {
  return [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
}

// Counter-clockwise arc of radius r (unit plane) from a0 to a1 degrees.
export function arcPath(r: number, a0: number, a1: number, filled = false): string {
  const [x0, y0] = polar(a0, r);
  const [x1, y1] = polar(a1, r);
  const start = filled ? `M${px(0)} ${py(0)} L` : "M";
  const radius = round(r * 140);
  const arc = `A${radius} ${radius} 0 0 0 ${round(px(x1))} ${round(py(y1))}`;
  return `${start}${round(px(x0))} ${round(py(y0))} ${arc}${filled ? " Z" : ""}`;
}

export const tint = (name: string, percent = 18) =>
  `color-mix(in srgb, var(--${name}) ${percent}%, transparent)`;

export function unitAngle(deg: number) {
  const [c, s] = polar(deg);
  return { c, s, tn: s / c, ct: c / s };
}

// Point at an angle and radius around a pixel centre (screen y grows downwards).
export function pointOn(cx: number, cy: number, deg: number, r: number): [number, number] {
  const [x, y] = polar(deg, r);
  return [cx + x, cy - y];
}
