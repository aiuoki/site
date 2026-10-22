<script lang="ts">
  import { quadrant } from "../../../lib/trig";
  import { circle } from "./state.svelte";

  // labels[0..3] are quadrants I..IV.
  let { labels }: { labels: string[] } = $props();

  const NAMES = ["", "I · 0°–90°", "II · 90°–180°", "III · 180°–270°", "IV · 270°–360°"];
  // Laid out like the plane: II I / III IV.
  const ORDER = [2, 1, 3, 4] as const;
  const current = $derived(quadrant(circle.deg));
</script>

<div class="quads">
  {#each ORDER as q (q)}
    <div class="qd demo" class:on={current === q} data-demo="signs" role="button" tabindex="0">
      <b>{NAMES[q]}</b>
      <span>{labels[q - 1]}</span>
    </div>
  {/each}
</div>
