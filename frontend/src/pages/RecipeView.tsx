import { deleteAllRecipes, refreshRecipes } from "@/api/recipes";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { Import, RefreshCw, Share, Trash } from "lucide-react";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";
import RecipeList from "../components/RecipeList";
import { type Recipe, type RecipeInput } from "@/types/recipes";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

function toRecipeInputs(recipes: Recipe[]): RecipeInput[] {
  return recipes.map((r) => ({
    name: r.name,
    meat_type: r.meat_type,
    longevity: r.longevity,
    frequency: r.frequency,
    note: r.note, // optional
    state: r.state,
    ingredients: r.ingredient_list.map((ing) => ({
      name: ing.name,
      quantity: ing.quantity,
    })),
  }));
}

function downloadRecipesAsJson(recipes: RecipeInput[]) {
  const dataStr = JSON.stringify(recipes, null, 2); // pretty print
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "recipes.json"; // filename
  link.click();

  URL.revokeObjectURL(url); // cleanup
}

export default function RecipeView() {
  const deleteAllMutation = useMutation({
    mutationFn: deleteAllRecipes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("All recipes deleted successfully");
    },
    onError: () => {
      toast.error("Something went wrong. Please retry");
    },
  });
  const refreshMutation = useMutation({
    mutationFn: refreshRecipes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("All recipes state refresh to active");
    },
    onError: () => {
      toast.error("Something went wrong. Please retry");
    },
  });
  const closeDialogRef = useRef<HTMLButtonElement>(null);

  const LeftSideButtons: React.FC = () => (
    <div className="grid grid-cols-2 gap-2 mb-2 @md:flex">
      {/* Export */}
      <Button
        size="sm"
        onClick={() => {
          let recipe_data = queryClient.getQueryData<Recipe[]>(["recipes"]);
          if (recipe_data) {
            let converted = toRecipeInputs(recipe_data);
            downloadRecipesAsJson(converted);
          }
        }}
      >
        <Share /> Export
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Import /> Import
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import recipes</DialogTitle>
            <DialogDescription>
              Add the JSON file which was exported from Ocipe
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="file">Upload JSON</Label>
            <Input
              id="file"
              type="file"
              accept=".json"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" ref={closeDialogRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Reset status */}
      <Button
        variant="secondary"
        size="sm"
        className="cursor-pointer"
        onClick={() => refreshMutation.mutate()}
      >
        <RefreshCw /> Reset status
      </Button>
      {/* Delete all */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="cursor-pointer">
            <Trash /> Delete all
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="!max-w-[40rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <img src="/are_u_sure.jpg" alt="Are you sure" />
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your saved recipes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Oops, misclick</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteAllMutation.mutate()}>
              Pretty sure
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
  return (
    <div className="@container">
      <RecipeList
        rowSelectionEnabled={false}
        LeftSideButtons={LeftSideButtons}
      />
    </div>
  );
}
