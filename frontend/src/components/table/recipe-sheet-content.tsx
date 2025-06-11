import type { Recipe } from "@/types/recipes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

const accuracyNode = (accuracy: number) => {
  let colorStyling = "";
  // I love u tailwind but this is abyssmal
  if (accuracy < 33) {
    colorStyling = "bg-red-400 dark:bg-red-900 text-red-900 dark:text-red-400";
  } else if (accuracy < 66) {
    colorStyling =
      "bg-yellow-400 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-400";
  } else if (accuracy < 100) {
    colorStyling =
      "bg-orange-400 dark:bg-orange-900 text-orange-900 dark:text-orange-400";
  } else {
    colorStyling =
      "bg-green-400 dark:bg-green-900 text-green-900 dark:text-green-400";
  }
  return (
    <span className={`text-xs ${colorStyling} ml-1 px-2 py-0.5 rounded`}>
      {accuracy}%
    </span>
  );
};

export default function RecipeContent(recipeData: Recipe) {
  const accuracy = recipeData.accuracy;
  const contentTrigger = (
    <div className="px-3 font-medium flex">
      <div
        className="hover:underline cursor-pointer"
        // onClick={() => console.log(row.original)}
      >
        {recipeData.name}
      </div>

      {accuracy !== undefined && accuracyNode(accuracy)}
    </div>
  );
  const detailContents = (
    <>
      <div>
        <label>Frequency</label>
        <span>{recipeData.frequency}</span>
      </div>
    </>
  );
  const isMobile = useIsMobile();
  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>{contentTrigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="scroll-m-20 text-xl font-extrabold tracking-tight text-balance">
            {recipeData.name}
          </DrawerTitle>
          <DrawerDescription>{recipeData.meat_type}</DrawerDescription>
        </DrawerHeader>
        {detailContents}
      </DrawerContent>
    </Drawer>
  ) : (
    <Sheet>
      <SheetTrigger asChild>{contentTrigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="scroll-m-20 text-xl font-extrabold tracking-tight text-balance">
            {recipeData.name}
          </SheetTitle>
          <SheetDescription>{recipeData.meat_type}</SheetDescription>
        </SheetHeader>
        {detailContents}
      </SheetContent>
    </Sheet>
  );
}
