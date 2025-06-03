"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { SortButton } from "./sort-column";
import { CircleCheck, NotepadText, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import type { Recipe } from "@/types/recipes";
import { deleteSingleRecipe } from "@/api/recipes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const accuracyNode = (accuracy: number) => {
  let colorStyling = "";
  // I love u tailwind but this is abyssmal
  if (accuracy < 33) {
    colorStyling = "bg-red-400 dark:bg-red-900 text-red-900 dark:text-red-400";
  } else if (accuracy < 66) {
    colorStyling =
      "bg-yellow-400 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-400";
  } else if (accuracy < 100) {
    colorStyling =
      "bg-orange-400 dark:bg-orange-900 text-orange-900 dark:text-orange-400";
  } else {
    colorStyling =
      "bg-green-400 dark:bg-green-900 text-green-900 dark:text-green-400";
  }
  return (
    <span className={`text-xs ${colorStyling} ml-1 px-2 py-0.5 rounded`}>
      {accuracy}%
    </span>
  );
};

export const recipeColumns: ColumnDef<Recipe>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortButton column={column} label="Recipe" />,
    cell: ({ row }) => {
      const accuracy = row.original.accuracy;
      return (
        <div className="px-3 font-medium">
          <Link to={`/recipes/${row.original.id}`} className="hover:underline">
            {row.getValue("name")}
          </Link>
          {accuracy !== undefined && accuracyNode(accuracy)}
        </div>
      );
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "meat_type",
    header: ({ column }) => <SortButton column={column} label="Meat type" />,
    cell: ({ row }) => (
      <div className="mx-2 text-xs py-0.5 px-1.5 text-muted-foreground border font-medium rounded-md w-max">
        {row.getValue("meat_type")}
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "state",
    header: ({ column }) => <SortButton column={column} label="Status" />,
    cell: ({ row }) => {
      let state = row.getValue("state");
      return (
        <div className="mx-2 text-xs py-0.5 px-1.5 text-muted-foreground font-medium border rounded-md w-max inline-flex items-center">
          {state === "active" ? (
            <Utensils className="w-3 h-3 ml-0.5 mr-1" />
          ) : (
            <CircleCheck className="w-4 h-4 mr-0.5 fill-green-500 text-background" />
          )}
          {state as string}
        </div>
      );
    },
  },
  {
    accessorKey: "longevity",
    header: ({ column }) => <SortButton column={column} label="Longevity" />,
    cell: ({ row }) => (
      <div className="px-3 text-center">{row.getValue("longevity")}</div>
    ),
  },
  {
    accessorKey: "frequency",
    header: ({ column }) => <SortButton column={column} label="Frequency" />,
    cell: ({ row }) => <div className="px-3">{row.getValue("frequency")}</div>,
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => {
      const note = row.getValue("note");
      return (
        <Popover>
          <PopoverTrigger asChild>
            <span>
              <Button variant="ghost">
                <NotepadText className="w-4 h-4" />
                <span className="sr-only">View note</span>
              </Button>
            </span>
          </PopoverTrigger>
          <PopoverContent className="max-w-56 w-max text-xs">
            {note ? String(note) : "No note"}
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const recipe = row.original;
      const queryClient = useQueryClient();

      const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteSingleRecipe(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["recipes"] });
          toast.success("Recipe deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete recipe");
        },
      });
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
                deleteMutation.mutate(recipe.id);
              }}
              disabled={deleteMutation.isPending}
            >
              <Trash className="mr-2 h-4 w-4" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
