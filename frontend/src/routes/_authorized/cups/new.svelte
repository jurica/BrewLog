<script lang="ts">
  import CupForm from "$lib/components/CupForm.svelte";
  import * as Api from "$lib/api";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let cup = $state(Api.Collections.Cups.newRecord());

  let response = $derived(Api.Collections.Bags.getList("opened"));

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">New Cup</h1>
{/snippet}

{#if response.loading || response.data === undefined}
  loading...
{:else}
  <CupForm bind:cup bags={response.data} />
{/if}
