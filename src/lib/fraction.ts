// Exact rational numbers, so matrix work (Gauss, inverses) shows 1/3 and
// not 0.3333. Always reduced, with a positive denominator. BigInt keeps them
// exact: cross products of Gauss-Jordan or (AAᵗ)⁻¹ pass 2^53 quickly.
export interface Frac {
  n: bigint;
  d: bigint;
}

const abs = (x: bigint) => (x < 0n ? -x : x);

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export function frac(n: number | bigint, d: number | bigint = 1): Frac {
  const [top, bottom] = [BigInt(n), BigInt(d)];
  if (bottom === 0n) throw new Error("Zero denominator");
  if (top === 0n) return { n: 0n, d: 1n };
  const g = gcd(abs(top), abs(bottom));
  const sign = bottom < 0n ? -1n : 1n;
  return { n: (sign * top) / g, d: abs(bottom) / g };
}

export const ZERO = frac(0);
export const ONE = frac(1);

export const add = (a: Frac, b: Frac) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Frac, b: Frac) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Frac, b: Frac) => frac(a.n * b.n, a.d * b.d);
export const neg = (a: Frac) => frac(-a.n, a.d);
export const absFrac = (a: Frac): Frac => ({ n: abs(a.n), d: a.d });
export const isZero = (a: Frac) => a.n === 0n;
export const isNegative = (a: Frac) => a.n < 0n;
export const isInteger = (a: Frac) => a.d === 1n;
export const eq = (a: Frac, b: Frac) => a.n === b.n && a.d === b.d;
export const toNumber = (a: Frac) => Number(a.n) / Number(a.d);

export function div(a: Frac, b: Frac): Frac {
  if (b.n === 0n) throw new Error("Division by zero");
  return frac(a.n * b.d, a.d * b.n);
}

// "3", "−2/3": typographic minus, as in the rest of the site.
export function fracText(a: Frac): string {
  const body = a.d === 1n ? String(abs(a.n)) : `${abs(a.n)}/${a.d}`;
  return a.n < 0n ? `−${body}` : body;
}

// Largest numerator or denominator accepted in a matrix cell.
const MAX_INPUT = 1_000_000n;

// Text typed in a matrix cell: integers, decimals ("0,5" or "0.5") and
// fractions ("-2/3"). Anything else is rejected.
export function parseFrac(input: string): Frac | null {
  const text = input.trim().replace(/−/g, "-").replace(/,/g, ".");
  const m = text.match(/^(-?)(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/);
  if (!m) return null;
  const decimal = (s: string) => {
    const [int, dec = ""] = s.split(".");
    return frac(BigInt(int + dec), 10n ** BigInt(dec.length));
  };
  const top = decimal(m[2]!);
  const bottom = m[3] ? decimal(m[3]) : ONE;
  if (isZero(bottom)) return null;
  const value = div(top, bottom);
  if (abs(value.n) > MAX_INPUT || value.d > MAX_INPUT) return null;
  return m[1] ? neg(value) : value;
}
