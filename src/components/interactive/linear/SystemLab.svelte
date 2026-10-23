<script lang="ts">
  import { ZERO, type Frac } from "../../../lib/fraction";
  import { fromNumbers, rows, cols, type Matrix } from "../../../lib/matrix";
  import { solve } from "../../../lib/systems";
  import { interpolate } from "../../../lib/text";
  import MatrixEditor from "./shared/MatrixEditor.svelte";
  import MatrixView from "./shared/MatrixView.svelte";
  import CaseTable from "./system/CaseTable.svelte";
  import { NOTES, PRESETS, bColumn } from "./system/presets";
  import SolutionPanel from "./system/SolutionPanel.svelte";

  let { strings: s }: { strings: Record<string, string>; locale: string } = $props();

  let A = $state<Matrix>(fromNumbers(NOTES.A));
  let B = $state<Matrix>(bColumn(NOTES.b));

  // b always has one row per equation.
  $effect.pre(() => {
    if (B.length !== A.length) B = A.map((_, i) => B[i] ?? [ZERO]);
  });
  const b = $derived<Frac[]>(A.map((_, i) => B[i]?.[0] ?? ZERO));

  const sol = $derived(solve(A, b));
  const m = $derived(rows(A));
  const n = $derived(cols(A));
  const k = $derived(sol.nullBasis.length);
  const geometry = $derived(k <= 2 ? s[`nulGeom${k}`]! : interpolate(s.nulGeomN, { k }));
  const pseudoNote = $derived({ both: s.pseudoBoth, right: s.pseudoRight, left: s.pseudoLeft, none: s.pseudoNone }[sol.case]!);
  const pseudoName = $derived({ both: "A⁻¹", right: "R", left: "L", none: "" }[sol.case]!);
  const pseudoFormula = $derived({ both: "", right: "R = Aᵗ(AAᵗ)⁻¹", left: "L = (AᵗA)⁻¹Aᵗ", none: "" }[sol.case]!);

  function load(index: number) {
    const preset = PRESETS[index]!;
    A = fromNumbers(preset.A);
    B = bColumn(preset.b);
  }
</script>

<section class="app">
  <div class="stage">
    <div class="card">
      <span class="eyebrow">{s.editorTitle}</span>
      <div class="body">
        <MatrixEditor bind:value={A} name="A" strings={s} color="--a" maxRows={3} maxCols={4} />
        <MatrixEditor bind:value={B} name="b" strings={s} color="--b" resizable={false} />
        <span class="eyebrow">{s.presetsTitle}</span>
        <div class="quick">
          {#each PRESETS as preset, i (preset.key)}
            <button type="button" onclick={() => load(i)}>{s[preset.key]}</button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="card">
      <div class="readout">
        <div class="big">{interpolate(s.rankLine, { r: sol.rank })}</div>
        <div class="sub">{interpolate(s.sizeLine, { m, n })}</div>
        <div class="nul">{interpolate(s.nulLine, { n, r: sol.rank, k })}</div>
        <div class="sub">{geometry}</div>
      </div>
    </div>

    <div class="card">
      <span class="eyebrow">{s.caseTitle}</span>
      <div class="body"><CaseTable current={sol.case} strings={s} /></div>
    </div>

    <div class="card">
      <span class="eyebrow">{s.pseudoTitle}</span>
      <div class="body">
        <p class="hint">{pseudoNote}</p>
        {#if sol.pseudo}
          {#if pseudoFormula}<div class="formula">{pseudoFormula}</div>{/if}
          <MatrixView matrix={sol.pseudo} name={pseudoName} color="--g" />
        {:else}
          <p class="hint">{sol.consistent ? s.noneConsistent : s.noneInconsistent}</p>
        {/if}
      </div>
    </div>

    {#if sol.case !== "none"}
      <div class="card"><SolutionPanel {A} {b} {sol} strings={s} /></div>
    {/if}
  </div>
</section>

<style>
  .body { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
  .nul { font-family: var(--f-math); font-size: 20px; margin-top: 6px; }
  .formula { font-family: var(--f-math); font-size: 20px; }
  p { margin: 0; }
</style>
