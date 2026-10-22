// Exact and approximate writing of complex numbers in every form
// (binomial, polar, trigonometric, exponential). HTML output uses
// <i>, <sub> and <sup> only; inputs are numbers, never user text.
import { abs, arg, type Complex } from "./complex";
import { evaluate, type Parsed } from "./expr";
import { fmtDeg, fmtMax, gcd, minus } from "./format";
import { exact, isInt } from "./trig";

export type AngleUnit = "deg" | "rad";
export interface Text {
  s: string;
  // Whether s is exact (fraction, root, multiple of π) or rounded.
  ex: boolean;
}

// Smallest fraction p/q (q ≤ maxDen) equal to x, if any.
export function ratio(x: number, maxDen = 64): [number, number] | null {
  if (!Number.isFinite(x)) return null;
  for (let q = 1; q <= maxDen; q++) {
    const p = Math.round(x * q);
    if (Math.abs(p / q - x) < 1e-9 * Math.max(1, Math.abs(x))) return [p, q];
  }
  return null;
}

// A real number: decimals up to 3 digits, else a fraction, else rounded.
export function nq(x: number, locale: string): Text {
  if (Math.abs(x) < 1e-10) return { s: "0", ex: true };
  if (Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-7) return { s: fmtMax(x, locale), ex: true };
  const r = ratio(x);
  if (r) return { s: minus(`${r[0]}/${r[1]}`), ex: true };
  return { s: fmtMax(x, locale), ex: false };
}

// √n simplified (√12 -> 2√3, √(3/4) -> √3/2), or null when n is not rational.
export function sqrtEx(n: number, locale: string): string | null {
  const r = ratio(n, 64);
  if (!r) return null;
  const [p, q] = r;
  if (p < 0 || p * q > 1e7) return null;
  let out = 1;
  let rest = p * q;
  for (let f = 2; f * f <= rest; f++) while (rest % (f * f) === 0) (rest /= f * f), (out *= f);
  const g = gcd(out, q);
  const [co, de] = [out / g, q / g];
  if (rest === 1) return nq(co / de, locale).s;
  return `${co === 1 ? "" : co}√${rest}${de > 1 ? `/${de}` : ""}`;
}

// Multiplies an exact value like "√3/2" by the fraction p/q.
export function scaleEx(str: string, [p, q]: [number, number]): string | null {
  if (p === q) return str;
  const negative = str.startsWith("−");
  const m = (negative ? str.slice(1) : str).match(/^(\d+)?(?:√(\d+))?(?:\/(\d+))?$/);
  if (!m || (!m[1] && !m[2])) return null;
  let num = (m[1] ? Number(m[1]) : 1) * p;
  let den = (m[3] ? Number(m[3]) : 1) * q;
  if (num === 0) return "0";
  const g = gcd(num, den);
  num /= g;
  den /= g;
  let out = m[2] ? `${num === 1 ? "" : num}√${m[2]}` : String(num);
  if (den > 1) out += `/${den}`;
  return (negative ? "−" : "") + out;
}

// r·π as text ("3π/4"), or null when r is not a simple fraction.
export function piQ(r: number): string | null {
  const f = ratio(r, 360);
  if (!f) return null;
  const [p, q] = f;
  if (p === 0) return "0";
  return `${p < 0 ? "−" : ""}${Math.abs(p) === 1 ? "" : Math.abs(p)}π${q > 1 ? `/${q}` : ""}`;
}

export const pp = (s: string) => (s.startsWith("−") ? `(${s})` : s);
export const ppc = (s: string) => (s.startsWith("−") || /[+−]/.test(s.slice(1)) ? `(${s})` : s);

// Real and imaginary parts, exact when possible (also via notable angles).
export function partsOf(z: Complex, locale: string): { a: string; b: string; ex: boolean } {
  const A = nq(z.re, locale);
  const B = nq(z.im, locale);
  if (A.ex && B.ex) return { a: A.s, b: B.s, ex: true };
  const rq = ratio(abs(z), 64);
  const d = (arg(z) * 180) / Math.PI;
  if (rq && isInt(d) && Math.round(d) % 15 === 0) {
    const E = exact(((Math.round(d) % 360) + 360) % 360)!;
    const a = scaleEx(E.cos ?? "0", rq);
    const b = scaleEx(E.sin ?? "0", rq);
    if (a && b) return { a, b, ex: true };
  }
  return { a: A.s, b: B.s, ex: false };
}

export function joinBin(a: string, b: string, html = true): string {
  const I = html ? "<i>i</i>" : "i";
  if (b === "0") return a;
  const negative = b.startsWith("−");
  const bb = negative ? b.slice(1) : b;
  const bi = bb === "1" ? I : bb.includes("/") ? `(${bb})${I}` : bb.includes("√") ? `${bb}\u2009${I}` : `${bb}${I}`;
  if (a === "0") return (negative ? "−" : "") + bi;
  return `${a} ${negative ? "−" : "+"} ${bi}`;
}

export function binOf(z: Complex, locale: string, html = true): Text {
  const p = partsOf(z, locale);
  return { s: joinBin(p.a, p.b, html), ex: p.ex };
}

// Binomial form, prefixed with ≈ when rounded.
export const binH = (z: Complex, locale: string, html = true) => {
  const b = binOf(z, locale, html);
  return (b.ex ? "" : "≈ ") + b.s;
};

export function modOf(z: Complex, locale: string): Text {
  const sq = z.re ** 2 + z.im ** 2;
  const e = sqrtEx(Math.abs(sq) < 1e-10 ? 0 : sq, locale);
  return e ? { s: e, ex: true } : { s: fmtMax(Math.sqrt(sq), locale), ex: false };
}

export function angOf(theta: number, unit: AngleUnit, locale: string): Text {
  if (unit === "deg") {
    const d = (theta * 180) / Math.PI;
    return { s: `${fmtDeg(d, locale)}°`, ex: Math.abs(d * 10 - Math.round(d * 10)) < 1e-6 };
  }
  const p = piQ(theta / Math.PI);
  return p ? { s: p, ex: true } : { s: fmtMax(theta, locale), ex: false };
}

const radS = (theta: number, locale: string) => piQ(theta / Math.PI) ?? fmtMax(theta, locale);

// n-th root sign with the index as a small superscript.
export const supI = (n: number | string, x: string) => `<sup class="ri">${n}</sup>√${x}`;

export function polH(z: Complex, unit: AngleUnit, locale: string): string {
  return `${modOf(z, locale).s}<sub>${angOf(arg(z), unit, locale).s}</sub>`;
}

function expS(theta: number, locale: string): string {
  const s = radS(theta, locale);
  if (s === "0") return "<i>i</i>·0";
  if (s.includes("π")) return s.startsWith("−") ? `−<i>i</i>${s.slice(1)}` : `<i>i</i>${s}`;
  return `${s}<i>i</i>`;
}

export function expH(z: Complex, locale: string): string {
  const r = modOf(z, locale).s;
  return `${r === "1" ? "" : r}<i>e</i><sup>${expS(arg(z), locale)}</sup>`;
}

export function trigH(z: Complex, unit: AngleUnit, locale: string, n: { sin: string; cos: string }): string {
  const r = modOf(z, locale).s;
  const a = pp(angOf(arg(z), unit, locale).s);
  return `${r === "1" ? "" : r}(${n.cos} ${a} + <i>i</i> ${n.sin} ${a})`;
}

// Number typed by the user: decimals, fractions, roots and π.
export function parseNum(input: string): Parsed | null {
  const text = input
    .trim()
    .toLowerCase()
    .replace(/,/g, ".")
    .replace(/−/g, "-")
    .replace(/[°º]/g, "")
    .replace(/sqrt/g, "√")
    .replace(/pi/g, "π");
  return text ? evaluate(text) : null;
}

// Exact value as an input field value ("−√3/2" -> "-√3/2").
export const inputText = (s: string) => s.replace(/−/g, "-").replace(/[\s\u2009]/g, "");

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const SUB = "₀₁₂₃₄₅₆₇₈₉";
export const sup = (n: number) => [...String(n)].map((d) => SUP[Number(d)]).join("");
export const sub = (n: number) => [...String(n)].map((d) => SUB[Number(d)]).join("");
