<script lang="ts">
  import { arrow } from "../../../lib/complex-plot";

  interface Props {
    from?: [number, number];
    to: [number, number];
    color: string;
    width?: number;
    dash?: string;
  }

  let { from = [0, 0], to, color, width = 3.5, dash }: Props = $props();
  const a = $derived(arrow(from[0], from[1], to[0], to[1]));
</script>

{#if a}
  <line {...a.shaft} stroke={color} stroke-width={width} stroke-linecap="round" stroke-dasharray={dash} />
  <path d={a.head} fill={color} />
{/if}
