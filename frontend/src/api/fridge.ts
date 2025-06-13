import type { IngredientInput } from "@/types/recipes";
import { axiosInstance } from "./axios";

export async function getFridge() {
  const response = await axiosInstance.get("/fridge");
  return response.data;
}

export async function updateSingleIngredient({
  id,
  data,
}: {
  id: number;
  data: IngredientInput;
}) {
  const response = await axiosInstance.put(`/fridge/ingredient/${id}/`, data);
  return response.data;
}
