<script lang="ts">
  import { untrack } from "svelte";
  import Chip from "../../ui/Chip.svelte";
  import Segmented from "../../ui/Segmented.svelte";
  import { fromNumbers, type Matrix } from "../../../lib/matrix";
  import { interpolate } from "../../../lib/text";
  import MatrixEditor from "./shared/MatrixEditor.svelte";
  import MatrixView from "./shared/MatrixView.svelte";
  import PlaneTransform from "./rank/PlaneTransform.svelte";
  import { DEFAULT_MATRIX, PRESETS } from "./rank/presets";
  import RankResult from "./rank/RankResult.svelte";
  import { buildRun, type Mode } from "./rank/run";
  import { rowOpText } from "./rank/row-op-text";
  import StepControls from "./rank/StepControls.svelte";

  let { strings: s, locale }: { strings: Record<string, string>; locale: string } = $props();

  let A = $state<Matrix>(DEFAULT_MATRIX());
  let mode = $state<Mode>("echelon");
  let reduced = $state(false);
  let step = $state(0);

  const run = $derived(buildRun(A, mode, reduced));
  const last = $derived(run.ops.length);
  const at = $derived(Math.min(step, last));
  const op = $derived(at > 0 ? run.ops[at - 1]! : null);
  // Rows touched by the operation just done; at the end, the pivots.
  const lit = $derived.by(() => {
    if (at === last) return { rows: [], cells: run.pivots };
    if (!op) return { rows: [], cells: [] };
    return { rows: op.kind === "swap" ? [op.i, op.j] : [op.i], cells: [] };
  });

  // A new matrix or a new mode starts the replay again.
  $effect.pre(() => {
    void [A, mode, reduced];
    untrack(() => (step = 0));
  });
</script>

<section class="app">
  <div class="stage">
    <div class="card">
      <span class="eyebrow">{s.editorTitle}</span>
      <div class="body">
        <MatrixEditor bind:value={A} name="A" strings={s} color="--a" />
        <span class="eyebrow">{s.presetsTitle}</span>
        <div class="quick">
          {#each PRESETS as preset (preset.key)}
            <button type="button" onclick={() => (A = fromNumbers(preset.data))}>{s[preset.key]}</button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="card">
      <div class="row">
        <Segmented
          label={s.modeLabel}
          options={[{ value: "echelon", label: s.modeEchelon ?? "" }, { value: "inverse", label: s.modeInverse ?? "" }]}
          bind:value={mode}
        />
        {#if mode === "echelon"}<Chip label={s.reduced ?? ""} bind:checked={reduced} />{/if}
      </div>
      <div class="body">
        <span class="eyebrow">{s.stepsTitle}</span>
        <div class="matrix" role="group" aria-label={s.stepMatrix}>
          <MatrixView matrix={run.matrices[at]!} color="--a" rows={lit.rows} cells={lit.cells} divider={run.divider} />
        </div>
        <div class="op" aria-live="polite">
          {#if op}
            <span class="text">{rowOpText(op, s.opLetter!)}</span>
            <span class="hint">{op.kind === "swap" ? s.opSwap : op.kind === "scale" ? s.opScale : s.opAdd}</span>
          {:else}
            <span class="hint">{run.notSquare ? interpolate(s.noInvNotSquare, { m: A.length, n: A[0]?.length ?? 0 }) : last === 0 ? s.noSteps : s.stepStart}</span>
          {/if}
        </div>
        {#if last > 0}<StepControls step={at} onstep={(to) => (step = to)} {last} strings={s} />{/if}
        {#if at === last && run.pivots.length > 0}<p class="hint">{s.pivotNote}</p>{/if}
      </div>
    </div>

    <div class="card">
      <span class="eyebrow">{s.resultTitle}</span>
      <RankResult {run} matrix={A} strings={s} />
    </div>

    {#if A.length === 2 && A[0]?.length === 2}
      <div class="card">
        <span class="eyebrow">{s.planeTitle}</span>
        <PlaneTransform matrix={A} strings={s} {locale} />
      </div>
    {/if}
  </div>
</section>

<style>
  .body { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
  .row + .body { margin-top: 16px; }
  .matrix { overflow-x: auto; scrollbar-width: none; padding: 4px 0; }
  .matrix::-webkit-scrollbar { display: none; }
  .op { display: flex; flex-direction: column; gap: 2px; min-height: 3.2em; }
  .op .text { font-family: var(--f-math); font-size: 22px; }
  p { margin: 0; }
</style>
