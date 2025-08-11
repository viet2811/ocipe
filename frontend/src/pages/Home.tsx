import {
  clearGroceryListAll,
  clearHistory,
  getGroceryList,
  getRecentGroceryPlan,
} from "@/api/grocery";
import RecipeContent from "@/components/table/recipe-sheet-content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRecipes } from "@/hooks/useRecipes";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type LucideIcon,
  Soup,
  Utensils,
  NotebookPen,
  Hamburger,
  X,
  Clipboard,
  History,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface quickButtonDataType {
  title: string;
  description: string;
  logo: LucideIcon;
  url: string;
}

type groceryListItem = {
  id: number;
  item: string;
  isChecked: boolean;
};

const quickButtonData: quickButtonDataType[] = [
  {
    title: "Hungry?",
    description: "Find something to cook",
    logo: Soup,
    url: "/recipes",
  },
  {
    title: "Found a new recipe?",
    description: "Add recipe manually or with Gemini",
    logo: Utensils,
    url: "/recipes/add-a-recipe",
  },
  {
    title: "Grocery time?",
    description: "Plan meals and grocery",
    logo: NotebookPen,
    url: "/grocery",
  },
  {
    title: "Too lazy?",
    description: "Find something to cook with your current fridge",
    logo: Hamburger,
    url: "/fridge",
  },
];

const quickButton = (data: quickButtonDataType) => {
  const Icon = data.logo;
  return (
    <Link to={data.url} key={data.title}>
      <Card className="flex flex-row items-center max-w-70 h-20 flex-1 p-2 @md:p-4 !gap-3">
        <Icon className="min-h-6 min-w-6 ml-1"></Icon>
        <div className="w-max">
          <div className="text-xs md:text-sm @lg:text-base font-semibold">
            {data.title}
          </div>
          <div className="hidden @md:block @md:text-xs text-[10px] text-wrap">
            {data.description}
          </div>
        </div>
      </Card>
    </Link>
  );
};

type History = {
  created_at: string;
  recipes: number[];
};

const Home = () => {
  const user = localStorage.getItem("name");

  const { data: groceryListData } = useQuery<groceryListItem[]>({
    queryKey: ["grocery-list"],
    queryFn: getGroceryList,
  });
  const { data: recipes } = useRecipes();
  const { data: recentPlans } = useQuery<History[]>({
    queryKey: ["plan"],
    queryFn: getRecentGroceryPlan,
  });

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

  const groceryList = (
    <>
      <div className="flex">
        <h1 className="flex items-center">
          Grocery List
          <Clipboard className="ml-2" />
        </h1>
        <Button
          variant="ghost"
          className="ml-auto"
          onClick={() => clearAllGroceryList.mutate()}
        >
          <X /> Clear all
        </Button>
      </div>
      <ul className="list-disc list-inside">
        {groceryListData && groceryListData.map((item) => <li>{item.item}</li>)}
      </ul>
    </>
  );

  const recentPlan = (
    <>
      <h1 className="flex items-center">
        Recent Plan
        <History className="ml-2" />
      </h1>
      {recentPlans &&
        recentPlans.map((item) => {
          const date = new Date(item.created_at);
          const formatted_date = date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          return (
            <>
              <h2>{formatted_date}</h2>
              <ScrollArea className="max-h-[210px] -mx-4 px-4">
                <ul className="mt-1 border border-gray-200 rounded-lg">
                  {item.recipes.map((item_id, index) => {
                    if (recipes) {
                      const recipe = recipes.filter(
                        (recipe) => recipe.id === item_id
                      )[0];

                      return (
                        <li
                          className={cn(
                            "flex w-full pr-3 pl-2 py-3",
                            index < item.recipes.length - 1 && "border-b"
                          )}
                        >
                          <div className="flex items-center">
                            <RecipeContent {...recipe} />
                            <span className="text-xs py-0.5 px-1.5 text-muted-foreground border font-medium rounded-md text-nowrap">
                              {recipe.meat_type}
                            </span>
                          </div>
                          <span className="ml-auto">{recipe.longevity}</span>
                        </li>
                      );
                    }
                  })}
                </ul>
              </ScrollArea>
            </>
          );
        })}
    </>
  );

  return (
    //
    <div className="h-[calc(100vh-64px)] @container">
      <div className="flex flex-col items-center">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1080 1080"
          preserveAspectRatio="xMidYMid meet"
          className="w-32 h-32 -mb-10"
        >
          <g
            transform="translate(0.000000,1080.000000) scale(0.100000,-0.100000)"
            fill="currentColor"
            stroke="none"
          >
            <path
              d="M5365 8270 c-255 -24 -494 -114 -735 -275 -63 -42 -117 -78 -119 -80
  -7 -8 63 -95 73 -92 6 3 56 35 111 72 181 121 396 210 580 241 146 24 377 15
  502 -20 188 -52 318 -111 491 -222 45 -30 84 -54 86 -54 6 0 66 83 66 91 0 7
  -146 103 -221 146 -65 37 -222 105 -310 133 -155 51 -367 75 -524 60z"
            />
            <path
              d="M4200 7769 c-456 -196 -560 -528 -297 -946 28 -46 56 -83 60 -83 5 0
  28 14 52 31 l43 31 -43 67 c-62 97 -92 160 -116 248 -66 238 48 412 356 543
  44 19 81 35 82 35 4 2 -29 99 -36 107 -3 4 -49 -11 -101 -33z"
            />
            <path
              d="M6611 7760 c-14 -65 -14 -70 3 -70 34 0 198 -54 272 -90 197 -95 276
  -239 230 -420 -20 -81 -79 -204 -139 -293 l-45 -67 46 -36 47 -35 21 26 c41
  52 117 188 150 269 90 223 63 400 -83 543 -49 49 -87 75 -175 118 -89 43 -271
  105 -310 105 -3 0 -11 -23 -17 -50z"
            />
            <path d="M4402 6018 l3 -613 58 -3 57 -3 0 616 0 615 -60 0 -60 0 2 -612z" />
            <path d="M6402 6018 l3 -613 58 -3 57 -3 0 616 0 615 -60 0 -60 0 2 -612z" />
            <path
              d="M1783 4579 c-63 -31 -97 -87 -101 -168 -3 -80 20 -129 86 -176 87
  -60 224 -31 277 60 84 142 -6 305 -167 305 -33 0 -68 -8 -95 -21z"
            />
            <path
              d="M8835 4583 c-76 -40 -108 -92 -109 -178 -2 -119 79 -199 201 -200 52
  0 68 4 105 30 66 47 89 96 86 176 -4 81 -38 138 -102 169 -51 24 -138 26 -181
  3z"
            />
            <path
              d="M5060 4029 l-45 -39 45 -46 c69 -70 168 -141 240 -171 56 -23 79 -27
  170 -28 101 0 108 1 184 38 43 20 97 51 120 69 59 45 136 120 136 133 0 5 -19
  25 -41 43 l-40 34 -52 -49 c-211 -199 -393 -203 -597 -15 l-75 69 -45 -38z"
            />
          </g>
        </svg>
        <h1>Hi {user}, how are we feeling?</h1>
      </div>
      <div className="flex mx-auto max-w-max my-4 max-h-100 flex-grow px-4">
        <div id="divB" className="flex flex-col ml-2 space-y-2">
          <div id="divC" className="grid grid-cols-3 space-x-2">
            {quickButton(quickButtonData[1])}
            {quickButton(quickButtonData[2])}
            {quickButton(quickButtonData[3])}
          </div>
          <div
            id="divD"
            className="flex flex-col space-y-2 @md:space-y-0 @md:mx-0 @md:grid @md:grid-cols-2 gap-2 grow"
          >
            <Card className="p-6 gap-2 flex" id="grocery-list">
              {groceryList}
            </Card>
            <Card className="p-6 gap-2 w-full" id="recent-plan">
              {recentPlan}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
