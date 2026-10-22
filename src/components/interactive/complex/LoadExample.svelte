<script lang="ts">
  import { loadExample } from "./examples";
  import { plane } from "./state.svelte";

  let { index, label }: { index: number; label: string } = $props();

  // Loads a worked example into the plane and brings it into view.
  function load() {
    loadExample(plane, index);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelector(".app .plot")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }
</script>

<button type="button" class="linkbtn" onclick={load}>{label}</button>
