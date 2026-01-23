<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as Api from "$lib/api";
  import { navigate, p } from "sv-router/generated";
  import { Plus } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = $derived(Api.Collections.Roaster.getList());

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
  <h1 class="text-3xl font-bold">Roasters</h1>
  <ButtonGroup.Root>
    <Button size="sm" onclick={() => navigate("/roasters/new")}>
      <Plus class="mr-2 h-4 w-4" />
      New Roaster
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
      <p class="text-muted-foreground text-lg">No roasters yet</p>
      <p class="text-muted-foreground mt-2 text-sm">
        Create your first roaster to get started
      </p>
      <Button class="mt-4" onclick={() => navigate("/roasters/new")}>
        <Plus class="mr-2 h-4 w-4" />
        Create First Roaster
      </Button>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each response.data as roaster}
        {@const href = p("/roasters/:roasterId", {
          params: { roasterId: roaster.id }
        })}
        <a {href} class="group" data-test-id="card-{roaster.name}">
          <Card.Root
            class="hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <Card.Header>
              <Card.Title class="group-hover:text-primary transition-colors">
                {roaster.name}
              </Card.Title>
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
