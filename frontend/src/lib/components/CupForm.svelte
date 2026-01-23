<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import * as Api from "$lib/api";
  import { navigate } from "sv-router/generated";
  import CupBagSelector from "./CupBagSelector.svelte";

  interface Props {
    cup: Api.Collections.Cups.Record;
    bags: Api.Collections.Bags.Record[];
  }

  let { cup = $bindable(), bags }: Props = $props();

  let isLoading = $state(false);
  let error = $state<string | null>(null);

  const handlePhotoChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      cup.pictures[0] = file;
    }
  };

  let photoPreview = $derived.by(() => {
    let picture = cup.pictures.at(0);
    if (picture instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(picture);
    }
    if (typeof picture === "string") {
      return Api.getURL(cup, picture);
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    isLoading = true;
    error = null;

    try {
      cup = await Api.Collections.Cups.persist(cup);
      navigate("/cups/:cupId", { params: { cupId: cup.id } });
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="space-y-6">
  <Card.Root>
    <Card.Header>
      <Card.Title>Brew Information</Card.Title>
    </Card.Header>
    <Card.Content>
      <form onsubmit={handleSubmit} class="space-y-6">
        {#if error}
          <div
            class="bg-destructive/10 text-destructive rounded-lg p-4 text-sm"
          >
            {error}
          </div>
        {/if}

        <!-- Bag Selection (Combobox) -->
        <div class="space-y-2">
          <CupBagSelector bind:cup {bags} />
        </div>

        <!-- Brew Parameters -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div class="space-y-2">
            <Label for="used_coffee_g" class="text-sm font-medium"
              >Coffee (g)</Label
            >
            <Input
              id="used_coffee_g"
              type="number"
              bind:value={cup.used_coffee_g}
              step="1"
            />
          </div>
          <div class="space-y-2">
            <Label for="yield_g" class="text-sm font-medium">Yield (g)</Label>
            <Input
              id="yield_ml"
              type="number"
              bind:value={cup.yield_g}
              step="1"
            />
          </div>
          <div class="space-y-2">
            <Label for="water_temp_c" class="text-sm font-medium"
              >Water Temp (°C)</Label
            >
            <Input
              id="water_temp_c"
              type="number"
              bind:value={cup.water_temp_c}
              step="1"
            />
          </div>
          <div class="space-y-2">
            <Label for="brew_time_s" class="text-sm font-medium"
              >Brew Time (s)</Label
            >
            <Input
              id="brew_time_s"
              type="number"
              bind:value={cup.brew_time_s}
              step="1"
            />
          </div>
        </div>

        <!-- Rating -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="rating" class="text-sm font-medium">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              bind:value={cup.rating}
              min="0"
              max="5"
              step="0.5"
            />
          </div>
        </div>

        <!-- Notes -->
        <div class="space-y-2">
          <Label for="notes" class="text-sm font-medium">Notes</Label>
          <Textarea
            id="notes"
            bind:value={cup.notes}
            placeholder="Tasting notes, observations..."
          />
        </div>

        <!-- Photo Upload -->
        <div class="space-y-2">
          <Label for="photo" class="text-sm font-medium">Photo</Label>
          {#if cup.pictures.length > 0}
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
            {isLoading ? "Saving..." : cup.id ? "Update Cup" : "Create Cup"}
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
