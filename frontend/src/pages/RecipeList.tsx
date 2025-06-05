import { recipeColumns } from "@/components/table/recipe-columns";
import { DataTable } from "@/components/table/recipe-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash } from "lucide-react";
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
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { Recipe } from "@/types/recipes";
import {
  deleteAllRecipes,
  getAllRecipes,
  getRecipesByIngredient,
  refreshRecipes,
} from "@/api/recipes";
import { useDebounce } from "@/hooks/useDebounce";

export default function RecipeList() {
  const columns = useMemo(() => recipeColumns, []);
  const queryClient = useQueryClient();
  const [searchType, setSearchType] = useState("default");
  const [ingredientInput, setIngredientInput] = useState("");
  const debouncedIngredient = useDebounce(ingredientInput, 700);

  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  });

  const { data: filteredRecipes, isFetching: ingredientFetching } = useQuery<
    Recipe[]
  >({
    queryKey: ["recipes-by-ingredients", debouncedIngredient],
    queryFn: () => getRecipesByIngredient(debouncedIngredient),
    enabled: searchType === "ingredients" && !!debouncedIngredient,
    placeholderData: keepPreviousData,
  });

  // Side buttons
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
    <div className="grid grid-cols-2 md:flex">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="cursor-pointer">
            <Trash /> Delete all
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
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
            <AlertDialogAction onClick={() => deleteMutation.mutate()}>
              Pretty sure
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        variant="secondary"
        size="sm"
        className="ml-2 cursor-pointer"
        onClick={() => refreshMutation.mutate()}
      >
        <RefreshCw /> Reset all states
      </Button>
    </div>
  );

  // Handle loading state
  if (isLoading) {
    return <Loading label="recipes" />;
  }

  const recipesData =
    searchType === "ingredients" &&
    debouncedIngredient &&
    (!ingredientFetching || filteredRecipes)
      ? filteredRecipes || []
      : recipes || [];

  return (
    <div className="m-6">
      <DataTable
        columns={columns}
        data={recipesData}
        LeftComponent={LeftSideButtons}
        searchType={searchType}
        setSearchType={setSearchType}
        ingredientInput={ingredientInput}
        setIngredientInput={setIngredientInput}
      />
    </div>
  );
}
