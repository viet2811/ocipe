import {
  clearGroceryListAll,
  deleteSingleGroceryListItem,
  getGroceryList,
  saveGroceryListItems,
  updateSingleGroceryListItem,
} from "@/api/grocery";
import { queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Clipboard, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { EditableTextInput } from "./editable-text-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Skeleton } from "./ui/skeleton";

type groceryListItem = {
  id: number;
  item: string;
  isChecked: boolean;
};

function GroceryListItem({ item }: { item: groceryListItem }) {
  const [listItemId, setListItemID] = useState<number>(item.id);

  const updateItemMutation = useMutation({
    mutationFn: updateSingleGroceryListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grocery-list"] });
    },
    onError: (e) => console.log("Save error" + e),
  });

  const onDelete = () => {
    queryClient.setQueryData<groceryListItem[]>(["grocery-list"], (old) =>
      old ? old.filter((cur_item) => cur_item.id !== listItemId) : []
    );
  };

  const deleteItemMutation = useMutation({
    mutationFn: () => deleteSingleGroceryListItem({ id: listItemId }),
    onMutate: () => {
      const previousList = queryClient.getQueryData<groceryListItem[]>([
        "grocery-list",
      ]);
      onDelete();
      return { previousList };
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["grocery-list"] }),
    onError: (_err, _id, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(["grocery-list"], context.previousList);
      }
    },
  });

  const createNewItemMutation = useMutation({
    mutationFn: saveGroceryListItems,
    onSuccess: (response, newValue) => {
      setListItemID(response.id);
      let newItem: groceryListItem = {
        id: response.id,
        item: newValue,
        isChecked: false,
      };
      queryClient.setQueryData<groceryListItem[]>(["grocery-list"], (old) => {
        if (!old) return [newItem];
        return old.map((item) => (item.id === listItemId ? newItem : item));
      });
    },
  });

  const [isChecked, setIsChecked] = useState<boolean>(item.isChecked);

  return (
    <li
      className="flex items-center justify-center space-x-2 mb-2"
      key={`recipe-list-item${item.id}`}
    >
      <Checkbox
        id={`list-item${item.id}`}
        aria-label="checkbox"
        checked={isChecked}
        onCheckedChange={(newCheckedState) => {
          if (typeof newCheckedState === "boolean") {
            setIsChecked(newCheckedState);
            updateItemMutation.mutate({
              id: item.id,
              data: { isChecked: newCheckedState },
            });
          }
        }}
        className="border-2 border-muted-foreground shadow-none rounded-none peer"
      />
      <Label
        htmlFor={`list-item${item.id}`}
        className="text-base peer-[&[data-state=checked]]:line-through peer-[&[data-state=checked]]:text-muted-foreground"
        onClick={(e) => e.preventDefault()}
      >
        <EditableTextInput
          baseValue={item.item}
          onUpdate={(newValue) => {
            if (listItemId > -1) {
              updateItemMutation.mutate({
                id: listItemId,
                data: { item: newValue },
              });
            } else {
              createNewItemMutation.mutate(newValue);
            }
          }}
          onDelete={onDelete}
          className="!w-40 cursor-text"
        />
      </Label>
      <X
        className="ml-auto cursor-pointer text-muted-foreground"
        size={16}
        onClick={() => deleteItemMutation.mutate()}
      />
    </li>
  );
}

export default function GroceryList() {
  const { data: groceryListData, isLoading } = useQuery<groceryListItem[]>({
    queryKey: ["grocery-list"],
    queryFn: getGroceryList,
  });

  const [newItemCounter, setNewItemCounter] = useState<number>(-1);

  const clearAllGroceryList = useMutation({
    mutationFn: clearGroceryListAll,
    onSuccess: () => {
      toast.success("List is cleared");
      queryClient.invalidateQueries({ queryKey: ["grocery-list"] });
    },
    onError: (e) => {
      toast.error("Something went wrong. Sorry mate");
      console.log(e);
    },
  });

  const addNewItemToList = () => {
    let item: groceryListItem = {
      id: newItemCounter,
      item: "",
      isChecked: false,
    };
    setNewItemCounter((prev) => prev - 1);
    queryClient.setQueryData<groceryListItem[]>(["grocery-list"], (old) => [
      item,
      ...(old ?? []),
    ]);
  };

  function ListItemSkeleton() {
    return (
      <li className="flex items-center space-x-2 mb-2">
        <Skeleton className="w-6 aspect-square " />
        <Skeleton className="w-40 h-6" />
        <Skeleton className="w-6 h-6 ml-auto" />
      </li>
    );
  }

  return (
    <>
      <div className="flex">
        <h2 className="flex items-center font-bold text-2xl">
          Grocery List
          <Clipboard className="ml-2" />
        </h2>
        <Button
          variant="ghost"
          className="ml-auto"
          onClick={() => clearAllGroceryList.mutate()}
        >
          <X /> Clear all
        </Button>
      </div>
      <Button
        variant="ghost"
        type="button"
        className="text-muted-foreground hover:bg-transparent hover:shadow-none hover:text-inherit cursor-pointer justify-start w-max !p-0"
        onClick={() => addNewItemToList()}
      >
        <Plus /> Add an item
      </Button>
      <ul className="list-inside">
        {/* Unchecked */}
        <ScrollArea className="max-h-[120px]  @md:max-h-[180px] -mx-4 pl-4 pr-2.5 overflow-auto [scrollbar-gutter:stable]">
          {groceryListData &&
            groceryListData.map((item) => {
              if (!item.isChecked)
                return <GroceryListItem item={item} key={`item-${item.id}`} />;
            })}
        </ScrollArea>
        {isLoading && (
          <>
            <ListItemSkeleton />
            <ListItemSkeleton />
          </>
        )}
        {/* Checked */}
        <Accordion type="single" collapsible>
          <AccordionItem value="checked-items">
            <AccordionTrigger>
              {groceryListData?.filter((item) => item.isChecked).length ?? 0}{" "}
              Checked items
            </AccordionTrigger>
            <AccordionContent asChild>
              <ScrollArea className="max-h-[60px] @md:max-h-[100px] -mx-4 pl-4 pr-2.5 overflow-auto [scrollbar-gutter:stable]">
                {groceryListData &&
                  groceryListData.map((item) => {
                    if (item.isChecked)
                      return (
                        <GroceryListItem item={item} key={`item-${item.id}`} />
                      );
                  })}
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ul>
    </>
  );
}
