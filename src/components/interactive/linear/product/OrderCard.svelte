<script lang="ts">
  import { interpolate } from "../../../../lib/text";
  import type { Matrix } from "../../../../lib/matrix";
  import { compareOrder, readTrace, traceOfProducts } from "./ops";

  interface Props {
    A: Matrix;
    B: Matrix;
    // "order": AB against BA. "trace": the trace of A, B and of the products.
    view: "order" | "trace";
    strings: Record<string, string>;
  }

  let { A, B, view, strings: s }: Props = $props();

  const order = $derived(compareOrder(A, B));
  const reads = $derived([readTrace(A, "A"), readTrace(B, "B")] as const);
  const products = $derived(traceOfProducts(A, B));
</script>

{#if view === "order"}
  <p class="line" class:differ={order.kind === "differ" || order.kind === "sizes"}>
    {interpolate(s[`order_${order.kind}`] ?? "", order.vars)}
  </p>
  <p class="hint">{s.orderHint}</p>
{:else}
  {#each reads as reading, t (t)}
    {#if reading}
      <div class="fx">
        <div class="f">{reading.symbolic}</div>
        <div class="s">{reading.numeric}</div>
        <div class="r"><span>= {reading.value}</span></div>
      </div>
    {:else}
      <p class="hint">{interpolate(s.traceNeedSquare ?? "", { name: t === 0 ? "A" : "B" })}</p>
    {/if}
  {/each}
  {#if products}
    <p class="line">{interpolate(s.traceProducts ?? "", { ab: products.ab, ba: products.ba })}</p>
  {:else}
    <p class="hint">{s.traceProductsNone}</p>
  {/if}
{/if}

<style>
  .line { margin: 0; font-family: var(--f-math); font-size: 16px; }
  .line.differ { color: var(--sec); }
  .hint { margin: 8px 0 0; }
  .fx { padding: 10px 0; }
  .fx:first-child { padding-top: 0; }
</style>
