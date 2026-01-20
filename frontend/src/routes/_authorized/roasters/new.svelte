<script lang="ts">
  import RoasterForm from "$lib/components/RoasterForm.svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">New Roaster</h1>
{/snippet}

<RoasterForm />
