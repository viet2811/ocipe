import { axiosInstance } from "./axios";

export async function getGroceryIngredients(recipe_ids: number[]) {
  const response = await axiosInstance.post("/grocery/", { recipe_ids });
  return response.data;
}

export async function getGroceryList() {
  const response = await axiosInstance.get("/grocery/list");
  return response.data;
}

export async function saveGroceryListItems(items: string) {
  const response = await axiosInstance.post("/grocery/list/", { items });
  return response.data;
}

type GroceryListItemInput = {
  item?: string;
  isChecked?: boolean;
};

export async function updateSingleGroceryListItem({
  id,
  data,
}: {
  id: number;
  data: GroceryListItemInput;
}) {
  const response = await axiosInstance.patch(`/grocery/list/${id}/`, data);
  return response.data;
}
export async function deleteSingleGroceryListItem({ id }: { id: number }) {
  await axiosInstance.delete(`/grocery/list/${id}/`);
}

export async function clearGroceryListAll() {
  await axiosInstance.delete("/grocery/list/");
}

export async function clearHistory() {
  await axiosInstance.delete("/grocery/history/");
}

export async function getRecentGroceryPlan() {
  const response = await axiosInstance.get("/grocery/history/recent");
  return response.data;
}

export async function getHistory() {
  const response = await axiosInstance.get("/grocery/history");
  return response.data;
}
