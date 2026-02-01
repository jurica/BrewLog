<script lang="ts">
  import * as Api from "$lib/api";
  import BagCard from "./Card.svelte";

  interface Props {
    bags: Api.Collections.Bags.Record[];
  }
  let { bags }: Props = $props();
</script>

<div class="space-y-6">
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each bags as bag}
      <BagCard {bag} />
    {/each}
  </div>
</div>
