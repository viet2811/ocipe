import * as React from "react"
import {
  BookOpen,
  ShoppingBasket,
  CookingPot,
  Refrigerator,
  ChefHat,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { ProjectHeader } from "@/components/project-header"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [username, setUsername] = React.useState(() => localStorage.getItem("name") || "")
  const userInitial = username ? username[0].toUpperCase(): ""

  React.useEffect(() => {
    const name = localStorage.getItem("name")
    if (name) {
      setUsername(name)
    }
  }, [])

  const data = {
    user: {
      name: username,
      avatar: userInitial
    },
    header:
      {
        name: "Ocipe",
        logo: ChefHat,
        description: "Meal planner",
      },
    kitchen: [
      {
        title: "Recipe",
        url: "#",
        icon: CookingPot,
        isActive: true,
        children: [
          {
            title: "View recipes",
            url: "#",
          },
          {
            title: "Add a recipe",
            url: "#",
          },
        ],
      },
      // Fridge
      {
        title: "Fridge",
        url: "#",
        icon: Refrigerator,
        children: [],
      },
      // Groceries
      {
        title: "Groceries",
        url: "#",
        icon: ShoppingBasket,
        isActive: true,
        children: [
          {
            title: "Plan meals",
            url: "#",
          },
          {
            title: "Grocery list",
            url: "#",
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
  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectHeader project={data.header} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.kitchen} label="My Kitchen"/>
        <NavMain items={data.documentation} label="How's this works?"/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
