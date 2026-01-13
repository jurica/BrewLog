<script lang="ts">
  import { loadLocale } from "wuchale/load-utils";
  import { Router } from "sv-router";
  import "sv-router/generated";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { getLocale } from "./locales/locales.svelte";

  async function init() {
    await loadLocale(getLocale());
  }
</script>

{#await init()}
  <Spinner />
{:then}
  <Router />
{/await}
