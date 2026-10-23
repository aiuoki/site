<script lang="ts">
  import type { Matrix } from "../../../lib/matrix";
  import MatrixEditor from "./shared/MatrixEditor.svelte";
  import { PRESETS, NOTES_EXAMPLE } from "./types/presets";
  import { typeReport } from "./types/report";
  import SplitCard from "./types/SplitCard.svelte";
  import TransposeCard from "./types/TransposeCard.svelte";
  import TypeList from "./types/TypeList.svelte";

  let { strings: s }: { strings: Record<string, string>; locale: string } = $props();

  let A = $state<Matrix>(NOTES_EXAMPLE());
  let pair = $state<[number, number] | null>([0, 1]);

  const report = $derived(typeReport(A));
</script>

<section class="app">
  <div class="stage">
    <div class="card">
      <span class="eyebrow">{s.yourMatrix}</span>
      <div class="controls first">
        <MatrixEditor bind:value={A} name="A" strings={s} color="--a" />
        <div class="angle-block">
          <span class="eyebrow">{s.presets}</span>
          <div class="quick">
            {#each PRESETS as preset (preset.label)}
              <button type="button" onclick={() => ((A = preset.matrix()), (pair = [0, 1]))}>{s[preset.label]}</button>
            {/each}
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <span class="eyebrow">{s.transposeTitle}</span>
      <div class="controls">
        <TransposeCard matrix={A} bind:pair strings={s} />
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="card">
      <span class="eyebrow">{s.typesTitle}</span>
      <TypeList rows={report} strings={s} />
      <p class="hint">{s.hintTypes}</p>
    </div>
    <div class="card">
      <span class="eyebrow">{s.splitTitle}</span>
      <div class="controls">
        <SplitCard matrix={A} strings={s} />
      </div>
    </div>
  </div>
</section>
