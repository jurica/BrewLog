<script lang="ts">
  import CupForm from "$lib/components/CupForm.svelte";
  import * as Api from "$lib/api";
  import { route } from "sv-router/generated";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = $derived(Api.Collections.Cups.getOne(route.params.cupId!));
  let response2 = $derived(Api.Collections.Bags.getList("all"));

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">Edit Cup</h1>
{/snippet}

{#if response.loading || response.error || response2.loading || response2.error}
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
{:else if response.data !== undefined}
  <CupForm bind:cup={response.data} bags={response2.data} />
{/if}
