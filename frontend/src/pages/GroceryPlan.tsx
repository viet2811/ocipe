import { CircleCheck, NotepadText, Shuffle } from "lucide-react";
import Fridge from "./Fridge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";
import RecipeList from "@/components/RecipeList";
import type { Table } from "@tanstack/react-table";
import type { Recipe } from "@/types/recipes";
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

const RecipeSelection: React.FC<{
  recipeBoard: Recipe[];
  setRecipeBoard: React.Dispatch<React.SetStateAction<Recipe[]>>;
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
          const originalRows = selectedRows?.map((row) => row.original);
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
    if (!over) return;

    const oldIndex = active.id as number;
    const newIndex = over.id as number;

    if (oldIndex !== newIndex) {
      setRecipeBoard((items) => arrayMove(items, oldIndex, newIndex));
    }
  }
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full mx-auto min-h-[78vh] @container">
      <div
        id="recipe-list"
        className="rounded-xl border w-full lg:w-7/10 flex-shrink-0 p-1"
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
        className="rounded-xl border w-full lg:w-3/10 flex-shrink-0 flex flex-col p-6"
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
          <ul className="list-disc my-4 -ml-4 -mr-3.5">
            <SortableContext
              items={recipeBoard.map((_, index) => index)}
              strategy={verticalListSortingStrategy}
            >
              {recipeBoard.map((recipe, index) => (
                <SortableRecipe
                  id={index}
                  key={index}
                  recipe={recipe}
                  setRecipeBoard={setRecipeBoard}
                />
              ))}
            </SortableContext>
          </ul>
        </DndContext>
        <div className="border-t pt-3 text-right text-lg font-semibold mt-auto">
          Total Longevity:{" "}
          {recipeBoard.reduce((sum, r) => sum + (Number(r.longevity) || 0), 0)}
        </div>
      </div>
    </div>
  );
};

export default function GroceryPlan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [recipeBoard, setRecipeBoard] = useState<Recipe[]>([]);

  const steps = [
    {
      title: "Check fridge",
      content: (
        <ScrollArea className="mt-4 flex-row @container w-full mx-auto max-h-3/4 lg:max-h-4/5 overflow-auto overscroll-auto justify-center py-4 rounded-xl border">
          <Fridge></Fridge>
        </ScrollArea>
      ),
    },
    {
      title: "Select recipe",
      content: (
        <RecipeSelection
          recipeBoard={recipeBoard}
          setRecipeBoard={setRecipeBoard}
        />
      ),
    },
    {
      title: "Grocery list",
      content: <span>Grocery list yippie</span>,
    },
  ];

  return (
    <div className="mx-6 mt-3 max-h-screen">
      <ol
        id="stepper"
        className="list-inside font-medium flex md:grid md:grid-cols-5 md:place-items-center w-full items-center justify-center text-center gap-3 text-sm md:text-base mb-4"
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
      {/* For 1st step-Check fridge */}
      {steps[currentStep].content}
      <div className="w-full my-4 flex justify-between">
        {currentStep > 0 ? (
          <Button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
            Prev
          </Button>
        ) : (
          <div className="invisible">Prev</div>
        )}
        {currentStep < steps.length - 1 ? (
          <Button
            type="button"
            disabled={currentStep === 1 && recipeBoard.length === 0}
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Next
          </Button>
        ) : (
          <div className="invisible">Next</div>
        )}
      </div>
    </div>
  );
}
