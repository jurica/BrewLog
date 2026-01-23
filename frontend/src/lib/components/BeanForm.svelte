<script lang="ts">
  import * as Api from "$lib/api";
  import { Button } from "$lib/components/ui/button/index.js";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { navigate } from "sv-router/generated";
  import { LoaderCircle } from "@lucide/svelte";
  import BeanRoasterSelector from "./BeanRoasterSelector.svelte";

  interface Props {
    bean: Api.Collections.Bean.Record;
    roasters: Api.Collections.Roaster.Record[];
  }

  let { bean = $bindable(), roasters }: Props = $props();

  let photoPreview = $derived.by(() => {
    let picture = bean.picture;
    if (picture instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(picture);
    }
    if (typeof picture === "string") {
      return Api.getURL(bean, picture);
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
      bean = await Api.Collections.Bean.persist(bean);
      navigate("/beans/:beanId", { params: { beanId: bean.id } });
    } catch (err) {
      error = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading = false;
    }
  }

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      bean.picture = input.files[0];
    }
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
            bind:value={bean.name}
            disabled={loading}
            aria-invalid={submitted && !bean.name}
          />
          {#if submitted && !bean.name}
            <Field.Error>Bean name is required</Field.Error>
          {/if}
        </Field.Field>

        <Field.Field>
          <BeanRoasterSelector bind:bean roasters={roasters} />
          {#if submitted && !bean.roaster}
            <Field.Error>Roaster is required</Field.Error>
          {/if}
        </Field.Field>

        <Field.Field>
          <Field.Label for="picture">Bean Image (Optional)</Field.Label>
          {#if bean.picture}
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
              {!!bean.id ? "Update Bean" : "Create Bean"}
            {/if}
          </Button>
          <Button
            type="button"
            variant="outline"
            onclick={() =>  navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
