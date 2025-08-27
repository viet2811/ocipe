import { Link, Outlet, useLocation } from "react-router-dom";

export default function PublicDocsLayout() {
  const location = useLocation();

  const links = [
    { to: "/docs/introduction", label: "Introduction" },
    { to: "/docs/recipe", label: "Recipe" },
    { to: "/docs/fridge", label: "Fridge" },
    { to: "/docs/grocery", label: "Grocery" },
  ];

  return (
    <div className="mt-6">
      <aside className="w-52 fixed border-gray-200 px-6 lg:pl-10 hidden md:block">
        <nav className="space-y-2 text-sm font-medium">
          <p className="text-chart-5 font-semibold">Getting started</p>
          {links.slice(0, 1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded-lg px-3 py-2 transition-colors ${
                location.pathname === link.to
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <p className="text-chart-5 font-semibold mt-6">Features</p>
          {links.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded-lg px-3 py-2 transition-colors ${
                location.pathname === link.to
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:ml-48">
        <Outlet />
      </div>
    </div>
  );
}
