<script lang="ts">
  import RoasterForm from "$lib/components/RoasterForm.svelte";
  import * as Api from "$lib/api";
  import { route } from "sv-router/generated";

  let response = $derived(
    Api.Collections.Roaster.getOne(route.params.roasterId),
  );
</script>

{#if response.loading}
  <div class="space-y-6">
    <div class="h-10 w-32 rounded bg-muted animate-pulse"></div>
  </div>
{:else if response.data !== undefined}
  <RoasterForm roasterId={response.data.id} initialData={response.data} />
{/if}
