<script lang="ts">
  import BagForm from "$lib/components/BagForm.svelte";
  import * as Api from "$lib/api";
  import { route } from "sv-router/generated";

  let response = Api.Collections.Bags.getOne(route.params.bagId!);
  let response2 = Api.Collections.Bean.getList();
</script>

{#if response.loading || response.data === undefined || response2.loading || response2.data === undefined}
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
{:else}
  <BagForm bind:bag={response.data} beans={response2.data} />
{/if}
