"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { SortButton } from "./sort-column";
import { CircleCheck, NotepadText, Utensils } from "lucide-react";
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
import type { Recipe, RecipeInput } from "@/types/recipes";
import { deleteSingleRecipe, updateSingleRecipe } from "@/api/recipes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import RecipeContent from "./recipe-sheet-content";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import type { RecipeFormValues } from "../RecipeForm";
import RecipeForm from "../RecipeForm";
import { useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { queryClient } from "@/lib/queryClient";

export function getRecipeColumns(
  rowSelectionEnabled: boolean
): ColumnDef<Recipe>[] {
  const baseColumns: ColumnDef<Recipe>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortButton column={column} label="Recipe" />,
      cell: ({ row }) => {
        return <RecipeContent {...row.original}></RecipeContent>;
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
      cell: ({ row }) => (
        <div className="px-3">{row.getValue("frequency")}</div>
      ),
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
              <ScrollArea className="max-h-[150px] overflow-auto whitespace-pre-wrap">
                {note ? String(note) : "No note"}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const recipe = row.original;
        const recipeInput: RecipeInput = {
          ...recipe,
          ingredients: recipe.ingredient_list,
        };
        delete (recipeInput as any).ingredient_list;

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

        const closeDialogRef = useRef<HTMLButtonElement>(null);
        const updateMutation = useMutation({
          mutationFn: updateSingleRecipe,
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
            toast.success("Recipes is successfully saved");
            closeDialogRef.current?.click();
          },
          onError: (e) => {
            toast.error("Something went wrong. Please retry");
            console.log(e);
          },
        });

        function onSubmit(values: RecipeFormValues) {
          let id = recipe.id;
          updateMutation.mutate({ id, data: values });
        }

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
                <Dialog>
                  <DialogTrigger className="hover:bg-muted w-full focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DialogTrigger>
                  <DialogContent className="lg:!max-w-4/5">
                    <DialogHeader>
                      <DialogTitle>Edit recipe</DialogTitle>
                      <DialogDescription>
                        Make changes to your recipe here. Click save when you
                        are done
                      </DialogDescription>
                    </DialogHeader>
                    <RecipeForm
                      onSubmit={onSubmit}
                      formType="update"
                      defaultFormValues={recipeInput}
                      className="-m-4"
                    ></RecipeForm>
                    <DialogFooter>
                      <DialogClose asChild>
                        {/* You can make this button invisible or just keep it simple */}
                        <Button
                          variant="ghost"
                          ref={closeDialogRef}
                          className="sr-only"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive hover:!text-destructive hover:!bg-destructive/10"
                onClick={() => {
                  deleteMutation.mutate(recipe.id);
                }}
                disabled={deleteMutation.isPending}
              >
                <Trash className="mr-2 h-4 w-4 text-destructive" />
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (!rowSelectionEnabled) return baseColumns;

  const selectionColumn: ColumnDef<Recipe> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  };
  return [selectionColumn, ...baseColumns];
}
