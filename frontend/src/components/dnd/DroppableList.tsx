import { useDroppable } from "@dnd-kit/core";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { EditableTextInput } from "../editable-text-input";

export const DroppableList = ({
  id,
  children,
  isHighlighted,
  onUpdate,
  onDelete,
}: {
  id: string;
  children: React.ReactNode;
  isHighlighted?: boolean;
  onUpdate: (newValue: string) => void;
  onDelete: () => void;
}) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <Card
      key={id}
      className={cn(
        "p-4 h-max transition-colors",
        isHighlighted ? "border-primary" : "border-transparent"
      )}
      ref={setNodeRef}
    >
      <EditableTextInput
        baseValue={id}
        onUpdate={onUpdate}
        onDelete={onDelete}
        className="font-semibold !text-lg"
      />
      <ul className="-mt-4">{children}</ul>
    </Card>
  );
};
