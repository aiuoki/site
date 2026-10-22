<script lang="ts">
  import { rad, signedDeg, wrapDeg, type AngleUnit } from "../../../lib/trig";

  interface Props {
    deg: number;
    unit: AngleUnit;
    label: string;
    color?: string;
  }

  let { deg = $bindable(), unit, label, color }: Props = $props();

  // Degrees: 0..360. Radians: −π..π.
  const range = $derived(
    unit === "deg" ? { min: 0, max: 360, step: 0.1 } : { min: -Math.PI, max: Math.PI, step: 0.001 },
  );
  const value = $derived(unit === "deg" ? deg : rad(signedDeg(deg)));

  function oninput(event: Event) {
    const x = Number((event.currentTarget as HTMLInputElement).value);
    deg = unit === "deg" ? x : wrapDeg((x * 180) / Math.PI);
  }
</script>

<input
  type="range"
  min={range.min}
  max={range.max}
  step={range.step}
  {value}
  aria-label={label}
  style:--rc={color ? `var(${color})` : undefined}
  {oninput}
/>
