// Live checks under the cards of the complex-number guide, recomputed with
// the current z, w and n of the plane.
import { abs, add, arg, conj, div, exp, log, mul, pow, roots, type Complex } from "./complex";
import { angOf, binH, polH, sup, type AngleUnit } from "./complex-format";
import { fmtDeg, fmtMax } from "./format";

export const COMPLEX_CHECKS = [
  "cx-tri", "cx-modprod", "cx-zz", "cx-div", "cx-arg", "cx-pprod", "cx-moivre", "cx-roots", "cx-exp", "cx-log",
] as const;
export type ComplexCheck = (typeof COMPLEX_CHECKS)[number];

export interface ComplexCheckState {
  z: Complex;
  w: Complex;
  n: number;
  unit: AngleUnit;
}

export function complexCheck(
  kind: ComplexCheck,
  st: ComplexCheckState,
  locale: string,
  s: { noDiv: string; undefArg: string },
): string {
  const { z, w, n, unit } = st;
  const f = (x: number) => fmtMax(x, locale);
  const b = (x: Complex) => binH(x, locale);
  const [zS, wS, az, aw] = [b(z), b(w), abs(z), abs(w)];
  switch (kind) {
    case "cx-tri":
      return `z = ${zS}, w = ${wS}: |z + w| = ${f(abs(add(z, w)))} ≤ ${f(az)} + ${f(aw)} = ${f(az + aw)}`;
    case "cx-modprod":
      return `|zw| = ${f(abs(mul(z, w)))} = ${f(az)} · ${f(aw)}`;
    case "cx-zz":
      return `(${zS})(${b(conj(z))}) = ${f(az * az)} = |z|²`;
    case "cx-div":
      return aw < 1e-12 ? s.noDiv : `z / w = ${b(div(z, w))}`;
    case "cx-arg": {
      if (az < 1e-12) return s.undefArg;
      const A = angOf(arg(z), "rad", locale);
      return `Arg(${zS}) ${A.ex ? "=" : "≈"} ${A.s} ≈ ${fmtDeg((arg(z) * 180) / Math.PI, locale)}°`;
    }
    case "cx-pprod":
      return az * aw < 1e-12 ? "" : `${polH(z, unit, locale)} · ${polH(w, unit, locale)} = ${polH(mul(z, w), unit, locale)}`;
    case "cx-moivre":
      return `z${sup(n)} = (${zS})${sup(n)} = ${b(pow(z, n))}`;
    case "cx-roots":
      return az < 1e-12 ? "" : `${sup(n)}√(${zS}): ${roots(z, n).map(b).join(" · ")}`;
    case "cx-exp":
      return `e^(${zS}) = ${b(exp(z))}, |e^z| = e^${f(z.re)} = ${f(Math.exp(z.re))}`;
    case "cx-log": {
      const l = log(z);
      return l ? `Log(${zS}) = ${b(l)}` : "log 0 ∄";
    }
  }
}
