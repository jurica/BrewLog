<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { Snippet } from "svelte";

  interface Props {
    isActive: boolean;
    onclick: () => void;
    children?: Snippet;
  }
  let { children, isActive, onclick }: Props = $props();
</script>

<Sidebar.MenuItem>
  <Sidebar.MenuButton {isActive} {onclick}>
    {@render children?.()}
  </Sidebar.MenuButton>
</Sidebar.MenuItem>
