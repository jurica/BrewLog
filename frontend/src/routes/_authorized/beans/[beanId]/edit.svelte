<script lang="ts">
  import BeanForm from "$lib/components/BeanForm.svelte";
  import * as Api from "$lib/api";
  import { route } from "sv-router/generated";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = $derived(Api.Collections.Bean.getOne(route.params.beanId));

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">Edit Bean</h1>
{/snippet}

{#if response.loading}
  <div class="space-y-6">
    <div class="bg-muted h-10 w-32 animate-pulse rounded"></div>
  </div>
{:else if response.data !== undefined}
  <BeanForm beanId={response.data.id} initialData={response.data} />
{/if}
