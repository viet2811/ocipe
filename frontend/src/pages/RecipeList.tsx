import { recipeColumns } from "@/components/table/recipe-columns";
import { DataTable } from "@/components/table/recipe-table";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
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
import Loading from "@/components/loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Recipe } from "@/types/recipes";
import { deleteAllRecipes, getAllRecipes } from "@/api/recipes";

export default function RecipeList() {
  const columns = useMemo(() => recipeColumns, []);
  const queryClient = useQueryClient();

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAllRecipes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("All recipes deleted successfully");
    },
    onError: () => {
      toast.error("Something went wrong. Please retry");
    },
  });

  const LeftSideButtons: React.FC = () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash /> Delete all
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <img src="/are_u_sure.jpg" alt="Are you sure" />
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all your
            saved recipes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Oops, misclick</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteMutation.mutate()}>
            Pretty sure
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // Handle loading state
  if (isLoading) {
    return <Loading label="recipes" />;
  }

  // Handle error state (optional)
  if (error) {
    return <div>Error loading recipes</div>;
  }

  return (
    <div className="m-6">
      <DataTable
        columns={columns}
        data={recipes || []}
        LeftComponent={LeftSideButtons}
      />
    </div>
  );
}
