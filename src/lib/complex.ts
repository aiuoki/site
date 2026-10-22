// Complex arithmetic. Values closer to 0 than 1e-10 are snapped to 0 so that
// results like i·i print as −1 instead of −1 + 1.2e-16i.

export interface Complex {
  re: number;
  im: number;
}

export const clean = (x: number) => (Math.abs(x) < 1e-10 ? 0 : x);
export const cx = (re: number, im: number): Complex => ({ re: clean(re), im: clean(im) });

export const add = (z: Complex, w: Complex) => cx(z.re + w.re, z.im + w.im);
export const mul = (z: Complex, w: Complex) => cx(z.re * w.re - z.im * w.im, z.re * w.im + z.im * w.re);
export const conj = (z: Complex) => cx(z.re, -z.im);
export const abs = (z: Complex) => Math.hypot(z.re, z.im);

export function div(z: Complex, w: Complex): Complex {
  const d = w.re ** 2 + w.im ** 2;
  return cx((z.re * w.re + z.im * w.im) / d, (z.im * w.re - z.re * w.im) / d);
}

// Principal argument in (−π, π].
export function arg(z: Complex): number {
  const a = Math.atan2(clean(z.im), clean(z.re));
  return a <= -Math.PI + 1e-12 ? Math.PI : a;
}

export const polar = (r: number, theta: number) => cx(r * Math.cos(theta), r * Math.sin(theta));

export function pow(z: Complex, n: number): Complex {
  let r = cx(1, 0);
  for (let i = 0; i < n; i++) r = mul(r, z);
  return r;
}

// Brings an angle back to (−π, π].
export function reduceAngle(a: number): number {
  let x = a;
  while (x > Math.PI + 1e-9) x -= 2 * Math.PI;
  while (x <= -Math.PI + 1e-9) x += 2 * Math.PI;
  return x;
}

// The n n-th roots, k = 0..n−1. Empty for z = 0.
export function roots(z: Complex, n: number): Complex[] {
  const r = abs(z);
  if (r < 1e-12) return [];
  return Array.from({ length: n }, (_, k) => polar(r ** (1 / n), (arg(z) + 2 * Math.PI * k) / n));
}

export const exp = (z: Complex) => polar(Math.exp(z.re), z.im);

// Principal logarithm; null for z = 0.
export function log(z: Complex): Complex | null {
  const r = abs(z);
  return r < 1e-12 ? null : cx(Math.log(r), arg(z));
}
