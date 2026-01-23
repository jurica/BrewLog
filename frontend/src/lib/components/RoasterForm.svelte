<script lang="ts">
  import * as Api from "$lib/api";
  import { Button } from "$lib/components/ui/button/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { navigate } from "sv-router/generated";
  import { LoaderCircle } from "@lucide/svelte";

  interface Props {
    roaster: Api.Collections.Roaster.Record;
  }

  let { roaster = $bindable() }: Props = $props();

  let photoPreview = $derived.by(() => {
    let picture = roaster.picture;
    if (picture instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(picture);
    }
    if (typeof picture === "string") {
      return Api.pb.files.getURL(roaster, picture);
    }
  });

  let loading = $state(false);
  let submitted = $state(false);
  let error = $state<string | null>(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = null;
    submitted = true;

    try {
      roaster = await Api.Collections.Roaster.persist(roaster);
        navigate(`/roasters/:roasterId`, { params: { roasterId: roaster.id }});
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading = false;
    }
  }

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      roaster.picture = input.files[0];
    }
  }
</script>

<div class="space-y-6">
  <Card.Root>
    <Card.Header>
      <Card.Title>Roster Information</Card.Title>
    </Card.Header>
    <Card.Content>
      <form onsubmit={handleSubmit} class="space-y-6">
        <Field.Field>
          <Field.Label for="name">Roaster Name *</Field.Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter roaster name"
            bind:value={roaster.name}
            disabled={loading}
            aria-invalid={submitted && !roaster.name}
          />
          {#if submitted && !roaster.name}
            <Field.Error>Roaster name is required</Field.Error>
          {/if}
        </Field.Field>

        <Field.Field>
          <Field.Label for="website">Website URL (Optional)</Field.Label>
          <Input
            id="website"
            type="url"
            placeholder="https://example.com"
            bind:value={roaster.website}
            disabled={loading}
          />
        </Field.Field>

        <Field.Field>
          <Field.Label for="picture">Roaster Image (Optional)</Field.Label>
          {#if roaster.picture}
            <div class="mb-4">
              <img
                src={photoPreview}
                alt="Preview"
                class="h-40 w-full rounded object-cover"
              />
            </div>
          {/if}
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onchange={handleFileChange}
            disabled={loading}
          />
        </Field.Field>

        {#if error}
          <div
            class="bg-destructive/10 text-destructive rounded-md p-3 text-sm"
          >
            {error}
          </div>
        {/if}

        <div class="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>
            {#if loading}
              <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
              Saving...
            {:else}
              {!!roaster.id ? "Update Roaster" : "Create Roaster"}
            {/if}
          </Button>
          <Button
            type="button"
            variant="outline"
            onclick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
