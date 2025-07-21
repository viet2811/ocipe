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
            setSearchType(value);
            // Prevent bug
            table.setGlobalFilter("");
            setIngredientInput("");
          }}
        >
          <SelectTrigger className="w-max">
            <SelectValue>Search by</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Name + Meat Type</SelectItem>
            <SelectItem value="ingredients">Ingredient(s)</SelectItem>
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
                  No results.
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
