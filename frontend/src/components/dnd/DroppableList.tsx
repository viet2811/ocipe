import { useDroppable } from "@dnd-kit/core";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

export const DroppableList = ({
  id,
  children,
  isHighlighted,
}: {
  id: string;
  children: React.ReactNode;
  isHighlighted?: boolean;
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
      <h3 className="font-semibold text-lg ml-2">{id}</h3>
      <ul className="-mt-4">{children}</ul>
    </Card>
  );
};
