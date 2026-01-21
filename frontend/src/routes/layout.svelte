<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import type { Snippet } from "svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  import {
    setHeaderContext,
    type HeaderContentType
  } from "$lib/layoutHeaderContext";

  let headerContent: HeaderContentType = $state(null);
  setHeaderContext({
    set: (newHeaderContent: HeaderContentType) =>
      (headerContent = newHeaderContent)
  });

  let { children }: { children: Snippet } = $props();
  let isMobile = $state(new IsMobile());
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header
      class="@container/header sticky top-0 flex shrink-0 items-center gap-2 bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:h-10 lg:h-16"
    >
      <div class="flex w-full items-center gap-2 px-4">
        {#if isMobile.current}
          <Sidebar.Trigger class="-ms-3" />
        {/if}
        <div class="flex w-full items-center justify-between">
          {@render headerContent?.()}
        </div>
      </div>
    </header>

    <div class="p-2 px-2">
      {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
