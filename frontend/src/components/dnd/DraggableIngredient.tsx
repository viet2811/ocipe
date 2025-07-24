import { useDraggable } from "@dnd-kit/core";
import { GripVertical, X } from "lucide-react";
import { EditableTextInput } from "../editable-text-input";
import { useState } from "react";

/**
 * DraggableIngredient component represents a single draggable list item with editable text and delete functionality.
 *
 * @param id - Unique identifier for the draggable item.
 * @param name - The display name or value of the item.
 * @param onUpdate - Callback function invoked when the item's value is updated.
 * @param onDelete - Callback function invoked when the item is deleted.
 *
 * Utilizes `useDraggable` for drag-and-drop capabilities and renders a grip icon for dragging,
 * an editable text input for the item's name, and a delete icon for removing the item.
 */
export const DraggableIngredient = ({
  id,
  name,
  onUpdate,
  onDelete,
}: {
  id: string;
  name: string;
  onUpdate: (newValue: string) => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const [isTouching, setIsTouching] = useState(false);
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

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
        baseValue={name}
        onUpdate={onUpdate}
        onDelete={onDelete}
        placeholder="Enter your ingredient here"
        forceLower={true}
      />
      <span className="flex items-center justify-center ml-auto w-4">
        <X
          size={16}
          className="text-muted-foreground cursor-pointer"
          onClick={() => onDelete()}
        />
      </span>
    </li>
  );
};
