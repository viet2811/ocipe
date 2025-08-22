"use client";

import {
  type ColumnDef,
  type Table as TableType,
  flexRender,
  type SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { DataTablePagination } from "./table-pagination";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { queryClient } from "@/lib/queryClient";
import { type FridgeResponse } from "@/types/recipes";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  LeftComponent?: React.FC;
  searchType: string;
  setSearchType: (s: string) => void;
  ingredientInput: string;
  setIngredientInput: (s: string) => void;
  rowSelectionEnabled: boolean;
  defaultPaginationSize: number;
  strictPagination: boolean;
  onTableChange?: (table: TableType<TData>) => void;
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
  LeftComponent,
  searchType,
  setSearchType,
  ingredientInput,
  setIngredientInput,
  rowSelectionEnabled,
  defaultPaginationSize,
  strictPagination,
  onTableChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: rowSelectionEnabled ? setRowSelection : undefined,
    state: {
      sorting,
      globalFilter,
      ...(rowSelectionEnabled && { rowSelection }),
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: defaultPaginationSize, // <-- Set your default page size here
      },
    },
  });

  useEffect(() => {
    if (onTableChange) onTableChange(table);
  }, [table, table.getState().rowSelection]);
  return (
    <div>
      <div id="searchFields" className="mb-3 flex items-center">
        {searchType === "default" ? (
          <Input
            type="text"
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            placeholder="Search by name or meat type..."
            className="w-2/3 md:w-1/3 mr-3"
          />
        ) : (
          <Input
            type="text"
            value={ingredientInput}
            onChange={(e) => {
              setIngredientInput(String(e.target.value));
            }}
            placeholder="Search by ingredient1, ingre2, ..."
            className="w-2/3 md:w-1/3 mr-3"
          />
        )}
        <Select
          defaultValue={searchType}
          onValueChange={(value) => {
            if (value === "fridge") {
              setSearchType("ingredients");
              let fridge_data = queryClient.getQueryData<FridgeResponse>([
                "fridge",
              ]);
              if (fridge_data) {
                let groups = fridge_data.ingredient_list;
                let strings = Object.values(groups) // get all ingredient arrays
                  .flat() // flatten them into one array
                  .map((ingredient) => ingredient.name) // pick out names
                  .join(", ");
                setIngredientInput(strings);
              }
            } else {
              setSearchType(value);
              setIngredientInput("");
            }
            table.setGlobalFilter("");
          }}
        >
          <SelectTrigger className="w-max">
            <SelectValue>Search by</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Name + Meat Type</SelectItem>
            <SelectItem value="ingredients">Ingredient(s)</SelectItem>
            <SelectItem value="fridge">Your Fridge</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div id="tableField" className="rounded-md border mb-3">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Kitchen seems.. empty? Go{" "}
                  <Link to="/recipes/add-a-recipe">
                    <Button variant="link" className="p-0">
                      here
                    </Button>
                  </Link>{" "}
                  to start adding your recipe
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        LeftComponent={LeftComponent}
        disabled={strictPagination}
      />
    </div>
  );
}
