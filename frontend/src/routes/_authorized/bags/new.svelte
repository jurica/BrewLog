<script lang="ts">
  import BagForm from "$lib/components/BagForm.svelte";
  import * as Api from "$lib/api";

  let bag = {} as Api.Collections.Bag.Record;
  bag.id = undefined;

  let response2 = $derived(Api.Collections.Bean.getList());
</script>

{#if response2.loading || response2.data === undefined}
loading...
{:else}
<BagForm bind:bag={bag} beans={response2.data}/>
{/if}
