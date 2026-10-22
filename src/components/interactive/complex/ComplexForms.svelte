<script lang="ts">
  import type { FormRow } from "../../../lib/complex-panel";

  let { rows }: { rows: FormRow[] } = $props();
</script>

<div class="vals">
  {#each rows as row, i (i)}
    <div class="frow demo" data-demo={row.demo} role="button" tabindex="0" style:--col="var({row.color})">
      <span class="bar"></span>
      <div class="fb">
        <div class="fh">
          <span class="fn mr">{@html row.name}</span>
          <span class="fd">{row.desc}</span>
        </div>
        <div class="fv mr">
          {@html row.value}
          {#if row.dec}<span class="dec num">≈ {row.dec}</span>{/if}
        </div>
      </div>
    </div>
  {/each}
</div>
