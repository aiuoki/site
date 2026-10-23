<script lang="ts">
  import type { Frac } from "../../../../lib/fraction";
  import { column } from "../../../../lib/systems";
  import MatrixView from "../shared/MatrixView.svelte";

  interface Props {
    // Symbol and optional subscript, e.g. "X" and "p" for Xp.
    sym: string;
    sub?: string;
    vec: Frac[];
    color?: string;
  }

  let { sym, sub, vec, color }: Props = $props();
</script>

<div class="vl" style:--vc={color ? `var(${color})` : "var(--fg)"}>
  <span class="nm"><i>{sym}</i>{#if sub}<sub>{sub}</sub>{/if} =</span>
  <MatrixView matrix={column(vec)} {color} />
</div>

<style>
  .vl { display: inline-flex; align-items: center; gap: 8px; }
  .nm { font-family: var(--f-math); font-size: 20px; color: var(--vc); white-space: nowrap; }
  sub { font-size: 0.62em; }
</style>
