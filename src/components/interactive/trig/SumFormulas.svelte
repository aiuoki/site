<script lang="ts">
  import { fmt, fmtP, paren } from "../../../lib/format";
  import { compute, exact, norm, type Ratio } from "../../../lib/trig";
  import type { Notation } from "../../../lib/notation";
  import { interpolate } from "../../../lib/text";
  import type { TrigStrings } from "./types";

  interface Props {
    a: number;
    b: number;
    op: 1 | -1;
    angleText: (d: number) => string;
    strings: TrigStrings;
    notation: Notation;
    locale: string;
    seeDemo: string;
  }

  let { a, b, op, angleText, strings: s, notation: n, locale, seeDemo }: Props = $props();

  const g = $derived(norm(a + op * b));
  const Va = $derived(compute(a));
  const Vb = $derived(compute(b));
  const Vg = $derived(compute(g));
  const Ea = $derived(exact(a));
  const Eb = $derived(exact(b));
  const Eg = $derived(exact(g));
  const sym = $derived(op > 0 ? "+" : "−");
  const inv = $derived(op > 0 ? "−" : "+");
  const gName = $derived(`α ${sym} β`);
  const A = `<i class="ia">α</i>`;
  const B = `<i class="ib">β</i>`;

  // Exact values only when both inputs are notable angles.
  const val = (which: "a" | "b", k: Ratio) => {
    const [E, V] = which === "a" ? [Ea, Va] : [Eb, Vb];
    return Ea && Eb && E ? paren(E[k] ?? "") : fmtP(V[k] ?? 0, locale);
  };
  const result = (k: Ratio) => {
    const x = Vg[k];
    if (x === null) return s.noExist;
    const approx = fmt(x, locale);
    const main = Eg ? (Eg[k] ?? approx) : approx;
    return main + (Eg && main !== approx ? ` <span class="hint num">≈ ${approx}</span>` : "");
  };
  const matches = (k: "sin" | "cos") => interpolate(s.matches, { x: `${n[k]}(${angleText(g)})` });

  const tan = $derived.by(() => {
    if (Va.tan === null || Vb.tan === null) {
      return {
        step: interpolate(s.tanNo, { x: Va.tan === null ? A : B }),
        result: Vg.tan === null ? `${n.tan}(${gName}) — ${s.noExist}` : `${s.useSinCos} <span class="ig">${result("tan")}</span>`,
      };
    }
    const den = 1 - op * Va.tan * Vb.tan;
    return {
      step: `= (${val("a", "tan")} ${sym} ${val("b", "tan")}) / (1 ${inv} ${val("a", "tan")} · ${val("b", "tan")})`,
      result: Math.abs(den) < 1e-9 ? interpolate(s.denom0, { g: gName }) : `= <span class="ig">${result("tan")}</span>`,
    };
  });
</script>

<div class="fx">
  <div class="f">{@html `${n.sin}(${A} ${sym} ${B}) = ${n.sin} ${A} · ${n.cos} ${B} ${sym} ${n.cos} ${A} · ${n.sin} ${B}`}</div>
  <div class="s">= {val("a", "sin")} · {val("b", "cos")} {sym} {val("a", "cos")} · {val("b", "sin")}</div>
  <div class="r"><span>= <span class="ig">{@html result("sin")}</span></span><span class="ok">{matches("sin")}</span></div>
  <button type="button" class="more" data-demo="sum-sin">{seeDemo}</button>
</div>
<div class="fx">
  <div class="f">{@html `${n.cos}(${A} ${sym} ${B}) = ${n.cos} ${A} · ${n.cos} ${B} ${inv} ${n.sin} ${A} · ${n.sin} ${B}`}</div>
  <div class="s">= {val("a", "cos")} · {val("b", "cos")} {inv} {val("a", "sin")} · {val("b", "sin")}</div>
  <div class="r"><span>= <span class="ig">{@html result("cos")}</span></span><span class="ok">{matches("cos")}</span></div>
  <button type="button" class="more" data-demo="sum-cos">{seeDemo}</button>
</div>
<div class="fx">
  <div class="f">{@html `${n.tan}(${A} ${sym} ${B}) = (${n.tan} ${A} ${sym} ${n.tan} ${B}) / (1 ${inv} ${n.tan} ${A} · ${n.tan} ${B})`}</div>
  <div class="s">{@html tan.step}</div>
  <div class="r"><span>{@html tan.result}</span></div>
  <button type="button" class="more" data-demo="sum-tan">{seeDemo}</button>
</div>
