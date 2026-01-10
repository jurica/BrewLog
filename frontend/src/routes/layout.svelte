<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  // import { Separator } from "$lib/components/ui/separator/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import type { Snippet } from "svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";

  let { children }: { children: Snippet } = $props();
  let isMobile = $state(new IsMobile());
</script>

<Sidebar.Provider>
  <div class="flex w-full min-h-screen">
    <AppSidebar />
    <Sidebar.Inset>
      <!-- <Separator /> -->
      <div class="px-2 p-2">
        {@render children?.()}
      </div>
    </Sidebar.Inset>
  </div>
  {#if isMobile.current}
    <div class="fixed bottom-6 right-6 z-50">
      <Sidebar.Trigger
        class="h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
      />
    </div>
  {/if}
</Sidebar.Provider>
