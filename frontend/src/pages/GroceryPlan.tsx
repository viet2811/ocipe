import { CircleCheck, Copy, NotepadText, Save, Shuffle } from "lucide-react";
import Fridge from "./Fridge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Fragment, memo, useRef, useState } from "react";
import RecipeList from "@/components/RecipeList";
import type { Table } from "@tanstack/react-table";
import type { Recipe, RecipeBoardItems } from "@/types/recipes";
import { useIsMobile } from "@/hooks/use-mobile";
import { SortableRecipe } from "@/components/dnd/SortableRecipe";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { nanoid } from "nanoid";
import { useMutation } from "@tanstack/react-query";
import { getGroceryIngredients, saveGroceryListItems } from "@/api/grocery";
import { toast } from "sonner";
import Loading from "@/components/loading";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SplitText from "@/components/SplitText";
import { useNavigate } from "react-router-dom";

const RecipeSelection: React.FC<{
  recipeBoard: RecipeBoardItems[];
  setRecipeBoard: React.Dispatch<React.SetStateAction<RecipeBoardItems[]>>;
}> = ({ recipeBoard, setRecipeBoard }) => {
  const [tableInstance, setTableInstance] = useState<Table<Recipe> | null>(
    null
  );

  const isMobile = useIsMobile();
  const defaultPaginationSize = isMobile ? 5 : 8;
  const leftSideButtons: React.FC = () => (
    <div className="grid grid-cols-2 md:flex gap-2">
      <Button
        type="button"
        className="cursor-pointer"
        disabled={tableInstance?.getSelectedRowModel().rows.length === 0}
        onClick={() => {
          const selectedRows = tableInstance?.getSelectedRowModel().rows;
          tableInstance?.resetRowSelection();
          setRecipeBoard((prev) => [
            ...prev,
            ...(selectedRows?.map((row) => ({
              ...row.original,
              instanceID: nanoid(),
            })) ?? []),
          ]);
        }}
      >
        Add to Board
      </Button>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={() => {
          const tableRows = tableInstance?.getCoreRowModel().rows; // filtered will be only within the range
          if (tableRows) {
            const randomRow =
              tableRows[Math.floor(Math.random() * tableRows.length)];
            setRecipeBoard((prev) => [
              ...prev,
              { ...randomRow.original, instanceID: nanoid() },
            ]);
          }
        }}
      >
        <Shuffle></Shuffle>
        Random pick
      </Button>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = recipeBoard.findIndex(
        (item) => item.instanceID === active.id
      );
      const newIndex = recipeBoard.findIndex(
        (item) => item.instanceID === over.id
      );
      setRecipeBoard((items) => arrayMove(items, oldIndex, newIndex));
    }
  }
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full mx-auto min-h-[78vh] @container">
      <div
        id="recipe-list"
        className="rounded-xl border w-full lg:w-7/10 flex-shrink-0 p-1 pt-6"
      >
        <RecipeList
          key={defaultPaginationSize}
          rowSelectionEnabled
          defaultPaginationSize={defaultPaginationSize}
          LeftSideButtons={leftSideButtons}
          strictPagination
          onTableChange={setTableInstance}
        />
      </div>
      <div
        className="rounded-xl border w-full lg:w-3/10 flex flex-col p-6"
        id="recipe-board"
      >
        <h1 className="scroll-m-20 mt-2 text-xl md:text-2xl lg:text-4xl flex items-center font-extrabold tracking-tight text-balance">
          The Recipe Board
          <NotepadText className="ml-1" />
        </h1>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext
            items={recipeBoard.map((recipe) => recipe.instanceID)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="list-disc my-4 -ml-4 -mr-3.5">
              {recipeBoard.map((recipe) => (
                <SortableRecipe
                  id={recipe.instanceID}
                  key={recipe.instanceID}
                  recipe={recipe}
                  setRecipeBoard={setRecipeBoard}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        <div className="border-t pt-3 text-right text-lg font-semibold mt-auto">
          Total Longevity:{" "}
          {recipeBoard.reduce((sum, r) => sum + (Number(r.longevity) || 0), 0)}
        </div>
      </div>
    </div>
  );
};

type IngredientDetails = {
  name: string;
  quantity: string;
};

type GroceryList = {
  grocery_list: IngredientDetails[];
  others: IngredientDetails[];
};

const AnimatedText = memo(({ text }: { text: string }) => {
  return <SplitText text={text} duration={0.6} delay={25} splitType="chars" />;
});

export default function GroceryPlan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipeBoard, setRecipeBoard] = useState<RecipeBoardItems[]>([]);

  // For grocery list results
  const [grocery, setGrocery] = useState<IngredientDetails[]>([]);
  const [existGroceryItem, setExistGroceryItem] = useState<IngredientDetails[]>(
    []
  );
  const [fullDetails, setFullDetails] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<boolean>(false);

  const { mutate: groceryList, isPending } = useMutation({
    mutationFn: getGroceryIngredients,
    onSuccess: (data: GroceryList) => {
      toast.success("Recipe fetched!");
      setGrocery(data.grocery_list);
      setExistGroceryItem(data.others);
    },
    onError: () => toast.error("Something went wrong. Please try again"),
  });

  const navigate = useNavigate();

  const saveGroceryList = useMutation({
    mutationFn: saveGroceryListItems,
    onSuccess: () => {
      toast.success("Items has been saved to grocery list."), navigate("/home");
    },
    onError: () => toast.error("Something went wrong. Please try again"),
  });
  const listRef = useRef<HTMLUListElement>(null);

  const steps = [
    {
      title: "Check fridge",
      content: (
        <Fragment>
          <ScrollArea className="mt-4 flex-row @container w-full mx-auto max-h-3/4 lg:max-h-4/5 overflow-auto overscroll-auto justify-center py-4 rounded-xl border">
            <Fridge></Fridge>
          </ScrollArea>
          <div className="w-full mt-4 pb-16 md:pb-0 flex justify-end">
            <Button
              type="button"
              onClick={() => {
                setCurrentStep(currentStep + 1);
              }}
            >
              Next
            </Button>
          </div>
        </Fragment>
      ),
    },
    {
      title: "Select recipe",
      content: (
        <Fragment>
          <RecipeSelection
            recipeBoard={recipeBoard}
            setRecipeBoard={setRecipeBoard}
          />
          <div className="w-full mt-4 pb-16 md:pb-0 flex justify-between">
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Prev
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  disabled={recipeBoard.length === 0}
                  onClick={() => {
                    if (recipeBoard.length > 0) {
                      let ids = recipeBoard.map((recipe) => recipe.id);
                      groceryList(ids);
                    }
                  }}
                >
                  Get grocery list
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[32rem]">
                <DialogHeader>
                  <DialogTitle>Grocery list</DialogTitle>
                  <DialogDescription>
                    Ingredient(s) need to be bought
                  </DialogDescription>
                </DialogHeader>
                <div id="grocery-list-content">
                  {isPending ? (
                    <Loading label="your grocery list..." />
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <ul ref={listRef} className="list-inside">
                          {grocery.length === 0 &&
                            "Congrats. You don't need to buy anything"}
                          {grocery.map((item, index) => (
                            <li
                              key={`groceryItem${index}`}
                              className="font-semibold relative list-none pl-5 before:content-['•'] before:absolute before:left-0 before:text-lg"
                            >
                              <span className="inline space-x-1">
                                <AnimatedText text={`\u00A0${item.name} `} />
                                {quantity && item.quantity && (
                                  <AnimatedText
                                    text={`\u00A0(${item.quantity})`}
                                  />
                                )}
                              </span>
                            </li>
                          ))}
                          {fullDetails &&
                            existGroceryItem.map((item, index) => (
                              <li
                                className="text-muted-foreground relative list-none pl-5 before:content-['•'] before:absolute before:left-0 before:text-lg"
                                key={`others${index}`}
                              >
                                <span className="inline space-x-1 italic">
                                  <AnimatedText text={item.name} />
                                  {quantity && item.quantity && (
                                    <AnimatedText
                                      text={`\u00A0(${item.quantity})`}
                                    />
                                  )}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="quantity"
                          checked={quantity}
                          onCheckedChange={() => {
                            setQuantity((prev) => !prev);
                          }}
                        />
                        <Label htmlFor="terms">Show aggregated quantity</Label>
                      </div>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={fullDetails}
                          id="terms-2"
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFullDetails(true);
                              setQuantity(true);
                            } else {
                              setFullDetails(false);
                              setQuantity(false);
                            }
                          }}
                        />
                        <div className="grid gap-2">
                          <Label htmlFor="terms-2">Show full details</Label>
                          <p className="text-muted-foreground text-sm">
                            Every ingredients needed, including ones you already
                            have
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                      if (listRef.current) {
                        const textToCopy = listRef.current.innerText;
                        console.log(textToCopy);
                        navigator.clipboard
                          .writeText(textToCopy)
                          .then(() => {
                            toast.success("List copied to clipboard!");
                          })
                          .catch((err) => {
                            console.error("Failed to copy: ", err);
                          });
                      }
                    }}
                  >
                    <Copy /> Copy list
                  </Button>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        if (listRef.current) {
                          const textToCopy = listRef.current.innerText;
                          saveGroceryList.mutate(textToCopy);
                        }
                      }}
                    >
                      <Save /> Save list
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Fragment>
      ),
    },
  ];

  return (
    <div className="mx-6 mt-3 max-h-[calc(100vh-64px)] lg:max-h-screen">
      <ol
        id="stepper"
        className="list-inside font-medium flex md:grid md:grid-cols-3 md:place-items-center w-full items-center justify-center text-center gap-3 text-sm md:text-base mb-4"
      >
        {steps.map((step, index) => (
          <Fragment key={`step${index}-buttons`}>
            <li
              key={`prevButton-step${index}`}
              className={cn(
                "transition-colors duration-300 inline-flex items-center",
                index < currentStep && "text-chart-5",
                index > currentStep && "text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <CircleCheck className="mr-1.5 fill-chart-5 text-background w-5 h-5 transition-all duration-300" />
              ) : (
                `${index + 1}. `
              )}
              {step.title}
            </li>

            {index < steps.length - 1 && (
              <li
                key={`nextButton-step${index}`}
                className={cn(
                  // Base styles for both views
                  "relative text-muted after:content-['/'] md:after:content-[''] md:w-full md:h-1 md:rounded-md overflow-hidden",

                  // Background color for desktop
                  "md:bg-muted",

                  // Completed step styling
                  index < currentStep && "after:text-chart-5 md:bg-transparent"
                )}
              >
                {/* Animate line only on desktop */}
                <div
                  className={cn(
                    "hidden md:block absolute inset-0 bg-chart-5 transition-all duration-700 origin-left",
                    index < currentStep ? "w-full scale-x-100" : "w-0 scale-x-0"
                  )}
                />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
      {steps[currentStep].content}
    </div>
  );
}
