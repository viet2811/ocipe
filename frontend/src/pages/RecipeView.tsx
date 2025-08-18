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

  const LeftSideButtons: React.FC = () => (
    <div className="grid grid-cols-2 gap-2 mb-2 @md:flex">
      <Button size="sm">
        <Share /> Export
      </Button>
      <Button size="sm" variant="outline">
        <Import /> Import
      </Button>
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
