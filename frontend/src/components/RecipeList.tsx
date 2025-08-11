import { getRecipeColumns } from "@/components/table/recipe-columns";
import { DataTable } from "@/components/table/recipe-table";
import { useState } from "react";
import Loading from "@/components/loading";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Recipe } from "@/types/recipes";
import { getRecipesByIngredient } from "@/api/recipes";
import { useDebounce } from "@/hooks/useDebounce";
import { type Table } from "@tanstack/react-table";
import { useRecipes } from "@/hooks/useRecipes";

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
  // const columns = useMemo(() => recipeColumns, []);
  // test const, later be parameter

  const columns = getRecipeColumns(rowSelectionEnabled);
  const [searchType, setSearchType] = useState("default");
  const [ingredientInput, setIngredientInput] = useState("");
  const debouncedIngredient = useDebounce(ingredientInput, 700);

  const { data: recipes, isLoading } = useRecipes();

  // Custom sorted data by ingredients
  const { data: filteredRecipes, isFetching: ingredientFetching } = useQuery<
    Recipe[]
  >({
    queryKey: ["recipes-by-ingredients", debouncedIngredient],
    queryFn: () => getRecipesByIngredient(debouncedIngredient),
    enabled: searchType === "ingredients" && !!debouncedIngredient,
    placeholderData: keepPreviousData,
  });

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
