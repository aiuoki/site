// Live checks shown under the identities of the guide, recomputed with the
// current angles. Returns HTML-safe text built from trusted strings.
import { fmt, fmtDeg, fmtP, piFrac } from "./format";
import { compute, isInt, norm, rad, signedDeg, type AngleUnit } from "./trig";

export interface CheckStrings {
  r1: string;
  r2: string;
  r3: string;
  q1: string;
  q2: string;
  p2: string;
  p3: string;
  noTanA: string;
  noTan2A: string;
  luck: string;
  direct: string;
}

export interface CheckNames {
  sin: string;
  cos: string;
  tan: string;
  rad: string;
}

export const CIRCLE_CHECKS = ["r1", "r2", "r3", "q1", "q2", "p1", "p2", "p3"] as const;
export const SUM_CHECKS = ["wrong", "dbl", "dbl2", "half", "s2p"] as const;
export type CircleCheck = (typeof CIRCLE_CHECKS)[number];
export type SumCheck = (typeof SUM_CHECKS)[number];

export function circleCheck(kind: CircleCheck, deg: number, locale: string, s: CheckStrings): string {
  const V = compute(deg);
  const f = (x: number) => fmt(x, locale);
  const fp = (x: number) => fmtP(x, locale);
  switch (kind) {
    case "r1":
      return V.csc === null ? s.r1 : `${f(V.s)} · ${fp(V.csc)} = ${f(V.s * V.csc)}`;
    case "r2":
      return V.sec === null ? s.r2 : `${f(V.c)} · ${fp(V.sec)} = ${f(V.c * V.sec)}`;
    case "r3":
      return V.tan === null || V.cot === null ? s.r3 : `${f(V.tan)} · ${fp(V.cot)} = ${f(V.tan * V.cot)}`;
    case "q1":
      return V.tan === null ? s.q1 : `${f(V.s)} / ${fp(V.c)} = ${f(V.tan)}`;
    case "q2":
      return V.cot === null ? s.q2 : `${f(V.c)} / ${fp(V.s)} = ${f(V.cot)}`;
    case "p1":
      return `${f(V.s ** 2)} + ${f(V.c ** 2)} = ${f(V.s ** 2 + V.c ** 2)}`;
    case "p2":
      return V.tan === null || V.sec === null ? s.p2 : `1 + ${f(V.tan ** 2)} = ${f(1 + V.tan ** 2)} = ${fp(V.sec)}²`;
    case "p3":
      return V.cot === null || V.csc === null ? s.p3 : `1 + ${f(V.cot ** 2)} = ${f(1 + V.cot ** 2)} = ${fp(V.csc)}²`;
  }
}

export interface SumState {
  a: number;
  b: number;
  op: 1 | -1;
  unit: AngleUnit;
}

export function sumCheck(kind: SumCheck, st: SumState, locale: string, n: CheckNames, s: CheckStrings): string {
  const { a, b, op } = st;
  const f = (x: number) => fmt(x, locale);
  const fp = (x: number) => fmtP(x, locale);
  const deg = (d: number) => fmtDeg(d, locale);
  const Va = compute(a);
  const Vb = compute(b);
  switch (kind) {
    case "wrong": {
      const g = norm(a + op * b);
      const sym = op > 0 ? "+" : "−";
      const angle = (d: number) => {
        if (st.unit === "deg") return `${deg(d)}°`;
        const sd = signedDeg(norm(d));
        return isInt(sd) ? piFrac(Math.round(sd)) : `${f(rad(sd))} ${n.rad}`;
      };
      const wrong = Va.s + op * Vb.s;
      const right = compute(g).s;
      const luck = Math.abs(wrong - right) < 1e-6 ? ` <span class="hint">${s.luck}</span>` : "";
      return `${n.sin} ${angle(a)} ${sym} ${n.sin} ${angle(b)} = <span class="num">${f(wrong)}</span> &nbsp;≠&nbsp; ${n.sin}(${angle(g)}) = <span class="num">${f(right)}</span>${luck}`;
    }
    case "dbl": {
      const d2 = compute(2 * a);
      const den = 1 - (Va.tan ?? 0) ** 2;
      const tan2 = Va.tan === null ? s.noTanA : Math.abs(den) < 1e-9 ? s.noTan2A : `${n.tan} 2α = ${f((2 * Va.tan) / den)}`;
      return `α = ${deg(a)}° → 2α = ${deg(norm(2 * a))}°: ${n.sin} 2α = ${f(2 * Va.s * Va.c)} (${s.direct} ${f(d2.s)}), ${n.cos} 2α = ${f(Va.c ** 2 - Va.s ** 2)} (${s.direct} ${f(d2.c)}), ${tan2}`;
    }
    case "dbl2":
      return `2·${fp(Va.c)}² − 1 = ${f(2 * Va.c ** 2 - 1)} · 1 − 2·${fp(Va.s)}² = ${f(1 - 2 * Va.s ** 2)}`;
    case "half": {
      const h = compute(a / 2);
      const root = (x: number) => f(Math.sqrt(Math.max(0, x)));
      return `α/2 = ${deg(a / 2)}°: √((1 − ${fp(Va.c)})/2) = ${root((1 - Va.c) / 2)} → ${n.sin} = ${f(h.s)}; √((1 + ${fp(Va.c)})/2) = ${root((1 + Va.c) / 2)} → ${n.cos} = ${f(h.c)}`;
    }
    case "s2p": {
      const p1 = 2 * Math.sin(rad((a + b) / 2)) * Math.cos(rad((a - b) / 2));
      const p2 = 2 * Math.cos(rad((a + b) / 2)) * Math.cos(rad((a - b) / 2));
      return `${n.sin} α + ${n.sin} β = ${f(Va.s + Vb.s)} = ${f(p1)} · ${n.cos} α + ${n.cos} β = ${f(Va.c + Vb.c)} = ${f(p2)}`;
    }
  }
}
