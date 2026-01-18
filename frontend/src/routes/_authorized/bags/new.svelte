<script lang="ts">
  import BagForm from "$lib/components/BagForm.svelte";
  import * as Api from "$lib/api";

  let bag = $state(Api.Collections.Bags.newRecord());

  let response = $derived(Api.Collections.Bean.getList());
</script>

{#if response.loading || response.data === undefined}
loading...
{:else}
<BagForm bind:bag={bag} beans={response.data}/>
{/if}
