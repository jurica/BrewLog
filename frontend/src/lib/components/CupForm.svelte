<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { ChevronsUpDown, Check } from "@lucide/svelte";
  import * as Api from "$lib/api";
  import { cn } from "$lib/utils.js";
  import { navigate } from "sv-router/generated";
  import { tick } from "svelte";

  interface Props {
    cup?: Api.Collections.Cups.Record;
  }

  const { cup }: Props = $props();

  let bags: Api.Bag[] = $state([]);
  let bagOpen = $state(false);
  let bagTriggerRef = $state<HTMLButtonElement>(null!);
  let photoPreview = $state<string | undefined>(
    cup?.pictures.length > 0
      ? Api.pb.files.getURL(cup, cup.pictures.at(0))
      : undefined
  );

  let formData = $state({
    bag: cup?.expand.bag.id || "",
    used_coffee_g: cup?.used_coffee_g || "",
    yield_g: cup?.yield_g || "",
    water_temp_c: cup?.water_temp_c || "",
    brew_time_s: cup?.brew_time_s || "",
    rating: cup?.rating || "",
    notes: cup?.notes || "",
    photo: undefined as File | undefined
  });

  let isLoading = $state(false);
  let error = $state<string | null>(null);

  const closeAndFocusTrigger = async (triggerRef: HTMLButtonElement) => {
    bagOpen = false;
    await tick();
    triggerRef?.focus();
  };

  const selectedBagLabel = $derived(() => {
    const bag = bags.find((b) => b.id === formData.bag);
    if (!bag) return "Select a bag...";
    return `${bag.expand?.bean?.name || "Unknown"} - ${bag.expand?.bean?.expand?.roaster?.name || bag.expand?.bean?.roaster || ""}`;
  });

  const loadBags = async () => {
    try {
      const result = await Api.pb
        .collection("bags")
        .getList<Api.Bag>(1, 100, { expand: "bean.roaster" });
      bags = result.items;
    } catch (err) {
      console.error("Failed to load bags:", err);
    }
  };

  const handlePhotoChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      formData.photo = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    isLoading = true;
    error = null;

    try {
      const data = new FormData();
      data.append("bag", formData.bag);
      data.append("used_coffee_g", String(formData.used_coffee_g));
      data.append("yield_g", String(formData.yield_g));
      data.append("brew_time_s", String(formData.brew_time_s));

      if (formData.water_temp_c)
        data.append("water_temp_c", String(formData.water_temp_c));
      if (formData.rating) data.append("rating", String(formData.rating));

      if (formData.notes) data.append("notes", formData.notes);
      if (formData.photo) data.append("pictures", formData.photo);

      if (cup?.id) {
        await Api.pb.collection("cups").update(cup.id, data);
      } else {
        const newCup = await Api.pb.collection("cups").create(data);
        navigate("/cups/:cupId", { params: { cupId: newCup.id } });
        return;
      }

      navigate("/cups/:cupId", { params: { cupId: cup!.id } });
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      isLoading = false;
    }
  };

  $effect(() => {
    loadBags();
  });
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold">{cup ? "Edit Cup" : "New Cup"}</h1>
    {#if cup}
      <p class="text-sm text-muted-foreground mt-2">Update cup details</p>
    {:else}
      <p class="text-sm text-muted-foreground mt-2">Record a new brew</p>
    {/if}
  </div>

  <Card.Root>
    <Card.Header>
      <Card.Title>Brew Information</Card.Title>
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

        <!-- Bag Selection (Combobox) -->
        <div class="space-y-2">
          <label for="bag-search" class="text-sm font-medium">Bag *</label>
          <Popover.Root bind:open={bagOpen}>
            <Popover.Trigger bind:ref={bagTriggerRef}>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="outline"
                  role="combobox"
                  aria-expanded={bagOpen}
                  class="w-full justify-between"
                >
                  {selectedBagLabel()}
                  <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-full p-0">
              <Command.Root>
                <Command.Input id="bag-search" placeholder="Search bags..." />
                <Command.Empty>No bag found.</Command.Empty>
                <Command.Group>
                  {#each bags as bag}
                    <Command.Item
                      value={`${bag.expand?.bean?.name} ${bag.expand?.bean?.roaster}`}
                      onSelect={() => {
                        formData.bag = bag.id;
                        closeAndFocusTrigger(bagTriggerRef);
                      }}
                    >
                      <Check
                        class={cn(
                          "mr-2 h-4 w-4",
                          formData.bag !== bag.id && "text-transparent"
                        )}
                      />
                      <div class="flex flex-col">
                        <span>{bag.expand?.bean?.name || "Unknown"}</span>
                        <span class="text-xs text-muted-foreground">
                          {bag.expand?.bean?.expand?.roaster?.name ||
                            bag.expand?.bean?.roaster ||
                            ""}
                        </span>
                      </div>
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
        </div>

        <!-- Brew Parameters -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div class="space-y-2">
            <label for="used_coffee_g" class="text-sm font-medium"
              >Coffee (g)</label
            >
            <Input
              id="used_coffee_g"
              type="number"
              bind:value={formData.used_coffee_g}
              step="1"
            />
          </div>
          <div class="space-y-2">
            <label for="yield_g" class="text-sm font-medium">Yield (g)</label>
            <Input
              id="yield_ml"
              type="number"
              bind:value={formData.yield_g}
              step="1"
            />
          </div>
          <div class="space-y-2">
            <label for="water_temp_c" class="text-sm font-medium"
              >Water Temp (°C)</label
            >
            <Input
              id="water_temp_c"
              type="number"
              bind:value={formData.water_temp_c}
              step="1"
            />
          </div>
          <div class="space-y-2">
            <label for="brew_time_s" class="text-sm font-medium"
              >Brew Time (s)</label
            >
            <Input
              id="brew_time_s"
              type="number"
              bind:value={formData.brew_time_s}
              step="1"
            />
          </div>
        </div>

        <!-- Rating -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label for="rating" class="text-sm font-medium">Rating (1-5)</label>
            <Input
              id="rating"
              type="number"
              bind:value={formData.rating}
              min="1"
              max="5"
              step="0.5"
            />
          </div>
        </div>

        <!-- Notes -->
        <div class="space-y-2">
          <label for="notes" class="text-sm font-medium">Notes</label>
          <Textarea
            id="notes"
            bind:value={formData.notes}
            placeholder="Tasting notes, observations..."
            rows="4"
          />
        </div>

        <!-- Photo Upload -->
        <div class="space-y-2">
          <label for="photo" class="text-sm font-medium">Photo</label>
          {#if photoPreview}
            <div class="mb-4">
              <img
                src={photoPreview}
                alt="Preview"
                class="h-40 w-full rounded object-cover"
              />
            </div>
          {/if}
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onchange={handlePhotoChange}
          />
        </div>

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : cup ? "Update Cup" : "Create Cup"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onclick={() => {
              if (cup?.id) {
                navigate("/cups/:cupId", { params: { cupId: cup.id } });
              } else {
                navigate("/cups");
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
