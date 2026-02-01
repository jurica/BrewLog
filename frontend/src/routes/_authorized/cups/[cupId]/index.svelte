<script lang="ts">
  import * as Api from "$lib/api";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { navigate, route } from "sv-router/generated";
  import { ArrowLeft, Ellipsis, Pen, Trash2, Coffee } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = $derived(Api.Collections.Cups.getOne(route.params.cupId));

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <Button
    variant="outline"
    size="sm"
    onclick={() => navigate("/cups")}
    class="gap-2"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to Cups
  </Button>
  <ButtonGroup.Root>
    <Button
      size="sm"
      variant="outline"
      onclick={() =>
        navigate("/cups/:cupId/edit", {
          params: { cupId: route.params.cupId }
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
          Delete Cup
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
          <div class="bg-muted h-96 w-full animate-pulse rounded"></div>
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
  {:else if response.data !== undefined}
    {@const cup = response.data}
    <!-- Main Cup Card with Photo -->
    <Card.Root>
      <Card.Header>
        <div class="flex items-center gap-2">
          <Coffee class="h-5 w-5" />
          <Card.Title
            >{cup.expand?.bag?.expand?.bean?.name || "Unknown Bean"}</Card.Title
          >
        </div>
        <Card.Description>
          {cup.expand?.bag?.expand?.bean?.expand?.roaster?.name ||
            cup.expand?.bag?.expand?.bean?.roaster ||
            "Unknown Roaster"}
        </Card.Description>
      </Card.Header>
      <Card.Content>
        {#if cup.pictures.length > 0}
          <img
            src={Api.getURL(cup, cup.pictures.at(0) as string)}
            alt="Cup"
            class="max-h-96 w-full rounded object-cover"
          />
        {:else}
          <div
            class="from-primary/20 to-primary/10 flex h-96 w-full items-center justify-center rounded bg-gradient-to-br"
          >
            <span class="text-muted-foreground text-lg">No photo available</span
            >
          </div>
        {/if}
      </Card.Content>
    </Card.Root>

    <!-- Info Grid -->
    <div class="grid gap-6 md:grid-cols-2">
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-base">Brew Details</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div>
            <p class="text-muted-foreground text-sm">Coffee Used</p>
            <p class="text-sm font-medium">{cup.used_coffee_g}g</p>
          </div>
          <div>
            <p class="text-muted-foreground text-sm">Yield</p>
            <p class="text-sm font-medium">{cup.yield_g} g</p>
          </div>
          {#if cup.water_temp_c}
            <div>
              <p class="text-muted-foreground text-sm">Water Temperature</p>
              <p class="text-sm font-medium">{cup.water_temp_c}°C</p>
            </div>
          {/if}
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title class="text-base">Tasting Notes</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4">
          {#if cup.rating}
            <div>
              <p class="text-muted-foreground text-sm">Rating</p>
              <p class="text-sm font-medium">{cup.rating}/5</p>
            </div>
          {/if}
          {#if cup.notes}
            <div>
              <p class="text-muted-foreground text-sm">Notes</p>
              <p class="text-sm">{cup.notes}</p>
            </div>
          {:else}
            <div>
              <p class="text-muted-foreground text-sm">No notes recorded</p>
            </div>
          {/if}
          <div>
            <p class="text-muted-foreground text-sm">Added</p>
            <p class="text-sm">
              {new Date(cup.created).toLocaleDateString(
                Api.currentUser.uiState.locale
              )}
            </p>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  {:else}
    <!-- Not Found State -->
    <div
      class="border-muted-foreground/30 rounded-lg border border-dashed py-12 text-center"
    >
      <p class="text-lg font-medium">Cup not found</p>
      <p class="text-muted-foreground mt-2 text-sm">
        The cup you're looking for doesn't exist or has been deleted
      </p>
      <Button class="mt-4" onclick={() => navigate("/cups")}>
        Back to Cups
      </Button>
    </div>
  {/if}
</div>
