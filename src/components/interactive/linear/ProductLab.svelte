<script lang="ts">
  import { parseFrac } from "../../../lib/fraction";
  import type { Matrix } from "../../../lib/matrix";
  import MatrixEditor from "./shared/MatrixEditor.svelte";
  import CellReading from "./product/CellReading.svelte";
  import OperationPicker from "./product/OperationPicker.svelte";
  import { compute, type Mode } from "./product/ops";
  import OrderCard from "./product/OrderCard.svelte";
  import { DEFAULT_A, DEFAULT_B, PRESETS } from "./product/presets";
  import ResultView from "./product/ResultView.svelte";

  let { strings: s }: { strings: Record<string, string>; locale: string } = $props();

  let A = $state<Matrix>(DEFAULT_A());
  let B = $state<Matrix>(DEFAULT_B());
  let mode = $state<Mode>("AB");
  let kText = $state("2");
  let selected = $state<[number, number]>([0, 0]);

  const k = $derived(parseFrac(kText));
  const out = $derived(mode === "trace" ? null : compute(mode, A, B, k));
  // The chosen entry may fall outside a smaller result.
  const sel = $derived.by<[number, number]>(() => {
    const result = out?.ok ? out.result : null;
    if (!result) return [0, 0];
    return [Math.min(selected[0], result.length - 1), Math.min(selected[1], (result[0]?.length ?? 1) - 1)];
  });
  const load = (i: number) => {
    A = PRESETS[i]!.A();
    B = PRESETS[i]!.B();
    selected = [0, 0];
  };
</script>

<section class="app">
  <div class="stage">
    <div class="card">
      <span class="eyebrow">{s.matricesTitle}</span>
      <div class="controls first">
        <MatrixEditor bind:value={A} name="A" strings={s} color="--a" />
        {#if mode !== "scale"}<MatrixEditor bind:value={B} name="B" strings={s} color="--b" />{/if}
        <div class="angle-block">
          <span class="eyebrow">{s.presets}</span>
          <div class="quick">
            {#each PRESETS as preset, i (preset.label)}
              <button type="button" onclick={() => load(i)}>{s[preset.label]}</button>
            {/each}
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <span class="eyebrow">{s.operation}</span>
      <div class="controls">
        <OperationPicker bind:mode bind:kText kValid={k !== null} strings={s} />
      </div>
    </div>
  </div>

  <div class="panel">
    {#if out}
      <div class="card">
        <span class="eyebrow">{s.resultTitle}</span>
        <ResultView {out} {sel} onselect={(cell) => (selected = cell)} strings={s} />
      </div>
      {#if out.ok}
        <div class="card">
          <span class="eyebrow">{s.entryTitle}</span>
          <div class="controls">
            <CellReading {out} {sel} strings={s} />
          </div>
        </div>
      {/if}
      {#if mode === "AB" || mode === "BA"}
        <div class="card">
          <span class="eyebrow">{s.orderTitle}</span>
          <div class="controls">
            <OrderCard {A} {B} view="order" strings={s} />
          </div>
        </div>
      {/if}
    {:else}
      <div class="card">
        <span class="eyebrow">{s.traceTitle}</span>
        <div class="controls first">
          <OrderCard {A} {B} view="trace" strings={s} />
        </div>
      </div>
    {/if}
  </div>
</section>
