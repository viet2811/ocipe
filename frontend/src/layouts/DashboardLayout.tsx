import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsFetching } from "@tanstack/react-query";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

const Breadcrumbs: React.FC = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter((x) => x);
  let breadcrumbPath = "";

  const capitalizeFirst = (str: string) => {
    str = str.replace(/-/g, " "); // the / / is the regex, g is global-find all hyphen
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base font-medium">
        {pathnames.map((name, index) => {
          breadcrumbPath += `/${name}`;
          const isLast = index === pathnames.length - 1;
          name = capitalizeFirst(name);
          return isLast ? (
            <BreadcrumbItem key={index}>
              <BreadcrumbPage>{name}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <Fragment key={index}>
              <BreadcrumbLink asChild>
                <Link to={breadcrumbPath}>{name}</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator className="block" />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const DashboardLayout: React.FC = () => {
  const isFetching = useIsFetching();
  console.log(isFetching);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumbs />
            {isFetching !== 0 ? (
              <div role="status" className="ml-auto">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-cloud-check-icon lucide-cloud-check ml-auto"
              >
                <path d="m17 15-5.5 5.5L9 18" />
                <path d="M5 17.743A7 7 0 1 1 15.71 10h1.79a4.5 4.5 0 0 1 1.5 8.742" />
              </svg>
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
