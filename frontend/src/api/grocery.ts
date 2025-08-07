import { axiosInstance } from "./axios";

export async function getGroceryIngredients(recipe_ids: number[]) {
  const response = await axiosInstance.post("/grocery/", { recipe_ids });
  return response.data;
}

export async function getGroceryList() {
  const response = await axiosInstance.get("/grocery/list");
  return response.data;
}

export async function updateGroceryListItems(items: string) {
  const response = await axiosInstance.post("/grocery/list/", { items });
  return response.data;
}

export async function clearGroceryListAll() {
  await axiosInstance.delete("/grocery/list/");
}

export async function clearHistory() {
  await axiosInstance.delete("/grocery/history/");
}

export async function getRecentGroceryPlan() {
  const response = await axiosInstance.get("/grocery/history");
  return response.data;
}
