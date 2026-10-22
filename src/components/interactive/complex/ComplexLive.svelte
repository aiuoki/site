<script lang="ts">
  import { complexCheck, type ComplexCheck } from "../../../lib/complex-checks";
  import { plane } from "./state.svelte";

  interface Props {
    kind: ComplexCheck;
    strings: { noDiv: string; undefArg: string };
    locale: string;
  }

  let { kind, strings, locale }: Props = $props();

  let mounted = $state(false);
  $effect(() => {
    mounted = true;
  });
  const html = $derived(complexCheck(kind, plane, locale, strings));
</script>

<!-- {@html} keeps the server text on hydration; re-render once mounted. -->
{#key mounted}<span>{@html html}</span>{/key}
