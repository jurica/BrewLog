<script lang="ts">
  import { loadLocale } from "wuchale/load-utils";
  import { Router } from "sv-router";
  import "sv-router/generated";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { onMount } from "svelte";
  import * as Api from "$lib/api";

  let loading = $state(true);
  onMount(async () => {
    try {
      await Api.init();
      await loadLocale(Api.currentUser.uiState.locale);
    } finally {
      loading = false;
    }
  });
  $effect(() => {
    loadLocale(Api.currentUser.uiState.locale);
  });
</script>

{#if loading}
  <Spinner />
{:else}
  <Router />
{/if}
