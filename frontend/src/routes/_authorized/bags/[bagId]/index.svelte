<script lang="ts">
  import * as Api from "$lib/api";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { navigate, route } from "sv-router/generated";
  import { ArrowLeft, Ellipsis, Pen, Trash2 } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = $derived(Api.Collections.Bags.getOne(route.params.bagId!));

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <Button
    variant="outline"
    size="sm"
    onclick={() => navigate("/bags")}
    class="gap-2"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to Bags
  </Button>
  <ButtonGroup.Root>
    <Button
      size="sm"
      variant="outline"
      onclick={() =>
        navigate("/bags/:bagId/edit", {
          params: { bagId: route.params.bagId }
        })}
    >
      <Pen class="h-4 w-4" />
      Edit
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
        <DropdownMenu.Item class="text-destructive focus:text-destructive">
          <Trash2 class="h-4 w-4" />
          Delete Bag
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </ButtonGroup.Root>
{/snippet}

<div class="space-y-6">
  {#if response.loading}
    <!-- Loading state -->
    <div class="space-y-6">
      <Card.Root>
        <Card.Header>
          <div class="bg-muted h-6 w-3/4 animate-pulse rounded"></div>
          <div class="bg-muted mt-2 h-4 w-1/2 animate-pulse rounded"></div>
        </Card.Header>
        <Card.Content>
          <div class="bg-muted h-40 w-full animate-pulse rounded"></div>
        </Card.Content>
      </Card.Root>
      <div class="grid gap-6 md:grid-cols-2">
        {#each Array(2) as _}
          <Card.Root>
            <Card.Header>
              <div class="bg-muted h-6 w-1/2 animate-pulse rounded"></div>
            </Card.Header>
            <Card.Content>
              <div class="bg-muted h-20 animate-pulse rounded"></div>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    </div>
  {:else if response.data}
    {@const bag = response.data}
    <!-- Main Bag Card -->
    <Card.Root>
      <Card.Header>
        <Card.Title>{bag.expand.bean.name}</Card.Title>
        <Card.Description>
          {bag.expand.bean.expand?.roaster?.name || bag.expand.bean.roaster}
        </Card.Description>
      </Card.Header>
      <Card.Content>
        {#if bag.expand.bean.picture}
          <img
            src={Api.getURL(bag.expand.bean, bag.expand.bean.picture as string)}
            alt={bag.expand.bean.name}
            class="max-h-60 w-full rounded object-contain"
          />
        {:else}
          <div
            class="from-primary/20 to-primary/10 flex h-40 w-full items-center justify-center rounded bg-gradient-to-br"
          >
            <span class="text-muted-foreground text-sm">No image available</span
            >
          </div>
        {/if}
      </Card.Content>
    </Card.Root>

    <!-- Info Grid -->
    <div class="grid gap-6 md:grid-cols-2">
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-base">Bag Details</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div>
            <p class="text-muted-foreground text-sm">Initial Weight</p>
            <p class="text-sm font-medium">{bag.initial_weight_g}g</p>
          </div>
          {#if bag.roast_date}
            <div>
              <p class="text-muted-foreground text-sm">Roasted</p>
              <p class="text-sm">
                {new Date(bag.roast_date).toLocaleDateString(
                  Api.currentUser.uiState.locale
                )}
              </p>
            </div>
          {/if}
          {#if bag.open_date}
            <div>
              <p class="text-muted-foreground text-sm">Opened</p>
              <p class="text-sm">
                {new Date(bag.open_date).toLocaleDateString(
                  Api.currentUser.uiState.locale
                )}
              </p>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title class="text-base">Usage Stats</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4">
          {#if bag.leftover_amount_g}
            <div>
              <p class="text-muted-foreground text-sm">Leftover</p>
              <p class="text-sm font-medium">{bag.leftover_amount_g}g</p>
            </div>
          {/if}
          {#if bag.finish_date}
            <div>
              <p class="text-muted-foreground text-sm">Finished</p>
              <p class="text-sm">
                {new Date(bag.finish_date).toLocaleDateString(
                  Api.currentUser.uiState.locale
                )}
              </p>
            </div>
          {/if}
          {#if bag.price}
            <div>
              <p class="text-muted-foreground text-sm">Price</p>
              <p class="text-sm font-medium">
                {bag.price}
                {bag.currency || "EUR"}
              </p>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
  {:else}
    <!-- Not Found State -->
    <div
      class="border-muted-foreground/30 rounded-lg border border-dashed py-12 text-center"
    >
      <p class="text-lg font-medium">Bag not found</p>
      <p class="text-muted-foreground mt-2 text-sm">
        The bag you're looking for doesn't exist or has been deleted
      </p>
      <Button class="mt-4" onclick={() => navigate("/bags")}>
        Back to Bags
      </Button>
    </div>
  {/if}
</div>
