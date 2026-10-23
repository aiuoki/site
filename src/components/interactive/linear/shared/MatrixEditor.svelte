<script lang="ts">
  import { untrack } from "svelte";
  import { ZERO, fracText, parseFrac } from "../../../../lib/fraction";
  import type { Matrix } from "../../../../lib/matrix";

  interface Props {
    value: Matrix;
    // Name shown before the matrix, e.g. "A".
    name: string;
    // Texts from the topic dictionary: rows, cols, addRow, removeRow, addCol, removeCol, invalidCell.
    strings: Record<string, string>;
    // Theme token for the name and brackets, e.g. "--a".
    color?: string;
    resizable?: boolean;
    maxRows?: number;
    maxCols?: number;
  }

  let { value = $bindable(), name, strings: s, color, resizable = true, maxRows = 4, maxCols = 4 }: Props = $props();

  const id = $props.id();
  const toTexts = (M: Matrix) => M.map((row) => row.map(fracText));
  let texts = $state(untrack(() => toTexts(value)));
  let bad = $state<boolean[][]>(untrack(() => value.map((row) => row.map(() => false))));
  let editing = $state(false);

  // Mirror the matrix unless the user is typing in it.
  $effect.pre(() => {
    const next = toTexts(value);
    if (!editing) {
      texts = next;
      bad = value.map((row) => row.map(() => false));
    }
  });

  function oninput() {
    editing = true;
    const parsed = texts.map((row) => row.map(parseFrac));
    bad = parsed.map((row) => row.map((x) => x === null));
    if (parsed.every((row) => row.every((x) => x !== null))) value = parsed as Matrix;
  }

  function onblur() {
    editing = false;
    texts = toTexts(value);
    bad = value.map((row) => row.map(() => false));
  }

  const m = $derived(value.length);
  const n = $derived(value[0]?.length ?? 0);
  const resize = (rows: number, cols: number) => {
    value = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => value[i]?.[j] ?? ZERO));
  };
</script>

<div class="medit" style:--mc={color ? `var(${color})` : undefined}>
  <span class="mname"><i>{name}</i> =</span>
  <div class="mgrid" style:--n={n}>
    {#each texts as row, i (i)}
      {#each row as _, j (j)}
        <input
          id="{id}-{i}-{j}"
          class:bad={bad[i]?.[j]}
          inputmode="decimal"
          autocomplete="off"
          spellcheck="false"
          aria-label="{name} {i + 1},{j + 1}"
          title={bad[i]?.[j] ? s.invalidCell : undefined}
          bind:value={texts[i]![j]}
          {oninput}
          {onblur}
        />
      {/each}
    {/each}
  </div>
  {#if resizable}
    <div class="msize">
      <span>{s.rows}</span>
      <button type="button" aria-label={s.removeRow} disabled={m <= 1} onclick={() => resize(m - 1, n)}>−</button>
      <button type="button" aria-label={s.addRow} disabled={m >= maxRows} onclick={() => resize(m + 1, n)}>+</button>
      <span>{s.cols}</span>
      <button type="button" aria-label={s.removeCol} disabled={n <= 1} onclick={() => resize(m, n - 1)}>−</button>
      <button type="button" aria-label={s.addCol} disabled={n >= maxCols} onclick={() => resize(m, n + 1)}>+</button>
    </div>
  {/if}
</div>

<style>
  .medit { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
  .mname { font-family: var(--f-math); font-size: 22px; color: var(--mc, var(--fg)); white-space: nowrap; }
  .mgrid {
    display: grid; grid-template-columns: repeat(var(--n), minmax(3.2ch, 5.5ch)); gap: 4px;
    padding: 4px 8px; border-left: 2px solid var(--mc, var(--fg)); border-right: 2px solid var(--mc, var(--fg)); border-radius: 6px;
  }
  input {
    width: 100%; min-width: 0; text-align: center; font-family: var(--f-mono); font-size: 15px; padding: 6px 2px;
    border: 1px solid var(--line); border-radius: 6px; background: var(--bg); color: var(--fg);
  }
  input:focus-visible { outline: 2px solid var(--fg); outline-offset: 1px; }
  input.bad { border-color: var(--sec); }
  .msize { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--muted); }
  .msize span { margin-left: 6px; }
  .msize button {
    width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--line); background: var(--surface-2);
    color: var(--fg); cursor: pointer; font-family: var(--f-mono);
  }
  .msize button:disabled { opacity: 0.4; cursor: default; }
</style>
