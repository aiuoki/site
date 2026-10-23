<script lang="ts">
  import { readCell, type Outcome } from "./ops";

  let { out, sel, strings: s }: { out: Outcome; sel: [number, number]; strings: Record<string, string> } = $props();

  const reading = $derived(out.ok ? readCell(out, sel[0], sel[1]) : null);
</script>

{#if reading}
  <div class="fx" aria-live="polite">
    <div class="f">{reading.symbolic}</div>
    <div class="s">{reading.numeric}</div>
    <div class="r"><span>= {reading.value}</span></div>
  </div>
  <p class="hint">{s.cellHint}</p>
{:else}
  <p class="hint">{s.cellNone}</p>
{/if}

<style>
  .fx { padding-top: 0; }
  .hint { margin: 8px 0 0; }
</style>
