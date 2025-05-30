import { type Column } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react"

interface SortButtonProps<TData, TValue> {
  column: Column<TData, TValue>
  label: string
}

export function SortButton<TData, TValue> ({
    column,
    label,
}: SortButtonProps<TData, TValue>) {
    const sorted = column.getIsSorted()
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(sorted === "asc")}
        >
            {label}
            {sorted === "asc" ? (
                <ArrowUp className="h-4 w-4 transition-all" />
            ) : sorted === "desc" ? (
                <ArrowDown className="h-4 w-4  transition-all" />
            ): 
                <ChevronsUpDown className="h-4 w-4  transition-all"/>
            }
        </Button>
    )
}