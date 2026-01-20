<script lang="ts">
  import BeanForm from "$lib/components/BeanForm.svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">New Bean</h1>
{/snippet}

<BeanForm />
