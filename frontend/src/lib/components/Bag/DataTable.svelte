<script lang="ts">
  import * as Api from "$lib/api";
  import { navigate } from "sv-router/generated";
  import {
    createColumnHelper,
    type ColumnDef,
    createTable,
    stockFeatures,
    FlexRender
  } from "@tanstack/svelte-table";
  import * as Table from "$lib/components/ui/table/index.js";

  interface Props {
    bags: Api.Collections.Bags.Record[];
  }
  let { bags }: Props = $props();

  function formatDate(date: string): string {
    if (date !== "" && Api.currentUser && Api.currentUser.uiState) {
      return new Date(date).toLocaleDateString(Api.currentUser.uiState.locale);
    } else {
      return "-";
    }
  }

  const columnHelper = createColumnHelper<
    typeof stockFeatures,
    Api.Collections.Bags.Record
  >();
  const columns: Array<
    ColumnDef<typeof stockFeatures, Api.Collections.Bags.Record>
  > = columnHelper.columns([
    columnHelper.accessor("expand.bean.name", { header: "Bean" }),
    columnHelper.accessor("open_date", {
      header: "Opened",
      cell: (date) => formatDate(date.getValue())
    }),
    columnHelper.accessor("finish_date", {
      header: "Finished",
      cell: (date) => formatDate(date.getValue())
    })
  ]);

  const table = createTable({
    features: stockFeatures,
    columns,
    get data() {
      return bags;
    }
  });
</script>

<div class="-mb-8 w-full">
  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head>
                <FlexRender {header} />
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row
            data-state={row.getIsSelected() && "selected"}
            onclick={() =>
              navigate("/bags/:bagId", { params: { bagId: row.original.id } })}
          >
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell class="[&:has([role=checkbox])]:ps-3">
                <FlexRender
                  content={cell.column.columnDef.cell}
                  context={cell.getContext()}
                />
              </Table.Cell>
            {/each}
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>
