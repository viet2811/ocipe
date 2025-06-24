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

export async function addAnIngredient(data: IngredientInput) {
  const response = await axiosInstance.post("/fridge/ingredient/", data);
  return response.data;
}

export async function deleteSingleIngredient(id: number) {
  await axiosInstance.delete(`/fridge/ingredient/${id}/`);
}

export async function renameIngredientGroup(
  old_name: string,
  new_name: string
) {
  await axiosInstance.put(`/fridge/ingredient/group/${old_name}`, {
    new_group: new_name,
  });
}

export async function deleteIngredientGroup(groupName: string) {
  await axiosInstance.delete(`/fridge/ingredient/group/${groupName}`);
}
