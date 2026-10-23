<script lang="ts">
  import { fracText, isZero } from "../../../../lib/fraction";
  import { cols, rows, type Matrix } from "../../../../lib/matrix";
  import { interpolate } from "../../../../lib/text";
  import MatrixView from "../shared/MatrixView.svelte";
  import { maxRank, type Run } from "./run";

  interface Props {
    run: Run;
    matrix: Matrix;
    strings: Record<string, string>;
  }

  let { run, matrix, strings: s }: Props = $props();

  const m = $derived(rows(matrix));
  const n = $derived(cols(matrix));
</script>

<div class="readout">
  {#if run.mode === "echelon"}
    <div class="big">{interpolate(s.rankLine, { r: run.rank })}</div>
    <div class="sub">{interpolate(s.rankSub, { r: run.rank })}</div>
    <div class="sub">{interpolate(s.rankBound, { m, n, k: maxRank(matrix) })}</div>
  {:else if run.notSquare}
    <div class="sub">{interpolate(s.noInvNotSquare, { m, n })}</div>
  {:else if run.inverse}
    <MatrixView matrix={run.inverse} name="A⁻¹" color="--g" />
    <div class="sub">{s.inverseFound}</div>
    <div class="sub">{run.inverseChecks ? s.inverseCheckOk : s.inverseCheckBad}</div>
  {:else}
    <div class="sub">{interpolate(s.noInvRank, { r: run.rank, n })}</div>
  {/if}
  {#if run.det}
    <div class="det">{interpolate(s.detLine, { d: fracText(run.det) })}</div>
    <div class="sub">{isZero(run.det) ? s.detZero : s.detNonZero}</div>
  {/if}
</div>

<style>
  .det { font-family: var(--f-math); font-size: 20px; margin-top: 6px; }
</style>
