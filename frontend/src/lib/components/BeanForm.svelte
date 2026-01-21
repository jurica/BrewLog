<script lang="ts">
  import * as Api from "$lib/api";
  import { Button } from "$lib/components/ui/button/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { navigate } from "sv-router/generated";
  import {
    LoaderCircle,
    Trash2,
    ChevronsUpDown,
    Check
  } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { cn } from "$lib/utils";
  import { tick } from "svelte";

  interface Props {
    beanId?: string;
    initialData?: Api.Collections.Bean.Record;
  }

  let { beanId, initialData }: Props = $props();

  let formData = $state({
    name: initialData?.name ?? "",
    roaster: initialData?.roaster ?? "",
    picture: undefined as File | undefined
  });

  let roasters = $state<Api.Roaster[]>([]);
  let currentImageUrl = $state<string | undefined>(
    initialData?.picture
      ? Api.pb.getFileUrl(initialData, initialData.picture)
      : undefined
  );
  let loading = $state(false);
  let roastersLoading = $state(true);
  let submitted = $state(false);
  let error = $state<string | null>(null);
  let roasterOpen = $state(false);
  let triggerRef = $state<HTMLButtonElement>(null!);

  onMount(async () => {
    try {
      roasters = await Api.pb.collection("roasters").getFullList<Api.Roaster>();
    } finally {
      roastersLoading = false;
    }
  });

  const selectedRoasterLabel = $derived(
    roasters.find((r) => r.id === formData.roaster)?.name
  );

  function closeAndFocusTrigger() {
    roasterOpen = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  const isEditing = !!beanId;
  const submitButtonText = isEditing ? "Update Bean" : "Create Bean";

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = null;
    submitted = true;

    try {
      if (!formData.name.trim()) {
        error = "Bean name is required";
        loading = false;
        return;
      }

      if (!formData.roaster.trim()) {
        error = "Roaster is required";
        loading = false;
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("roaster", formData.roaster);
      if (formData.picture) {
        data.append("picture", formData.picture);
      }
      if (isEditing && currentImageUrl === undefined) {
        data.append("picture", "");
      }

      if (isEditing && beanId) {
        await Api.pb.collection("beans").update(beanId, data);
        navigate(`/beans/${beanId}`);
      } else {
        const result = await Api.pb.collection("beans").create<Api.Bean>(data);
        navigate(`/beans/${result.id}`);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading = false;
    }
  }

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      formData.picture = input.files[0];
    }
  }

  function handleDeleteCurrentImage() {
    currentImageUrl = undefined;
  }
</script>

<div class="space-y-6">
  <Card.Root>
    <Card.Header>
      <Card.Title>Bean Information</Card.Title>
    </Card.Header>
    <Card.Content>
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Name Field -->
        <Field.Field>
          <Field.Label for="name">Bean Name *</Field.Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter bean name"
            bind:value={formData.name}
            disabled={loading}
            aria-invalid={submitted && !formData.name}
          />
          {#if submitted && !formData.name}
            <Field.Error>Bean name is required</Field.Error>
          {/if}
        </Field.Field>

        <!-- Roaster Field -->
        <Field.Field>
          <Field.Label for="roaster">Roaster *</Field.Label>
          <Popover.Root bind:open={roasterOpen}>
            <Popover.Trigger bind:ref={triggerRef}>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="outline"
                  class="w-full justify-between"
                  role="combobox"
                  aria-expanded={roasterOpen}
                  disabled={roastersLoading || loading}
                  aria-invalid={submitted && !formData.roaster}
                >
                  {selectedRoasterLabel || "Select a roaster..."}
                  <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-full p-0">
              <Command.Root>
                <Command.Input placeholder="Search roaster..." />
                <Command.List>
                  <Command.Empty>No roaster found.</Command.Empty>
                  <Command.Group>
                    {#each roasters as roaster (roaster.id)}
                      <Command.Item
                        value={roaster.name}
                        onSelect={() => {
                          formData.roaster = roaster.id;
                          closeAndFocusTrigger();
                        }}
                      >
                        <Check
                          class={cn(
                            "mr-2 h-4 w-4",
                            formData.roaster !== roaster.id &&
                              "text-transparent"
                          )}
                        />
                        {roaster.name}
                      </Command.Item>
                    {/each}
                  </Command.Group>
                </Command.List>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
          {#if submitted && !formData.roaster}
            <Field.Error>Roaster is required</Field.Error>
          {/if}
        </Field.Field>

        <!-- Picture Field -->
        <Field.Field>
          <Field.Label for="picture">Bean Image (Optional)</Field.Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onchange={handleFileChange}
            disabled={loading}
          />
          {#if formData.picture}
            <Field.Description>
              Selected: {formData.picture.name}
            </Field.Description>
          {/if}
        </Field.Field>

        <!-- Current Image Preview -->
        {#if currentImageUrl}
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Field.Label>Current Image</Field.Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onclick={handleDeleteCurrentImage}
                disabled={loading}
                class="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
              >
                <Trash2 class="h-4 w-4" />
                Delete
              </Button>
            </div>
            <div class="bg-muted/50 rounded-md border p-2">
              <img
                src={currentImageUrl}
                alt="Current bean image"
                class="h-32 w-auto rounded"
              />
            </div>
          </div>
        {/if}

        <!-- Error Message -->
        {#if error}
          <div
            class="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
          >
            {error}
          </div>
        {/if}

        <!-- Form Actions -->
        <div class="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>
            {#if loading}
              <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
              Saving...
            {:else}
              {submitButtonText}
            {/if}
          </Button>
          <Button
            type="button"
            variant="outline"
            onclick={() => navigate(isEditing ? `/beans/${beanId}` : "/beans")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
