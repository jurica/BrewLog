<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Api from "$lib/api";
  import { navigate, p } from "sv-router/generated";
  import { Plus } from "@lucide/svelte";

  let bagFilter: Api.Collections.Bags.Filters = $state("opened");
  const filterLabels: Api.Collections.Bags.FilterValues<string> = {
    unopened: "Unopened",
    opened: "Opened",
    finished: "Finished",
    all: "All"
  };

  let response = $derived(Api.Collections.Bags.getList(bagFilter));
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between @container/card">
    <h1 class="text-3xl font-bold">Bags</h1>
    <ToggleGroup.Root
      data-test-id="tg_bagfilter"
      type="single"
      bind:value={bagFilter}
      variant="outline"
      size="sm"
      class="hidden *:data-[slot=toggle-group-item]:!px-4 @[550px]/card:flex"
    >
      {#each Object.entries(filterLabels) as [key, label]}
        <ToggleGroup.Item value={key} disabled={bagFilter === key}
          >{label}</ToggleGroup.Item
        >
      {/each}
    </ToggleGroup.Root>
    <Select.Root type="single" bind:value={bagFilter}>
      <Select.Trigger
        size="sm"
        class="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[550px]/card:hidden"
        aria-label="Select a value"
      >
        <span data-slot="select-value">
          {filterLabels[bagFilter]}
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
  </div>

  {#if response.loading}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each Array(6) as _}
        <Card.Root>
          <Card.Header>
            <div class="h-6 w-3/4 rounded bg-muted animate-pulse"></div>
            <div class="mt-2 h-4 w-1/2 rounded bg-muted animate-pulse"></div>
          </Card.Header>
          <Card.Content>
            <div class="h-40 rounded bg-muted animate-pulse"></div>
          </Card.Content>
        </Card.Root>
      {/each}
    </div>
  {:else if response.data.length === 0}
    <div
      class="rounded-lg border border-dashed border-muted-foreground/30 py-12 text-center"
    >
      <p class="text-lg text-muted-foreground">No bags yet</p>
      <p class="mt-2 text-sm text-muted-foreground">
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
            class="transition-all hover:shadow-lg hover:border-primary/50"
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
                  src="/api/files/beans/{bag.expand.bean.id}/{bag.expand.bean
                    .picture}"
                  alt={bag.expand.bean.name}
                  class="h-40 w-full rounded object-contain"
                />
              {:else}
                <div
                  class="h-40 w-full rounded bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center"
                >
                  <span class="text-sm text-muted-foreground">No image</span>
                </div>
              {/if}
            </Card.Content>
          </Card.Root>
        </a>
      {/each}
    </div>
  {/if}
</div>
