<script lang="ts">
  import type { Matrix } from "../../../../lib/matrix";
  import { absFrac, fracText, isInteger, toNumber } from "../../../../lib/fraction";
  import { interpolate } from "../../../../lib/text";
  import { gridLines, planeOf, svgPoints } from "./plane";

  interface Props {
    matrix: Matrix;
    strings: Record<string, string>;
    locale: string;
  }

  let { matrix, strings: s, locale }: Props = $props();

  const plane = $derived(planeOf(matrix));
  const lines = $derived(plane ? gridLines(plane) : []);
  const area = $derived(plane ? Math.abs(toNumber(plane.det)) : 0);
  // Exact value, plus a decimal when the area is not a whole number.
  const areaText = $derived.by(() => {
    if (!plane) return "";
    const exact = fracText(absFrac(plane.det));
    return isInteger(plane.det) ? exact : `${exact} ≈ ${area.toLocaleString(locale, { maximumFractionDigits: 3 })}`;
  });
  const note = $derived(
    !plane ? "" : plane.kind === "full" ? s.planeFull : plane.kind === "segment" ? s.planeSegment : s.planePoint,
  );
  // Sizes in view units, so they scale with the zoom.
  const u = $derived(plane ? plane.extent / 40 : 1);
  // Each label goes on the outer side of its vector, so the two never overlap.
  const label = (p: [number, number], left: boolean) => ({
    x: p[0] + (left ? -u * 1.8 : u * 1.8),
    y: -p[1] - u * 1.5,
    "text-anchor": left ? "end" : "start",
  });
  const e1Left = $derived(plane ? plane.e1[0] <= plane.e2[0] : true);
</script>

{#if plane}
  <div class="plane">
    <svg
      viewBox="{-plane.extent} {-plane.extent} {2 * plane.extent} {2 * plane.extent}"
      role="img"
      aria-label={s.planeAria}
    >
      {#each lines as g (g)}
        <line class="grid" x1={g} y1={-plane.extent} x2={g} y2={plane.extent} />
        <line class="grid" x1={-plane.extent} y1={g} x2={plane.extent} y2={g} />
      {/each}
      <line class="axis" x1={-plane.extent} y1="0" x2={plane.extent} y2="0" />
      <line class="axis" x1="0" y1={-plane.extent} x2="0" y2={plane.extent} />

      <polygon class="unit" points={svgPoints(plane.unit)} />
      {#if plane.kind === "full"}
        <polygon class="image" class:flip={toNumber(plane.det) < 0} points={svgPoints(plane.image)} />
      {:else if plane.kind === "segment"}
        <polyline class="segment" points={svgPoints(plane.image)} />
      {/if}

      <line class="col1" x1="0" y1="0" x2={plane.e1[0]} y2={-plane.e1[1]} />
      <line class="col2" x1="0" y1="0" x2={plane.e2[0]} y2={-plane.e2[1]} />
      <circle class="dot1" cx={plane.e1[0]} cy={-plane.e1[1]} r={u * 1.1} />
      <circle class="dot2" cx={plane.e2[0]} cy={-plane.e2[1]} r={u * 1.1} />
      <circle class="origin" cx="0" cy="0" r={u * (plane.kind === "point" ? 1.8 : 1)} />
      {#if plane.kind !== "point"}
        <text class="t1" {...label(plane.e1, e1Left)} font-size={u * 3.2}>Ae₁</text>
        <text class="t2" {...label(plane.e2, !e1Left)} font-size={u * 3.2}>Ae₂</text>
      {/if}
    </svg>
    <div class="legend">
      <span style:--sw="var(--b)"><i></i>{s.planeUnit}</span>
      <span style:--sw={toNumber(plane.det) < 0 ? "var(--sec)" : "var(--a)"}><i></i>{s.planeImage}</span>
    </div>
    <p class="hint">{s.planeColumns}</p>
    <p class="area">
      {interpolate(s.planeArea, { d: fracText(plane.det) })}
      {#if toNumber(plane.det) < 0}{s.planeFlip}{/if}
    </p>
    <p class="hint">{interpolate(note, { a: areaText })}</p>
  </div>
{/if}

<style>
  .plane { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
  svg { display: block; width: 100%; max-width: 360px; aspect-ratio: 1; margin: 0 auto; background: var(--bg); border: 1px solid var(--line); border-radius: 10px; }
  svg * { vector-effect: non-scaling-stroke; }
  .grid { stroke: var(--line); stroke-width: 1; opacity: 0.6; }
  .axis { stroke: var(--muted); stroke-width: 1.5; }
  .unit { fill: color-mix(in srgb, var(--b) 18%, transparent); stroke: var(--b); stroke-width: 2; stroke-dasharray: 5 4; }
  .image { fill: color-mix(in srgb, var(--a) 24%, transparent); stroke: var(--a); stroke-width: 2.5; stroke-linejoin: round; }
  .image.flip { fill: color-mix(in srgb, var(--sec) 22%, transparent); stroke: var(--sec); }
  .segment { fill: none; stroke: var(--a); stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; }
  .col1, .col2 { stroke-width: 2.5; }
  .col1 { stroke: var(--cos); }
  .col2 { stroke: var(--cot); }
  .dot1 { fill: var(--cos); }
  .dot2 { fill: var(--cot); }
  .origin { fill: var(--fg); }
  text { font-family: var(--f-math); font-style: italic; paint-order: stroke; stroke: var(--bg); stroke-width: 4px; stroke-linejoin: round; }
  .t1 { fill: var(--cos); }
  .t2 { fill: var(--cot); }
  p { margin: 0; }
  .area { font-family: var(--f-math); font-size: 16px; }
</style>
