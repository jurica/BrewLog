<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as Api from "$lib/api";
  import { navigate } from "sv-router/generated";
  import { Plus, Ellipsis, LayoutGrid, LayoutList } from "@lucide/svelte";
  import BagFilterToggle from "$lib/components/BagFilterToggle.svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  const filterLabels: Api.Collections.Bags.FilterValues<string> = {
    unopened: "Unopened",
    opened: "Opened",
    finished: "Finished",
    all: "All"
  };

  let currentView = $derived(Api.currentUser.uiState.bags.view);

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });

  $effect(() => {
    Api.currentUser.uiState.bags.filter;
    Api.currentUser.uiState.bags.view;
    Api.Collections.Users.persistDebounced(Api.currentUser);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">Bags</h1>
  <BagFilterToggle
    bind:bagFilter={Api.currentUser.uiState.bags.filter}
    class="hidden *:data-[slot=toggle-group-item]:!px-4 @[600px]/header:flex"
  />
  <ButtonGroup.Root>
    <Button size="sm" variant="outline" onclick={() => navigate("/bags/new")}>
      <Plus class="mr-2 h-4 w-4" />
      New Bag
    </Button>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button
            {...props}
            variant="outline"
            size="icon-sm"
            aria-label="More Options"
          >
            <Ellipsis class="h-4 w-4" />
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>View</DropdownMenu.Label>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            disabled={currentView === "grid"}
            onclick={() => (Api.currentUser.uiState.bags.view = "grid")}
          >
            <LayoutGrid /> Grid
          </DropdownMenu.Item>
          <DropdownMenu.Item
            disabled={currentView === "table"}
            onclick={() => (Api.currentUser.uiState.bags.view = "table")}
          >
            <LayoutList />
            Table
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>Filter</DropdownMenu.Label>
        <DropdownMenu.Group>
          {#each Api.Collections.Bags.FilterKeys as filter}
            <DropdownMenu.Item disabled={filter === Api.currentUser.uiState.bags.filter} onclick={()=>Api.currentUser.uiState.bags.filter = filter}>{filterLabels[filter]}</DropdownMenu.Item>
          {/each}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </ButtonGroup.Root>
{/snippet}
