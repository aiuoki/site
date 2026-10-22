<script lang="ts" generics="T extends string | number">
  interface Option {
    value: T;
    label: string;
    math?: boolean;
  }

  interface Props {
    options: Option[];
    value: T;
    label?: string;
  }

  let { options, value = $bindable(), label }: Props = $props();
</script>

<div class="seg" role="group" aria-label={label}>
  {#each options as option (option.value)}
    <button
      type="button"
      class:mr={option.math}
      aria-pressed={value === option.value}
      onclick={() => (value = option.value)}>{option.label}</button
    >
  {/each}
</div>
