<script lang="ts">
  import * as Api from "$lib/api";
  import { navigate, p } from "sv-router/generated";
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import * as Table from "$lib/components/ui/table/index.js";
  import {
    FlexRender,
    createSvelteTable,
    renderSnippet
  } from "$lib/components/ui/data-table/index.js";

  interface Props {
    bags: Api.Collections.Bags.Record[];
  }
  let { bags }: Props = $props();

  const columns: ColumnDef<Api.Collections.Bags.Record>[] = [
    {
      accessorKey: "expand.bean.name",
      header: "Bean"
    },
    {
      header: "Roasted",
      cell: ({ row }) =>
        renderSnippet(dateCell, { date: row.original.roast_date })
    },
    {
      header: "Purchased",
      cell: ({ row }) =>
        renderSnippet(dateCell, { date: row.original.purchase_date })
    },
    {
      header: "Opened",
      cell: ({ row }) =>
        renderSnippet(dateCell, { date: row.original.open_date })
    },
    {
      header: "Finished",
      cell: ({ row }) =>
        renderSnippet(dateCell, { date: row.original.finish_date })
    }
  ];

  const table = createSvelteTable({
    get data() {
      return bags;
    },
    columns,
    getCoreRowModel: getCoreRowModel()
  });
</script>

{#snippet dateCell(params: { date: string })}
  <div>{new Date(params.date).toLocaleDateString(Api.currentUser.uiState.locale)}</div>
{/snippet}

<div class="-mb-8 w-full">
  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head>
                  <FlexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
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
