<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { ChevronsUpDown, Check, Trash2 } from "@lucide/svelte";
  import * as Api from "$lib/api";
  import { cn } from "$lib/utils.js";
  import { navigate } from "sv-router/generated";
  import { tick } from "svelte";

  interface Props {
    bag?: Api.Bag;
  }

  const { bag }: Props = $props();

  let beans: Api.Bean[] = $state([]);
  let beanOpen = $state(false);
  let beanTriggerRef = $state<HTMLButtonElement>(null!);

  let formData = $state({
    bean: bag?.bean || "",
    initial_weight_g: bag?.initial_weight_g || "250",
    roast_date: bag?.roast_date || "",
    opened_date: bag?.opened_date || "",
    finished_date: bag?.finished_date || "",
    leftover_amount_g: bag?.leftover_amount_g || "",
    price: bag?.price || "",
    currency: bag?.currency || "EUR",
  });

  let isLoading = $state(false);
  let error = $state<string | null>(null);

  const closeAndFocusTrigger = async (triggerRef: HTMLButtonElement) => {
    beanOpen = false;
    await tick();
    triggerRef?.focus();
  };

  const selectedBeanLabel = $derived(
    beans.find((b) => b.id === formData.bean)?.name || "Select a bean...",
  );

  const loadBeans = async () => {
    try {
      const result = await Api.pb
        .collection("beans")
        .getList<Api.Bean>(1, 100, { expand: "roaster" });
      beans = result.items;
    } catch (err) {
      console.error("Failed to load beans:", err);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    isLoading = true;
    error = null;

    if (!formData.bean) {
      error = "Please select a bean";
      isLoading = false;
      return;
    }

    try {
      const data = new FormData();
      data.append("bean", formData.bean);
      data.append("initial_weight_g", String(formData.initial_weight_g));

      if (formData.roast_date) data.append("roast_date", formData.roast_date);
      if (formData.opened_date)
        data.append("opened_date", formData.opened_date);
      if (formData.finished_date)
        data.append("finished_date", formData.finished_date);
      if (formData.leftover_amount_g)
        data.append("leftover_amount_g", String(formData.leftover_amount_g));
      if (formData.price) data.append("price", String(formData.price));
      if (formData.currency) data.append("currency", formData.currency);

      if (bag?.id) {
        await Api.pb.collection("bags").update(bag.id, data);
      } else {
        const newBag = await Api.pb.collection("bags").create(data);
        navigate("/bags/:bagId", { params: { bagId: newBag.id } });
        return;
      }

      navigate("/bags/:bagId", { params: { bagId: bag!.id } });
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      isLoading = false;
    }
  };

  $effect(() => {
    loadBeans();
  });
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold">{bag ? "Edit Bag" : "New Bag"}</h1>
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
            <Popover.Trigger bind:ref={beanTriggerRef}>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="outline"
                  role="combobox"
                  aria-expanded={beanOpen}
                  class="w-full justify-between"
                >
                  {selectedBeanLabel}
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
                        formData.bean = bean.id;
                        closeAndFocusTrigger(beanTriggerRef);
                      }}
                    >
                      <Check
                        class={cn(
                          "mr-2 h-4 w-4",
                          formData.bean !== bean.id && "text-transparent",
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
          <label for="initial_weight_g" class="text-sm font-medium"
            >Initial Weight (g) *</label
          >
          <Input
            id="initial_weight_g"
            type="number"
            bind:value={formData.initial_weight_g}
            placeholder="0"
            required
          />
        </div>

        <!-- Dates Section -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label for="roast_date" class="text-sm font-medium"
              >Roast Date</label
            >
            <Input
              id="roast_date"
              type="date"
              bind:value={formData.roast_date}
            />
          </div>
          <div class="space-y-2">
            <label for="opened_date" class="text-sm font-medium"
              >Opened Date</label
            >
            <Input
              id="opened_date"
              type="date"
              bind:value={formData.opened_date}
            />
          </div>
          <div class="space-y-2">
            <label for="finished_date" class="text-sm font-medium"
              >Finished Date</label
            >
            <Input
              id="finished_date"
              type="date"
              bind:value={formData.finished_date}
            />
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
              bind:value={formData.leftover_amount_g}
              placeholder="0"
            />
          </div>
          <div class="space-y-2">
            <label for="price" class="text-sm font-medium">Price</label>
            <Input
              id="price"
              type="number"
              bind:value={formData.price}
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div class="space-y-2">
            <label for="currency" class="text-sm font-medium">Currency</label>
            <Input
              id="currency"
              type="text"
              bind:value={formData.currency}
              placeholder="EUR"
            />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : bag ? "Update Bag" : "Create Bag"}
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
