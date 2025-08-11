import { getAllRecipes } from "@/api/recipes";
import type { Recipe } from "@/types/recipes";
import { useQuery } from "@tanstack/react-query";

export function useRecipes() {
  return useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  });
}
