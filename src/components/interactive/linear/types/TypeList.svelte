<script lang="ts">
  import { interpolate } from "../../../../lib/text";
  import type { TypeId, TypeRow } from "./report";

  let { rows, strings: s }: { rows: TypeRow[]; strings: Record<string, string> } = $props();

  // Short definitions in symbols; the same in every language.
  const DEFS: Record<TypeId, string> = {
    square: "m = n",
    zero: "<i>a</i><sub>ij</sub> = 0",
    identity: "<i>a</i><sub>ii</sub> = 1, <i>a</i><sub>ij</sub> = 0 (<i>i</i> ≠ <i>j</i>)",
    diagonal: "<i>a</i><sub>ij</sub> = 0 (<i>i</i> ≠ <i>j</i>)",
    symmetric: "A = Aᵗ",
    antisymmetric: "Aᵗ = −A",
    upper: "<i>a</i><sub>ij</sub> = 0 (<i>i</i> &gt; <i>j</i>)",
    lower: "<i>a</i><sub>ij</sub> = 0 (<i>i</i> &lt; <i>j</i>)",
  };
  const NAMES: Record<TypeId, string> = {
    square: "typeSquare",
    zero: "typeZero",
    identity: "typeIdentity",
    diagonal: "typeDiagonal",
    symmetric: "typeSymmetric",
    antisymmetric: "typeAntisymmetric",
    upper: "typeUpper",
    lower: "typeLower",
  };
</script>

<ul class="types">
  {#each rows as row (row.id)}
    <li class:yes={row.yes}>
      <div class="head">
        <span class="name">{s[NAMES[row.id]]}</span>
        <span class="def mr">{@html DEFS[row.id]}</span>
        <span class="badge">{row.yes ? s.yes : s.no}</span>
      </div>
      <div class="why">{interpolate(s[row.why] ?? "", row.vars)}</div>
    </li>
  {/each}
</ul>

<style>
  .types { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
  li { padding: 10px 0 10px 12px; border-bottom: 1px solid var(--line); border-left: 3px solid var(--line); margin-top: 2px; }
  li:last-child { border-bottom: 0; }
  li.yes { border-left-color: var(--csc); }
  .head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; }
  .name { font-weight: 600; font-size: 15px; }
  .def { font-family: var(--f-math); font-size: 15px; color: var(--muted); flex: 1; min-width: 0; }
  .badge {
    font-size: 12px; font-family: var(--f-mono); letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted);
    border: 1px solid var(--line); border-radius: 999px; padding: 1px 9px;
  }
  .yes .badge { color: var(--csc); border-color: currentColor; }
  .why { font-family: var(--f-math); font-size: 15px; color: var(--muted); margin-top: 2px; }
</style>
