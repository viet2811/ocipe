import * as React from "react";
import {
  BookOpen,
  ShoppingBasket,
  CookingPot,
  Refrigerator,
  ChefHat,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { ProjectHeader } from "@/components/sidebar/project-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [username, setUsername] = React.useState(
    () => localStorage.getItem("name") || ""
  );
  const userInitial = username ? username[0].toUpperCase() : "";

  React.useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      setUsername(name);
    }
  }, []);

  const data = {
    user: {
      name: username,
      avatar: userInitial,
    },
    header: {
      name: "Ocipe",
      logo: ChefHat,
      description: "Meal planner",
    },
    kitchen: [
      {
        title: "Recipe",
        url: "/recipes",
        icon: CookingPot,
        isActive: true,
        children: [
          {
            title: "View recipes",
            url: "/recipes",
          },
          {
            title: "Add a recipe",
            url: "/recipes/add-a-recipe",
          },
        ],
      },
      // Fridge
      {
        title: "Fridge",
        url: "/fridge",
        icon: Refrigerator,
        children: [],
      },
      // Groceries
      {
        title: "Groceries",
        url: "/grocery",
        icon: ShoppingBasket,
        isActive: true,
        children: [
          {
            title: "Plan meals",
            url: "/grocery/plan-meals",
          },
          {
            title: "Previous plan",
            url: "#",
          },
        ],
      },
    ],
    documentation: [
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        children: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectHeader project={data.header} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.kitchen} label="My Kitchen" />
        <NavMain items={data.documentation} label="How's this works?" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
