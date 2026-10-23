<script lang="ts">
  import type { SystemCase } from "../../../../lib/systems";

  interface Props {
    current: SystemCase;
    strings: Record<string, string>;
  }

  let { current, strings: s }: Props = $props();

  const CASES: SystemCase[] = ["both", "right", "left", "none"];
  const word = (c: SystemCase, part: "" | "Cond" | "Sol") => s[`case${c[0]!.toUpperCase()}${c.slice(1)}${part}`]!;
</script>

<ul class="cases">
  {#each CASES as c (c)}
    <li class:on={c === current} aria-current={c === current ? "true" : undefined}>
      <div class="head">
        <b>{word(c, "")}</b>
        <span class="cond">{word(c, "Cond")}</span>
        {#if c === current}<span class="tag">{s.caseCurrent}</span>{/if}
      </div>
      <div class="sol">{word(c, "Sol")}</div>
    </li>
  {/each}
</ul>

<style>
  .cases { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
  li { padding: 10px 12px; border: 1px solid var(--line); border-radius: 10px; opacity: 0.7; }
  li.on { opacity: 1; border-color: var(--b); background: color-mix(in srgb, var(--b) 12%, transparent); }
  .head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; }
  b { font-weight: 600; font-size: 15px; }
  .cond { font-family: var(--f-math); font-size: 16px; color: var(--muted); }
  .tag {
    margin-left: auto; font-size: 12px; padding: 1px 8px; border-radius: 999px; background: var(--b); color: var(--bg);
    font-weight: 600;
  }
  .sol { font-size: 14px; color: var(--muted); margin-top: 2px; }
</style>
