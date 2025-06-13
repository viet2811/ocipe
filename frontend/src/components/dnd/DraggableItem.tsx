import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { EditableTextInput } from "../editable-text-input";

export const DraggableItem = ({
  id,
  name,
  onUpdate,
}: {
  id: string;
  name: string;
  onUpdate: (newValue: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-2 px-2 py-1 pl-0 -ml-1 rounded hover:bg-muted transition-colors"
    >
      <span
        className="flex items-center justify-center w-4"
        {...listeners}
        {...attributes}
      >
        <GripVertical size={16} className="text-muted-foreground cursor-move" />
      </span>
      <EditableTextInput baseValue={name} onUpdate={onUpdate} />
    </li>
  );
};
