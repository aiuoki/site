<script lang="ts">
  import { C, X, Y } from "../../../lib/complex-plot";
  import { minus } from "../../../lib/format";

  const lines = Array.from({ length: 23 }, (_, i) => -5.5 + i * 0.5);
  const ticks = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
  const imLabel = (i: number) => (i === 1 ? "i" : i === -1 ? "−i" : `${minus(String(i))}i`);
</script>

<g aria-hidden="true">
  {#each lines as i (i)}
    <line x1={X(i)} y1="0" x2={X(i)} y2="700" stroke="var(--grid)" stroke-width={Number.isInteger(i) ? 1.2 : 0.6} />
    <line x1="0" y1={Y(i)} x2="700" y2={Y(i)} stroke="var(--grid)" stroke-width={Number.isInteger(i) ? 1.2 : 0.6} />
  {/each}
  <line x1="8" y1={C} x2="692" y2={C} stroke="var(--axis)" stroke-width="1.4" />
  <line x1={C} y1="692" x2={C} y2="8" stroke="var(--axis)" stroke-width="1.4" />
  <path d="M692 {C} l-10 -5 v10 z" fill="var(--axis)" />
  <path d="M{C} 8 l-5 10 h10 z" fill="var(--axis)" />
  <text x="684" y={C - 12} text-anchor="end" fill="var(--muted)" font-size="17">Re</text>
  <text x={C + 12} y="26" fill="var(--muted)" font-size="17">Im</text>
  {#each ticks as i (i)}
    <line x1={X(i)} y1={C - 4} x2={X(i)} y2={C + 4} stroke="var(--axis)" />
    <line x1={C - 4} y1={Y(i)} x2={C + 4} y2={Y(i)} stroke="var(--axis)" />
    <text x={X(i)} y={C + 20} text-anchor="middle" fill="var(--muted)" font-size="13">{minus(String(i))}</text>
    <text x={C - 9} y={Y(i) + 4} text-anchor="end" fill="var(--muted)" font-size="13" font-style="italic">{imLabel(i)}</text>
  {/each}
  <circle cx={C} cy={C} r="3.5" fill="var(--axis)" />
</g>
