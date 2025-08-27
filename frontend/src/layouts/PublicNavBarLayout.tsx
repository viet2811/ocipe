import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import { ChefHat, Moon, Sun } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function PublicNavBarLayout() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-12 w-full items-center px-4 md:px-6 lg:px-10 justify-between">
          {/* Left: Logo + App Name */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat />
            <span className="font-semibold">Ocipe</span>
          </Link>

          {/* Right: Nav items */}
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link to="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <Link
              to="/login"
              className="rounded-lg px-3.5 py-1.5 w-max bg-primary"
            >
              Log in
            </Link>
            {/* Theme toggle */}
            <Separator orientation="vertical" className="!h-5" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-md p-2 hover:bg-muted -ml-3"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
