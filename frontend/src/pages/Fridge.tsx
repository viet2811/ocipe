import {
  addAnIngredient,
  deleteSingleIngredient,
  getFridge,
  updateSingleIngredient,
} from "@/api/fridge";
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

export default function Fridge() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<FridgeResponse>({
    queryKey: ["fridge"],
    queryFn: getFridge,
  });
  const [ingredientList, setIngredientList] = useState<IngredientGroup>({});
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

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
  // Mutation area
  const onSuccessMutation = (successMessage: string) => {
    queryClient.invalidateQueries({ queryKey: ["fridge"] });
    toast.success(successMessage);
  };
  const updateMutation = useMutation({
    mutationFn: updateSingleIngredient,
    onSuccess: () => onSuccessMutation("Ingredient updated!"),
    onError: (e) => {
      console.log(e);
      toast.error("Something went wrong. Please retry");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSingleIngredient,
    onSuccess: () => onSuccessMutation("Ingredient deleted!"),
    onError: (e) => {
      console.log(e);
      toast.error("Something went wrong. Please retry");
    },
  });

  const createMutation = useMutation({
    mutationFn: addAnIngredient,
    onSuccess: () => onSuccessMutation("Ingredient added!"),
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

  const handleAddIngredient = (groupName: string) => {
    setIngredientList((prev) => {
      const newList = { ...prev };
      newList[groupName] = [
        ...newList[groupName],
        {
          id: -1,
          name: "",
        },
      ];
      return newList;
    });
  };

  const removeIngredient = (groupName: string, id: number) => {
    setIngredientList((prev) => {
      const updated = { ...prev };
      updated[groupName] = updated[groupName].filter((item) => item.id !== id);
      return updated;
    });
  };

  return (
    <DndContext
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
      <div className="m-6 grid grid-cols-4 gap-4">
        {Object.entries(ingredientList).map(([groupName, ingredients]) => (
          <DroppableList
            id={groupName}
            key={groupName}
            isHighlighted={activeGroup === groupName}
          >
            {ingredients.map((ingredient) => (
              <DraggableItem
                name={ingredient.name}
                key={ingredient.id}
                id={`${groupName}-${ingredient.id}`}
                onUpdate={(newName) => {
                  if (ingredient.id !== -1) {
                    updateMutation.mutate({
                      id: ingredient.id,
                      data: { name: newName, group: groupName },
                    });
                  } else {
                    // create mutation
                    console.log("Send create request to API");
                    createMutation.mutate({ name: newName, group: groupName });
                  }
                }}
                onDelete={() => {
                  if (ingredient.id !== -1) {
                    // delete mutate
                    console.log("Send a delete request to API");
                    deleteMutation.mutate(ingredient.id);
                  }
                  removeIngredient(groupName, ingredient.id);
                }}
              ></DraggableItem>
            ))}
            <Button
              variant="ghost"
              type="button"
              className="text-muted-foreground hover:bg-transparent hover:shadow-none hover:text-inherit cursor-pointer -ml-2"
              onClick={() => handleAddIngredient(groupName)}
            >
              <Plus /> Add an ingredient
            </Button>
          </DroppableList>
        ))}
      </div>
    </DndContext>
  );
}
