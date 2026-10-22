<script lang="ts">
  interface Props {
    label: string;
    checked: boolean;
    // Theme token for the swatch, e.g. "--sin".
    color?: string;
  }

  let { label, checked = $bindable(), color }: Props = $props();
</script>

<label class="chip" style:--sw={color ? `var(${color})` : undefined}>
  <input type="checkbox" bind:checked />
  <span class="sw"></span>
  <span>{label}</span>
</label>
