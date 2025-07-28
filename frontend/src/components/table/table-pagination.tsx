import { type Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  disabled: boolean;
  LeftComponent?: React.FC;
}

export function DataTablePagination<TData>({
  table,
  LeftComponent,
  disabled = false, // disabled would mean the row per page will be locked as default. It would mean this is the table with selected enable. Bad code, I know but im tired man.
}: DataTablePaginationProps<TData>) {
  const PageNav: React.FC = () => (
    <div className="flex items-center space-x-2 shrink-0">
      <div className="flex w-fit items-center justify-center text-sm font-medium">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="hidden size-8 @lg:flex"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to first page</span>
        <ChevronsLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRight />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="hidden size-8 @lg:flex"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to last page</span>
        <ChevronsRight />
      </Button>
    </div>
  );

  const SelectNav: React.FC = () => (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">Rows per page</p>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
        disabled={disabled}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {[5, 10, 15, 20].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
  return (
    <div className="@container w-full">
      <div className="grid gap-2 items-center grid-cols-1 @md:flex @md:justify-between">
        {LeftComponent && <LeftComponent />}
        <div
          className={cn(
            "flex items-center space-x-6 min-w-0 @lg:space-x-8",
            disabled ? "flex-wrap gap-2 justify-end ml-6" : "ml-auto"
          )}
        >
          {disabled ? (
            <div className="text-muted-foreground flex-1 text-sm mr-0 whitespace-nowrap max-w-max">
              {table.getSelectedRowModel().rows.length} of{" "}
              {table.getCoreRowModel().rows.length} row(s) selected.
            </div>
          ) : (
            <SelectNav />
          )}
          <PageNav />
        </div>
      </div>
    </div>
  );
}
