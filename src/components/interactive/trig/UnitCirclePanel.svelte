<script lang="ts">
  import Segmented from "../../ui/Segmented.svelte";
  import { fmt, fmtDeg, piFrac } from "../../../lib/format";
  import { RATIOS, compute, exact, isInt, quadrant, rad, refAngle, signedDeg, wrapDeg, type AngleUnit, type Ratio } from "../../../lib/trig";
  import type { Notation } from "../../../lib/notation";
  import AngleField from "./AngleField.svelte";
  import AngleSlider from "./AngleSlider.svelte";
  import type { TrigStrings } from "./types";

  interface Props {
    deg: number;
    unit: AngleUnit;
    hovered: Ratio | null;
    strings: TrigStrings;
    notation: Notation;
    locale: string;
  }

  let { deg = $bindable(), unit = $bindable(), hovered = $bindable(), strings: s, notation: n, locale }: Props = $props();

  const QUICK = {
    deg: [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 270, 300, 315],
    rad: [-180, -135, -90, -60, -45, -30, 0, 30, 45, 60, 90, 120, 135, 150, 180],
  };
  const ROMAN = ["", "I", "II", "III", "IV"];

  const V = $derived(compute(deg));
  const E = $derived(exact(deg));
  const sd = $derived(signedDeg(deg));
  const radDec = $derived(fmt(rad(unit === "rad" ? sd : deg), locale));
  const piText = $derived(unit === "deg" ? (isInt(deg) ? piFrac(Math.round(deg)) : null) : isInt(sd) ? piFrac(Math.round(sd)) : null);
  const q = $derived(quadrant(deg));

  function rowValue(k: Ratio) {
    const val = V[k];
    if (val === null) return { exact: s.undef, dec: `${k === "tan" || k === "sec" ? n.cos : n.sin} θ = 0`, undef: true };
    return { exact: E ? (E[k] ?? "") : fmt(val, locale), dec: E ? `≈ ${fmt(val, locale)}` : "", undef: false };
  }
</script>

<div class="panel">
  <div class="card">
    <div class="readout">
      <span class="eyebrow">{s.angle}</span>
      {#if unit === "deg"}
        <div class="big"><i>θ</i> = {fmtDeg(deg, locale)}°</div>
        <div class="sub">= {#if piText}<span class="mr">{piText}</span> {n.rad} ≈ {:else}≈ {/if}<span class="num">{radDec}</span> {n.rad}</div>
      {:else}
        <div class="big"><i>θ</i> = {piText ?? radDec} <span class="big-unit">{n.rad}</span></div>
        <div class="sub">≈ <span class="num">{radDec}</span> {n.rad} = {fmtDeg(sd, locale)}°</div>
      {/if}
      <div>
        <span class="quad">{q ? `${s.quadrant} ${ROMAN[q]} · ${s.ref} ${fmtDeg(refAngle(deg), locale)}°` : s.onAxis}</span>
      </div>
    </div>
    <div class="controls">
      <div class="row">
        <Segmented options={[{ value: "deg", label: s.deg }, { value: "rad", label: s.radians }]} bind:value={unit} />
        <AngleField bind:deg {unit} {locale} label="θ =" unitLabel={unit === "deg" ? "°" : n.rad} />
      </div>
      <AngleSlider bind:deg {unit} label={s.angle} />
      <div class="hint">{@html unit === "deg" ? s.hintDeg : s.hintRad}</div>
      <div class="quick">
        {#each QUICK[unit] as d (d)}
          <button type="button" onclick={() => (deg = wrapDeg(d))}>{unit === "deg" ? `${d}°` : piFrac(d)}</button>
        {/each}
      </div>
    </div>
  </div>
  <div class="card">
    <span class="eyebrow">{s.values}</span>
    <div class="vals">
      {#each RATIOS as k (k)}
        {@const row = rowValue(k)}
        <div
          class="val"
          class:undef={row.undef}
          class:hl={hovered === k}
          style:--col="var(--{k})"
          role="presentation"
          onmouseenter={() => (hovered = k)}
          onmouseleave={() => (hovered = null)}
        >
          <span class="bar"></span>
          <span class="name">{n[k]} <i>θ</i></span>
          <span class="exact">{row.exact}</span>
          <span class="def">{s.def[k]}</span>
          <span class="dec">{row.dec}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
