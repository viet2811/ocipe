import { clearHistory, getHistory } from "@/api/grocery";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRecipes } from "@/hooks/useRecipes";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import type { HistoryPlans } from "@/types/recipes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FileWarning, HistoryIcon, X } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

function PreviousPlansContent() {
  const { data: recipes } = useRecipes();
  const { data: history } = useQuery<HistoryPlans[]>({
    queryKey: ["history"],
    queryFn: getHistory,
  });
  return (
    <ScrollArea className="max-h-4/5 overflow-auto [scrollbar-gutter:stable] -mt-4">
      <Accordion
        type="single"
        collapsible
        defaultValue="item-0"
        className="mx-6"
      >
        {history &&
          history.map((plan, index) => {
            const date = new Date(plan.created_at);
            const formatted_date = date.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            return (
              <AccordionItem value={`item-${index}`} key={`item-${index}`}>
                <AccordionTrigger className="text-muted-foreground">
                  {/* Date and Combine of longevity */}
                  <h2>{formatted_date}</h2>
                  {/* Not very efficient down here cause im super duper lazy :< */}
                  <span className="ml-auto">
                    {plan.recipes.reduce((total, recipeID) => {
                      const recipe = recipes?.find((r) => r.id === recipeID);
                      return total + (recipe?.longevity ?? 0);
                    }, 0)}
                  </span>
                </AccordionTrigger>
                <AccordionContent asChild>
                  <ul className="disc-inside">
                    {plan.recipes.map((recipeID, index) => {
                      {
                        if (recipes) {
                          const recipe = recipes.filter(
                            (recipe) => recipe.id === recipeID
                          )[0];
                          if (!recipe)
                            return (
                              <li
                                className={cn(
                                  "flex w-full text-small text-destructive pr-3 items-center pl-2 py-3",
                                  index < plan.recipes.length - 1 && "border-b"
                                )}
                                key={`error-recipe-${index}`}
                              >
                                <FileWarning size={16} className="mr-2" />{" "}
                                Recipe might be deleted
                              </li>
                            );

                          return (
                            <li
                              key={`recipe-${index}`}
                              className={cn(
                                "flex w-full pr-3 pl-2 py-3",
                                index < plan.recipes.length - 1 && "border-b"
                              )}
                            >
                              <div className="flex flex-wrap items-center mr-4 px-3">
                                <span className="-ml-3 px-3 font-medium">
                                  {recipe.name}
                                </span>
                                <span className="text-xs py-0.5 px-1.5 text-muted-foreground border font-medium rounded-md text-nowrap">
                                  {recipe.meat_type}
                                </span>
                              </div>
                              <span className="ml-auto mr-5">
                                {recipe.longevity}
                              </span>
                            </li>
                          );
                        }
                      }
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
      </Accordion>
    </ScrollArea>
  );
}

export default function PreviousPlansButton() {
  const clearAllHistory = useMutation({
    mutationFn: clearHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["recent-plan"] });
    },
  });
  const contentTrigger = (
    <Button variant="outline" className="ml-auto">
      <HistoryIcon />
      <span className="hidden md:block">Previous plans</span>
    </Button>
  );

  const deleteAllButton = (
    <Button
      variant="destructive"
      className="ml-auto"
      onClick={() => clearAllHistory.mutate()}
    >
      <X /> Clear all
    </Button>
  );
  const isMobile = useIsMobile();
  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>{contentTrigger}</DrawerTrigger>
      <DrawerContent
        className="max-h-max"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DrawerHeader>
          <DrawerTitle>Previous plans</DrawerTitle>
          <DrawerDescription>Recipe planning history</DrawerDescription>
        </DrawerHeader>
        <PreviousPlansContent />
        <DrawerFooter>{deleteAllButton}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Sheet>
      <SheetTrigger asChild>{contentTrigger}</SheetTrigger>
      <SheetContent className="!max-w-[24rem]">
        <SheetHeader>
          <SheetTitle className="scroll-m-20 text-xl font-extrabold tracking-tight text-wrap mr-2">
            Previous plans
          </SheetTitle>
          <SheetDescription>Recipe planning history</SheetDescription>
        </SheetHeader>
        <PreviousPlansContent />
        <SheetFooter>{deleteAllButton}</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
