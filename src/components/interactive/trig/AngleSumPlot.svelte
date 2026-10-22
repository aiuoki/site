<script lang="ts">
  import { arcPath, polar, u, v } from "../../../lib/plot";
  import { angDist, compute, norm, snap, type AngleUnit } from "../../../lib/trig";
  import CircleAxes from "./CircleAxes.svelte";
  import { eventDeg, keyStep } from "./pointer";

  interface Props {
    a: number;
    b: number;
    op: 1 | -1;
    unit: AngleUnit;
    labels: boolean;
    projections: boolean;
    magnet: boolean;
    label: string;
    angleText: (d: number) => string;
  }

  let { a = $bindable(), b = $bindable(), op, unit, labels, projections, magnet, label: plotLabel, angleText }: Props = $props();

  let svg: SVGSVGElement;
  let dragging: "a" | "b" | "g" | null = null;

  const g = $derived(norm(a + op * b));
  const Vg = $derived(compute(g));
  const [ax, ay] = $derived(polar(a));
  const [bx, by] = $derived(polar(b));
  const [gx, gy] = $derived(polar(g));
  const arcA = $derived(arcPath(0.3, 0, a, true));
  const arcB = $derived(arcPath(0.46, a, a + op * b));
  const seg = (x1: number, y1: number, x2: number, y2: number) => ({ x1: u(x1), y1: v(y1), x2: u(x2), y2: v(y2) });
  const label = (d: number, r: number) => {
    const [x, y] = polar(d, r);
    return { x: u(x), y: v(y) + 7 };
  };
  const gName = $derived(`α ${op > 0 ? "+" : "−"} β`);

  // Dragging the result moves β so that α ± β follows the pointer.
  function move(d: number) {
    const x = snap(d, magnet);
    if (dragging === "a") a = x;
    else if (dragging === "b") b = x;
    else b = norm(op * (x - a));
  }

  function onpointerdown(event: PointerEvent) {
    const d = eventDeg(svg, event);
    if (d === null) return;
    const near = (["a", "g", "b"] as const)
      .map((k) => [k, angDist(d, k === "a" ? a : k === "b" ? b : a + op * b)] as const)
      .sort((p, q) => p[1] - q[1]);
    dragging = near[0]![0];
    svg.setPointerCapture(event.pointerId);
    move(d);
    event.preventDefault();
  }

  function onpointermove(event: PointerEvent) {
    if (!dragging) return;
    const d = eventDeg(svg, event);
    if (d !== null) move(d);
  }

  function keyFor(which: "a" | "b") {
    return (event: KeyboardEvent) => {
      const step = keyStep(event);
      if (step === null) return;
      event.preventDefault();
      if (which === "a") a = norm(Math.round(a) + step);
      else b = norm(Math.round(b) + step);
    };
  }
</script>

<svg
  bind:this={svg}
  class="plot"
  viewBox="0 0 700 700"
  role="group"
  aria-label={plotLabel}
  {onpointerdown}
  {onpointermove}
  onpointerup={() => (dragging = null)}
  onpointercancel={() => (dragging = null)}
>
  <defs>
    <marker id="angle-sum-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--b)" />
    </marker>
  </defs>
  <CircleAxes {unit} />
  <g>
    {#if arcA}<path d={arcA} fill="color-mix(in srgb, var(--a) 18%, transparent)" stroke="var(--a)" stroke-width="2" />{/if}
    {#if arcB && b > 3}<path d={arcB} fill="none" stroke="var(--b)" stroke-width="3.5" marker-end="url(#angle-sum-arrow)" />{/if}
    <line {...seg(0, 0, bx, by)} stroke="var(--b)" stroke-width="1.6" stroke-dasharray="5 6" opacity=".85" />
    <line {...seg(0, 0, ax, ay)} stroke="var(--a)" stroke-width="3" />
    {#if projections && Math.abs(Vg.c) > 1e-9}<line {...seg(0, 0, Vg.c, 0)} stroke="var(--cos)" stroke-width="5" stroke-linecap="round" />{/if}
    {#if projections && Math.abs(Vg.s) > 1e-9}<line {...seg(Vg.c, 0, Vg.c, Vg.s)} stroke="var(--sin)" stroke-width="5" stroke-linecap="round" />{/if}
    <line {...seg(0, 0, gx, gy)} stroke="var(--g)" stroke-width="3.5" />
    <circle cx={u(gx)} cy={v(gy)} r="9" fill="var(--g)" stroke="var(--surface)" stroke-width="3" />
  </g>
  {#if labels}
    <g class="sum-labels" aria-hidden="true">
      <text {...label(a, 1.2)} fill="var(--a)">α</text>
      <text {...label(b, 1.2)} fill="var(--b)">β</text>
      <text {...label(g, 1.42)} fill="var(--g)">{gName}</text>
    </g>
  {/if}
  <g class="handle" tabindex="0" role="slider" aria-label="α" aria-valuemin="0" aria-valuemax="360" aria-valuenow={Number(a.toFixed(1))} aria-valuetext={angleText(a)} onkeydown={keyFor("a")}>
    <circle cx={u(ax)} cy={v(ay)} r="15" fill="color-mix(in srgb, var(--a) 18%, transparent)" stroke="var(--a)" stroke-width="2" />
    <circle cx={u(ax)} cy={v(ay)} r="6.5" fill="var(--a)" />
  </g>
  <g class="handle" tabindex="0" role="slider" aria-label="β" aria-valuemin="0" aria-valuemax="360" aria-valuenow={Number(b.toFixed(1))} aria-valuetext={angleText(b)} onkeydown={keyFor("b")}>
    <circle cx={u(bx)} cy={v(by)} r="13" fill="color-mix(in srgb, var(--b) 14%, transparent)" stroke="var(--b)" stroke-width="2" stroke-dasharray="4 3" />
    <circle cx={u(bx)} cy={v(by)} r="5.5" fill="var(--b)" />
  </g>
</svg>
