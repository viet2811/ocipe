import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function ProjectHeader({
  project,
}: {
  project: {
    name: string;
    logo: React.ElementType;
    description: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link to="/home">
          <SidebarMenuButton size="lg">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <project.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{project.name}</span>
              <span className="truncate text-xs">{project.description}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
