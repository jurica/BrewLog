<script lang="ts">
  import * as Api from "$lib/api";
  import { Button } from "$lib/components/ui/button/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { navigate } from "sv-router/generated";
  import { LoaderCircle, ArrowLeft, Trash2 } from "@lucide/svelte";

  interface Props {
    roasterId?: string;
    initialData?: Api.Collections.Roaster.Record;
  }

  let { roasterId, initialData }: Props = $props();

  let formData = $state({
    name: initialData?.name ?? "",
    website: initialData?.website ?? "",
    picture: undefined as File | undefined
  });

  let currentImageUrl = $state<string | undefined>(
    initialData?.picture
      ? Api.pb.getFileUrl(initialData, initialData.picture)
      : undefined
  );
  let loading = $state(false);
  let submitted = $state(false);
  let error = $state<string | null>(null);

  const isEditing = !!roasterId;
  const submitButtonText = isEditing ? "Update Roaster" : "Create Roaster";

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = null;
    submitted = true;

    try {
      if (!formData.name.trim()) {
        error = "Roaster name is required";
        loading = false;
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      if (formData.website) {
        data.append("website", formData.website);
      }
      if (formData.picture) {
        data.append("picture", formData.picture);
      }
      if (isEditing && currentImageUrl === undefined) {
        data.append("picture", "");
      }

      if (isEditing && roasterId) {
        await Api.pb.collection("roasters").update(roasterId, data);
        navigate(`/roasters/${roasterId}`);
      } else {
        const result = await Api.pb
          .collection("roasters")
          .create<Api.Roaster>(data);
        navigate(`/roasters/${result.id}`);
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
      <Card.Title>Roster Information</Card.Title>
    </Card.Header>
    <Card.Content>
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Name Field -->
        <Field.Field>
          <Field.Label for="name">Roaster Name *</Field.Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter roaster name"
            bind:value={formData.name}
            disabled={loading}
            aria-invalid={submitted && !formData.name}
          />
          {#if submitted && !formData.name}
            <Field.Error>Roaster name is required</Field.Error>
          {/if}
        </Field.Field>

        <!-- Website Field -->
        <Field.Field>
          <Field.Label for="website">Website URL (Optional)</Field.Label>
          <Input
            id="website"
            type="url"
            placeholder="https://example.com"
            bind:value={formData.website}
            disabled={loading}
          />
        </Field.Field>

        <!-- Picture Field -->
        <Field.Field>
          <Field.Label for="picture">Roaster Image (Optional)</Field.Label>
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
            <div class="rounded-md border p-2 bg-muted/50">
              <img
                src={currentImageUrl}
                alt="Current roaster image"
                class="h-32 w-auto rounded"
              />
            </div>
          </div>
        {/if}

        <!-- Error Message -->
        {#if error}
          <div
            class="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
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
            onclick={() =>
              navigate(isEditing ? `/roasters/${roasterId}` : "/roasters")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
