<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Api from "$lib/api";
  import { navigate, p } from "sv-router/generated";
  import { Plus } from "@lucide/svelte";
  import BagFilterToggle from "$lib/components/BagFilterToggle.svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";
  import { filter } from "./filter.svelte";

  // let bagFilter: Api.Collections.Bags.Filters = $state("opened");
  const filterLabels: Api.Collections.Bags.FilterValues<string> = {
    unopened: "Unopened",
    opened: "Opened",
    finished: "Finished",
    all: "All"
  };

  let response = $derived(Api.Collections.Bags.getList(filter.value));

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">Bags</h1>
  <BagFilterToggle
    bind:bagFilter={filter.value}
    class="hidden *:data-[slot=toggle-group-item]:!px-4 @[550px]/header:flex"
  />
  <Select.Root type="single" bind:value={filter.value}>
    <Select.Trigger
      size="sm"
      class="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[550px]/header:hidden"
      aria-label="Select a value"
    >
      <span data-slot="select-value">
        {filterLabels[filter.value]}
      </span>
    </Select.Trigger>
    <Select.Content class="rounded-xl">
      {#each Object.entries(filterLabels) as [key, label]}
        <Select.Item value={key} class="rounded-lg">{label}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
  <ButtonGroup.Root>
    <Button size="sm" onclick={() => navigate("/bags/new")}>
      <Plus class="mr-2 h-4 w-4" />
      New Bag
    </Button>
  </ButtonGroup.Root>
{/snippet}

<div class="space-y-6">
  {#if response.loading}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each Array(6) as _}
        <Card.Root>
          <Card.Header>
            <div class="bg-muted h-6 w-3/4 animate-pulse rounded"></div>
            <div class="bg-muted mt-2 h-4 w-1/2 animate-pulse rounded"></div>
          </Card.Header>
          <Card.Content>
            <div class="bg-muted h-40 animate-pulse rounded"></div>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
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
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each response.data as bag}
        {@const href = p("/bags/:bagId", { params: { bagId: bag.id } })}
        <a {href} class="group" data-test-id="card-{bag.expand?.bean?.name}">
          <Card.Root
            class="hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <Card.Header>
              <Card.Title class="group-hover:text-primary transition-colors">
                {bag.expand.bean.name}
              </Card.Title>
              <Card.Description>
                {#if bag.finish_date}
                  Finished {new Date(bag.finish_date).toLocaleDateString()}
                {:else if bag.open_date}
                  Opened {new Date(bag.open_date).toLocaleDateString()}
                {:else}
                  Unopened
                {/if}
              </Card.Description>
            </Card.Header>
            <Card.Content>
              {#if bag.expand.bean.picture}
                <img
                  src={Api.getURL(bag.expand.bean, bag.expand.bean.picture as string)}
                  alt={bag.expand.bean.name}
                  class="h-40 w-full rounded object-contain"
                />
              {:else}
                <div
                  class="from-primary/10 to-primary/5 flex h-40 w-full items-center justify-center rounded bg-gradient-to-br"
                >
                  <span class="text-muted-foreground text-sm">No image</span>
                </div>
              {/if}
            </Card.Content>
          </Card.Root>
        </a>
      {/each}
    </div>
  {/if}
</div>
