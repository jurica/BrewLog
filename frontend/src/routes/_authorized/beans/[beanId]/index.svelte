<script lang="ts">
  import * as Api from "$lib/api";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { navigate, route } from "sv-router/generated";
  import { onMount } from "svelte";
  import { ArrowLeft, MoreHorizontal, Edit2, Trash2 } from "@lucide/svelte";

  // let bean: Api.Bean | undefined = $state();
  // let loading = $state(true);
  //
  // onMount(async () => {
  //   try {
  //     if (route.params.beanId !== undefined) {
  //       bean = await Api.pb
  //         .collection("beans")
  //         .getOne<Api.Bean>(route.params.beanId, { expand: "roaster" });
  //     }
  //   } finally {
  //     loading = false;
  //   }
  // });
  let response = $derived(Api.Collections.Bean.getOne(route.params.beanId));
</script>

<div class="space-y-6">
  <!-- Header Navigation -->
  <div class="flex items-center justify-between">
    <Button
      variant="outline"
      size="sm"
      onclick={() => navigate("/beans")}
      class="gap-2"
    >
      <ArrowLeft class="h-4 w-4" />
      Back to Beans
    </Button>
    <ButtonGroup.Root>
      <Button
        size="sm"
        variant="outline"
        onclick={() =>
          navigate("/beans/:beanId/edit", { params: { beanId: route.params.beanId } })}
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
            Delete Bean
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </ButtonGroup.Root>
  </div>

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
    {@const bean = response.data}
    <!-- Main Bean Card with Image -->
    <Card.Root>
      <Card.Header>
        <Card.Title>{bean.name}</Card.Title>
        <Card.Description>{bean.expand.roaster.name}</Card.Description>
      </Card.Header>
      <Card.Content>
        {#if bean.picture}
          <img
            src="/api/files/beans/{bean.id}/{bean.picture}"
            alt={bean.name}
            class="w-full max-h-96 rounded object-contain"
          />
        {:else}
          <div
            class="w-full h-96 rounded bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
          >
            <span class="text-lg text-muted-foreground">No image available</span
            >
          </div>
        {/if}
      </Card.Content>
    </Card.Root>

    <!-- Info Grid -->
    <div class="grid gap-6 md:grid-cols-2">
      <Card.Root>
        <Card.Header>
          <Card.Title class="text-base">Bean Details</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div>
            <p class="text-sm text-muted-foreground">ID</p>
            <p class="font-mono text-sm">{bean.id}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Added</p>
            <p class="text-sm">
              {new Date(bean.created).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Last Updated</p>
            <p class="text-sm">
              {new Date(bean.updated).toLocaleDateString()}
            </p>
          </div>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title class="text-base">Quick Stats</Card.Title>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div>
            <p class="text-sm text-muted-foreground">Status</p>
            <p class="text-sm font-medium">Active</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Bags in Collection</p>
            <p class="text-sm font-medium">—</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Total Brews</p>
            <p class="text-sm font-medium">—</p>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  {:else}
    <!-- Not Found State -->
    <div
      class="rounded-lg border border-dashed border-muted-foreground/30 py-12 text-center"
    >
      <p class="text-lg font-medium">Bean not found</p>
      <p class="mt-2 text-sm text-muted-foreground">
        The bean you're looking for doesn't exist or has been deleted
      </p>
      <Button class="mt-4" onclick={() => navigate("/beans")}>
        Back to Beans
      </Button>
    </div>
  {/if}
</div>
