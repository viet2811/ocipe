// A draggable item - this is fine outside
// This has an onUpdate, onDelete props so we can handle it outside
import type { FridgeResponse, IngredientGroup } from "@/types/recipes";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getFridge, updateSingleIngredient } from "@/api/fridge";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DroppableIngredientGroup from "@/components/dnd/DroppableIngredientGroup";
import Masonry from "react-masonry-css";
import { useIsMobile } from "@/hooks/use-mobile";

// The main container with DnD context along handle drag end.
// Also need a local state to hold fetch data in order to manipulate changing group, and deletion/change
export default function Fridge() {
  const queryClient = useQueryClient();
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
  const { data, isLoading } = useQuery<FridgeResponse>({
    queryKey: ["fridge"],
    queryFn: getFridge,
  });

  const [ingredientList, setIngredientList] = useState<IngredientGroup>({});
  useEffect(() => {
    if (data && Object.keys(data.ingredient_list).length !== 0) {
      setIngredientList(data.ingredient_list);
    } else {
      setIngredientList({ General: [] });
    }
  }, [data]);
  // Handle loading state
  if (isLoading) {
    return <Loading label="fridge" />;
  }

  // Local data for drag and drop
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  // Sensor for both touch and mouse user
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const [fromGroup, ingredientIdStr] = (active.id as string).split("-");

    // Drop into same group or outside a droppable field
    if (!over || fromGroup === over.id) return;

    const ingredientId = Number(ingredientIdStr);
    const toGroup = over.id;
    const movedItem = ingredientList[fromGroup].find(
      (item) => item.id === ingredientId
    );
    if (!movedItem) return;

    const previousList = ingredientList;

    setIngredientList((prev) => {
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
          setIngredientList(previousList);
          toast.error("Something went wrong. Please retry");
        },
      }
    );
  };

  const breakpointColumnsObj = {
    default: 4,
    1280: 4,
    1024: 3,
    768: 2,
    425: 1,
  };
  const isMobile = useIsMobile();
  return (
    <DndContext
      sensors={sensors}
      onDragOver={(event) => {
        const overId = event.over?.id;
        if (overId && overId !== activeGroup) {
          setActiveGroup(overId.toString());
        }
      }}
      onDragCancel={() => setActiveGroup(null)}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveGroup(null);
      }}
    >
      <Button
        variant="ghost"
        type="button"
        className="text-muted-foreground hover:bg-muted hover:shadow-none hover:text-inherit cursor-pointer justify-start w-max mx-6"
        onClick={() =>
          isMobile
            ? setIngredientList((prev) => ({
                [""]: [],
                ...prev,
              }))
            : setIngredientList((prev) => ({
                ...prev,
                [""]: [],
              }))
        }
      >
        <Plus /> Add an ingredient group
      </Button>
      <div className="mx-6 mt-3">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto bg-clip-padding space-x-4"
        >
          {Object.entries(ingredientList).map(([groupName, ingredients]) => (
            <DroppableIngredientGroup
              key={groupName}
              groupId={groupName}
              name={groupName}
              ingredients={ingredients}
              isHighlighted={activeGroup === groupName}
              setIngredientList={setIngredientList}
            />
          ))}
        </Masonry>
      </div>
    </DndContext>
  );
}
