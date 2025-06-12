import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRecipe } from "@/api/recipes";
import { toast } from "sonner";
import { type RecipeInput } from "@/types/recipes";
import type { RecipeFormValues } from "@/components/RecipeForm";
import RecipeForm from "@/components/RecipeForm";
import type { UseFormReturn } from "react-hook-form";

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
  const queryClient = useQueryClient();
  const postMutation = useMutation({
    mutationFn: postRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Recipes is successfully added");
    },
    onError: (e) => {
      toast.error("Something went wrong. Please retry");
      console.log(e);
    },
  });

  function onSubmit(
    values: RecipeFormValues,
    form: UseFormReturn<RecipeFormValues>
  ) {
    // Use Query for post
    // Mutation for post, invalid ["recipes"]
    postMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
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
