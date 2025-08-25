import { useEffect, useState } from "react";

type Heading = {
  id: string;
  label: string;
};

type OnThisPageProps = {
  headings: Heading[];
};

export function OnThisPage({ headings }: OnThisPageProps) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? ""
  );

  useEffect(() => {
    const handleScroll = () => {
      let current = null;
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top < 150) {
          current = h.id;
        }
      });
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <aside className="hidden @lg:block fixed right-8 mt-6 w-48 text-sm space-y-2">
      <p className="text-muted-foreground font-semibold">On This Page</p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block transition-colors ${
                activeId === h.id ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {h.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
