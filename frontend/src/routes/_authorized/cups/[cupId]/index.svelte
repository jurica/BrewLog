<script lang="ts">
  import * as Api from "$lib/api";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { navigate, route } from "sv-router/generated";
  import {
    ArrowLeft,
    MoreHorizontal,
    Edit2,
    Trash2,
    Coffee
  } from "@lucide/svelte";
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
      <Edit2 class="h-4 w-4" />
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
            <MoreHorizontal class="h-4 w-4" />
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
          <div class="h-6 w-3/4 rounded bg-muted animate-pulse"></div>
          <div class="mt-2 h-4 w-1/2 rounded bg-muted animate-pulse"></div>
        </Card.Header>
        <Card.Content>
          <div class="w-full h-96 rounded bg-muted animate-pulse"></div>
        </Card.Content>
      </Card.Root>
      <div class="grid gap-6 md:grid-cols-2">
        {#each Array(2) as _}
          <Card.Root>
            <Card.Header>
              <div class="h-6 w-1/2 rounded bg-muted animate-pulse"></div>
            </Card.Header>
            <Card.Content>
              <div class="h-20 rounded bg-muted animate-pulse"></div>
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
            src={Api.pb.files.getURL(cup, cup.pictures.at(0))}
            alt="Cup"
            class="w-full max-h-96 rounded object-cover"
          />
        {:else}
          <div
            class="w-full h-96 rounded bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
          >
            <span class="text-lg text-muted-foreground">No photo available</span
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
            <p class="text-sm text-muted-foreground">Coffee Used</p>
            <p class="text-sm font-medium">{cup.used_coffee_g}g</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Yield</p>
            <p class="text-sm font-medium">{cup.yield_g} g</p>
          </div>
          {#if cup.water_temp_c}
            <div>
              <p class="text-sm text-muted-foreground">Water Temperature</p>
              <p class="text-sm font-medium">{cup.water_temp_c}°C</p>
            </div>
          {/if}
          {#if cup.timestamp}
            <div>
              <p class="text-sm text-muted-foreground">Brewed</p>
              <p class="text-sm">
                {new Date(cup.timestamp).toLocaleString()}
              </p>
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
              <p class="text-sm text-muted-foreground">Rating</p>
              <p class="text-sm font-medium">{cup.rating}/5</p>
            </div>
          {/if}
          {#if cup.notes}
            <div>
              <p class="text-sm text-muted-foreground">Notes</p>
              <p class="text-sm">{cup.notes}</p>
            </div>
          {:else}
            <div>
              <p class="text-sm text-muted-foreground">No notes recorded</p>
            </div>
          {/if}
          <div>
            <p class="text-sm text-muted-foreground">Added</p>
            <p class="text-sm">
              {new Date(cup.created).toLocaleDateString()}
            </p>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  {:else}
    <!-- Not Found State -->
    <div
      class="rounded-lg border border-dashed border-muted-foreground/30 py-12 text-center"
    >
      <p class="text-lg font-medium">Cup not found</p>
      <p class="mt-2 text-sm text-muted-foreground">
        The cup you're looking for doesn't exist or has been deleted
      </p>
      <Button class="mt-4" onclick={() => navigate("/cups")}>
        Back to Cups
      </Button>
    </div>
  {/if}
</div>
