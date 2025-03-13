import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { Badge } from "./ui/badge";

type Kind = "OpenAPI";

export interface Column {
  name: string;
  kind: Kind;
}

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "name",
    header: () => h("p", "Name"),
    cell: ({ row }) => {
      const value = row.getValue<string>("name");
      return h("div", { class: "font-medium" }, value);
    },
  },
  {
    accessorKey: "kind",
    header: () => h("p", { class: 'text-right text-ellipsis mr-5' }, "Type"),
    cell: ({ row }) => {
      const value = row.getValue<string>("kind");
      return h("div", { class: 'ml-auto w-fit' }, h(Badge, () => value));
    },
  },
];
