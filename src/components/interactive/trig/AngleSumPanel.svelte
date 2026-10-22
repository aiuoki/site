<script lang="ts">
  import Segmented from "../../ui/Segmented.svelte";
  import { fmt, fmtDeg, piFrac } from "../../../lib/format";
  import { compute, exact, isInt, norm, rad, signedDeg, type AngleUnit, type Ratio } from "../../../lib/trig";
  import type { Notation } from "../../../lib/notation";
  import { interpolate } from "../../../lib/text";
  import AngleField from "./AngleField.svelte";
  import AngleSlider from "./AngleSlider.svelte";
  import SumFormulas from "./SumFormulas.svelte";
  import type { TrigStrings } from "./types";

  interface Props {
    a: number;
    b: number;
    op: 1 | -1;
    unit: AngleUnit;
    strings: TrigStrings;
    notation: Notation;
    locale: string;
    seeDemo: string;
  }

  let { a = $bindable(), b = $bindable(), op = $bindable(), unit = $bindable(), strings: s, notation: n, locale, seeDemo }: Props = $props();

  const PAIRS = [[45, 30], [60, 45], [45, 45], [90, 30], [120, 45], [135, 60], [180, 30], [30, 60]] as const;
  const raw = $derived(a + op * b);
  const g = $derived(norm(raw));
  const sym = $derived(op > 0 ? "+" : "−");
  const gName = $derived(`α ${sym} β`);
  const short = (d: number) => (unit === "deg" ? `${d}°` : piFrac(d));

  function angleText(d: number): string {
    if (unit === "deg") return `${fmtDeg(d, locale)}°`;
    const sd = signedDeg(norm(d));
    return isInt(sd) ? piFrac(Math.round(sd)) : `${fmt(rad(sd), locale)} ${n.rad}`;
  }

  const wrapped = $derived(Math.abs(raw - g) > 1e-9 && Math.abs(raw - 360) > 1e-9);
  const equiv = $derived(
    interpolate(s.equiv, { a: `${fmtDeg(a, locale)}° ${sym} ${fmtDeg(b, locale)}°`, b: `${fmtDeg(raw, locale)}°`, c: `${fmtDeg(g, locale)}°` }),
  );
  const cell = (d: number, k: Ratio) => {
    const x = compute(d)[k];
    if (x === null) return null;
    return exact(d)?.[k] ?? fmt(x, locale);
  };
</script>

<div class="panel">
  <div class="card">
    <div class="controls first">
      <div class="row">
        <Segmented options={[{ value: "deg", label: s.deg }, { value: "rad", label: s.radians }]} bind:value={unit} />
        <Segmented options={[{ value: 1, label: "α + β", math: true }, { value: -1, label: "α − β", math: true }]} bind:value={op} />
      </div>
      <div class="angle-block">
        <AngleField bind:deg={a} {unit} {locale} label="α =" unitLabel={unit === "deg" ? "°" : n.rad} color="--a" />
        <AngleSlider bind:deg={a} {unit} label="α" color="--a" />
      </div>
      <div class="angle-block">
        <AngleField bind:deg={b} {unit} {locale} label="β =" unitLabel={unit === "deg" ? "°" : n.rad} color="--b" />
        <AngleSlider bind:deg={b} {unit} label="β" color="--b" />
      </div>
      <div class="hint">{@html unit === "deg" ? s.hintDeg : s.hintRad}</div>
      <div class="quick">
        {#each PAIRS as [pa, pb] (`${pa}-${pb}`)}
          <button type="button" onclick={() => ((a = pa), (b = pb))}>{short(pa)} {sym} {short(pb)}</button>
        {/each}
      </div>
    </div>
  </div>
  <div class="card">
    <div class="readout">
      <span class="eyebrow">{s.result}</span>
      <div class="big"><i>α</i> {sym} <i>β</i> = <span class="ig">{angleText(g)}</span></div>
      <div class="sub">
        {#if unit === "deg"}
          {#if isInt(g)}= <span class="mr">{piFrac(Math.round(g))}</span> {n.rad} ≈ {:else}≈ {/if}<span class="num">{fmt(rad(g), locale)}</span> {n.rad}
        {:else}
          ≈ <span class="num">{fmt(rad(signedDeg(g)), locale)}</span> {n.rad} = {fmtDeg(signedDeg(g), locale)}°
        {/if}
        {#if wrapped} · {equiv}{/if}
      </div>
    </div>
    <div class="miniwrap">
      <table class="mini">
        <thead><tr><th></th><th class="ca">α</th><th class="cb">β</th><th class="cg">{gName}</th></tr></thead>
        <tbody>
          {#each ["sin", "cos", "tan"] as const as k (k)}
            <tr>
              <td>{n[k]}</td>
              {#each [a, b, g] as d, i (i)}
                {@const x = cell(d, k)}
                {#if x === null}<td class="nd">{s.noExist}</td>{:else}<td>{x}</td>{/if}
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  <div class="card">
    <span class="eyebrow">{s.withFormulas}</span>
    <SumFormulas {a} {b} {op} {angleText} strings={s} notation={n} {locale} {seeDemo} />
  </div>
</div>
