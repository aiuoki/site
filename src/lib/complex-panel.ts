// Text of the complex-number panel: readout, every form of z, and the steps
// of each operation. Pure functions returning trusted HTML built from numbers.
import { abs, arg, conj, cx, div, mul, reduceAngle, roots, type Complex } from "./complex";
import {
  angOf, binH, binOf, inputText, joinBin, modOf, nq, partsOf, piQ, polH, pp, ppc, ratio, sqrtEx, sub, sup, supI, trigH, expH,
  type AngleUnit,
} from "./complex-format";
import { fmtDeg, fmtMax } from "./format";
import { interpolate } from "./text";

export type Op = "none" | "conj" | "sum" | "prod" | "quot" | "pow" | "root";
export const OPS_WITH_W: readonly Op[] = ["sum", "prod", "quot"];

export interface PanelStrings {
  undefArg: string; rowBin: string; rowRe: string; rowIm: string; rowMod: string; rowArg: string; rowPol: string;
  rowTrig: string; rowExp: string; rowConj: string; expRad: string; pickOp: string; inPolar: string; reduce: string;
  noDiv: string; root0: string; outside: string;
}
export interface Names { sin: string; cos: string }

export type Block =
  | { kind: "fx"; f: string; s?: string; r?: string; demos: string[]; extra?: string }
  | { kind: "note"; text: string; warn?: boolean };

const Zi = `<i class="cz">z</i>`;
const Wi = `<i class="cw">w</i>`;
const I = "<i>i</i>";
const ov = (x: string) => `<span class="ov">${x}</span>`;
const fr = (a: string, b: string | number) => `<span class="fr"><span>${a}</span><span>${b}</span></span>`;
const r1 = "<i>ρ</i><sub>1</sub>", r2 = "<i>ρ</i><sub>2</sub>", t1 = "<i>θ</i><sub>1</sub>", t2 = "<i>θ</i><sub>2</sub>";
const hasRoot = (s: string) => /√|\//.test(s);

export function readout(z: Complex, unit: AngleUnit, locale: string, s: PanelStrings) {
  const r = abs(z);
  const th = arg(z);
  const B = binOf(z, locale);
  const M = modOf(z, locale);
  const A = angOf(th, unit, locale);
  const big = `${Zi} = <span class="cz">${B.ex ? "" : "≈ "}${B.s}</span>`;
  if (r < 1e-12) return { big, sub: `|${Zi}| = 0 · ${s.undefArg}` };
  const approx = M.ex && hasRoot(M.s) ? ` ≈ <span class="num">${fmtMax(r, locale)}</span>` : "";
  const other = unit === "rad" ? `${fmtDeg((th * 180) / Math.PI, locale)}°` : `${fmtMax(th, locale)} rad`;
  return { big, sub: `|${Zi}| = ${M.s}${approx} · Arg ${Zi} ${A.ex ? "= " : "≈ "}${A.s} <span class="num">(${other})</span>` };
}

export interface FormRow { color: string; name: string; desc: string; value: string; dec: string; demo: string }

export function forms(z: Complex, unit: AngleUnit, locale: string, n: Names, s: PanelStrings): FormRow[] {
  const r = abs(z);
  const th = arg(z);
  const P = partsOf(z, locale);
  const M = modOf(z, locale);
  const A = angOf(th, unit, locale);
  const fT = (x: number) => fmtMax(x, locale);
  const argText =
    r < 1e-12 ? s.undefArg
    : A.ex ? A.s
    : `arctan(${nq(z.im / z.re, locale).s})${z.re > 0 ? "" : z.im >= 0 ? " + π" : " − π"}`;
  const argDec = r < 1e-12 ? "" : unit === "rad" ? `${A.ex ? `${fT(th)} rad · ` : ""}${fmtDeg((th * 180) / Math.PI, locale)}°` : `${fT(th)} rad`;
  return [
    { color: "--z", name: `<i>a</i> + <i>bi</i>`, desc: s.rowBin, value: (P.ex ? "" : "≈ ") + joinBin(P.a, P.b), dec: "", demo: "cx-axiom" },
    { color: "--re", name: `Re(${Zi}) = <i>a</i>`, desc: s.rowRe, value: P.a, dec: P.ex && hasRoot(P.a) ? fT(z.re) : "", demo: "cx-axiom" },
    { color: "--im", name: `Im(${Zi}) = <i>b</i>`, desc: s.rowIm, value: P.b, dec: P.ex && hasRoot(P.b) ? fT(z.im) : "", demo: "cx-axiom" },
    {
      color: "--fg", name: `|<i>z</i>| = √<span class="rad"><i>a</i>² + <i>b</i>²</span>`, desc: s.rowMod,
      value: `√<span class="rad">${ppc(P.a)}² + ${ppc(P.b)}²</span> = ${M.s}`, dec: M.ex && hasRoot(M.s) ? fT(r) : "", demo: "cx-mod1",
    },
    { color: "--z", name: `<i>θ</i> = Arg <i>z</i>`, desc: s.rowArg, value: argText, dec: argDec, demo: "cx-arg" },
    { color: "--z", name: `<i>ρ</i><sub><i>θ</i></sub>`, desc: s.rowPol, value: polH(z, unit, locale), dec: "", demo: "cx-p2b" },
    {
      color: "--z", name: `<i>ρ</i>(${n.cos} <i>θ</i> + <i>i</i> ${n.sin} <i>θ</i>)`, desc: s.rowTrig,
      value: trigH(z, unit, locale, n), dec: "", demo: "cx-p2b",
    },
    { color: "--z", name: `<i>ρe</i><sup><i>iθ</i></sup>`, desc: s.rowExp, value: expH(z, locale), dec: unit === "deg" ? s.expRad : "", demo: "cx-euler" },
    { color: "--result", name: `${ov("<i>z</i>")} = <i>a</i> − <i>bi</i>`, desc: s.rowConj, value: binH(conj(z), locale), dec: "", demo: "cx-conj1" },
  ];
}

export interface PanelState { z: Complex; w: Complex; op: Op; n: number; unit: AngleUnit }

// Angles of a polar product or quotient, and whether the result was brought back to (−π, π].
function polarAngles(z: Complex, w: Complex, sign: 1 | -1, unit: AngleUnit, locale: string) {
  const raw = arg(z) + sign * arg(w);
  const red = reduceAngle(raw);
  const a = (x: number) => angOf(x, unit, locale).s;
  return { A1: a(arg(z)), A2: a(arg(w)), RAW: a(raw), RED: a(red), reduced: Math.abs(raw - red) > 1e-9 };
}

export function resultBlocks(st: PanelState, locale: string, s: PanelStrings): Block[] {
  const { z, w, op, n, unit } = st;
  const r = abs(z);
  const th = arg(z);
  const resB = (x: Complex) => `<span class="cr">${binH(x, locale)}</span>`;
  const resP = (x: Complex) => `<span class="cr">${abs(x) < 1e-12 ? "0" : polH(x, unit, locale)}</span>`;
  const reduceHint = (a: string, b: string) => `<span class="hint">${interpolate(s.reduce, { a, b })}</span>`;
  const P1 = partsOf(z, locale);
  const P2 = partsOf(w, locale);

  switch (op) {
    case "none":
      return [{ kind: "note", text: s.pickOp }];
    case "conj": {
      const res = conj(z);
      return [{
        kind: "fx", f: `${ov(Zi)} = <i>a</i> − <i>b</i>${I}`, s: `= ${binOf(res, locale).s}`,
        r: `<span>${s.inPolar}: ${ov(Zi)} = <i>ρ</i><sub>−<i>θ</i></sub> = ${resP(res)}</span>`, demos: ["cx-conj1", "cx-pconj"],
      }];
    }
    case "sum": {
      const res = cx(z.re + w.re, z.im + w.im);
      return [{
        kind: "fx", f: `${Zi} + ${Wi} = (<i>a</i> + <i>c</i>) + (<i>b</i> + <i>d</i>)${I}`,
        s: `= (${P1.a} + ${pp(P2.a)}) + (${P1.b} + ${pp(P2.b)})${I}`, r: `<span>= ${resB(res)}</span>`, demos: ["cx-axiom", "cx-tri"],
      }];
    }
    case "prod": {
      const res = mul(z, w);
      const blocks: Block[] = [{
        kind: "fx", f: `(<i>a</i> + <i>bi</i>)(<i>c</i> + <i>di</i>) = (<i>ac</i> − <i>bd</i>) + (<i>ad</i> + <i>bc</i>)${I}`,
        s: `= (${pp(P1.a)}·${pp(P2.a)} − ${pp(P1.b)}·${pp(P2.b)}) + (${pp(P1.a)}·${pp(P2.b)} + ${pp(P1.b)}·${pp(P2.a)})${I}`,
        r: `<span>= ${resB(res)}</span>`, demos: ["cx-axiom"],
      }];
      if (r > 1e-12 && abs(w) > 1e-12) {
        const p = polarAngles(z, w, 1, unit, locale);
        blocks.push({
          kind: "fx", f: `(${r1})<sub>${t1}</sub> · (${r2})<sub>${t2}</sub> = (${r1}${r2})<sub>${t1} + ${t2}</sub>`,
          s: `= (${pp(modOf(z, locale).s)} · ${pp(modOf(w, locale).s)})<sub>${p.A1} + ${pp(p.A2)}</sub> = ${modOf(res, locale).s}<sub>${p.RAW}</sub>`,
          r: `<span>= ${resP(res)}</span>${p.reduced ? reduceHint(p.RAW, p.RED) : ""}`, demos: ["cx-pprod"],
        });
      }
      return blocks;
    }
    case "quot": {
      if (abs(w) < 1e-12) return [{ kind: "note", text: s.noDiv, warn: true }];
      const res = div(z, w);
      const w2 = nq(w.re ** 2 + w.im ** 2, locale).s;
      const wS = binOf(w, locale).s;
      const blocks: Block[] = [{
        kind: "fx", f: `${fr(Zi, Wi)} = ${fr(`${Zi} · ${ov(Wi)}`, `|${Wi}|²`)}`,
        s: `= ${fr(`(${binOf(z, locale).s})(${wS === "0" ? "0" : binOf(conj(w), locale).s})`, w2)} = ${fr(binOf(mul(z, conj(w)), locale).s, w2)}`,
        r: `<span>= ${resB(res)}</span>`, demos: ["cx-div"],
      }];
      if (r > 1e-12) {
        const p = polarAngles(z, w, -1, unit, locale);
        blocks.push({
          kind: "fx", f: `${fr(`(${r1})<sub>${t1}</sub>`, `(${r2})<sub>${t2}</sub>`)} = (${fr(r1, r2)})<sub>${t1} − ${t2}</sub>`,
          s: `= (${modOf(z, locale).s} / ${modOf(w, locale).s})<sub>${p.A1} − ${pp(p.A2)}</sub>`,
          r: `<span>= ${resP(res)}</span>${p.reduced ? reduceHint(p.RAW, p.RED) : ""}`, demos: ["cx-pquot"],
        });
      }
      return blocks;
    }
    case "pow": {
      let res = cx(1, 0);
      for (let i = 0; i < n; i++) res = mul(res, z);
      const raw = n * th;
      const red = reduceAngle(raw);
      const [RAW, RED] = [angOf(raw, unit, locale).s, angOf(red, unit, locale).s];
      const rn = sqrtEx((z.re ** 2 + z.im ** 2) ** n, locale) ?? fmtMax(r ** n, locale);
      return [{
        kind: "fx", f: `(<i>ρ</i><sub><i>θ</i></sub>)<sup><i>n</i></sup> = (<i>ρ</i><sup><i>n</i></sup>)<sub><i>nθ</i></sub>`,
        s: r < 1e-12 ? "" : `= (${modOf(z, locale).s})${sup(n)}<sub>${n} · ${pp(angOf(th, unit, locale).s)}</sub> = ${rn}<sub>${RAW}</sub>`,
        r: `<span>= ${resP(res)} = ${resB(res)}</span>${r > 1e-12 && Math.abs(raw - red) > 1e-9 ? reduceHint(RAW, RED) : ""}`,
        demos: ["cx-moivre"],
      }];
    }
    case "root": {
      if (r < 1e-12) return [{ kind: "note", text: s.root0 }];
      const rr = r ** (1 / n);
      const rq = ratio(rr, 64);
      const sq = nq(z.re ** 2 + z.im ** 2, locale);
      const rS = rq ? nq(rr, locale).s : sq.ex ? supI(2 * n, sq.s) : fmtMax(rr, locale);
      const list = roots(z, n)
        .map((p, k) => {
          const AS = angOf((th + 2 * Math.PI * k) / n, unit, locale).s;
          return `<div><b>k = ${k}</b><span><span class="cr"><i>w</i>${sub(k)}</span> = ${rS}<sub>${AS}</sub></span><span>= ${resB(p)}</span></div>`;
        })
        .join("");
      return [{
        kind: "fx",
        f: `${supI("<i>n</i>", "<i>z</i>")} = { (${supI("<i>n</i>", "<i>ρ</i>")})<sub>${fr("<i>θ</i> + 2π<i>k</i>", "<i>n</i>")}</sub> }`,
        s: `${supI(n, "ρ")} = ${supI(n, pp(modOf(z, locale).s))} = ${rS}${rq ? "" : ` ≈ ${fmtMax(rr, locale)}`} · ${fr(`${angOf(th, unit, locale).s} + ${unit === "deg" ? "360°k" : "2πk"}`, n)}`,
        demos: ["cx-roots"], extra: `<div class="res-list">${list}</div>`,
      }];
    }
  }
}

// Points drawn for the result of the operation (empty when there is none).
export function resultPoints(st: Pick<PanelState, "z" | "w" | "op" | "n">): Complex[] {
  const { z, w, op, n } = st;
  if (op === "conj") return [conj(z)];
  if (op === "sum") return [cx(z.re + w.re, z.im + w.im)];
  if (op === "prod") return [mul(z, w)];
  if (op === "quot") return abs(w) < 1e-12 ? [] : [div(z, w)];
  if (op === "pow") {
    let r = cx(1, 0);
    for (let i = 0; i < n; i++) r = mul(r, z);
    return [r];
  }
  if (op === "root") return roots(z, n);
  return [];
}

// Value shown in an input: exact when possible, otherwise 4 decimals.
export function fieldText(z: Complex, index: 0 | 1, mode: "bin" | "pol", unit: AngleUnit, locale: string): string {
  if (mode === "bin") {
    const P = partsOf(z, locale);
    return P.ex ? inputText(index ? P.b : P.a) : (index ? z.im : z.re).toFixed(4).replace(/\.?0+$/, "");
  }
  if (index === 0) {
    const M = modOf(z, locale);
    return M.ex ? inputText(M.s) : abs(z).toFixed(4);
  }
  const th = arg(z);
  if (unit === "deg") return fmtDeg((th * 180) / Math.PI, locale).replace("−", "-").replace(",", ".");
  const p = piQ(th / Math.PI);
  return p ? inputText(p) : th.toFixed(4);
}
