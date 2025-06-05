import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { CircleHelp, NotebookPen, Plus, Sparkles, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecipeFromURL, postRecipe } from "@/api/recipes";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { type RecipeInput } from "@/types/recipes";

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

const invalidDomains = [
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "www.tiktok.com",
  "tiktok.com",
];
const urlSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL (e.g. https://...)")
    .refine(
      (url) => !invalidDomains.some((domain) => url.includes(domain)),
      "Please submit a non-video web link, I dont want to spend money on AI"
    ),
});

export default function RecipeAdd() {
  const [formValues, setFormValues] = useState<RecipeInput>({
    name: "",
    meat_type: "",
    longevity: 1,
    frequency: "weekday",
    note: "",
    state: "active",
    ingredients: [{ name: "", quantity: "" }],
  });

  const form = useForm<z.infer<typeof recipeSchema>>({
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

  const queryClient = useQueryClient();
  const postMutation = useMutation({
    mutationFn: postRecipe,
    onSuccess: (newRecipe) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Recipes is successfully added");
      console.log(newRecipe);
    },
    onError: (e) => {
      toast.error("Something went wrong. Please retry");
      console.log(e);
    },
  });

  function onSubmit(values: z.infer<typeof recipeSchema>) {
    // Use Query for post
    // Mutation for post, invalid ["recipes"]
    postMutation.mutate(values);
    console.log(values);
  }

  const closeDialog = useRef<HTMLButtonElement>(null);

  const [urlInput, setUrlInput] = useState("");
  const recipeFetchViaURL = useMutation({
    mutationFn: getRecipeFromURL,
    onSuccess: (data) => {
      toast.success("Recipe fetched!");
      setFormValues(data);
      closeDialog.current?.click();
    },
    onError: () => toast.error("Something went wrong. Please try again"),
  });

  return (
    <div className="mx-auto mt-12 w-4/5 lg:w-2/5 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
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
                      <TooltipTrigger>
                        <CircleHelp size={16} />
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <ul className="list-disc list-inside">
                          How often you want to cook this recipe?
                          <li>
                            I don't mind cooking this everyday: <b>Weekday</b>
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
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="weekday" />
                        <Label htmlFor="weekday">Weekday</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="weekend" />
                        <Label htmlFor="weekend">Weekend</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="rarely" />
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
                      <TooltipTrigger>
                        <CircleHelp size={14} />
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
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            {/* Meat type */}
            <FormField
              control={form.control}
              name="meat_type"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Meat type</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter meat type or None if not..."
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          {/* Ingredients */}
          <FormItem className="flex-1 mt-4">
            <FormLabel>Ingredients</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-1 lg:space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => append({ name: "", quantity: "" })}
                  className="-ml-6 md:-ml-9 lg:-ml-15  !p-1.5 lg:has-[>svg]:!px-3" //border-none shadow-none
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
                        <Input {...field} placeholder="Quantity(optional)..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                {index !== 0 && (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => remove(index)}
                    className="lg:-mr-14 -mr-7 !p-1 lg:has-[>svg]:!px-3"
                  >
                    <X />
                  </Button>
                )}
              </div>
            ))}
            <FormMessage />
          </FormItem>
          <div className="flex justify-between mt-4">
            {/* Gemini autofill */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                >
                  <Sparkles />
                  Autofill with Gemini
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Autofill with Gemini</DialogTitle>
                  <DialogDescription>
                    Add non-video recipe web link here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <Label htmlFor="url-1">URL</Label>
                  <Input
                    value={urlInput}
                    form="none"
                    placeholder="Any non-video url here..."
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" ref={closeDialog}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    onClick={() => {
                      const validateLink = urlSchema.safeParse({
                        url: urlInput,
                      });
                      if (!validateLink.success) {
                        toast.warning(
                          validateLink.error.format().url?._errors[0]
                        );
                      } else {
                        toast.success("Input is a valid URL. Now fetching...");
                        recipeFetchViaURL.mutate(urlInput);
                      }
                    }}
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
