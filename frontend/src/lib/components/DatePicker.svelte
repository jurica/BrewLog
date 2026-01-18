<script lang="ts" generics="T extends PB_Record">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Calendar as CalendarIcon } from "@lucide/svelte";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import { today, getLocalTimeZone } from "@internationalized/date";
  import * as Api from "$lib/api";
  import type { PB_Record } from "$lib/api/collections/common.svelte";

  interface Props<T extends PB_Record> {
    record: T;
    property: keyof T;
    label: string;
  }
  const { record, label, property }: Props<T> = $props();
  // svelte-ignore state_referenced_locally
  let zonedDateTimeProxy = new Api.ZonedDateTimeProxy(record, property);

  let open = $state(false);
</script>

<Label class="text-sm font-medium">{label}</Label>
<Popover.Root bind:open>
  <Popover.Trigger id="roast_date">
    {#snippet child({ props })}
      <Button
        data-test-id="btn-{label}"
        {...props}
        variant="outline"
        class="w-48 justify-between font-normal"
      >
        {zonedDateTimeProxy.toString() || "Select date"}
        <CalendarIcon />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto overflow-hidden p-0" align="start">
    <Calendar
      type="single"
      bind:value={zonedDateTimeProxy.value}
      captionLayout="dropdown"
      onValueChange={() => {
        open = false;
      }}
      maxValue={today(getLocalTimeZone())}
    />
  </Popover.Content>
</Popover.Root>
