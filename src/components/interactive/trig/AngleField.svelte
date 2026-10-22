<script lang="ts">
  import { untrack } from "svelte";
  import { angleText, parseAngle, toDegrees, type AngleUnit } from "../../../lib/trig";

  interface Props {
    deg: number;
    unit: AngleUnit;
    locale: string;
    label: string;
    unitLabel: string;
    // Theme token for the label color, e.g. "--a".
    color?: string;
  }

  let { deg = $bindable(), unit, locale, label, unitLabel, color }: Props = $props();

  const id = $props.id();
  let editing = $state(false);
  let invalid = $state(false);
  // Initial value also rendered on the server; the effect keeps it in sync.
  let text = $state(untrack(() => angleText(deg, unit, locale)));

  // Mirror the angle in the input unless the user is typing in it.
  $effect(() => {
    const next = angleText(deg, unit, locale);
    if (!editing) text = next;
  });

  function oninput() {
    editing = true;
    const parsed = parseAngle(text);
    invalid = !parsed;
    if (parsed) deg = toDegrees(parsed, unit);
  }

  function onblur() {
    editing = false;
    invalid = false;
    text = angleText(deg, unit, locale);
  }
</script>

<div class="field" class:bad={invalid} style:--lc={color ? `var(${color})` : undefined}>
  <label for={id}>{label}</label>
  <input
    {id}
    inputmode="decimal"
    autocomplete="off"
    spellcheck="false"
    bind:value={text}
    {oninput}
    {onblur}
    onkeydown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
  />
  <span class="unit">{unitLabel}</span>
</div>
