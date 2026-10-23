<script lang="ts">
  import type { Mode } from "./ops";

  interface Props {
    mode: Mode;
    kText: string;
    kValid: boolean;
    strings: Record<string, string>;
  }

  let { mode = $bindable(), kText = $bindable(), kValid, strings: s }: Props = $props();

  const id = $props.id();
  const OPS: [Mode, string, string][] = [
    ["sum", "A + B", "opSum"],
    ["scale", "λA", "opScale"],
    ["AB", "A · B", "opProduct"],
    ["BA", "B · A", "opProductReverse"],
    ["trace", "tr", "opTrace"],
  ];
</script>

<div class="opgrid" role="group" aria-label={s.operation}>
  {#each OPS as [value, symbol, key] (value)}
    <button type="button" aria-pressed={mode === value} onclick={() => (mode = value)}>
      <span class="mr">{symbol}</span><span>{s[key]}</span>
    </button>
  {/each}
</div>
{#if mode === "scale"}
  <div class="row">
    <div class="field" class:bad={!kValid}>
      <label for="{id}-k">λ</label>
      <input id="{id}-k" bind:value={kText} inputmode="decimal" autocomplete="off" spellcheck="false" aria-label={s.scalar} />
    </div>
  </div>
  {#if !kValid}<p class="res-warn">{s.invalidCell}</p>{/if}
{/if}
