import { getFridge, updateSingleIngredient } from "@/api/fridge";
import Loading from "@/components/loading";
import { type FridgeResponse, type IngredientGroup } from "@/types/recipes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { DroppableList } from "@/components/dnd/DroppableList";
import { DraggableItem } from "@/components/dnd/DraggableItem";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableTextInput } from "@/components/editable-text-input";

export default function Fridge() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<FridgeResponse>({
    queryKey: ["fridge"],
    queryFn: getFridge,
  });
  const [ingredientList, setIngredientList] = useState<IngredientGroup>({});

  useEffect(() => {
    if (data) {
      setIngredientList(data.ingredient_list);
    }
  }, [data]);

  // Handle loading state
  if (isLoading) {
    return <Loading label="fridge" />;
  }
  if (!data) {
    return <div>Hmm nothing here. Will add option here later</div>;
  }

  const updateMutation = useMutation({
    mutationFn: updateSingleIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fridge"] });
      toast.success("Ingredient updated!");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Something went wrong. Please retry");
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const [fromGroup, ingredientIdStr] = (active.id as string).split("-");

    // Same group or not drop into a droppable
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

    updateMutation.mutate(
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="m-6 grid grid-cols-4 gap-4">
        {Object.entries(ingredientList).map(([groupName, ingredients]) => (
          <DroppableList id={groupName} key={groupName}>
            {ingredients.map((ingredient) => (
              <DraggableItem
                key={ingredient.id}
                id={`${groupName}-${ingredient.id}`}
                onUpdate={(newName) =>
                  updateMutation.mutate({
                    id: ingredient.id,
                    data: { name: newName, group: groupName },
                  })
                }
                name={ingredient.name}
              ></DraggableItem>
            ))}
            <Button
              variant="ghost"
              type="button"
              className="text-muted-foreground hover:bg-transparent hover:shadow-none hover:text-inherit cursor-pointer -ml-2"
            >
              <Plus /> Add an ingredient
            </Button>
          </DroppableList>
        ))}
      </div>
    </DndContext>
  );
}
