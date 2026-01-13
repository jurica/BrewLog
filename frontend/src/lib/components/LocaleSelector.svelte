<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import type { Locale } from "$src/locales/locales.svelte";
  import { getLocale, updateLocale } from "$src/locales/locales.svelte";

  type LocaleValues = { [key in Locale]: string };
  const localeLabels: LocaleValues = {
    de: "German",
    en: "English",
  };
</script>


<Select.Root
  type="single"
  bind:value={() => getLocale(), (l) => updateLocale(l)}
>
  <Select.Trigger size="sm" aria-label="Select a value">
    <span data-slot="select-value">
      {localeLabels[getLocale()]}
    </span>
  </Select.Trigger>
  <Select.Content class="rounded-xl">
    {#each Object.entries(localeLabels) as [key, label]}
      <Select.Item value={key} class="rounded-lg">{label}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
