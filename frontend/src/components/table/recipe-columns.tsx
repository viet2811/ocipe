"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { SortButton } from "./sort-column"
import { CircleCheck, Utensils } from "lucide-react"
import { Link } from "react-router-dom"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash} from "lucide-react"

export type Recipe = {
    id: number,
    name: string,
    meat_type: string,
    state: "active" | "used",
    longevity: number,
    frequency: string
}




export const recipeColumns: ColumnDef<Recipe>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <SortButton column={column} label="Recipe" />),
        cell: ({ row }) => (
            <div className="px-3 font-medium">
            <Link to={`/recipes/${row.original.id}`} className="hover:underline">
                {row.getValue("name")}
            </Link>
            </div>
        ),
    },
    {
        accessorKey: "meat_type",
        header: ({ column }) => (
        <SortButton column={column} label="Meat type" />),
        cell: ({ row }) => (
            <div className="mx-2 text-xs py-0.5 px-1.5 text-muted-foreground border font-medium rounded-md w-max">{row.getValue("meat_type")}</div>
        )
    },
    {
        accessorKey: "state",
        header: ({ column }) => (
        <SortButton column={column} label="Status" />),
        cell: ({ row }) => {
            let state = row.getValue("state")
            return (
                <div className="mx-2 text-xs py-0.5 px-1.5 text-muted-foreground font-medium border rounded-md w-max inline-flex items-center">
                    {state === "active" ? (
                        <Utensils className="w-3 h-3 ml-0.5 mr-1"/>
                    ) : (
                        <CircleCheck className="w-4 h-4 mr-0.5 fill-green-500 text-background" />
                    )}
                    {state as string}
                </div>
            )
        }
    },
    {
        accessorKey: "longevity",
        header: ({ column }) => (
                <SortButton column={column} label="Longevity"/>
            ),
        cell: ({ row }) => (
            <div className="px-3 text-center">{row.getValue("longevity")}</div>
        ),
    },
    {
        accessorKey: "frequency",
        header: ({ column }) => (
        <SortButton column={column} label="Frequency" />),
        cell: ({ row }) => (
            <div className="px-3">{row.getValue("frequency")}</div>
        )
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const recipe = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:bg-muted data-[state=open]:bg-muted"
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link 
                                to={`/recipes/${recipe.id}/edit`}
                                className="flex items-center cursor-pointer hover:bg-muted"
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer text-red-600 hover:bg-muted"
                            onClick={() => {
                                console.log('Delete recipe:', recipe.id)
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]