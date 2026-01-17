<script lang="ts">
  import DatePicker from "$lib/components/DatePicker.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import {
    ChevronsUpDown,
    Check,
    Trash2,
  } from "@lucide/svelte";
  import * as Api from "$lib/api";
  import { cn } from "$lib/utils.js";
  import { navigate } from "sv-router/generated";
  import { Label } from "$lib/components/ui/label/index.js";

  interface Props {
    bag: Api.Collections.Bag.Record;
    beans: Api.Collections.Bean.Record[];
  }
  let { bag = $bindable(), beans }: Props = $props();
  let dateRoast = new Api.ZonedDateTimeProxy(bag, "roast_date");
  let dateOpened = new Api.ZonedDateTimeProxy(bag, "opened_date");
  let dateFinished = new Api.ZonedDateTimeProxy(bag, "finished_date");

  let beanOpen = $state(false);

  let isLoading = $state(false);
  let error = $state<string | null>(null);


  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    isLoading = true;
    error = null;

    if (!bag.bean) {
      error = "Please select a bean";
      isLoading = false;
      return;
    }

    try {
      if (bag?.id) {
        await Api.pb.collection("bags").update(bag.id, bag);
      } else {
        bag = await Api.pb.collection("bags").create<Api.Collections.Bag.Record>(bag);
      }

      navigate("/bags/:bagId", { params: { bagId: bag.id } });
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      isLoading = false;
    }
  };

  // $effect(() => {
  //   loadBeans();
  // });
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold">{bag.id ? "Edit Bag" : "New Bag"}</h1>
    {#if bag}
      <p class="text-sm text-muted-foreground mt-2">Update bag details</p>
    {:else}
      <p class="text-sm text-muted-foreground mt-2">Create a new bag entry</p>
    {/if}
  </div>

  <Card.Root>
    <Card.Header>
      <Card.Title>Bag Information</Card.Title>
    </Card.Header>
    <Card.Content>
      <form onsubmit={handleSubmit} class="space-y-6">
        {#if error}
          <div
            class="rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
          >
            {error}
          </div>
        {/if}

        <!-- Bean Selection (Combobox) -->
        <div class="space-y-2">
          <label for="bean-search" class="text-sm font-medium">Bean *</label>
          <Popover.Root bind:open={beanOpen}>
            <Popover.Trigger>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="outline"
                  role="combobox"
                  aria-expanded={beanOpen}
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
                        beanOpen = false;
                      }}
                    >
                      <Check
                        class={cn(
                          "mr-2 h-4 w-4",
                          bag.bean !== bean.id && "text-transparent",
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
        </div>

        <!-- Initial Weight -->
        <div class="space-y-2">
          <Label for="initial_weight_g" class="text-sm font-medium"
            >Initial Weight (g) *</Label
          >
          <Input
            id="initial_weight_g"
            type="number"
            bind:value={bag.initial_weight_g}
            placeholder="0"
            required
          />
        </div>

        <!-- Dates Section -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="space-y-2">
            <DatePicker bind:value={dateRoast.value} label="Roast Date" selectedDate={dateRoast.toString()}/>
          </div>
          <div class="space-y-2">
            <DatePicker bind:value={dateOpened.value} label="Opened Date" selectedDate={dateOpened.toString()}/>
          </div>
          <div class="space-y-2">
            <DatePicker bind:value={dateFinished.value} label="Finished Date" selectedDate={dateFinished.toString()}/>
          </div>
        </div>

        <!-- Usage & Price Section -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="space-y-2">
            <label for="leftover_amount_g" class="text-sm font-medium"
              >Leftover Amount (g)</label
            >
            <Input
              id="leftover_amount_g"
              type="number"
              bind:value={bag.leftover_amount_g}
              placeholder="0"
            />
          </div>
          <div class="space-y-2">
            <label for="price" class="text-sm font-medium">Price</label>
            <Input
              id="price"
              type="number"
              bind:value={bag.price}
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div class="space-y-2">
            <label for="currency" class="text-sm font-medium">Currency</label>
            <Input
              id="currency"
              type="text"
              bind:value={bag.currency}
              placeholder="EUR"
            />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : bag.id ? "Update Bag" : "Create Bag"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onclick={() => {
              if (bag?.id) {
                navigate("/bags/:bagId", { params: { bagId: bag.id } });
              } else {
                navigate("/bags");
              }
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
