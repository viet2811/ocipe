import { axiosInstance } from "./axios";

export async function getAllRecipes() {
  const response = await axiosInstance.get("/recipes?ordering=-added_date");
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
