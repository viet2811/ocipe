import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ingredientSchema = z.object({
  name: z
    .string()
    .min(1, "Can't wait to use ' ' for a recipe!(Please fill in)"),
  quantity: z.string(),
});

const recipeSchema = z.object({
  name: z
    .string()
    .min(1, "' ' is a great recipe name!(Please fill in)")
    .max(100, "Please don't type the script of Bee movie"),
  meat_type: z
    .string()
    .min(1, "You can type None for non-meat recipe :(")
    .max(30, "Whoa, don't described the whole personality of the meat"),
  longevity: z
    .number()
    .int()
    .min(1, "I guess the recipe is empty?(Not 0 man)")
    .max(20, "Whoa, that's a lot"),
  frequency: z.enum(["weekday", "weekend", "rarely"]),
  note: z.string(),
  state: z.enum(["active", "used"]),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "Surely a recipe has an ingredient right?"),
});

const form = useForm<z.infer<typeof recipeSchema>>({
  resolver: zodResolver(recipeSchema),
  defaultValues: {
    name: "",
    meat_type: "",
    longevity: 1,
    frequency: "weekday",
    note: "",
    state: "active",
    ingredients: [{ name: "", quantity: "" }],
  },
});

export default function RecipeAdd() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      Recipe Add pages
    </div>
  );
}
