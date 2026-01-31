<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Api from "$lib/api";
  import { p } from "sv-router/generated";

  let href = $state(p("/bags/:bagId", { params: { bagId: bag.id } }));

  interface Props {
    bag: Api.Collections.Bags.Record;
  }
  let { bag }: Props = $props();
</script>

<a {href} class="group" data-test-id="card-{bag.expand?.bean?.name}">
  <Card.Root class="hover:border-primary/50 transition-all hover:shadow-lg">
    <Card.Header>
      <Card.Title class="group-hover:text-primary transition-colors">
        {bag.expand.bean.name}
      </Card.Title>
      <Card.Description>
        {#if bag.finish_date}
          Finished {new Date(bag.finish_date).toLocaleDateString(Api.currentUser.uiState.locale)}
        {:else if bag.open_date}
          Opened {new Date(bag.open_date).toLocaleDateString(Api.currentUser.uiState.locale)}
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
