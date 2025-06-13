import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";

export const DraggableItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center space-x-2 px-2 py-1 pl-0 -ml-1 rounded hover:bg-muted transition-colors"
    >
      <span className="flex items-center justify-center w-4">
        <GripVertical size={16} className="text-muted-foreground cursor-move" />
      </span>
      <span className="text-sm">{children}</span>
    </li>
  );
};
