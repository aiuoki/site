<script lang="ts">
  import { abs, add, arg, conj, cx, div, mul, pow, roots, type Complex } from "../../../lib/complex";
  import { binOf, sub, sup } from "../../../lib/complex-format";
  import { C, R, S, X, Y, anchorFor, arc, labelPos, sector, snapPoint } from "../../../lib/complex-plot";
  import { OPS_WITH_W, type Op } from "../../../lib/complex-panel";
  import Arrow from "./Arrow.svelte";
  import PlaneGrid from "./PlaneGrid.svelte";

  interface Show {
    labels: boolean;
    proj: boolean;
    polar: boolean;
    unit: boolean;
  }

  interface Props {
    z: Complex;
    w: Complex;
    op: Op;
    n: number;
    show: Show;
    magnet: boolean;
    locale: string;
    label: string;
  }

  let { z = $bindable(), w = $bindable(), op, n, show, magnet, locale, label }: Props = $props();

  let svg: SVGSVGElement;
  let dragging: "z" | "w" | null = null;

  const pt = (c: Complex): [number, number] => [c.re, c.im];
  const r = $derived(abs(z));
  const th = $derived(arg(z));
  const usesW = $derived(OPS_WITH_W.includes(op));
  const tint = (token: string, pct: number) => `color-mix(in srgb, var(${token}) ${pct}%, transparent)`;
  const seg = (a: Complex, b: Complex) => ({ x1: X(a.re), y1: Y(a.im), x2: X(b.re), y2: Y(b.im) });
  const text = (at: [number, number], fs = 20) => ({ x: X(at[0]), y: Y(at[1]) + fs * 0.35, "font-size": fs });

  const res = $derived.by(() => {
    if (op === "conj") return conj(z);
    if (op === "sum") return add(z, w);
    if (op === "prod") return mul(z, w);
    if (op === "quot") return abs(w) < 1e-12 ? null : div(z, w);
    if (op === "pow") return pow(z, n);
    return null;
  });
  const powers = $derived(op === "pow" ? Array.from({ length: n }, (_, i) => pow(z, i + 1)) : []);
  const rootList = $derived(op === "root" ? roots(z, n) : []);
  const rootR = $derived(r ** (1 / n));
  const tw = $derived(arg(w));
  const t2 = $derived(op === "prod" ? th + tw : th - tw);
  const zArc = $derived(Math.min(44, r * S * 0.6));
  const rhoAngle = $derived(th + (Math.abs(th) < 1.4 ? 0.22 : -0.22));

  function toPlane(event: PointerEvent): [number, number] | null {
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
    return [(p.x - C) / S, (C - p.y) / S];
  }

  function move(event: PointerEvent) {
    const p = toPlane(event);
    if (!p || !dragging) return;
    const [x, y] = snapPoint(p[0], p[1], magnet);
    if (dragging === "z") z = cx(x, y);
    else w = cx(x, y);
  }

  function onpointerdown(event: PointerEvent) {
    const p = toPlane(event);
    if (!p) return;
    // preventDefault keeps focus where it was: release a focused input so it shows the new value.
    (document.activeElement as HTMLElement | null)?.blur();
    const dz = Math.hypot(p[0] - z.re, p[1] - z.im);
    const dw = usesW ? Math.hypot(p[0] - w.re, p[1] - w.im) : Infinity;
    dragging = dw < dz ? "w" : "z";
    svg.setPointerCapture(event.pointerId);
    move(event);
    event.preventDefault();
  }

  function keyFor(which: "z" | "w") {
    return (event: KeyboardEvent) => {
      const step = event.shiftKey || !magnet ? 0.05 : 0.5;
      const d = { ArrowRight: [step, 0], ArrowLeft: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }[event.key];
      if (!d) return;
      event.preventDefault();
      const v = which === "z" ? z : w;
      const clampRound = (x: number) => Math.max(-R, Math.min(R, Math.round(x * 100) / 100));
      const next = cx(clampRound(v.re + d[0]!), clampRound(v.im + d[1]!));
      if (which === "z") z = next;
      else w = next;
    };
  }
</script>

<svg
  bind:this={svg}
  class="plot"
  viewBox="0 0 700 700"
  role="group"
  aria-label={label}
  {onpointerdown}
  onpointermove={move}
  onpointerup={() => (dragging = null)}
  onpointercancel={() => (dragging = null)}
>
  <PlaneGrid />
  <g class="cx-drawing" class:no-labels={!show.labels}>
    {#if show.unit}<circle cx={C} cy={C} r={S} fill="none" stroke="var(--muted)" stroke-width="1.3" stroke-dasharray="3 5" opacity=".85" />{/if}
    {#if show.polar && r > 1e-9}<circle cx={C} cy={C} r={r * S} fill="none" stroke="var(--z)" stroke-dasharray="2 6" opacity=".7" />{/if}

    {#if op === "conj" && res}
      <line {...seg(z, res)} stroke="var(--muted)" stroke-width="1.3" stroke-dasharray="4 5" />
      {#if show.polar && r > 1e-9}<path d={arc(zArc, 0, -th)} fill="none" stroke="var(--result)" stroke-width="2" />{/if}
      <Arrow to={pt(res)} color="var(--result)" width={4} />
      <text {...text(labelPos(res))} text-anchor={anchorFor(res)} fill="var(--result)">z̅</text>
    {:else if op === "sum" && res}
      <path d="M{X(0)} {Y(0)} L{X(z.re)} {Y(z.im)} L{X(res.re)} {Y(res.im)} L{X(w.re)} {Y(w.im)} Z" fill={tint("--result", 9)} />
      <line {...seg(z, res)} stroke="var(--w)" stroke-width="2" stroke-dasharray="6 5" />
      <line {...seg(w, res)} stroke="var(--z)" stroke-width="2" stroke-dasharray="6 5" />
      <Arrow to={pt(w)} color="var(--w)" width={4} />
      <Arrow to={pt(res)} color="var(--result)" width={4.5} />
      <text {...text(labelPos(w))} text-anchor={anchorFor(w)} fill="var(--w)">w</text>
      <text {...text(labelPos(res))} text-anchor={anchorFor(res)} fill="var(--result)">z + w</text>
    {:else if op === "prod" || op === "quot"}
      <Arrow to={pt(w)} color="var(--w)" width={4} />
      <text {...text(labelPos(w))} text-anchor={anchorFor(w)} fill="var(--w)">w</text>
      {#if res}
        {#if show.polar && r > 1e-9 && abs(w) > 1e-9}
          <path d={arc(34, 0, th)} fill="none" stroke="var(--z)" stroke-width="2.2" />
          <path d={arc(50, th, t2)} fill="none" stroke="var(--w)" stroke-width="2.6" />
          <path d={arc(66, 0, t2)} fill="none" stroke="var(--result)" stroke-width="1.4" />
        {/if}
        {#if show.polar && abs(res) > 1e-9}<circle cx={C} cy={C} r={abs(res) * S} fill="none" stroke="var(--result)" stroke-dasharray="2 6" opacity=".7" />{/if}
        <Arrow to={pt(res)} color="var(--result)" width={4.5} />
        <text {...text(labelPos(res))} text-anchor={anchorFor(res)} fill="var(--result)">{op === "prod" ? "z · w" : "z / w"}</text>
      {/if}
    {:else if op === "pow" && res}
      <polyline points={[cx(1, 0), ...powers].map((p) => `${X(p.re)},${Y(p.im)}`).join(" ")} fill="none" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="4 5" />
      {#each powers.slice(1, -1) as p, i (i)}
        <circle cx={X(p.re)} cy={Y(p.im)} r="5" fill="var(--z)" opacity=".75" />
        <text {...text(labelPos(p, 0.32), 15)} text-anchor={anchorFor(p)} fill="var(--z)">z{sup(i + 2)}</text>
      {/each}
      {#if show.polar && r > 1e-9}<path d={arc(66, 0, n * th)} fill="none" stroke="var(--result)" stroke-width="1.6" />{/if}
      <Arrow to={pt(res)} color="var(--result)" width={4.5} />
      <text {...text(labelPos(res))} text-anchor={anchorFor(res)} fill="var(--result)">z{sup(n)}</text>
    {:else if op === "root" && rootList.length}
      <circle cx={C} cy={C} r={rootR * S} fill="none" stroke="var(--result)" stroke-width="1.3" stroke-dasharray="5 5" />
      {#if n > 2}
        <polygon points={rootList.map((p) => `${X(p.re)},${Y(p.im)}`).join(" ")} fill={tint("--result", 12)} stroke="var(--result)" stroke-width="1.8" />
      {:else}
        <line {...seg(rootList[0]!, rootList[1]!)} stroke="var(--result)" stroke-width="1.8" stroke-linecap="round" />
      {/if}
      {#if show.polar}<path d={arc(Math.min(40, rootR * S * 0.6), 0, th / n)} fill="none" stroke="var(--result)" stroke-width="2.2" />{/if}
      {#each rootList as p, i (i)}
        {#if i}<line {...seg(cx(0, 0), p)} stroke="var(--result)" stroke-width="1.4" stroke-dasharray="3 4" stroke-linecap="round" />{:else}<Arrow to={pt(p)} color="var(--result)" width={4} />{/if}
        <circle cx={X(p.re)} cy={Y(p.im)} r={i ? 6 : 7.5} fill="var(--result)" />
        <text {...text(labelPos(p, 0.36), 17)} text-anchor={anchorFor(p)} fill="var(--result)">w{sub(i)}</text>
      {/each}
    {/if}

    {#if show.proj && r > 1e-9}
      <line {...seg(cx(0, 0), cx(z.re, 0))} stroke="var(--re)" stroke-width="6" stroke-linecap="round" />
      <line {...seg(cx(z.re, 0), z)} stroke="var(--im)" stroke-width="6" stroke-linecap="round" />
    {/if}
    {#if show.polar && op !== "prod" && op !== "quot" && r > 1e-9}
      <path d={sector(zArc, 0, th)} fill={tint("--z", 12)} />
      <path d={arc(zArc, 0, th)} fill="none" stroke="var(--z)" stroke-width="2" />
      <text {...text([(Math.cos(th / 2) * (zArc + 16)) / S, (Math.sin(th / 2) * (zArc + 16)) / S], 17)} text-anchor="middle" fill="var(--z)">θ</text>
    {/if}
    <Arrow to={pt(z)} color="var(--z)" width={4.5} />
    {#if show.proj && r > 1e-9}
      {#if Math.abs(z.re) > 0.3}<text {...text([z.re / 2, z.im >= 0 ? -0.33 : 0.33], 17)} text-anchor="middle" fill="var(--re)">a</text>{/if}
      {#if Math.abs(z.im) > 0.3}<text {...text([z.re + (z.re >= 0 ? 0.2 : -0.2), z.im / 2], 17)} text-anchor={z.re >= 0 ? "start" : "end"} fill="var(--im)">b</text>{/if}
    {/if}
    {#if show.polar && r > 0.6}
      <text {...text([Math.cos(rhoAngle) * r * 0.55, Math.sin(rhoAngle) * r * 0.55], 17)} text-anchor="middle" fill="var(--z)">ρ</text>
    {/if}
    <text {...text(labelPos(z), 22)} text-anchor={anchorFor(z)} fill="var(--z)">z</text>
  </g>

  {#if usesW}
    <g class="handle cx-handle" tabindex="0" role="slider" aria-label="w" aria-valuemin={-R} aria-valuemax={R} aria-valuenow={w.re} aria-valuetext={binOf(w, locale, false).s} onkeydown={keyFor("w")}>
      <circle cx={X(w.re)} cy={Y(w.im)} r="26" fill="transparent" />
      <circle cx={X(w.re)} cy={Y(w.im)} r="15" fill="none" stroke="var(--w)" stroke-width="2.4" opacity=".55" />
      <circle cx={X(w.re)} cy={Y(w.im)} r="7.5" fill="var(--w)" stroke="var(--surface)" stroke-width="2" />
    </g>
  {/if}
  <g class="handle cx-handle" tabindex="0" role="slider" aria-label="z" aria-valuemin={-R} aria-valuemax={R} aria-valuenow={z.re} aria-valuetext={binOf(z, locale, false).s} onkeydown={keyFor("z")}>
    <circle cx={X(z.re)} cy={Y(z.im)} r="26" fill="transparent" />
    <circle cx={X(z.re)} cy={Y(z.im)} r="15" fill="none" stroke="var(--z)" stroke-width="2.4" opacity=".55" />
    <circle cx={X(z.re)} cy={Y(z.im)} r="7.5" fill="var(--z)" stroke="var(--surface)" stroke-width="2" />
  </g>
</svg>
