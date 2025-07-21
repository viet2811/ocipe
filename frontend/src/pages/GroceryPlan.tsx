import { CircleCheck } from "lucide-react";
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

  const leftSideButtons: React.FC = () => (
    <div className="grid grid-cols-2 md:flex">
      <Button
        type="button"
        disabled={tableInstance?.getSelectedRowModel().rows.length === 0}
        onClick={() => {
          const selectedRows = tableInstance?.getSelectedRowModel().rows;
          const originalRows = selectedRows?.map((row) => row.original);
          console.log(originalRows);
        }}
      >
        Add to Board
      </Button>
    </div>
  );
  return (
    <div className="w-2/3 p-1">
      <div className="rounded-xl border min-h-4/5">
        <RecipeList
          rowSelectionEnabled
          defaultPaginationSize={10}
          LeftSideButtons={leftSideButtons}
          strictPagination
          onTableChange={setTableInstance}
        />
      </div>
    </div>
  );
};

const steps = [
  {
    title: "Check fridge",
    content: (
      <ScrollArea className="mt-4 mx-auto max-h-4/5 overflow-auto p-6 rounded-xl border">
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
