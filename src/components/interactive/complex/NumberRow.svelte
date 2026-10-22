<script lang="ts">
  import { untrack } from "svelte";
  import { cx, polar, type Complex } from "../../../lib/complex";
  import { parseNum, type AngleUnit } from "../../../lib/complex-format";
  import { fieldText } from "../../../lib/complex-panel";

  interface Props {
    value: Complex;
    name: "z" | "w";
    mode: "bin" | "pol";
    unit: AngleUnit;
    locale: string;
  }

  let { value = $bindable(), name, mode, unit, locale }: Props = $props();

  const id = $props.id();
  const color = name === "z" ? "--z" : "--w";
  const labels = $derived(mode === "bin" ? (name === "z" ? ["a =", "b ="] : ["c =", "d ="]) : ["ρ =", "θ ="]);
  const unitLabel = $derived(mode === "bin" ? "" : unit === "deg" ? "°" : "rad");

  let editing = $state(false);
  let bad = $state([false, false]);
  // Initial values are also rendered on the server; the effect keeps them in sync.
  let texts = $state(untrack(() => [fieldText(value, 0, mode, unit, locale), fieldText(value, 1, mode, unit, locale)]));

  // Mirror the number unless the user is typing in this row.
  $effect.pre(() => {
    const next = [fieldText(value, 0, mode, unit, locale), fieldText(value, 1, mode, unit, locale)];
    if (!editing) texts = next;
  });

  function oninput() {
    editing = true;
    const [p0, p1] = texts.map(parseNum);
    bad = [!p0, !p1];
    if (!p0 || !p1) return;
    if (mode === "bin") {
      value = cx(p0.val, p1.val);
      return;
    }
    if (p0.val < 0) {
      bad = [true, false];
      return;
    }
    value = polar(p0.val, unit === "rad" || p1.hasPi ? p1.val : (p1.val * Math.PI) / 180);
  }

  function onblur() {
    editing = false;
    bad = [false, false];
    texts = [fieldText(value, 0, mode, unit, locale), fieldText(value, 1, mode, unit, locale)];
  }
</script>

<div class="zrow">
  <span class="zlab" style:--lc="var({color})"><i>{name}</i></span>
  {#each [0, 1] as i (i)}
    <div class="field" class:bad={bad[i]} style:--lc="var({color})">
      <label for="{id}-{i}">{labels[i]}</label>
      <input
        id="{id}-{i}"
        inputmode="decimal"
        autocomplete="off"
        spellcheck="false"
        bind:value={texts[i]}
        {oninput}
        {onblur}
        onkeydown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
      />
      <span class="unit">{i === 1 ? unitLabel : ""}</span>
    </div>
  {/each}
</div>
