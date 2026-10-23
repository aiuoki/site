<script lang="ts">
  import { fracText } from "../../../../lib/fraction";
  import { cols, rows } from "../../../../lib/matrix";
  import { interpolate } from "../../../../lib/text";
  import MatrixView from "../shared/MatrixView.svelte";
  import { entryName } from "../types/entry";
  import { sizeText, type Operand, type Outcome } from "./ops";

  interface Props {
    out: Outcome;
    // Selected entry of the result (row, column; 0-based).
    sel: [number, number];
    onselect: (cell: [number, number]) => void;
    strings: Record<string, string>;
  }

  let { out, sel, onselect, strings: s }: Props = $props();

  const isProduct = (o: Outcome) => o.ok && (o.mode === "AB" || o.mode === "BA");
  const OPERATOR = { sum: "+", scale: "·", AB: "·", BA: "·" } as const;
</script>

{#snippet operand(o: Operand, rowsLit: number[], colsLit: number[], cellsLit: [number, number][])}
  <div class="opnd">
    <span class="cap" style:color="var({o.color})"><i>{o.name}</i> · {sizeText(o.matrix)}</span>
    <MatrixView matrix={o.matrix} color={o.color} rows={rowsLit} cols={colsLit} cells={cellsLit} />
  </div>
{/snippet}

{#if out.ok}
  <div class="eq">
    {#if out.mode === "scale" && out.k}<span class="lam mr">{fracText(out.k)}</span>{/if}
    {#if isProduct(out)}
      {@render operand(out.left, [sel[0]], [], [])}
      <span class="op mr">{OPERATOR[out.mode]}</span>
      {@render operand(out.right!, [], [sel[1]], [])}
    {:else}
      {@render operand(out.left, [], [], [sel])}
      {#if out.right}
        <span class="op mr">{OPERATOR[out.mode]}</span>
        {@render operand(out.right, [], [], [sel])}
      {/if}
    {/if}
    <span class="op mr">=</span>
    <div class="opnd">
      <span class="cap" style:color="var(--g)"><i>C</i> · {sizeText(out.result)}</span>
      <div class="cgrid" style:--n={cols(out.result)} role="group" aria-label={s.resultMatrix}>
        {#each out.result as row, i (i)}
          {#each row as x, j (j)}
            <button
              type="button"
              class:lit={sel[0] === i && sel[1] === j}
              aria-pressed={sel[0] === i && sel[1] === j}
              aria-label={interpolate(s.cellLabel ?? "", { c: entryName("c", i, j), v: fracText(x) })}
              onclick={() => onselect([i, j])}>{fracText(x)}</button
            >
          {/each}
        {/each}
      </div>
    </div>
  </div>
  {#if isProduct(out) && out.right}
    <p class="hint">
      {interpolate(s.sizeRule ?? "", { l: sizeText(out.left.matrix), r: sizeText(out.right.matrix), o: `${rows(out.result)} × ${cols(out.result)}` })}
    </p>
  {/if}
{:else}
  <p class="undefined-note">{interpolate(s[out.why] ?? "", out.vars)}</p>
{/if}

<style>
  .eq { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; margin-top: 12px; }
  .opnd { display: flex; flex-direction: column; gap: 4px; min-width: 0; max-width: 100%; }
  .cap { font-family: var(--f-math); font-size: 14px; white-space: nowrap; }
  .op, .lam { font-size: 22px; color: var(--muted); }
  .lam { color: var(--fg); }
  .cgrid {
    display: grid; grid-template-columns: repeat(var(--n), auto); gap: 2px 4px; overflow-x: auto; scrollbar-width: none;
    padding: 4px 8px; border-left: 2px solid var(--g); border-right: 2px solid var(--g); border-radius: 6px; max-width: 100%;
  }
  .cgrid::-webkit-scrollbar { display: none; }
  .cgrid button {
    min-width: 3ch; padding: 3px 6px; text-align: center; font-family: var(--f-math); font-size: 18px; cursor: pointer;
    border: 0; border-radius: 6px; background: transparent; color: var(--fg); font-variant-numeric: tabular-nums;
  }
  .cgrid button:hover { background: color-mix(in srgb, var(--g) 12%, transparent); }
  .cgrid button.lit { background: color-mix(in srgb, var(--g) 28%, transparent); font-weight: 600; }
  .undefined-note { margin: 12px 0 0; font-size: 15px; color: var(--sec); }
  .hint { margin: 10px 0 0; }
</style>
