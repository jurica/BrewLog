<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { ChevronsUpDown, Check } from "@lucide/svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Api from "$lib/api";
  import { cn } from "$lib/utils.js";

  interface Props {
    bag: Api.Collections.Bag.Record;
    beans: Api.Collections.Bean.Record[];
  }
  let { bag = $bindable(), beans }: Props = $props();

  let open = $state(false);
</script>

<Label for="bean-search" class="text-sm font-medium">Bean *</Label>
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
        {bag.expand?.bean.name || "Select a bean..."}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-full p-0">
    <Command.Root>
      <Command.Input id="bean-search" placeholder="Search beans..." />
      <Command.Empty>No bean found.</Command.Empty>
      <Command.Group>
        {#each beans as bean}
          <Command.Item
            value={bean.name}
            onSelect={() => {
              bag.bean = bean.id;
              bag.expand.bean = bean;
              open = false;
            }}
          >
            <Check
              class={cn(
                "mr-2 h-4 w-4",
                bag.bean !== bean.id && "text-transparent"
              )}
            />
            {bean.name}
            <span class="ml-2 text-xs text-muted-foreground">
              ({bean.expand?.roaster?.name || bean.roaster})
            </span>
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
