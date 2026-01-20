<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import type { Snippet } from "svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { Plus, Coffee, ChevronLeft, ChevronRight } from "@lucide/svelte";
  import { navigate, p } from "sv-router/generated";
  import { setHeaderContext, type HeaderContentType } from "$lib/layoutHeaderContext";

  let headerContent :HeaderContentType = $state(null);
  setHeaderContext({
    set: (newHeaderContent: HeaderContentType) => (headerContent = newHeaderContent)
  });

  let { children }: { children: Snippet } = $props();
  let isMobile = $state(new IsMobile());
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header
      class="flex lg:h-16 sm:h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 bg-white @container/header"
    >
      <div class="flex items-center gap-2 px-4 w-full">
        {#if isMobile.current}
          <Sidebar.Trigger class="-ms-3" />
        {/if}
        <div class="flex items-center justify-between w-full">
          {@render headerContent?.()}
        </div>
      </div>
    </header>

    <div class="px-2 p-2">
      {@render children?.()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>

<!-- <div class="flex w-full min-h-screen"> -->
<!--   <Sidebar.Inset> -->
<!--     <Separator /> -->
<!--     <div class="px-2 p-2"> -->
<!--       {@render children?.()} -->
<!--     </div> -->
<!--   </Sidebar.Inset> -->
<!-- </div> -->
<!-- {#if isMobile.current} -->
<!--   <div class="fixed bottom-6 right-6"> -->
<!--     <Sidebar.Trigger -->
<!--       class="h-14 w-14 rounded-full shadow-lg hover:shadow-xl" -->
<!--     /> -->
<!--   </div> -->
<!-- {/if} -->
