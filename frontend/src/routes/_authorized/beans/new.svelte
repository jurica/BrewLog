<script lang="ts">
  import * as Api from "$lib/api";
  import BeanForm from "$lib/components/BeanForm.svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let bean = $state(Api.Collections.Bean.newRecord());
  let response = Api.Collections.Roaster.getList();

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">New Bean</h1>
{/snippet}

{#if response.loading || response.data === undefined}
  loading...
{:else}
  <BeanForm bind:bean roasters={response.data} />
{/if}
