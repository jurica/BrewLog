<script lang="ts">
  import BeanForm from "$lib/components/BeanForm.svelte";
  import * as Api from "$lib/api";
  import { route } from "sv-router/generated";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = Api.Collections.Bean.getOne(route.params.beanId!);
  let response2 = Api.Collections.Roaster.getList();

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">Edit Bean</h1>
{/snippet}

{#if response.loading || response.error || response2.loading || response2.error}
  <div class="space-y-6">
    <div class="bg-muted h-10 w-32 animate-pulse rounded"></div>
  </div>
{:else}
  <BeanForm bind:bean={response.data} roasters={response2.data} />
{/if}
