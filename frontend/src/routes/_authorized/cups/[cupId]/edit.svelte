<script lang="ts">
  import CupForm from "$lib/components/CupForm.svelte";
  import * as Api from "$lib/api";
  import { route } from "sv-router/generated";
  import { onMount } from "svelte";

  let response = $derived(Api.Collections.Cups.getOne(route.params.cupId));
</script>

{#if response.loading}
  <div class="space-y-6">
    <div class="h-10 w-32 rounded bg-muted animate-pulse"></div>
    <div class="rounded-lg border p-6">
      <div class="h-6 w-40 rounded bg-muted animate-pulse"></div>
      <div class="mt-6 space-y-4">
        {#each Array(5) as _}
          <div class="h-10 w-full rounded bg-muted animate-pulse"></div>
        {/each}
      </div>
    </div>
  </div>
{:else if response.data !== undefined}
  <CupForm cup={response.data} />
{/if}
