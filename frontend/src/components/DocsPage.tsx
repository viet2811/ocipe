import { useEffect, useState } from "react";

type Heading = {
  id: string;
  label: string;
};

type OnThisPageProps = {
  headings: Heading[];
};

function OnThisPage({ headings }: OnThisPageProps) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? ""
  );

  useEffect(() => {
    const handleScroll = () => {
      let current = null;
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top < 150) {
          current = heading.id;
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

interface DocsPageProps {
  headings: Heading[];
  content: React.ReactNode; // <-- not React.FC
}

export default function DocsPage({ headings, content }: DocsPageProps) {
  // Content should be section(with id)> heading, div>text, blockquote, e.t.c
  return (
    <div className="flex @container">
      <div className="docs">{content}</div>
      <OnThisPage headings={headings} />
    </div>
  );
}
