<script lang="ts">
  import RoasterForm from "$lib/components/RoasterForm.svelte";
  import * as Api from "$lib/api";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let roaster = $state(Api.Collections.Roaster.newRecord());

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">New Roaster</h1>
{/snippet}

<RoasterForm bind:roaster />
