<script lang="ts">
  import { loadLocale } from "wuchale/load-utils";
  import { Router } from "sv-router";
  import "sv-router/generated";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { onMount } from "svelte";

  let locale = $state("en");
  let loading = $state(true);
  onMount(async () => {
    try {
      await loadLocale(locale);
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <Spinner />
{:else}
  <Router />
{/if}
