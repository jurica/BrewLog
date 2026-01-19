<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import * as Api from "$lib/api";
  import type { ClassValue } from "svelte/elements";

  interface Props {
    bagFilter: Api.Collections.Bags.Filters;
    class?: ClassValue;
  }
  let { bagFilter = $bindable(), class: clazz }: Props = $props();

  const filterLabels: Api.Collections.Bags.FilterValues<string> = {
    unopened: "Unopened",
    opened: "Opened",
    finished: "Finished",
    all: "All"
  };
</script>

<ToggleGroup.Root
  data-test-id="tg_bagfilter"
  type="single"
  bind:value={bagFilter}
  variant="outline"
  size="sm"
  class={clazz}
>
  {#each Object.entries(filterLabels) as [key, label]}
    <ToggleGroup.Item value={key} disabled={bagFilter === key}
      >{label}</ToggleGroup.Item
    >
  {/each}
</ToggleGroup.Root>
