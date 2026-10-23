<script lang="ts">
  import { equals, splitSymmetric, sum, type Matrix } from "../../../../lib/matrix";
  import MatrixView from "../shared/MatrixView.svelte";

  let { matrix, strings: s }: { matrix: Matrix; strings: Record<string, string> } = $props();

  const parts = $derived(splitSymmetric(matrix));
  const joined = $derived(parts ? sum(parts.symmetric, parts.antisymmetric) : null);
  const ok = $derived(joined !== null && equals(joined, matrix));
</script>

{#if parts && joined}
  <p class="def mr"><i>S</i> = (<i>A</i> + <i>A</i><sup>t</sup>) / 2 &nbsp; <i>K</i> = (<i>A</i> − <i>A</i><sup>t</sup>) / 2</p>
  <div class="eq">
    <MatrixView matrix={parts.symmetric} name="S" color="--a" />
    <span class="op mr">+</span>
    <MatrixView matrix={parts.antisymmetric} name="K" color="--b" />
    <span class="op mr">=</span>
    <MatrixView matrix={joined} name="A" color="--g" />
  </div>
  <p class="check" class:ok>{ok ? s.splitOk : s.splitBad}</p>
  <p class="hint">{s.splitHint}</p>
{:else}
  <p class="hint">{s.splitNeedSquare}</p>
{/if}

<style>
  .def { font-size: 16px; margin: 0 0 12px; }
  .eq { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; }
  .op { font-size: 22px; color: var(--muted); }
  .check { margin: 12px 0 0; font-size: 14px; color: var(--sec); }
  .check.ok { color: var(--csc); }
  .hint { margin: 8px 0 0; }
</style>
