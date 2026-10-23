<script lang="ts">
  import { fracText, type Frac } from "../../../../lib/fraction";

  interface Props {
    matrix: Frac[][];
    // Name shown before the matrix ("A", "Aᵗ"...); omitted when empty.
    name?: string;
    color?: string;
    // Rows, columns or single cells to highlight (0-based).
    rows?: number[];
    cols?: number[];
    cells?: [number, number][];
    // Draw a vertical bar before this column, for [A | I] or [A | b].
    divider?: number;
  }

  let { matrix, name, color, rows = [], cols = [], cells = [], divider }: Props = $props();
  const n = $derived(matrix[0]?.length ?? 0);
  const lit = (i: number, j: number) => rows.includes(i) || cols.includes(j) || cells.some(([r, c]) => r === i && c === j);
</script>

<div class="mview" style:--mc={color ? `var(${color})` : undefined}>
  {#if name}<span class="mname"><i>{name}</i> =</span>{/if}
  <div class="mgrid" style:--n={n}>
    {#each matrix as row, i (i)}
      {#each row as x, j (j)}
        <span class:lit={lit(i, j)} class:bar={divider !== undefined && j === divider}>{fracText(x)}</span>
      {/each}
    {/each}
  </div>
</div>

<style>
  .mview { display: inline-flex; align-items: center; gap: 10px; max-width: 100%; }
  .mname { font-family: var(--f-math); font-size: 20px; color: var(--mc, var(--fg)); white-space: nowrap; }
  .mgrid {
    display: grid; grid-template-columns: repeat(var(--n), auto); gap: 2px 4px; overflow-x: auto; scrollbar-width: none;
    padding: 4px 8px; border-left: 2px solid var(--mc, var(--fg)); border-right: 2px solid var(--mc, var(--fg)); border-radius: 6px;
  }
  .mgrid::-webkit-scrollbar { display: none; }
  span:not(.mname) {
    min-width: 3ch; padding: 3px 6px; text-align: center; font-family: var(--f-math); font-size: 18px;
    border-radius: 6px; font-variant-numeric: tabular-nums;
  }
  .lit { background: color-mix(in srgb, var(--mc, var(--g)) 22%, transparent); color: var(--fg); }
  .bar { border-left: 1.5px solid var(--muted); border-radius: 0 6px 6px 0; }
</style>
