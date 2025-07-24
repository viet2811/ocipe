import type { Recipe } from "@/types/recipes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

export function SortableRecipe({
  id,
  recipe,
  setRecipeBoard,
}: {
  id: number;
  recipe: Recipe;
  setRecipeBoard: React.Dispatch<React.SetStateAction<Recipe[]>>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, animateLayoutChanges: () => true });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      key={`recipe${id}`}
      className="flex justify-between items-center pb-2 pt-1"
      style={style}
      ref={setNodeRef}
    >
      <span
        className="flex items-center justify-center"
        {...listeners}
        {...attributes}
      >
        <GripVertical
          size={16}
          className="text-muted-foreground cursor-move mr-1"
        />
      </span>
      <span>{recipe.name}</span>
      <span className="ml-2 text-xs py-0.5 px-1.5 -mb-1 text-muted-foreground border font-medium rounded-md w-max">
        {recipe.meat_type}
      </span>
      <span className="ml-auto">{recipe.longevity}</span>
      <X
        size={16}
        className="mr-0.5 ml-2 text-muted-foreground cursor-pointer -mb-0.5"
        onClick={() => {
          setRecipeBoard((prev) =>
            prev.filter((_, curIndex) => curIndex !== id)
          );
        }}
      />
    </li>
  );
}
