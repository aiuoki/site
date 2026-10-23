<script lang="ts">
  import { interpolate } from "../../../../lib/text";

  interface Props {
    // Current step, 0 = the starting matrix.
    step: number;
    onstep: (to: number) => void;
    // Index of the last step (number of operations).
    last: number;
    strings: Record<string, string>;
  }

  let { step, onstep, last, strings: s }: Props = $props();

  const go = (to: number) => onstep(Math.max(0, Math.min(last, to)));
</script>

<div class="step-nav" role="group" aria-label={s.stepsGroup}>
  <button type="button" aria-label={s.stepFirst} title={s.stepFirst} disabled={step <= 0} onclick={() => go(0)}>«</button>
  <button type="button" aria-label={s.stepPrev} title={s.stepPrev} disabled={step <= 0} onclick={() => go(step - 1)}>‹</button>
  <span class="count" aria-live="polite">{interpolate(s.stepCounter, { i: step, n: last })}</span>
  <button type="button" aria-label={s.stepNext} title={s.stepNext} disabled={step >= last} onclick={() => go(step + 1)}>›</button>
  <button type="button" aria-label={s.stepLast} title={s.stepLast} disabled={step >= last} onclick={() => go(last)}>»</button>
</div>

<style>
  .step-nav { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  button {
    width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface-2);
    color: var(--fg); font-family: var(--f-math); font-size: 22px; line-height: 1; cursor: pointer;
  }
  button:hover:not(:disabled) { border-color: var(--muted); }
  button:disabled { opacity: 0.4; cursor: default; }
  .count { flex: 1; min-width: 7ch; text-align: center; font-family: var(--f-mono); font-size: 13px; color: var(--muted); }
</style>
