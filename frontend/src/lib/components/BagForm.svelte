<script lang="ts">
  import DatePicker from "$lib/components/DatePicker.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Api from "$lib/api";
  import { navigate } from "sv-router/generated";
  import { Label } from "$lib/components/ui/label/index.js";
  import BagBeanSelector from "./BagBeanSelector.svelte";

  interface Props {
    bag: Api.Collections.Bags.Record;
    beans: Api.Collections.Bean.Record[];
  }
  let { bag = $bindable(), beans }: Props = $props();

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
      bag = await Api.Collections.Bags.persist(bag);
      navigate("/bags/:bagId", { params: { bagId: bag.id } });
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold">{bag.id ? "Edit Bag" : "New Bag"}</h1>
    {#if bag.id}
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

        <div class="space-y-2">
          <BagBeanSelector bind:bag {beans} />
        </div>

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

        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div class="space-y-2">
            <DatePicker record={bag} property="roast_date" label="Roast Date" />
          </div>
          <div class="space-y-2">
            <DatePicker
              record={bag}
              property="purchase_date"
              label="Purchase Date"
            />
          </div>
          <div class="space-y-2">
            <DatePicker record={bag} property="open_date" label="Opened Date" />
          </div>
          <div class="space-y-2">
            <DatePicker
              record={bag}
              property="finish_date"
              label="Finished Date"
            />
          </div>
        </div>

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
