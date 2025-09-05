import { useDraggable } from "@dnd-kit/core";
import { GripVertical, X } from "lucide-react";
import { EditableTextInput } from "../editable-text-input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  addAnIngredient,
  deleteSingleIngredient,
  updateSingleIngredient,
} from "@/api/fridge";
import { toast } from "sonner";
import type { Ingredient, IngredientGroup } from "@/types/recipes";
import { queryClient } from "@/lib/queryClient";

const onErrorMutation = (e: Error) => {
  console.log(e);
  toast.error("Something went wrong. Please retry");
};

/**
 * DraggableIngredient component represents a single draggable list item with editable text and delete functionality.
 *
 * @param dragId - Unique identifier for the draggable item.
 * @param ingredient- The ingredient item.
 * @param groupName - groupName of the ingredient to handle UPDATE
 * @param onDelete - Callback function to delete the item
 *
 * Utilizes `useDraggable` for drag-and-drop capabilities and renders a grip icon for dragging,
 * an editable text input for the item's name, and a delete icon for removing the item.
 */
export const DraggableIngredient = ({
  dragId,
  ingredient,
  groupName,
  onDelete,
}: {
  dragId: string;
  ingredient: Ingredient;
  groupName: string;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: dragId,
  });
  const [isTouching, setIsTouching] = useState(false);
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const [ingreId, setIngreId] = useState<number>(ingredient.id);

  const updateIngredientMutation = useMutation({
    mutationFn: updateSingleIngredient,
    // onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fridge"] }),
    onError: (e) => onErrorMutation(e),
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: deleteSingleIngredient,
    // onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fridge"] }),
    onError: (e) => onErrorMutation(e),
  });

  const createIngredientMutation = useMutation({
    mutationFn: addAnIngredient,
    onSuccess: (response, value) => {
      setIngreId(response.id);
      queryClient.setQueryData<IngredientGroup>(["fridge"], (prev) => {
        const newList = { ...prev };
        let itemIndex = newList[groupName].findIndex(
          (curIngre) => curIngre.id === ingredient.id
        );
        if (itemIndex) {
          newList[groupName][itemIndex] = {
            id: response.id,
            name: value.name,
          };
        }
        return newList;
      });
    },
    onError: (e) => onErrorMutation(e),
  });

  const onIngredientDelete = () => {
    if (ingreId > -1) {
      deleteIngredientMutation.mutate(ingreId);
    }
    onDelete();
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-2 px-2 py-1 pl-0 -ml-1 rounded transition-colors ${
        isTouching ? "bg-muted" : "hover:bg-muted"
      }`}
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={() => setIsTouching(false)}
      onTouchCancel={() => setIsTouching(false)}
    >
      <span
        className="flex items-center justify-center w-4"
        {...listeners}
        {...attributes}
      >
        <GripVertical size={16} className="text-muted-foreground cursor-move" />
      </span>
      <EditableTextInput
        baseValue={ingredient.name}
        onUpdate={(newName) => {
          // Exist ingredient, update
          if (ingreId > -1) {
            updateIngredientMutation.mutate({
              id: ingreId,
              data: { name: newName, group: groupName },
            });
            // New ingredient, id <= -1, create
          } else {
            createIngredientMutation.mutate({
              name: newName,
              group: groupName,
            });
          }
        }}
        onDelete={onIngredientDelete}
        placeholder="Enter your ingredient here"
        forceLower={true}
      />
      <span className="flex items-center justify-center ml-auto w-4">
        <X
          size={16}
          className="text-muted-foreground cursor-pointer"
          onClick={() => onIngredientDelete()}
        />
      </span>
    </li>
  );
};
