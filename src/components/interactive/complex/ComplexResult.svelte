<script lang="ts">
  import type { Block } from "../../../lib/complex-panel";

  let { blocks, outsideNote, seeDemo }: { blocks: Block[]; outsideNote: string; seeDemo: string } = $props();
</script>

{#each blocks as block, i (i)}
  {#if block.kind === "note"}
    <p class={block.warn ? "res-warn" : "hint"}>{block.text}</p>
  {:else}
    <div class="fx">
      <div class="f">{@html block.f}</div>
      {#if block.s}<div class="s">{@html block.s}</div>{/if}
      {#if block.r}<div class="r">{@html block.r}</div>{/if}
      {#if block.extra}{@html block.extra}{/if}
      {#each block.demos as demo (demo)}
        <button type="button" class="more" data-demo={demo}>{seeDemo}</button>
      {/each}
    </div>
  {/if}
{/each}
{#if outsideNote}<div class="hint">{outsideNote}</div>{/if}
