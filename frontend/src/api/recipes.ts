import type { RecipeInput } from "@/types/recipes";
import { axiosInstance } from "./axios";

export async function getAllRecipes() {
  const response = await axiosInstance.get("/recipes?ordering=-added_date");
  return response.data;
}

export async function postRecipe(data: RecipeInput) {
  const response = await axiosInstance.post("/recipes/", data);
  return response.data;
}

export async function bulkCreateRecipe(list: RecipeInput[]) {
  const response = await axiosInstance.post("/recipes/bulk/", { list });
  return response.data;
}

export async function updateSingleRecipe({
  id,
  data,
}: {
  id: number;
  data: RecipeInput;
}) {
  const response = await axiosInstance.put(`/recipes/${id}/`, data);
  return response.data;
}

export async function getRecipeFromURL(url: string) {
  const response = await axiosInstance.post("/recipes/genai/", { url });
  return response.data;
}

export async function deleteAllRecipes() {
  await axiosInstance.delete("/recipes/");
}

export async function deleteSingleRecipe(id: number) {
  await axiosInstance.delete(`/recipes/${id}/`);
}

export async function getRecipesByIngredient(ingredientInput: string) {
  const response = await axiosInstance.get(
    `/recipes?ingredients=${ingredientInput}`
  );
  return response.data;
}

export async function refreshRecipes() {
  await axiosInstance.post("/recipes/refresh/");
}
