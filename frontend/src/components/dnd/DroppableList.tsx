import { useDroppable } from "@dnd-kit/core";
import { Card } from "../ui/card";

export const DroppableList = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <Card key={id} className="p-4 h-max" ref={setNodeRef}>
      <h3 className="font-semibold text-lg ml-2">{id}</h3>
      <ul className="-mt-4">{children}</ul>
    </Card>
  );
};
