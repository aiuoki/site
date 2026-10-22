import { evaluate, type Parsed } from "./expr";
import { fmtDeg, neg, piFrac } from "./format";

export const RATIOS = ["sin", "cos", "tan", "cot", "sec", "csc"] as const;
export type Ratio = (typeof RATIOS)[number];
export type AngleUnit = "deg" | "rad";
export type RatioValues = Record<Ratio, number | null> & { c: number; s: number };
export type ExactValues = Record<Ratio, string | null>;

const EPS = 1e-9;

export const rad = (d: number) => (d * Math.PI) / 180;
export const isInt = (d: number) => Math.abs(d - Math.round(d)) < 1e-6;

export function norm(d: number): number {
  const w = ((d % 360) + 360) % 360;
  return Math.abs(w - 360) < EPS ? 0 : w;
}

// Like norm, but keeps exactly 360 so a typed full turn is not reset to 0.
export const wrapDeg = (d: number) => (Math.abs(d - 360) < EPS ? 360 : norm(d));
export const signedDeg = (d: number) => (d > 180 ? d - 360 : d);

export function compute(d: number): RatioValues {
  let c = Math.cos(rad(d));
  let s = Math.sin(rad(d));
  if (Math.abs(c) < 1e-12) c = 0;
  if (Math.abs(s) < 1e-12) s = 0;
  return {
    c,
    s,
    sin: s,
    cos: c,
    tan: c === 0 ? null : s / c,
    cot: s === 0 ? null : c / s,
    sec: c === 0 ? null : 1 / c,
    csc: s === 0 ? null : 1 / s,
  };
}

// First-quadrant exact values for every multiple of 15°.
const EXACT_BASE: Record<number, ExactValues> = {
  0: { sin: "0", cos: "1", tan: "0", cot: null, sec: "1", csc: null },
  15: { sin: "(√6−√2)/4", cos: "(√6+√2)/4", tan: "2−√3", cot: "2+√3", sec: "√6−√2", csc: "√6+√2" },
  30: { sin: "1/2", cos: "√3/2", tan: "√3/3", cot: "√3", sec: "2√3/3", csc: "2" },
  45: { sin: "√2/2", cos: "√2/2", tan: "1", cot: "1", sec: "√2", csc: "√2" },
  60: { sin: "√3/2", cos: "1/2", tan: "√3", cot: "√3/3", sec: "2", csc: "2√3/3" },
  75: { sin: "(√6+√2)/4", cos: "(√6−√2)/4", tan: "2+√3", cot: "2−√3", sec: "√6+√2", csc: "√6−√2" },
  90: { sin: "1", cos: "0", tan: null, cot: "0", sec: null, csc: "1" },
};

export function exact(d: number): ExactValues | null {
  if (!isInt(d)) return null;
  const n = ((Math.round(d) % 360) + 360) % 360;
  if (n % 15) return null;
  const [ref, sx, sy] =
    n <= 90 ? [n, 1, 1] : n <= 180 ? [180 - n, -1, 1] : n <= 270 ? [n - 180, -1, -1] : [360 - n, 1, -1];
  const base = EXACT_BASE[ref]!;
  const sign: Record<Ratio, number> = { sin: sy, cos: sx, tan: sx * sy, cot: sx * sy, sec: sx, csc: sy };
  const out = {} as ExactValues;
  for (const k of RATIOS) {
    const v = base[k];
    out[k] = v === null ? null : v !== "0" && sign[k] < 0 ? neg(v) : v;
  }
  return out;
}

export function quadrant(d: number): 0 | 1 | 2 | 3 | 4 {
  const n = norm(d);
  if ([0, 90, 180, 270].some((a) => Math.abs(n - a) < EPS)) return 0;
  return n < 90 ? 1 : n < 180 ? 2 : n < 270 ? 3 : 4;
}

export function refAngle(d: number): number {
  const n = norm(d);
  return n <= 90 ? n : n <= 180 ? 180 - n : n <= 270 ? n - 180 : 360 - n;
}

// With the magnet on, whole degrees that snap to multiples of 15° within 3°.
export function snap(d: number, magnet: boolean): number {
  let out: number;
  if (magnet) {
    out = Math.round(d);
    const near = Math.round(out / 15) * 15;
    if (Math.abs(out - near) <= 3) out = near;
  } else {
    out = Math.round(d * 10) / 10;
  }
  return out >= 360 ? 0 : out;
}

export function angDist(a: number, b: number): number {
  const x = Math.abs(norm(a) - norm(b));
  return Math.min(x, 360 - x);
}

export type ParsedAngle = Parsed;

// Angle typed by the user: degrees, or radians when it uses π.
export function parseAngle(input: string): ParsedAngle | null {
  const text = input
    .trim()
    .toLowerCase()
    .replace(/,/g, ".")
    .replace(/−/g, "-")
    .replace(/°|º|deg|rad|рад/g, "")
    .replace(/pi/g, "π");
  return evaluate(text);
}

export function toDegrees(p: ParsedAngle, unit: AngleUnit): number {
  return wrapDeg(unit === "rad" || p.hasPi ? (p.val * 180) / Math.PI : p.val);
}

// Text for the angle input: plain "-" so the user can edit it easily.
export function angleText(d: number, unit: AngleUnit, locale: string): string {
  if (unit === "deg") return fmtDeg(d, locale).replace("−", "-");
  const sd = signedDeg(d);
  return isInt(sd) ? piFrac(Math.round(sd)) : rad(sd).toFixed(4);
}
