import { getRecipeColumns } from "@/components/table/recipe-columns";
import { DataTable } from "@/components/table/recipe-table";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { useMutation } from "@tanstack/react-query";
import type { Recipe } from "@/types/recipes";
import { getRecipesByIngredient } from "@/api/recipes";
import { useDebounce } from "@/hooks/useDebounce";
import { type Table } from "@tanstack/react-table";
import { useRecipes } from "@/hooks/useRecipes";
import { toast } from "sonner";

type RecipeListProps = {
  rowSelectionEnabled: boolean;
  LeftSideButtons?: React.FC;
  defaultPaginationSize?: number;
  strictPagination?: boolean;
  onTableChange?: (table: Table<Recipe>) => void;
};
export default function RecipeList({
  rowSelectionEnabled = true,
  LeftSideButtons,
  defaultPaginationSize = 10,
  strictPagination = false,
  onTableChange,
}: RecipeListProps) {
  const columns = getRecipeColumns(rowSelectionEnabled);
  const [searchType, setSearchType] = useState("default");
  const [ingredientInput, setIngredientInput] = useState("");
  const debouncedIngredient = useDebounce(ingredientInput, 700);

  const { data: recipes, isLoading } = useRecipes();
  // Handle loading state
  if (isLoading) {
    return <Loading label="recipes" />;
  }

  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[] | null>(null);
  const ingredientFilteredMutation = useMutation({
    mutationFn: getRecipesByIngredient,
  });

  useEffect(() => {
    if (searchType === "ingredients" && debouncedIngredient) {
      toast.promise(
        ingredientFilteredMutation.mutateAsync(debouncedIngredient),
        {
          loading: "Filtering recipes..",
          success: (responseData: Recipe[]) => {
            setFilteredRecipes(responseData);
            return "Filtered";
          },
          error: (e) => {
            console.log(e);
            return "Something went wrong. Please retry";
          },
        }
      );
    }
  }, [debouncedIngredient, searchType]);

  const recipesData =
    searchType === "ingredients" && debouncedIngredient && filteredRecipes
      ? filteredRecipes
      : recipes || [];

  return (
    <div className="mx-6 mb-6">
      <DataTable
        columns={columns}
        data={recipesData}
        LeftComponent={LeftSideButtons}
        searchType={searchType}
        setSearchType={setSearchType}
        ingredientInput={ingredientInput}
        setIngredientInput={setIngredientInput}
        rowSelectionEnabled={rowSelectionEnabled}
        defaultPaginationSize={defaultPaginationSize}
        strictPagination={strictPagination}
        onTableChange={onTableChange}
      />
    </div>
  );
}
