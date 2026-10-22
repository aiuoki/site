<script lang="ts">
  import Chip from "../../ui/Chip.svelte";
  import { fmtDeg } from "../../../lib/format";
  import { RATIOS, type AngleUnit, type Ratio } from "../../../lib/trig";
  import { circle } from "./state.svelte";
  import type { TrigIslandProps } from "./types";
  import UnitCirclePanel from "./UnitCirclePanel.svelte";
  import UnitCirclePlot from "./UnitCirclePlot.svelte";

  let { strings, notation, locale }: TrigIslandProps = $props();

  let unit = $state<AngleUnit>("deg");
  let labels = $state(true);
  let magnet = $state(true);
  let hovered = $state<Ratio | null>(null);
  const show = $state<Record<Ratio, boolean>>({ sin: true, cos: true, tan: true, cot: true, sec: true, csc: true });
</script>

<section class="app">
  <div class="stage">
    <div class="canvas">
      <UnitCirclePlot
        bind:deg={circle.deg}
        {unit}
        {show}
        {labels}
        {magnet}
        {hovered}
        names={notation}
        angleLabel={strings.angle}
        valueText={`${fmtDeg(circle.deg, locale)}°`}
      />
    </div>
    <div class="chips">
      {#each RATIOS as k (k)}
        <Chip label={notation[k]} color="--{k}" bind:checked={show[k]} />
      {/each}
      <Chip label={strings.labels} bind:checked={labels} />
      <Chip label={strings.snap} bind:checked={magnet} />
    </div>
  </div>
  <UnitCirclePanel bind:deg={circle.deg} bind:unit bind:hovered {strings} {notation} {locale} />
</section>
