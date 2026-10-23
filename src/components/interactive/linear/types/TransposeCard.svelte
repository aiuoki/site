<script lang="ts">
  import { fracText } from "../../../../lib/fraction";
  import { transpose, type Matrix } from "../../../../lib/matrix";
  import { interpolate } from "../../../../lib/text";
  import MatrixView from "../shared/MatrixView.svelte";
  import { entryName } from "./entry";

  interface Props {
    matrix: Matrix;
    // Entry of A (row, column; 0-based) whose mirrored position is shown.
    pair: [number, number] | null;
    strings: Record<string, string>;
  }

  let { matrix, pair = $bindable(), strings: s }: Props = $props();

  const t = $derived(transpose(matrix));
  // The pair may fall outside A after resizing it.
  const live = $derived(pair && pair[0] < matrix.length && pair[1] < (matrix[0]?.length ?? 0) ? pair : null);
  const info = $derived.by(() => {
    if (!live) return "";
    const [i, j] = live;
    const vars = { a: entryName("a", i, j), v: fracText(matrix[i]![j]!), r: j + 1, c: i + 1, i: i + 1, j: j + 1 };
    return interpolate(i === j ? s.pairDiagonal! : s.pairInfo!, vars);
  });
</script>

<div class="views">
  <MatrixView {matrix} name="A" color="--a" cells={live ? [live] : []} />
  <div class="tview" role="group" aria-label={s.transposeGrid}>
    <span class="mname"><i>A</i><sup>t</sup> =</span>
    <div class="tgrid" style:--n={t[0]?.length ?? 0}>
      {#each t as row, r (r)}
        {#each row as x, c (c)}
          <button
            type="button"
            class:lit={live !== null && live[0] === c && live[1] === r}
            aria-label={interpolate(s.transposeCell ?? "", { a: entryName("a", c, r), r: r + 1, c: c + 1, v: fracText(x) })}
            onpointerenter={() => (pair = [c, r])}
            onfocus={() => (pair = [c, r])}
            onclick={() => (pair = [c, r])}>{fracText(x)}</button
          >
        {/each}
      {/each}
    </div>
  </div>
</div>
<p class="hint">{s.transposeLead}</p>
<p class="pair" aria-live="polite">{info || s.pairNone}</p>

<style>
  .views { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 24px; }
  .tview { display: inline-flex; align-items: center; gap: 10px; max-width: 100%; }
  .mname { font-family: var(--f-math); font-size: 20px; color: var(--b); white-space: nowrap; }
  .tgrid {
    display: grid; grid-template-columns: repeat(var(--n), auto); gap: 2px 4px; overflow-x: auto; scrollbar-width: none;
    padding: 4px 8px; border-left: 2px solid var(--b); border-right: 2px solid var(--b); border-radius: 6px;
  }
  .tgrid::-webkit-scrollbar { display: none; }
  button {
    min-width: 3ch; padding: 3px 6px; text-align: center; font-family: var(--f-math); font-size: 18px; cursor: pointer;
    border: 0; border-radius: 6px; background: transparent; color: var(--fg); font-variant-numeric: tabular-nums;
  }
  button:hover, button.lit { background: color-mix(in srgb, var(--b) 22%, transparent); }
  .pair { margin: 8px 0 0; font-family: var(--f-math); font-size: 16px; min-height: 2.6em; }
  .hint { margin: 10px 0 0; }
</style>
