<script lang="ts">
  import BagCardGrid from "$lib/components/Bag/CardGrid.svelte";
  import BagDataTable from "$lib/components/Bag/DataTable.svelte";
  import BagHeader from "$lib/components/Bag/Header.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { Plus } from "@lucide/svelte";
  import * as Api from "$lib/api";
  import { navigate } from "sv-router/generated";

  let response = $derived(
    Api.Collections.Bags.getList(Api.currentUser.uiState.bags.filter)
  );
</script>

<BagHeader />

<div class="space-y-6">
  {#if response.loading}
    <Spinner />
  {:else if response.data.length === 0}
    <div
      class="border-muted-foreground/30 rounded-lg border border-dashed py-12 text-center"
    >
      <p class="text-muted-foreground text-lg">No bags yet</p>
      <p class="text-muted-foreground mt-2 text-sm">
        Create your first bag to get started
      </p>
      <Button class="mt-4" onclick={() => navigate("/bags/new")}>
        <Plus class="mr-2 h-4 w-4" />
        Create First Bag
      </Button>
    </div>
  {:else if Api.currentUser.uiState.bags.view === "grid"}
    <BagCardGrid bags={response.data} />
  {:else}
    <BagDataTable bags={response.data} />
  {/if}
</div>
