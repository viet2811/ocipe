import {
  CircleCheck,
  GripVertical,
  NotepadText,
  Shuffle,
  X,
} from "lucide-react";
import Fridge from "./Fridge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RecipeList from "@/components/RecipeList";
import type { Table } from "@tanstack/react-table";
import type { Recipe } from "@/types/recipes";

const RecipeSelectionDesktop: React.FC = () => {
  const [tableInstance, setTableInstance] = useState<Table<Recipe> | null>(
    null
  );
  const [recipeBoard, setRecipeBoard] = useState<Recipe[]>([]);

  const leftSideButtons: React.FC = () => (
    <div className="grid grid-cols-2 md:flex gap-2">
      <Button
        type="button"
        className="cursor-pointer"
        disabled={tableInstance?.getSelectedRowModel().rows.length === 0}
        onClick={() => {
          const selectedRows = tableInstance?.getSelectedRowModel().rows;
          const originalRows = selectedRows?.map((row) => row.original);
          console.log(originalRows);
          tableInstance?.resetRowSelection();
          setRecipeBoard((prev) => [...prev, ...(originalRows ?? [])]);
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
            setRecipeBoard((prev) => [...prev, randomRow.original]);
            console.log(randomRow.original);
          }
        }}
      >
        <Shuffle></Shuffle>
        Random pick
      </Button>
    </div>
  );
  return (
    <div className="flex gap-3">
      <div className="rounded-xl border min-h-4/5 min-w-0 flex-7 p-1">
        <RecipeList
          rowSelectionEnabled
          LeftSideButtons={leftSideButtons}
          strictPagination
          onTableChange={setTableInstance}
        />
      </div>
      <div
        className="rounded-xl border flex-3 flex flex-col p-6"
        id="recipe-board"
      >
        <h1 className="scroll-m-20 mt-2 text-4xl flex items-center font-extrabold tracking-tight text-balance">
          The Recipe Board
          <NotepadText className="ml-1" />
        </h1>
        {/* Example */}
        <ul className="list-disc my-4 space-y-3">
          {recipeBoard.map((recipe, index) => (
            <li
              key={`recipe${index}`}
              className="flex justify-between items-center -ml-4"
            >
              <GripVertical
                size={16}
                className="text-muted-foreground cursor-move mr-1"
              />
              <span>{recipe.name}</span>
              <span className="ml-2 text-xs py-0.5 px-1.5 -mb-1 text-muted-foreground border font-medium rounded-md w-max">
                {recipe.meat_type}
              </span>
              <span className="ml-auto">{recipe.longevity}</span>
              <X
                size={16}
                className="-mr-2 ml-2 text-muted-foreground cursor-pointer -mb-0.5"
                onClick={() => {
                  setRecipeBoard((prev) =>
                    prev.filter((_, curIndex) => curIndex !== index)
                  );
                }}
              />
            </li>
          ))}
        </ul>
        <div className="border-t pt-3 text-right text-lg font-semibold mt-auto">
          Total Longevity:{" "}
          {recipeBoard.reduce((sum, r) => sum + (Number(r.longevity) || 0), 0)}
        </div>
      </div>
    </div>
  );
};

const steps = [
  {
    title: "Check fridge",
    content: (
      <ScrollArea className="mt-4 w-full mx-auto max-h-4/5 overflow-auto p-6 rounded-xl border">
        <Fridge></Fridge>
      </ScrollArea>
    ),
  },
  {
    title: "Select recipe",
    content: <RecipeSelectionDesktop />,
  },
  {
    title: "Grocery list",
    content: <span>Grocery list yippie</span>,
  },
];

export default function GroceryPlan() {
  //   "text-blue-600 dark:text-blue-500";
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div className="mx-6 mt-3 max-h-screen">
      <ol
        id="stepper"
        className="list-inside font-medium flex md:grid md:grid-cols-5 md:place-items-center w-full items-center justify-center text-center gap-3 text-sm md:text-base mb-4"
      >
        {steps.map((step, index) => (
          <>
            <li
              className={cn(
                index < currentStep && "inline-flex items-center text-chart-5",
                index > currentStep && "text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <CircleCheck className="mr-1.5 fill-chart-5 text-background w-5 h-5" />
              ) : (
                `${index + 1}. `
              )}
              {step.title}
            </li>
            {index < steps.length - 1 && (
              <li
                className={cn(
                  "after:content-['/'] text-muted md:after:content-[''] md:w-full md:border-b md:h-1 md:border-1 md:rounded",
                  index < currentStep && "border-chart-5 bg-chart-5"
                )}
              ></li>
            )}
          </>
        ))}
      </ol>
      {/* For 1st step-Check fridge */}
      {steps[currentStep].content}
      <div className="w-full mt-4 flex justify-between">
        {currentStep > 0 ? (
          <Button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
            Prev
          </Button>
        ) : (
          <div className="invisible">Prev</div>
        )}
        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
            Next
          </Button>
        ) : (
          <div className="invisible">Next</div>
        )}
      </div>
    </div>
  );
}
