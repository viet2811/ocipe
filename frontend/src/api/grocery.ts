import { axiosInstance } from "./axios";

export async function getGroceryList(recipe_ids: number[]) {
  const response = await axiosInstance.post("/grocery/", { recipe_ids });
  return response.data;
}
