<script lang="ts">
  import { circleCheck, sumCheck, type CheckNames, type CheckStrings, type CircleCheck, type SumCheck } from "../../../lib/trig-checks";
  import { circle, sum } from "./state.svelte";

  interface Props {
    kind: CircleCheck | SumCheck;
    strings: CheckStrings;
    names: CheckNames;
    locale: string;
  }

  let { kind, strings, names, locale }: Props = $props();

  let mounted = $state(false);
  $effect(() => {
    mounted = true;
  });

  const isSum = (k: Props["kind"]): k is SumCheck => ["wrong", "dbl", "dbl2", "half", "s2p"].includes(k);
  const html = $derived(isSum(kind) ? sumCheck(kind, sum, locale, names, strings) : circleCheck(kind, circle.deg, locale, strings));
</script>

<!-- {@html} keeps the server text on hydration; re-render once mounted. -->
{#key mounted}<span>{@html html}</span>{/key}
