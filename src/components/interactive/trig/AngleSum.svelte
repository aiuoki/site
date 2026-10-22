<script lang="ts">
  import Chip from "../../ui/Chip.svelte";
  import { fmtDeg } from "../../../lib/format";
  import AngleSumPanel from "./AngleSumPanel.svelte";
  import AngleSumPlot from "./AngleSumPlot.svelte";
  import { sum } from "./state.svelte";
  import type { TrigIslandProps } from "./types";

  let { strings, notation, locale, seeDemo }: TrigIslandProps = $props();

  let labels = $state(true);
  let magnet = $state(true);
  let projections = $state(true);

  const legend = $derived([
    ["--a", "α"],
    ["--b", strings.legB],
    ["--g", "α ± β"],
    ["--cos", `${notation.cos}(α ± β)`],
    ["--sin", `${notation.sin}(α ± β)`],
  ]);
</script>

<section class="app">
  <div class="stage">
    <div class="canvas">
      <AngleSumPlot bind:a={sum.a} bind:b={sum.b} op={sum.op} unit={sum.unit} {labels} {projections} {magnet} label={strings.result} angleText={(d) => `${fmtDeg(d, locale)}°`} />
    </div>
    <div class="legend">
      {#each legend as [color, text] (color)}
        <span style:--sw="var({color})"><i></i>{text}</span>
      {/each}
    </div>
    <div class="chips">
      <Chip label={strings.proj} bind:checked={projections} />
      <Chip label={strings.labels} bind:checked={labels} />
      <Chip label={strings.snap} bind:checked={magnet} />
    </div>
  </div>
  <AngleSumPanel bind:a={sum.a} bind:b={sum.b} bind:op={sum.op} bind:unit={sum.unit} {strings} {notation} {locale} {seeDemo} />
</section>
