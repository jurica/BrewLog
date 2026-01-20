<script lang="ts">
  import BagForm from "$lib/components/BagForm.svelte";
  import * as Api from "$lib/api";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let bag = $state(Api.Collections.Bags.newRecord());

  let response = $derived(Api.Collections.Bean.getList());

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">New Bag</h1>
{/snippet}

{#if response.loading || response.data === undefined}
  loading...
{:else}
  <BagForm bind:bag beans={response.data} />
{/if}
