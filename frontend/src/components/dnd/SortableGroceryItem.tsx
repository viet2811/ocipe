import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { EditableTextInput } from "../editable-text-input";
import { Checkbox } from "../ui/checkbox";

export function SortableGroceryItem({
  id,
  name,
  onDelete,
  onChecked,
  onUpdate,
}: {
  id: string;
  name: string;
  onDelete: () => void;
  onChecked: () => void;
  onUpdate: () => void;
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
      <Checkbox />
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
      <EditableTextInput
        baseValue={name}
        onUpdate={onUpdate}
        onDelete={onDelete}
        placeholder="Enter your ingredient here"
        forceLower={true}
      />
      <X
        size={16}
        className="mr-0.5 ml-2 text-muted-foreground cursor-pointer -mb-0.5"
        onClick={() => onDelete()}
      />
    </li>
  );
}
