// A draggable item - this is fine outside
// This has an onUpdate, onDelete props so we can handle it outside
import type { IngredientGroup } from "@/types/recipes";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getFridge, updateSingleIngredient } from "@/api/fridge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DroppableIngredientGroup from "@/components/dnd/DroppableIngredientGroup";
import Masonry from "react-masonry-css";
import { useIsMobile } from "@/hooks/use-mobile";
import { queryClient } from "@/lib/queryClient";

// The main container with DnD context along handle drag end.
// Also need a local state to hold fetch data in order to manipulate changing group, and deletion/change
export default function Fridge() {
  const updateIngredientMutation = useMutation({
    mutationFn: updateSingleIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fridge"] });
      toast.success("Ingredients updated!");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Something went wrong. Please retry");
    },
  });

  // Fridge fetch data
  const { data: ingredientList } = useQuery<IngredientGroup>({
    queryKey: ["fridge"],
    queryFn: getFridge,
  });

  // Local data for drag and drop
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  // Sensor for both touch and mouse user
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const [fromGroup, ingredientIdStr] = (active.id as string).split("-");

    // Drop into same group or outside a droppable field
    if (!over || fromGroup === over.id || !ingredientList) return;

    const ingredientId = Number(ingredientIdStr);
    const toGroup = over.id;
    const movedItem = ingredientList[fromGroup].find(
      (item) => item.id === ingredientId
    );
    if (!movedItem) return;

    const previousList = ingredientList;

    queryClient.setQueryData<IngredientGroup>(["fridge"], (prev) => {
      const newList = { ...prev };
      // Remove from old group
      newList[fromGroup] = newList[fromGroup].filter(
        (item) => item.id !== ingredientId
      );
      // Add to new group
      newList[toGroup] = [...newList[toGroup], movedItem];
      return newList;
    });

    updateIngredientMutation.mutate(
      {
        id: ingredientId,
        data: { name: movedItem.name, group: `${toGroup}` },
      },
      {
        onError: () => {
          queryClient.setQueryData<IngredientGroup>(["fridge"], previousList);
          toast.error("Something went wrong. Please retry");
        },
      }
    );
  };

  const breakpointColumnsObj = {
    default: 5,
    1440: 4,
    1024: 3,
    821: 2,
    520: 1,
  };
  const isMobile = useIsMobile();

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
      onDragOver={(event) => {
        const overId = event.over?.id;
        if (overId && overId !== activeGroup) {
          setActiveGroup(overId.toString());
        } else {
          // Set active group as original group
          const [fromGroup, _] = (event.active.id as string).split("-");
          setActiveGroup(fromGroup);
        }
      }}
      onDragCancel={() => setActiveGroup(null)}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveGroup(null);
      }}
    >
      <div className="mx-6 max-w-screen">
        <Button
          variant="ghost"
          type="button"
          className="text-muted-foreground hover:bg-muted hover:shadow-none hover:text-inherit cursor-pointer justify-start w-max"
          onClick={() =>
            isMobile
              ? queryClient.setQueryData<IngredientGroup>(
                  ["fridge"],
                  (old) => ({
                    [""]: [],
                    ...old,
                  })
                )
              : queryClient.setQueryData<IngredientGroup>(
                  ["fridge"],
                  (old) => ({
                    ...old,
                    [""]: [],
                  })
                )
          }
        >
          <Plus /> Add an ingredient group
        </Button>
        <div className="my-3">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto bg-clip-padding space-x-4"
          >
            {ingredientList &&
              Object.entries(ingredientList).map(([groupName, ingredients]) => (
                <DroppableIngredientGroup
                  key={groupName}
                  groupId={groupName}
                  name={groupName}
                  ingredients={ingredients}
                  isHighlighted={activeGroup === groupName}
                />
              ))}
          </Masonry>
        </div>
      </div>
    </DndContext>
  );
}
