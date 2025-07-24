import { useDroppable } from "@dnd-kit/core";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { EditableTextInput } from "../editable-text-input";
import type { Ingredient, IngredientGroup } from "@/types/recipes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addAnIngredient,
  deleteIngredientGroup,
  deleteSingleIngredient,
  renameIngredientGroup,
  updateSingleIngredient,
} from "@/api/fridge";
import { useState } from "react";
import { DraggableIngredient } from "./DraggableIngredient";
import { Button } from "../ui/button";
import { Ellipsis, Plus, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { queryClient } from "@/lib/queryClient";

type IngredientGroupProps = {
  groupId: string; // For Node ref
  name: string; // Initial name, can be changed
  ingredients: Ingredient[]; // To render and map draggable item inside
  isHighlighted: boolean; // If it's being hovered at when dragging
  setIngredientList: React.Dispatch<React.SetStateAction<IngredientGroup>>;
  // onUpdate: (newName: string) => void
  // onDelete: () => void
  // I mean we could just handle these ourselves
};

// A droppable area, sharing its name to child - item
export default function DroppableIngredientGroup({
  groupId,
  name,
  ingredients,
  isHighlighted,
  setIngredientList,
}: IngredientGroupProps) {
  // Helper function
  // Invalidate query key and toast a success
  const onSuccessMutation = (successMessage: string) => {
    queryClient.invalidateQueries({ queryKey: ["fridge"] });
    toast.success(successMessage);
  };
  // Console log error and toast error
  const onErrorMutation = (e: Error) => {
    console.log(e);
    toast.error("Something went wrong. Please retry");
  };

  const updateIngredientMutation = useMutation({
    mutationFn: updateSingleIngredient,
    onSuccess: () => onSuccessMutation("Ingredient updated!"),
    onError: (e) => onErrorMutation(e),
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: deleteSingleIngredient,
    onSuccess: () => onSuccessMutation("Ingredient deleted!"),
    onError: (e) => onErrorMutation(e),
  });

  const createIngredientMutation = useMutation({
    mutationFn: addAnIngredient,
    onSuccess: () => onSuccessMutation("Ingredient added!"),
    onError: (e) => onErrorMutation(e),
  });

  const renameGroupMutation = useMutation({
    mutationFn: ({
      old_name,
      new_name,
    }: {
      old_name: string;
      new_name: string;
    }) => renameIngredientGroup(old_name, new_name),
    onSuccess: () => onSuccessMutation("Group renamed successfully!"),
    onError: (e) => onErrorMutation(e),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteIngredientGroup,
    onSuccess: () => onSuccessMutation("Group is successfully deleted!"),
    onError: (e) => onErrorMutation(e),
  });

  const { setNodeRef } = useDroppable({ id: groupId });
  const [groupName, setGroupName] = useState(name);

  const onGroupUpdate = (newName: string) => {
    // Exist group, call PUT api
    // Name = "" -> new group so just keep in state
    if (name !== "") {
      renameGroupMutation.mutate({
        old_name: groupName,
        new_name: newName,
      });
    } else {
      setIngredientList((prev) => {
        let updated = { ...prev };
        delete updated[groupName];
        updated[newName] = [];
        return updated;
      });
    }
    setGroupName(newName);
  };

  const onGroupDelete = () => {
    // exist group, call DELETE api
    if (groupName !== "") {
      deleteGroupMutation.mutate(groupName);
    }
    // delete from ingredientList
    setIngredientList((prev) => {
      let updated = { ...prev };
      delete updated[groupName];
      return updated;
    });
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

  return (
    <Card
      key={groupId}
      className={cn(
        "p-4 h-max transition-colors mb-4",
        isHighlighted ? "border-primary" : "border-transparent"
      )}
      ref={setNodeRef}
    >
      <div className="flex space-x-2 items-center px-2 py-1 pl-0">
        <EditableTextInput
          baseValue={groupId}
          onUpdate={(newName) => onGroupUpdate(newName)}
          onDelete={onGroupDelete}
          className="font-semibold !text-lg"
          placeholder="Enter an ingredient group.."
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="flex items-center justify-center w-4 ml-auto">
              <Ellipsis
                size={16}
                className="text-muted-foreground cursor-pointer"
              />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-max">
            <DropdownMenuItem
              className="cursor-pointer px-2 text-destructive hover:!text-destructive hover:!bg-destructive/10"
              onClick={() => onGroupDelete()}
            >
              Delete
              <Trash className="h-4 w-4 text-destructive" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ul className="-mt-4">
        {ingredients.map((ingredient) => (
          <DraggableIngredient
            id={`${groupId}-${ingredient.id}`}
            key={ingredient.id}
            name={ingredient.name}
            onUpdate={(newName) => {
              // Exist ingredient, update
              if (ingredient.id !== -1) {
                updateIngredientMutation.mutate({
                  id: ingredient.id,
                  data: { name: newName, group: groupName },
                });
                // New ingredient, id = -1, create
              } else {
                createIngredientMutation.mutate({
                  name: newName,
                  group: groupName,
                });
              }
            }}
            onDelete={() => {
              // Existed: call API
              if (ingredient.id !== -1) {
                deleteIngredientMutation.mutate(ingredient.id);
              }
              // Remove from UI
              setIngredientList((prev) => {
                let updated = { ...prev };
                updated[groupName] = updated[groupName].filter(
                  (item) => item.id !== ingredient.id
                );
                return updated;
              });
            }}
          />
        ))}
        <Button
          variant="ghost"
          type="button"
          className="text-muted-foreground hover:bg-transparent hover:shadow-none hover:text-inherit cursor-pointer -ml-2"
          onClick={() => handleAddIngredient(groupName)}
        >
          <Plus /> Add an ingredient
        </Button>
      </ul>
    </Card>
  );
}
