import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link, Outlet, useLocation } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

const Breadcrumbs: React.FC = () => {
  const {pathname} = useLocation();
  const pathnames = pathname.split("/").filter((x) => x)
  let breadcrumbPath = "";

  const capitalizeFirst = (str: string) => {
    str = str.replace(/-/g, " ") // the / / is the regex, g is global-find all hyphen
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base font-medium">
        {pathnames.map((name, index) => {
          breadcrumbPath += `/${name}`;
          const isLast = index === pathnames.length - 1;
          name = capitalizeFirst(name)
          return isLast ? (
            <BreadcrumbItem key={index}>
              <BreadcrumbPage>
                {name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <Fragment key={index}>
              <BreadcrumbLink asChild>
                  <Link to={breadcrumbPath}>{name}</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator className="hidden md:block" />
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>

  )
}


const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4"/>
            <Breadcrumbs />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout;