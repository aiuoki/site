<script lang="ts">
  import { untrack } from "svelte";
  import { fracText, type Frac } from "../../../../lib/fraction";
  import { equals, type Matrix } from "../../../../lib/matrix";
  import { column, type Solution } from "../../../../lib/systems";
  import { interpolate } from "../../../../lib/text";
  import { combine, halves, matVec, paramName } from "./combine";
  import VecLabel from "./VecLabel.svelte";

  interface Props {
    A: Matrix;
    b: Frac[];
    sol: Solution;
    strings: Record<string, string>;
  }

  let { A, b, sol, strings: s }: Props = $props();

  const basis = $derived(sol.nullBasis);
  // Sliders in halves, one per vector of the basis.
  let steps = $state<number[]>([]);
  $effect.pre(() => {
    void basis;
    untrack(() => (steps = []));
  });
  const t = $derived(basis.map((_, i) => halves(steps[i] ?? 0)));

  // With a left inverse the only candidate is Lb, even when it fails.
  const base = $derived(sol.particular ?? (sol.case === "left" && sol.pseudo ? matVec(sol.pseudo, b) : null));
  const X = $derived(base ? combine(base, basis, t) : null);
  const AX = $derived(X ? matVec(A, X) : null);
  const works = $derived(AX !== null && equals(column(AX), column(b)));
  const sub = (i: number) => (basis.length === 1 ? undefined : String(i + 1));
</script>

<div class="block">
  <span class="eyebrow">{s.particularTitle}</span>
  {#if base}
    <VecLabel sym="X" sub="p" vec={base} color="--csc" />
    <p class="hint">{sol.case === "left" ? s.leftCandidate : s.particularHint}</p>
  {/if}
</div>

<div class="block">
  <span class="eyebrow">{s.nullTitle}</span>
  {#if basis.length === 0}
    <p class="hint">{s.nullZero}</p>
  {:else}
    <div class="vecs">
      {#each basis as v, i (i)}<VecLabel sym="v" sub={sub(i)} vec={v} color="--cos" />{/each}
    </div>
    <p class="hint">{s.nullHint}</p>
  {/if}
</div>

{#if basis.length > 0 && base}
  <div class="block">
    <span class="eyebrow">{s.chosenTitle}</span>
    <p class="hint">{s.chosenHint}</p>
    {#each basis as _, i (i)}
      {@const name = paramName(i, basis.length)}
      <label class="slider" style:--rc="var(--cos)">
        <span class="pn"><i>{name}</i> = {fracText(t[i]!)}</span>
        <input
          type="range"
          min="-12"
          max="12"
          step="1"
          aria-label={interpolate(s.paramLabel, { name })}
          bind:value={steps[i]}
        />
      </label>
    {/each}
  </div>
{/if}

{#if X && AX}
  <div class="block">
    <span class="eyebrow">{s.checkTitle}</span>
    <div class="vecs">
      <VecLabel sym="X" vec={X} color="--g" />
      <VecLabel sym="AX" vec={AX} color="--g" />
      <VecLabel sym="b" vec={b} color="--b" />
    </div>
    <p class={works ? "verdict ok" : "verdict res-warn"}>
      {works ? s.checkOk : s.checkBad}
    </p>
    {#if sol.case === "left"}<p class="hint">{sol.consistent ? s.leftIn : s.leftOut}</p>{/if}
  </div>
{/if}

<style>
  .block { display: flex; flex-direction: column; gap: 8px; padding-top: 14px; margin-top: 14px; border-top: 1px solid var(--line); }
  .block:first-child { padding-top: 0; margin-top: 0; border-top: 0; }
  .vecs { display: flex; flex-wrap: wrap; gap: 10px 22px; }
  p { margin: 0; }
  .slider { display: grid; grid-template-columns: 8.5ch minmax(0, 1fr); gap: 10px; align-items: center; }
  .pn { font-family: var(--f-math); font-size: 18px; white-space: nowrap; }
  .verdict { font-size: 14px; }
  .verdict.ok { color: var(--csc); }
  .verdict.res-warn { margin-top: 0; }
  .ok { font-family: var(--f-body); }
</style>
