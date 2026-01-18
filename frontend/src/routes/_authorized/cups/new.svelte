<script lang="ts">
  import CupForm from "$lib/components/CupForm.svelte";
  import * as Api from "$lib/api";

  let cup = $state(Api.Collections.Cups.newRecord());

  let response = $derived(Api.Collections.Bags.getList("opened"));
  $inspect(cup);
</script>

{#if response.loading || response.data === undefined}
  loading...
{:else}
  <CupForm bind:cup bags={response.data} />
{/if}
