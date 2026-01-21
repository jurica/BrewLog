import * as Api from "$lib/api";

export let filter = $state<{ value: Api.Collections.Bags.Filters }>({
  value: "opened"
});
