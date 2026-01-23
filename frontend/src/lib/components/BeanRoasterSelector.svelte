<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { ChevronsUpDown, Check } from "@lucide/svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Api from "$lib/api";
  import { cn } from "$lib/utils.js";

  interface Props {
    bean: Api.Collections.Bean.Record;
    roasters: Api.Collections.Roaster.Record[];
  }
  let { bean = $bindable(), roasters }: Props = $props();

  let open = $state(false);
</script>

<Label for="roaster-search" class="text-sm font-medium">Roaster *</Label>
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
        {bean.expand?.roaster.name || "Select a roaster..."}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-full p-0">
    <Command.Root>
      <Command.Input id="roaster-search" placeholder="Search roaster..." />
      <Command.Empty>No roasters found.</Command.Empty>
      <Command.Group>
        {#each roasters as roaster}
          <Command.Item
            value={roaster.name}
            onSelect={() => {
              bean.roaster = roaster.id;
              bean.expand.roaster = roaster;
              open = false;
            }}
          >
            <Check
              class={cn(
                "mr-2 h-4 w-4",
                bean.roaster !== roaster.id && "text-transparent"
              )}
            />
            {roaster.name}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
