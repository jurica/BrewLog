<script lang="ts">
  import * as Api from "$lib/api";
  import * as Select from "$lib/components/ui/select/index.js";
  import { loadLocale } from "wuchale/load-utils";

  type LocaleValues = { [key in Api.Collections.Locale]: string };
  const localeLabels: LocaleValues = {
    de: "German",
    en: "English",
  };

  $effect(() => {
    Api.currentUser.uiState.locale;
    loadLocale(Api.currentUser.uiState.locale);
    Api.Collections.Users.persistDebounced(Api.currentUser);
  });
</script>


<Select.Root
  type="single"
  bind:value={() => Api.currentUser.uiState.locale, (l) => Api.currentUser.uiState.locale = l}
>
  <Select.Trigger size="sm" aria-label="Select a value">
    <span data-slot="select-value">
      {localeLabels[Api.currentUser.uiState.locale]}
    </span>
  </Select.Trigger>
  <Select.Content class="rounded-xl">
    {#each Object.entries(localeLabels) as [key, label]}
      <Select.Item value={key} class="rounded-lg">{label}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
