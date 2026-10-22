// Number formatting shared by every topic. Output uses the typographic
// minus sign (−) and the decimal separator of the given BCP 47 locale.

export const minus = (s: string) => s.replace(/-/g, "−");

export function fmt(x: number, locale: string, digits = 4): string {
  const value = Math.abs(x) < 5 * 10 ** -(digits + 1) ? 0 : x;
  const text = value.toLocaleString(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
  return minus(text);
}

export function fmtP(x: number, locale: string, digits = 4): string {
  const s = fmt(x, locale, digits);
  return s.startsWith("−") ? `(${s})` : s;
}

export function fmtDeg(d: number, locale: string): string {
  const r = Math.round(d * 10) / 10;
  const text = Number.isInteger(r)
    ? String(r)
    : r.toLocaleString(locale, { maximumFractionDigits: 1, useGrouping: false });
  return minus(text);
}

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

// Whole degrees as a reduced multiple of π: 60 -> "π/3", -90 -> "−π/2".
export function piFrac(degrees: number): string {
  if (degrees === 0) return "0";
  const g = gcd(Math.abs(degrees), 180);
  const num = degrees / g;
  const den = 180 / g;
  const head = num === 1 ? "π" : num === -1 ? "−π" : minus(`${num}π`);
  return den > 1 ? `${head}/${den}` : head;
}

// Negates an exact value, adding parentheses around sums.
export const neg = (s: string) => (s.startsWith("(") || !/[+−]/.test(s) ? `−${s}` : `−(${s})`);

// Wraps a value in parentheses when it is negative or a sum.
export const paren = (s: string) =>
  s.startsWith("−") || (/[+−]/.test(s) && !s.startsWith("(")) ? `(${s})` : s;
