<script lang="ts">
  import { loadLocale } from "wuchale/load-utils";
  import { Router } from "sv-router";
  import "sv-router/generated";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import * as Api from "$lib/api";

  async function init() {
    await Api.init();
    await loadLocale(Api.currentUser.uiState.locale);
  }
</script>

{#await init()}
  <Spinner />
{:then}
  <Router />
{/await}
