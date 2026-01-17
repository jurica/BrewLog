<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Calendar as CalendarIcon } from "@lucide/svelte";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import type { DateValue } from "@internationalized/date";
  import {
    today,
    getLocalTimeZone
  } from "@internationalized/date";

  interface Props {
    value: DateValue;
    label: string;
    selectedDate: string;
  }
  let { value=$bindable(), label, selectedDate }: Props = $props();

  let open = $state(false);
  let id = $props.id();
</script>

<Label for="roast_date" class="text-sm font-medium">{label}</Label>
<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        data-test-id="btn-{label}"
        {...props}
        variant="outline"
        class="w-48 justify-between font-normal"
      >
        {selectedDate || "Select date"}
        <CalendarIcon />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto overflow-hidden p-0" align="start">
    <Calendar
      type="single"
      bind:value
      captionLayout="dropdown"
      onValueChange={() => {
        open = false;
      }}
      maxValue={today(getLocalTimeZone())}
    />
  </Popover.Content>
</Popover.Root>
