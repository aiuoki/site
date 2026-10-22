<script lang="ts">
  import { piFrac } from "../../../lib/format";
  import { RATIOS, exact, norm } from "../../../lib/trig";
  import type { Notation } from "../../../lib/notation";
  import { circle } from "./state.svelte";

  interface Props {
    notation: Notation;
    degLabel: string;
    radLabel: string;
  }

  let { notation, degLabel, radLabel }: Props = $props();

  const ANGLES = [0, 30, 45, 60, 90, 180, 270];
  const reduceMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Moves the point and brings the canvas into view.
  function pick(d: number) {
    circle.deg = d;
    document.querySelector(".app .plot")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }
</script>

<div class="tablewrap">
  <table class="big">
    <thead>
      <tr>
        <th>{degLabel}</th>
        <th>{radLabel}</th>
        {#each RATIOS as k (k)}<th data-c style:--col="var(--{k})">{notation[k]}</th>{/each}
      </tr>
    </thead>
    <tbody>
      {#each ANGLES as d (d)}
        {@const e = exact(d)}
        <!-- Keyboard users pick the row with the button in its first cell. -->
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
        <tr class:on={Math.abs(norm(circle.deg) - d) < 1e-6} onclick={() => pick(d)}>
          <td><button type="button" class="row-pick" onclick={(e) => (e.stopPropagation(), pick(d))}>{d}°</button></td>
          <td>{piFrac(d)}</td>
          {#each RATIOS as k (k)}
            {#if e?.[k] == null}<td class="nd">∄</td>{:else}<td>{e[k]}</td>{/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
