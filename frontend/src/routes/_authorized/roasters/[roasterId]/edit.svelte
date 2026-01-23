<script lang="ts">
  import RoasterForm from "$lib/components/RoasterForm.svelte";
  import * as Api from "$lib/api";
  import { route } from "sv-router/generated";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = Api.Collections.Roaster.getOne(route.params.roasterId!);

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">Edit Roaster</h1>
{/snippet}

{#if response.loading || response.error}
  <div class="space-y-6">
    <div class="bg-muted h-10 w-32 animate-pulse rounded"></div>
  </div>
{:else}
  <RoasterForm bind:roaster={response.data} />
{/if}
