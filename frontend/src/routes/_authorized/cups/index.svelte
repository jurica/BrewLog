<script lang="ts">
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as Api from "$lib/api";
  import { navigate, p } from "sv-router/generated";
  import { Plus, Coffee, ChevronLeft, ChevronRight } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = $derived(
    Api.Collections.Cups.getList(Api.currentUser.uiState.cups.page)
  );

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });

  $effect(() => {
    Api.currentUser.uiState.cups.page;
    Api.Collections.Users.persistDebounced(Api.currentUser);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">Cups</h1>
  <ButtonGroup.Root>
    <Button size="sm" onclick={() => navigate("/cups/new")}>
      <Plus class="mr-2 h-4 w-4" />
      New Cup
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
      <p class="text-muted-foreground text-lg">No cups yet</p>
      <p class="text-muted-foreground mt-2 text-sm">
        Create your first cup to get started
      </p>
      <Button class="mt-4" onclick={() => navigate("/cups/new")}>
        <Plus class="mr-2 h-4 w-4" />
        Create First Cup
      </Button>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each response.data as cup}
        {@const href = p("/cups/:cupId", { params: { cupId: cup.id } })}
        <a
          {href}
          class="group"
          data-test-id="card-{cup.expand?.bag?.expand?.bean?.name}"
        >
          <Card.Root
            class="hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <Card.Header>
              <Card.Title
                class="group-hover:text-primary flex items-center gap-2 transition-colors"
              >
                <Coffee class="h-5 w-5" />
                {cup.expand?.bag?.expand?.bean?.name || "Unknown Bean"}
              </Card.Title>
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
                  class="mb-4 h-40 w-full rounded object-cover"
                />
              {/if}
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-muted-foreground text-xs">Date</span>
                  <span class="text-sm font-medium"
                    >{new Date(cup.created).toLocaleString(
                      Api.currentUser.uiState.locale
                    )}</span
                  >
                </div>
                {#if cup.rating}
                  <div class="flex justify-between">
                    <span class="text-muted-foreground text-xs">Rating</span>
                    <span class="text-sm font-medium">{cup.rating}/5</span>
                  </div>
                {/if}
                <div class="flex justify-between">
                  <span class="text-muted-foreground text-xs">Coffee</span>
                  <span class="text-sm font-medium">{cup.used_coffee_g}g</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground text-xs">Yield</span>
                  <span class="text-sm font-medium">{cup.yield_g} g</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground text-xs">Brew Time</span>
                  <span class="text-sm font-medium">{cup.brew_time_s} s</span>
                </div>
                {#if cup.water_temp_c}
                  <div class="flex justify-between">
                    <span class="text-muted-foreground text-xs"
                      >Temperature</span
                    >
                    <span class="text-sm font-medium">{cup.water_temp_c}°C</span
                    >
                  </div>
                {/if}
              </div>
            </Card.Content>
          </Card.Root>
        </a>
      {/each}
    </div>
  {/if}
  <div class="sticky bottom-0 z-50 flex flex-row items-center justify-center">
    <Card.Root>
      <Card.Content class="-m-4">
        <Pagination.Root
          count={response.totalItems}
          page={Api.currentUser.uiState.cups.page}
          onPageChange={(page) => (Api.currentUser.uiState.cups.page = page)}
          perPage={9}
        >
          {#snippet children({ pages, currentPage })}
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.PrevButton>
                  <ChevronLeft />
                </Pagination.PrevButton>
              </Pagination.Item>
              {#each pages as page (page.key)}
                {#if page.type === "ellipsis"}
                  <Pagination.Item>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                {:else}
                  <Pagination.Item>
                    <Pagination.Link
                      {page}
                      isActive={currentPage === page.value}
                    >
                      {page.value}
                    </Pagination.Link>
                  </Pagination.Item>
                {/if}
              {/each}
              <Pagination.Item>
                <Pagination.NextButton>
                  <ChevronRight />
                </Pagination.NextButton>
              </Pagination.Item>
            </Pagination.Content>
          {/snippet}
        </Pagination.Root>
      </Card.Content>
    </Card.Root>
  </div>
</div>
