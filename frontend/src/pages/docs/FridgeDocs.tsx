import DocsPage from "@/components/DocsPage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function FridgeDocs() {
  const headings = [
    { id: "intro", label: "Introduction" },
    { id: "usage", label: "Usage" },
  ];
  const contents = (
    <>
      <section id="intro">
        <h1>Fridge</h1>
        <div>
          <p className="text-muted-foreground">
            A place where you store your ingredients
          </p>
          <p>
            <b>Why is this essential?</b> <br />
            This app designed with grocery planner in mind. To figure out what
            you need to buy, we need to know what you currently have.
          </p>
          <p>
            <span className="text-destructive">Else</span>, you will be
            presented with all ingredients of all recipes and you have to filter
            it out yourself.
          </p>
        </div>
      </section>

      <section id="usage">
        <h2>Usage</h2>
        <div>
          <p>
            To be organised, ingredients are grouped into your own defined
            groups
          </p>

          <h3>Preview</h3>
          <img
            src="/fridge.png"
            alt="fridge-ui-preview"
            className="dark:hidden"
          />
          <img
            src="/fridge-dark.png"
            alt="fridge-ui-preview"
            className="hidden dark:block"
          />
          <h3>Edit</h3>
          <p>
            To rename ingredient or group, you can edit live like a notes app.
            No need to save or press any button to go into edit mode.
          </p>
          <h3>Changing group</h3>
          <p>
            If you accidently add an ingredient to wrong group or just change
            your mind, worry free cause you can just drag and drop in another
            group <br />
            <span className="flex items-center mt-2">
              <Info className="mr-2 text-yellow-600" /> Drag the recipe by the
              handle icon (⋮⋮)
            </span>
          </p>
        </div>
      </section>

      <div className="w-full flex justify-between mt-12">
        <Link to="/docs/recipe">
          <Button>
            <ArrowLeft /> Recipe
          </Button>
        </Link>
        <Link to="/docs/grocery">
          <Button>
            Grocery <ArrowRight />
          </Button>
        </Link>
      </div>
    </>
  );
  return <DocsPage headings={headings} content={contents} />;
}
