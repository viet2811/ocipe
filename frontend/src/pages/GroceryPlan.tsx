import { CircleCheck, Copy, NotepadText, Save, Shuffle } from "lucide-react";
import Fridge from "./Fridge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Fragment, useRef, useState } from "react";
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
import { getGroceryList } from "@/api/grocery";
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
    mutationFn: getGroceryList,
    onSuccess: (data: GroceryList) => {
      toast.success("Recipe fetched!");
      console.log(data);
      setGrocery(data.grocery_list);
      setExistGroceryItem(data.others);
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
              <DialogContent>
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
                        <ul className="list-disc list-inside" ref={listRef}>
                          {grocery.length === 0 &&
                            "Congrats. You don't need to buy anything"}
                          {grocery.map((item) => (
                            <li className="font-semibold">
                              {item.name}
                              {quantity &&
                                item.quantity &&
                                ` (${item.quantity})`}
                            </li>
                          ))}
                          {fullDetails &&
                            existGroceryItem.map((item) => (
                              <li className="text-muted-foreground italic">
                                {item.name}
                                {quantity &&
                                  item.quantity &&
                                  ` (${item.quantity})`}
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
                    <Button>
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
    // {
    //   title: "Grocery list",
    //   content: (
    //     <div className="flex flex-col justify-center items-center w-full">
    //       {isPending ? (
    //         <Loading label="your grocery list..." />
    //       ) : (
    //         <>
    //           <svg
    //             version="1.0"
    //             xmlns="http://www.w3.org/2000/svg"
    //             viewBox="0 0 1080 1080"
    //             preserveAspectRatio="xMidYMid meet"
    //             className="w-32 h-32 -my-8"
    //           >
    //             <g
    //               transform="translate(0.000000,1080.000000) scale(0.100000,-0.100000)"
    //               fill="currentColor"
    //               stroke="none"
    //             >
    //               <path
    //                 d="M5365 8270 c-255 -24 -494 -114 -735 -275 -63 -42 -117 -78 -119 -80
    // -7 -8 63 -95 73 -92 6 3 56 35 111 72 181 121 396 210 580 241 146 24 377 15
    // 502 -20 188 -52 318 -111 491 -222 45 -30 84 -54 86 -54 6 0 66 83 66 91 0 7
    // -146 103 -221 146 -65 37 -222 105 -310 133 -155 51 -367 75 -524 60z"
    //               />
    //               <path
    //                 d="M4200 7769 c-456 -196 -560 -528 -297 -946 28 -46 56 -83 60 -83 5 0
    // 28 14 52 31 l43 31 -43 67 c-62 97 -92 160 -116 248 -66 238 48 412 356 543
    // 44 19 81 35 82 35 4 2 -29 99 -36 107 -3 4 -49 -11 -101 -33z"
    //               />
    //               <path
    //                 d="M6611 7760 c-14 -65 -14 -70 3 -70 34 0 198 -54 272 -90 197 -95 276
    // -239 230 -420 -20 -81 -79 -204 -139 -293 l-45 -67 46 -36 47 -35 21 26 c41
    // 52 117 188 150 269 90 223 63 400 -83 543 -49 49 -87 75 -175 118 -89 43 -271
    // 105 -310 105 -3 0 -11 -23 -17 -50z"
    //               />
    //               <path d="M4402 6018 l3 -613 58 -3 57 -3 0 616 0 615 -60 0 -60 0 2 -612z" />
    //               <path d="M6402 6018 l3 -613 58 -3 57 -3 0 616 0 615 -60 0 -60 0 2 -612z" />
    //               <path
    //                 d="M1783 4579 c-63 -31 -97 -87 -101 -168 -3 -80 20 -129 86 -176 87
    // -60 224 -31 277 60 84 142 -6 305 -167 305 -33 0 -68 -8 -95 -21z"
    //               />
    //               <path
    //                 d="M8835 4583 c-76 -40 -108 -92 -109 -178 -2 -119 79 -199 201 -200 52
    // 0 68 4 105 30 66 47 89 96 86 176 -4 81 -38 138 -102 169 -51 24 -138 26 -181
    // 3z"
    //               />
    //               <path
    //                 d="M5060 4029 l-45 -39 45 -46 c69 -70 168 -141 240 -171 56 -23 79 -27
    // 170 -28 101 0 108 1 184 38 43 20 97 51 120 69 59 45 136 120 136 133 0 5 -19
    // 25 -41 43 l-40 34 -52 -49 c-211 -199 -393 -203 -597 -15 l-75 69 -45 -38z"
    //               />
    //             </g>
    //           </svg>
    //           <div>
    //             <h1>Grocery list</h1>
    //             <ul className="list-disc list-inside">
    //               {grocery.map((item) => (
    //                 <li>{item}</li>
    //               ))}
    //             </ul>
    //           </div>
    //         </>
    //       )}
    //     </div>
    //   ),
    // },
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
