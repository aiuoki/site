<script lang="ts">
  import { C, S, SIZE, u, v } from "../../../lib/plot";
  import { rad, type AngleUnit } from "../../../lib/trig";

  let { unit }: { unit: AngleUnit } = $props();

  const ticks = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
  const dots = Array.from({ length: 24 }, (_, i) => i * 15).filter((a) => !(a % 30) || !(a % 45));
  const axisText = { deg: ["0° · 360°", "90°", "180°", "270°"], rad: ["0", "π/2", "±π", "−π/2"] };
  const axisPos = [
    { x: u(1) + 8, y: C + 24, a: "start" },
    { x: C + 10, y: v(1) - 10, a: "start" },
    { x: u(-1) - 8, y: C - 10, a: "end" },
    { x: C + 10, y: v(-1) + 26, a: "start" },
  ] as const;
  const coords = [
    { t: "(1, 0)", x: u(1) + 8, y: C + 42, a: "start" },
    { t: "(0, 1)", x: C - 10, y: v(1) - 10, a: "end" },
    { t: "(−1, 0)", x: u(-1) - 8, y: C + 22, a: "end" },
    { t: "(0, −1)", x: C - 10, y: v(-1) + 26, a: "end" },
  ] as const;
</script>

<g aria-hidden="true">
  {#each ticks as i (i)}
    <line x1={u(i)} y1="0" x2={u(i)} y2={SIZE} stroke="var(--grid)" stroke-width="1" />
    <line x1="0" y1={v(i)} x2={SIZE} y2={v(i)} stroke="var(--grid)" stroke-width="1" />
  {/each}
  <line x1={u(1)} y1="0" x2={u(1)} y2={SIZE} stroke="var(--muted)" stroke-dasharray="2 5" opacity=".8" />
  <line x1="0" y1={v(1)} x2={SIZE} y2={v(1)} stroke="var(--muted)" stroke-dasharray="2 5" opacity=".8" />
  <line x1="8" y1={C} x2="692" y2={C} stroke="var(--axis)" stroke-width="1.4" />
  <line x1={C} y1="692" x2={C} y2="8" stroke="var(--axis)" stroke-width="1.4" />
  <path d="M692 {C} l-10 -5 v10 z" fill="var(--axis)" />
  <path d="M{C} 8 l-5 10 h10 z" fill="var(--axis)" />
  <text x="684" y={C - 12} text-anchor="end" fill="var(--muted)" font-size="18" font-style="italic">x</text>
  <text x={C + 12} y="24" fill="var(--muted)" font-size="18" font-style="italic">y</text>
  {#each ticks.filter((i) => i !== 0) as i (i)}
    <line x1={u(i)} y1={C - 4} x2={u(i)} y2={C + 4} stroke="var(--axis)" />
    <line x1={C - 4} y1={v(i)} x2={C + 4} y2={v(i)} stroke="var(--axis)" />
    {#if Math.abs(i) === 2}
      <text x={u(i)} y={C + 20} text-anchor="middle" fill="var(--muted)" font-size="14">{i < 0 ? "−2" : "2"}</text>
      <text x={C - 10} y={v(i) + 5} text-anchor="end" fill="var(--muted)" font-size="14">{i < 0 ? "−2" : "2"}</text>
    {/if}
  {/each}
  <circle cx={C} cy={C} r={S} fill="none" stroke="var(--axis)" stroke-width="1.3" opacity=".7" />
  {#each dots as a (a)}
    <circle cx={u(Math.cos(rad(a)))} cy={v(Math.sin(rad(a)))} r="2.6" fill="var(--muted)" />
  {/each}
  {#each axisPos as p, i (i)}
    <text x={p.x} y={p.y} text-anchor={p.a} fill="var(--fg)" font-size="20" font-weight="600">{axisText[unit][i]}</text>
  {/each}
  {#each coords as p (p.t)}
    <text x={p.x} y={p.y} text-anchor={p.a} fill="var(--muted)" font-size="13">{p.t}</text>
  {/each}
  <circle cx={C} cy={C} r="4" fill="var(--axis)" />
</g>
