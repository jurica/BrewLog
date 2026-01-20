<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import * as Api from "$lib/api";
  import { navigate, p } from "sv-router/generated";
  import { Plus } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { getHeaderContext } from "$lib/layoutHeaderContext";

  let response = $derived(Api.Collections.Bean.getList());

  onMount(() => {
    getHeaderContext().set(headerContent);
    return () => getHeaderContext().set(null);
  });
</script>

{#snippet headerContent()}
    <h1 class="text-3xl font-bold">Beans</h1>
    <ButtonGroup.Root>
      <Button size="sm" onclick={() => navigate("/beans/new")}>
        <Plus class="mr-2 h-4 w-4" />
        New Bean
      </Button>
    </ButtonGroup.Root>
{/snippet}

<div class="space-y-6">
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
      <p class="text-lg text-muted-foreground">No beans yet</p>
      <p class="mt-2 text-sm text-muted-foreground">
        Create your first bean to get started
      </p>
      <Button class="mt-4" onclick={() => navigate("/beans/new")}>
        <Plus class="mr-2 h-4 w-4" />
        Create First Bean
      </Button>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each response.data as bean}
        {@const href = p("/beans/:beanId", { params: { beanId: bean.id } })}
        <a {href} class="group" data-test-id="card-{bean.name}">
          <Card.Root
            class="transition-all hover:shadow-lg hover:border-primary/50"
          >
            <Card.Header>
              <Card.Title class="group-hover:text-primary transition-colors">
                {bean.name}
              </Card.Title>
              <Card.Description>{bean.expand.roaster.name}</Card.Description>
            </Card.Header>
            <Card.Content>
              {#if bean.picture}
                <img
                  src="/api/files/beans/{bean.id}/{bean.picture}"
                  alt={bean.name}
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
