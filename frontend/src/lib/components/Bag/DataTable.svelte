<script lang="ts">
  import * as Api from "$lib/api";
  import { navigate } from "sv-router/generated";
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import * as Table from "$lib/components/ui/table/index.js";
  import {
    FlexRender,
    createSvelteTable,
    renderSnippet
  } from "$lib/components/ui/data-table/index.js";
  import { createRawSnippet } from "svelte";

  interface Props {
    bags: Api.Collections.Bags.Record[];
  }
  let { bags }: Props = $props();

  const cellSnippet = createRawSnippet<[{ content: string; class: string }]>(
    (props) => {
      return {
        render: () => `<div class="${props().class}">${props().content}</div>`
      };
    }
  );

  function formatDate(date: string): string {
    if (date !== "" && Api.currentUser && Api.currentUser.uiState) {
      return new Date(date).toLocaleDateString(Api.currentUser.uiState.locale);
    } else {
      return "-";
    }
  }

  const columns: ColumnDef<Api.Collections.Bags.Record>[] = [
    {
      id: "bean",
      accessorKey: "expand.bean.name",
      header: () => {
        return renderSnippet(cellSnippet, {
          content: "Bean",
          class: "font-bold"
        });
      }
    },
    {
      id: "open_date",
      header: () => {
        return renderSnippet(cellSnippet, {
          content: "Opened",
          class: "font-bold text-center"
        });
      },
      cell: ({ row }) =>
        renderSnippet(cellSnippet, {
          content: formatDate(row.original.open_date),
          class: "text-center"
        })
    },
    {
      id: "finish_date",
      header: () => {
        return renderSnippet(cellSnippet, {
          content: "Finished",
          class: "font-bold text-center"
        });
      },
      cell: ({ row }) =>
        renderSnippet(cellSnippet, {
          content: formatDate(row.original.finish_date),
          class: "text-center"
        })
    }
    // {
    //   id: "roast_date",
    //   header: () => {
    //     return renderSnippet(cellSnippet, {
    //       content: "Roasted",
    //       class: "font-bold text-center"
    //     });
    //   },
    //   cell: ({ row }) =>
    //     renderSnippet(cellSnippet, { content: formatDate(row.original.roast_date), class: "text-center" })
    // },
    // {
    //   id: "purchase_date",
    //   header: () => {
    //     return renderSnippet(cellSnippet, {
    //       content: "Purchased",
    //       class: "font-bold text-center"
    //     });
    //   },
    //   cell: ({ row }) =>
    //     renderSnippet(cellSnippet, { content: formatDate(row.original.purchase_date), class: "text-center" })
    // }
  ];

  const table = createSvelteTable({
    get data() {
      return bags;
    },
    columns,
    getCoreRowModel: getCoreRowModel()
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
