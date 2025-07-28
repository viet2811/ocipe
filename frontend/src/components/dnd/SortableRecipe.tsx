import type { Recipe, RecipeBoardItems } from "@/types/recipes";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

export function SortableRecipe({
  id,
  recipe,
  setRecipeBoard,
}: {
  id: string;
  recipe: Recipe;
  setRecipeBoard: React.Dispatch<React.SetStateAction<RecipeBoardItems[]>>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, animateLayoutChanges: defaultAnimateLayoutChanges });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li
      className="flex items-center pb-2 pt-1 touch-none"
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
      <div className="min-h-max">
        <span>{recipe.name}</span>
        <span className="ml-2 text-xs py-0.5 px-1.5 -mb-1 text-muted-foreground border font-medium rounded-md text-nowrap">
          {recipe.meat_type}
        </span>
      </div>
      <span className="ml-auto">{recipe.longevity}</span>
      <X
        size={16}
        className="mr-0.5 ml-2 text-muted-foreground cursor-pointer -mb-0.5"
        onClick={() => {
          setRecipeBoard((prev) =>
            prev.filter((recipe) => recipe.instanceID !== id)
          );
        }}
      />
    </li>
  );
}
