import { z } from "zod";
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CircleHelp, NotebookPen, Plus, Save, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { type RecipeInput } from "@/types/recipes";
import GeminiAutofillDialog from "@/components/GeminiAutofillDialog";

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
    .min(1, "I mean, you can type None for non-meat recipe")
    .max(30, "Whoa, don't described the whole personality of the meat"),
  longevity: z
    .number()
    .int()
    .min(1, "Ah yes, 0 portion")
    .max(20, "Whoa, that's a lot"),
  frequency: z.enum(["weekday", "weekend", "rarely"]),
  note: z.string(),
  state: z.enum(["active", "used"]),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "Surely a recipe has an ingredient right?"),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

export interface RecipeFormProps {
  onSubmit: (
    values: RecipeFormValues,
    form: UseFormReturn<RecipeFormValues>
  ) => void;
  formType: "create" | "update";
  defaultFormValues: RecipeInput;
  className?: string;
}

export default function RecipeForm({
  onSubmit,
  formType,
  defaultFormValues,
  className,
}: RecipeFormProps) {
  const [formValues, setFormValues] = useState<RecipeInput>(defaultFormValues);
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: formValues,
  });

  useEffect(() => {
    form.reset(formValues);
  }, [formValues]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const onAutofillSuccess = (data: RecipeInput) => {
    setFormValues(data);
  };
  const handleFormSubmit = (values: RecipeFormValues) => {
    onSubmit(values, form);
  };

  return (
    <div className={`@container ${className}`}>
      <div className="mx-auto mt-12 w-4/5 @lg:w-4/5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="w-full @lg:space-y-4 @lg:grid @lg:grid-cols-2 @lg:gap-10 @lg:items-start"
          >
            <div className="space-y-2">
              <div className="flex items-start space-x-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance">
                        Recipe Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter recipe name.." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                {/* Frequency */}
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Frequency
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button">
                              <CircleHelp size={16} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <ul className="list-disc list-inside">
                              How often you want to cook this recipe?
                              <li>
                                I don't mind cooking this everyday:{" "}
                                <b>Weekday</b>
                              </li>
                              <li>
                                Too busy to cook this during the week:{" "}
                                <b>Weekend</b>
                              </li>
                              <li>
                                I'll treat myself this once in a while:{" "}
                                <b>Rarely</b>
                              </li>
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                          id="frequency"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="weekday" id="weekday" />
                            <Label htmlFor="weekday">Weekday</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="weekend" id="weekend" />
                            <Label htmlFor="weekend">Weekend</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="rarely" id="rarely" />
                            <Label htmlFor="rarely">Rarely</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex items-start space-x-4 -mt-1">
                {/* Longevity */}
                <FormField
                  control={form.control}
                  name="longevity"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <FormLabel>
                        Longevity
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button">
                              <CircleHelp size={14} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Portion/Day(s) whatever u think would fit...</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                {/* Category Meat type */}
                <FormField
                  control={form.control}
                  name="meat_type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter meat type or other category..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
              {/* Note */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="flex-1 mt-4">
                    <FormLabel>
                      Personal Note <NotebookPen size={14} />{" "}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type your personal note, instructions or whatever you like here..."
                        className="md:max-h-38 max-h-28 overflow-auto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            {/* Ingredients */}
            <FormItem className="@lg:ml-15 @lg:space-y-2 mt-4 @lg:mt-0">
              <FormLabel>Ingredients</FormLabel>
              <FormItem>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex space-x-1 @lg:space-x-4">
                    <Button
                      variant="outline"
                      type="button"
                      aria-label="Add a ingredient"
                      onClick={() => append({ name: "", quantity: "" })}
                      className="-ml-6 md:-ml-9 @lg:-ml-15  !p-1.5 @lg:has-[>svg]:!px-3" //border-none shadow-none
                    >
                      <Plus></Plus>
                    </Button>
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Ingredient name.." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Quantity(optional)..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                    {index !== 0 && (
                      <Button
                        variant="ghost"
                        type="button"
                        aria-label="Remove this ingredient"
                        onClick={() => remove(index)}
                        className="@lg:-mr-14 -mr-7 !p-1 @lg:has-[>svg]:!px-3"
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                ))}
              </FormItem>

              <FormMessage />
            </FormItem>
            {formType === "create" ? (
              <div className="flex justify-between my-4 col-span-2">
                {/* Gemini autofill */}
                <GeminiAutofillDialog onAutofillSuccess={onAutofillSuccess} />
                <Button type="submit">Submit</Button>
              </div>
            ) : (
              <div className="flex justify-end my-4 col-span-2">
                <Button type="submit">
                  <Save /> Save
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
