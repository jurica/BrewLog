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

  let response = $derived(
    Api.Collections.Roaster.getOne(route.params.roasterId)
  );

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <Button
    variant="outline"
    size="sm"
    onclick={() => navigate("/roasters")}
    class="gap-2"
  >
    <ArrowLeft class="h-4 w-4" />
    Back to Roasters
  </Button>
  <ButtonGroup.Root>
    <Button
      size="sm"
      variant="outline"
      onclick={() =>
        navigate("/roasters/:roasterId/edit", {
          params: { roasterId: route.params.roasterId }
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
          Delete Roaster
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
    {@const roaster = response.data}
    <!-- Main Roaster Card with Image -->
    <Card.Root>
      <Card.Header>
        <Card.Title>{roaster.name}</Card.Title>
        {#if roaster.website}
          <Card.Description>
            <a
              href={roaster.website}
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              {roaster.website}
            </a>
          </Card.Description>
        {/if}
      </Card.Header>
      <Card.Content>
        {#if roaster.picture}
          <img
            src={Api.getURL(roaster, roaster.picture as string)}
            alt={roaster.name}
            class="max-h-96 w-full rounded object-contain"
          />
        {:else}
          <div
            class="from-primary/20 to-primary/10 flex h-96 w-full items-center justify-center rounded bg-gradient-to-br"
          >
            <span class="text-muted-foreground text-lg">No image available</span
            >
          </div>
        {/if}
      </Card.Content>
    </Card.Root>

    <!-- Info Grid -->
    <div class="grid gap-6 md:grid-cols-1">
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-base">Roaster Details</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div>
            <p class="text-muted-foreground text-sm">ID</p>
            <p class="font-mono text-sm">{roaster.id}</p>
          </div>
          <div>
            <p class="text-muted-foreground text-sm">Added</p>
            <p class="text-sm">
              {new Date(roaster.created).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p class="text-muted-foreground text-sm">Last Updated</p>
            <p class="text-sm">
              {new Date(roaster.updated).toLocaleDateString()}
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
      <p class="text-lg font-medium">Roaster not found</p>
      <p class="text-muted-foreground mt-2 text-sm">
        The roaster you're looking for doesn't exist or has been deleted
      </p>
      <Button class="mt-4" onclick={() => navigate("/roasters")}>
        Back to Roasters
      </Button>
    </div>
  {/if}
</div>
