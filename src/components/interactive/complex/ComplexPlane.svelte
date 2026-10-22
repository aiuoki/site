<script lang="ts">
  import Chip from "../../ui/Chip.svelte";
  import Segmented from "../../ui/Segmented.svelte";
  import { outside } from "../../../lib/complex-plot";
  import { OPS_WITH_W, forms, readout, resultBlocks, resultPoints, type Op } from "../../../lib/complex-panel";
  import type { ComplexDict } from "../../../i18n/topics/complejos";
  import type { Notation } from "../../../lib/notation";
  import ComplexForms from "./ComplexForms.svelte";
  import ComplexPlot from "./ComplexPlot.svelte";
  import ComplexResult from "./ComplexResult.svelte";
  import { EXAMPLES, loadExample } from "./examples";
  import NumberRow from "./NumberRow.svelte";
  import { plane } from "./state.svelte";

  let { strings: s, notation, locale }: { strings: ComplexDict["ui"]; notation: Notation; locale: string } = $props();

  const OPS: [Op, string, keyof ComplexDict["ui"]][] = [
    ["none", "z", "opNone"], ["conj", "z̄", "opConj"], ["sum", "z + w", "opSum"], ["prod", "z · w", "opProd"],
    ["quot", "z / w", "opQuot"], ["pow", "zⁿ", "opPow"], ["root", "ⁿ√z", "opRoot"],
  ];
  const show = $state({ labels: true, proj: true, polar: true, unit: true });
  let magnet = $state(true);

  const usesW = $derived(OPS_WITH_W.includes(plane.op));
  const head = $derived(readout(plane.z, plane.unit, locale, s));
  const blocks = $derived(resultBlocks(plane, locale, s));
  const rows = $derived(forms(plane.z, plane.unit, locale, notation, s));
  const out = $derived(outside([plane.z, ...resultPoints(plane)]));
  const legend = $derived([["--z", "z"], ["--w", "w"], ["--result", s.legR], ["--re", "Re(z) = a"], ["--im", "Im(z) = b"]]);
</script>

<section class="app">
  <div class="stage">
    <div class="canvas">
      <ComplexPlot bind:z={plane.z} bind:w={plane.w} op={plane.op} n={plane.n} {show} {magnet} {locale} label={s.number} />
    </div>
    <div class="legend">
      {#each legend as [color, text] (color)}<span style:--sw="var({color})"><i></i>{text}</span>{/each}
    </div>
    <div class="chips">
      <Chip label={s.chipLabels} bind:checked={show.labels} />
      <Chip label={s.chipProj} color="--re" bind:checked={show.proj} />
      <Chip label={s.chipPolar} color="--z" bind:checked={show.polar} />
      <Chip label={s.chipUnit} color="--muted" bind:checked={show.unit} />
      <Chip label={s.chipSnap} bind:checked={magnet} />
    </div>
  </div>

  <div class="panel">
    <div class="card">
      <div class="readout">
        <span class="eyebrow">{s.number}</span>
        <div class="big">{@html head.big}</div>
        <div class="sub">{@html head.sub}</div>
      </div>
      <div class="controls">
        <div class="row">
          <Segmented options={[{ value: "bin", label: s.bin }, { value: "pol", label: s.pol }]} bind:value={plane.mode} />
          <Segmented options={[{ value: "deg", label: s.deg }, { value: "rad", label: s.radians }]} bind:value={plane.unit} />
        </div>
        <NumberRow bind:value={plane.z} name="z" mode={plane.mode} unit={plane.unit} {locale} />
        {#if usesW}<NumberRow bind:value={plane.w} name="w" mode={plane.mode} unit={plane.unit} {locale} />{/if}
        <div class="hint">{@html plane.mode === "bin" ? s.hintBin : s.hintPol}</div>
        <div class="angle-block">
          <span class="eyebrow">{s.op}</span>
          <div class="opgrid">
            {#each OPS as [id, symbol, key] (id)}
              <button type="button" aria-pressed={plane.op === id} onclick={() => (plane.op = id)}>
                <span class="mr">{symbol}</span><span>{s[key]}</span>
              </button>
            {/each}
          </div>
          {#if plane.op === "pow" || plane.op === "root"}
            <div class="row">
              <span class="hint mr"><i>n</i> =</span>
              <Segmented options={[2, 3, 4, 5, 6, 8].map((v) => ({ value: v, label: String(v) }))} bind:value={plane.n} />
            </div>
          {/if}
        </div>
        <div class="angle-block">
          <span class="eyebrow">{s.quick}</span>
          <div class="quick">
            {#each EXAMPLES as example, i (i)}
              <button type="button" onclick={() => loadExample(plane, i)}>{@html example.label}</button>
            {/each}
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <span class="eyebrow">{s.result}</span>
      <ComplexResult {blocks} outsideNote={out ? s.outside : ""} seeDemo={s.seeDemo} />
    </div>
    <div class="card">
      <span class="eyebrow">{s.forms}</span>
      <ComplexForms {rows} />
    </div>
  </div>
</section>
