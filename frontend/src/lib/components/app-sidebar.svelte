<script lang="ts">
  import {
    CoffeeIcon,
    Icon,
    Factory,
    PackageOpen,
    CircleUserIcon,
    EllipsisVerticalIcon,
    LogOutIcon,
    SettingsIcon
  } from "@lucide/svelte";
  import { coffeeBean, coffeemaker } from "@lucide/lab";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { navigate, isActive } from "sv-router/generated";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Api from "$lib/api";
  import SidebarMenuItem from "$lib/components/sidebar-menu-item.svelte";

  const sidebar = Sidebar.useSidebar();
  let response = $derived(Api.Collections.Users.getCurrentUser());
</script>

<Sidebar.Root collapsible="offcanvas" side="left">
  <Sidebar.Header>
    <div class="flex items-baseline">
      <Icon iconNode={coffeemaker} class="mr-2" /><span>BrewLog</span><span
        class="text-muted-foreground ml-2 text-sm">v{__APP_VERSION__}</span
      >
    </div>
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <SidebarMenuItem
            isActive={isActive("/cups") || isActive("/cups/:cupId")}
            onclick={() => navigate("/cups")}
          >
            <CoffeeIcon /> Cups
          </SidebarMenuItem>
          <SidebarMenuItem
            isActive={isActive("/bags") || isActive("/bags/:bagId")}
            onclick={() => navigate("/bags")}
          >
            <PackageOpen />Bags
          </SidebarMenuItem>
          <SidebarMenuItem
            isActive={isActive("/beans") || isActive("/beans/:beanId")}
            onclick={() => navigate("/beans")}
          >
            <Icon iconNode={coffeeBean} />Beans
          </SidebarMenuItem>
          <SidebarMenuItem
            isActive={isActive("/roasters") || isActive("/roasters/:roasterId")}
            onclick={() => navigate("/roasters")}
          >
            <Factory />Roasters
          </SidebarMenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  {#if response.data !== undefined}
    {@const user = response.data}
    <Sidebar.SidebarFooter>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton
                  {...props}
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar.Root class="size-8 rounded-lg grayscale">
                    <Avatar.Image src={user.avatar} alt={user.email} />
                    <Avatar.Fallback class="rounded-lg"
                      >{`${user.firstname.charAt(0).toUpperCase()}${user.lastname.charAt(0).toUpperCase()}`}</Avatar.Fallback
                    >
                  </Avatar.Root>
                  <div class="grid flex-1 text-start text-sm leading-tight">
                    <span class="truncate font-medium"
                      >{user.firstname} {user.lastname}</span
                    >
                    <span class="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                  <EllipsisVerticalIcon class="ms-auto size-4" />
                </Sidebar.MenuButton>
              {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
              side={sidebar.isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenu.Label class="p-0 font-normal">
                <div
                  class="flex items-center gap-2 px-1 py-1.5 text-start text-sm"
                >
                  <Avatar.Root class="size-8 rounded-lg">
                    <Avatar.Image src={user.avatar} alt={user.email} />
                    <Avatar.Fallback class="rounded-lg"
                      >{`${user.firstname.charAt(0).toUpperCase()}${user.lastname.charAt(0).toUpperCase()}`}</Avatar.Fallback
                    >
                  </Avatar.Root>
                  <div class="grid flex-1 text-start text-sm leading-tight">
                    <span class="truncate font-medium"
                      >{user.firstname} {user.lastname}</span
                    >
                    <span class="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Group>
                <DropdownMenu.Item>
                  <CircleUserIcon />
                  Account
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <SettingsIcon />
                  Settings
                </DropdownMenu.Item>
              </DropdownMenu.Group>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onclick={() => navigate("/logout")}>
                <LogOutIcon />
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.SidebarFooter>
  {/if}
</Sidebar.Root>
