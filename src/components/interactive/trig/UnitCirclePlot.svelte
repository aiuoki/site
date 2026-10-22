<script lang="ts">
  import { C, LIM, arcPath, clampValue, u, v } from "../../../lib/plot";
  import { compute, norm, rad, snap, type AngleUnit, type Ratio } from "../../../lib/trig";
  import CircleAxes from "./CircleAxes.svelte";
  import { eventDeg, keyStep } from "./pointer";

  interface Props {
    deg: number;
    unit: AngleUnit;
    show: Record<Ratio, boolean>;
    labels: boolean;
    magnet: boolean;
    hovered: Ratio | null;
    names: Record<Ratio, string>;
    angleLabel: string;
    valueText: string;
  }

  let { deg = $bindable(), unit, show, labels, magnet, hovered, names, angleLabel, valueText }: Props = $props();

  let svg: SVGSVGElement;
  let dragging = false;

  const V = $derived(compute(deg));
  const c = $derived(V.c);
  const s = $derived(V.s);
  const tn = $derived(V.tan === null ? null : clampValue(V.tan));
  const ct = $derived(V.cot === null ? null : clampValue(V.cot));
  const seg = (x1: number, y1: number, x2: number, y2: number) => ({ x1: u(x1), y1: v(y1), x2: u(x2), y2: v(y2) });
  const width = (k: Ratio) => (hovered === k ? 9 : 6);

  // Label position in units; hidden when off-canvas or too small to read.
  function at(x: number, y: number, anchor: string, on: boolean) {
    const visible = on && labels && Math.abs(x) < LIM - 0.05 && Math.abs(y) < LIM - 0.05;
    return { x: u(x), y: v(y) + 6, anchor, visible };
  }

  const lbl = $derived.by(() => {
    const nx = -s;
    const ny = c;
    const along = (t: number) => Math.min(0.5, (LIM - 0.3) / Math.max(1, Math.abs(t)));
    const hidden = { x: 0, y: 0, anchor: "middle", visible: false };
    return {
      cos: at(c / 2, s >= 0 ? -0.2 : 0.12, "middle", show.cos && Math.abs(c) > 0.18),
      sin: at(c + (c >= 0 ? 0.08 : -0.08), s / 2, c >= 0 ? "start" : "end", show.sin && Math.abs(s) > 0.18),
      tan: tn === null ? hidden : at(1.08, Math.max(-LIM + 0.2, Math.min(LIM - 0.2, tn / 2)), "start", show.tan && Math.abs(tn) > 0.2),
      cot: ct === null ? hidden : at(Math.max(-LIM + 0.3, Math.min(LIM - 0.3, ct / 2)), 1.13, "middle", show.cot && Math.abs(ct) > 0.25),
      sec: tn === null ? hidden : at(along(tn) - nx * 0.16, along(tn) * tn - ny * 0.16, "middle", show.sec && Math.abs(V.sec ?? 0) > 0.3),
      csc: ct === null ? hidden : at(along(ct) * ct + nx * 0.16, along(ct) + ny * 0.16, "middle", show.csc && Math.abs(V.csc ?? 0) > 0.3),
    };
  });
  const order: Ratio[] = ["cos", "sin", "tan", "cot", "sec", "csc"];
  const arc = $derived(arcPath(0.27, 0, deg, true));
  const thetaR = $derived(deg < 25 ? 0.52 : 0.42);

  function pick(event: PointerEvent) {
    const d = eventDeg(svg, event);
    if (d !== null) deg = snap(d, magnet);
  }

  function onkeydown(event: KeyboardEvent) {
    const step = keyStep(event);
    if (step === null) return;
    event.preventDefault();
    deg = norm(Math.round(deg) + step);
  }
</script>

<svg
  bind:this={svg}
  class="plot"
  viewBox="0 0 700 700"
  role="group"
  aria-label={angleLabel}
  onpointerdown={(e) => {
    dragging = true;
    svg.setPointerCapture(e.pointerId);
    pick(e);
    e.preventDefault();
  }}
  onpointermove={(e) => dragging && pick(e)}
  onpointerup={() => (dragging = false)}
  onpointercancel={() => (dragging = false)}
>
  <CircleAxes {unit} />
  <g>
    <line {...seg(-4 * c, -4 * s, 4 * c, 4 * s)} stroke="var(--muted)" stroke-dasharray="1 6" stroke-linecap="round" />
    {#if arc}<path d={arc} fill="color-mix(in srgb, var(--fg) 8%, transparent)" stroke="var(--fg)" stroke-width="1.4" />{/if}
    {#if ct !== null && show.csc}<line {...seg(0, 0, ct, 1)} stroke="var(--csc)" stroke-width={width("csc")} stroke-dasharray="14 10" />{/if}
    {#if tn !== null && show.sec}<line {...seg(0, 0, 1, tn)} stroke="var(--sec)" stroke-width={width("sec")} stroke-dasharray="10 14" stroke-dashoffset="-14" />{/if}
    {#if ct !== null && show.cot && Math.abs(ct) > 1e-9}<line {...seg(0, 1, ct, 1)} stroke="var(--cot)" stroke-width={width("cot")} stroke-linecap="round" />{/if}
    {#if tn !== null && show.tan && Math.abs(tn) > 1e-9}<line {...seg(1, 0, 1, tn)} stroke="var(--tan)" stroke-width={width("tan")} stroke-linecap="round" />{/if}
    {#if show.cos && Math.abs(c) > 1e-9}<line {...seg(0, 0, c, 0)} stroke="var(--cos)" stroke-width={width("cos")} stroke-linecap="round" />{/if}
    {#if show.sin && Math.abs(s) > 1e-9}<line {...seg(c, 0, c, s)} stroke="var(--sin)" stroke-width={width("sin")} stroke-linecap="round" />{/if}
    <line {...seg(0, 0, c, s)} stroke="var(--fg)" stroke-width="1.6" opacity=".85" />
    {#if show.cos || show.sin}<circle cx={u(c)} cy={C} r="5.5" fill="var(--cos)" />{/if}
    {#if tn !== null && (show.tan || show.sec) && Math.abs(tn) < LIM}<circle cx={u(1)} cy={v(tn)} r="5.5" fill="var(--tan)" />{/if}
    {#if ct !== null && (show.cot || show.csc) && Math.abs(ct) < LIM}<circle cx={u(ct)} cy={v(1)} r="5.5" fill="var(--cot)" />{/if}
  </g>
  <g aria-hidden="true">
    {#if deg > 6 && labels}
      <text x={u(thetaR * Math.cos(rad(deg / 2)))} y={v(thetaR * Math.sin(rad(deg / 2))) + 6} fill="var(--fg)" font-size="18" font-style="italic" text-anchor="middle">θ</text>
    {/if}
    {#each order as k (k)}
      {#if lbl[k].visible}
        <text class="seg-label" x={lbl[k].x} y={lbl[k].y} text-anchor={lbl[k].anchor} fill="var(--{k})">{names[k]}</text>
      {/if}
    {/each}
  </g>
  <g
    class="handle"
    tabindex="0"
    role="slider"
    aria-label={angleLabel}
    aria-valuemin="0"
    aria-valuemax="360"
    aria-valuenow={Number(deg.toFixed(1))}
    aria-valuetext={valueText}
    {onkeydown}
  >
    <circle cx={u(c)} cy={v(s)} r="17" fill="color-mix(in srgb, var(--handle) 12%, transparent)" stroke="var(--handle)" stroke-width="2" />
    <circle cx={u(c)} cy={v(s)} r="7" fill="var(--handle)" />
  </g>
</svg>
