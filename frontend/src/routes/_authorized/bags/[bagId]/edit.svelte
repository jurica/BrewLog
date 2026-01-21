<script lang="ts">
  import BagForm from "$lib/components/BagForm.svelte";
  import * as Api from "$lib/api";
  import { route } from "sv-router/generated";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = Api.Collections.Bags.getOne(route.params.bagId!);
  let response2 = Api.Collections.Bean.getList();

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">Edit Bag</h1>
{/snippet}

{#if response.loading || response.data === undefined || response2.loading || response2.data === undefined}
  <div class="space-y-6">
    <div class="bg-muted h-10 w-32 animate-pulse rounded"></div>
    <div class="rounded-lg border p-6">
      <div class="bg-muted h-6 w-40 animate-pulse rounded"></div>
      <div class="mt-6 space-y-4">
        {#each Array(5) as _}
          <div class="bg-muted h-10 w-full animate-pulse rounded"></div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <BagForm bind:bag={response.data} beans={response2.data} />
{/if}
