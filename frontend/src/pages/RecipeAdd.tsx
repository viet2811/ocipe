import { useMutation } from "@tanstack/react-query";
import { postRecipe } from "@/api/recipes";
import { toast } from "sonner";
import { type Recipe, type RecipeInput } from "@/types/recipes";
import type { RecipeFormValues } from "@/components/RecipeForm";
import RecipeForm from "@/components/RecipeForm";
import type { UseFormReturn } from "react-hook-form";
import { queryClient } from "@/lib/queryClient";

const defaultFormValues: RecipeInput = {
  name: "",
  meat_type: "",
  longevity: 1,
  frequency: "weekday",
  note: "",
  state: "active",
  ingredients: [{ name: "", quantity: "" }],
};

export default function RecipeAdd() {
  const postMutation = useMutation({
    mutationFn: postRecipe,
  });

  function onSubmit(
    values: RecipeFormValues,
    form: UseFormReturn<RecipeFormValues>
  ) {
    toast.promise(postMutation.mutateAsync(values), {
      loading: "Adding recipe...",
      success: (newRecipe: Recipe) => {
        form.reset(defaultFormValues);
        queryClient.setQueryData<Recipe[]>(["recipes"], (old) => [
          newRecipe,
          ...(old ?? []),
        ]);
        return "Recipe is successfully added";
      },
      error: (e) => {
        console.log(e);
        return "Something went wrong. Please retry";
      },
    });
  }

  return (
    <RecipeForm
      onSubmit={onSubmit}
      formType="create"
      defaultFormValues={defaultFormValues}
    />
  );
}
