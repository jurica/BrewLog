<script lang="ts">
  import BeanForm from "$lib/components/BeanForm.svelte";
  import * as Api from "$lib/api";
  import { route } from "sv-router/generated";

  let response = $derived(Api.Collections.Bean.getOne(route.params.beanId));
</script>

{#if response.loading}
  <div class="space-y-6">
    <div class="h-10 w-32 rounded bg-muted animate-pulse"></div>
  </div>
{:else if response.data !== undefined}
  <BeanForm beanId={response.data.id} initialData={response.data} />
{/if}
