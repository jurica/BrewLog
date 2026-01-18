<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { ChevronsUpDown, Check } from "@lucide/svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Api from "$lib/api";
  import { cn } from "$lib/utils.js";

  interface Props {
    cup: Api.Collections.Cups.Record;
    bags: Api.Collections.Bags.Record[];
  }
  let { cup = $bindable(), bags }: Props = $props();

  let open = $state(false);

  const selectedBagLabel = $derived(() => {
    const bag = bags.find((b) => b.id === cup.bag);
    if (!bag) return "Select a bag...";
    return `${bag.expand?.bean?.name || "Unknown"} - ${bag.expand?.bean?.expand?.roaster?.name || bag.expand?.bean?.roaster || ""}`;
  });
</script>

<Label for="bean-search" class="text-sm font-medium">Bag *</Label>
<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        class="w-full justify-between"
      >
        {selectedBagLabel()}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-full p-0">
    <Command.Root>
      <Command.Input id="bean-search" placeholder="Search beans..." />
      <Command.Empty>No bean found.</Command.Empty>
      <Command.Group>
        {#each bags as bag}
          <Command.Item
            value={`${bag.expand?.bean?.name} ${bag.expand?.bean?.roaster}`}
            onSelect={() => {
              cup.bag = bag.id;
              cup.expand.bag = bag;
              open = false;
            }}
          >
            <Check
              class={cn(
                "mr-2 h-4 w-4",
                cup.bag !== bag.id && "text-transparent"
              )}
            />
            <div class="flex flex-col">
              <span>{bag.expand.bean.name}</span>
              <span class="text-xs text-muted-foreground">
                {bag.expand.bean.expand.roaster.name}
              </span>
            </div>
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
