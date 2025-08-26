import DocsPage from "@/components/DocsPage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function GroceryDocs() {
  const headings = [
    { id: "intro", label: "Introduction" },
    { id: "steps", label: "Steps" },
    { id: "result", label: "Result" },
  ];
  const contents = (
    <>
      <section id="intro">
        <h1>Grocery</h1>
        <div>
          <p className="text-muted-foreground">
            Aaah, the "chore" we all love to do <br />
          </p>
          <p>
            It's quite straightforward. You pick recipes, you get grocery list.
          </p>
          <p>
            But if you're picky like me, choosing is not easy. Having to recheck
            what ingredients each recipe has to finalize a grocery list after is
            even more time-consuming.
          </p>
        </div>
      </section>

      <section id="steps">
        {/* Cookbook */}
        <h2>Steps</h2>
        <div>
          <h3>1. Checking your fridge</h3>
          <div className="!space-y-2">
            <p>
              Almost similar to normal routine, you need to remember what you
              current have to make grocery list.
            </p>
            <p>Well, in Ocipe, you start those first.</p>
          </div>

          <h3>2. Choosing your recipe</h3>
          <div>
            <p>
              Alongside the exist Recipe table with search & sort is a{" "}
              <b>Recipe board</b> for your selection, sums up the total amount
              of <u>longevity</u> <br />
              <span className="flex items-center mt-2">
                <Info className="mr-2 text-yellow-600 shrink-0" /> If you want
                to order which recipe you want to cook first, no worries. Drag
                the handle (⋮⋮) on each recipe to reorder.
              </span>
            </p>
            <div className="!space-y-2">
              <h4>Extra tools</h4>
              <p>
                Like previously mentioned, I sometimes don't know what to
                choose. So I add some tools to help that.
              </p>
              <b>Random</b> — simplest form to decide something innit? <br />
              <p>
                I had some "fairly simple" settings, which you can disable if
                you want to:
              </p>
              <ul className="ml-2 space-y-1">
                <li>
                  Only random <b className="underline">active</b> recipe (you
                  haven't eat yet)
                </li>
                <li>
                  When you select bunch of recipe on the table, it will random
                  only <u>the selected</u>.
                </li>
                <li>
                  Extra settings for the 2nd one — after a recipe is randomed,
                  its selection will be removed .
                </li>
              </ul>
              <p>
                <b>Previous plans</b> <br />
                Have a look at what you have planned before. Either help you
                what not to pick or you can reuse your old plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="result">
        <h2>Result</h2>
        <div>
          <p>
            After you have chosen your recipes, you will get that quick, instant
            grocery list, what to buy without a thought*.{" "}
          </p>
          <p>
            The result will be presented the simplest form, only the ingredients
            name, which on its own might not be enough right?
          </p>
          <p>
            That's why there will be 2 checkbox options to see the list more
            details:
          </p>
          <ul className="-mt-3 ml-2 !list-outside pl-3 space-y-2">
            <li>
              <b>Show aggregated quantity</b> — All quantities combined** will
              be revealed. <br />
              <span className="text-muted-foreground text-sm">
                **Remember when I allow freedom in specifying quantity? Yea so,
                the combined will be <u>text concatenation</u> and you have to
                do the math here sorry D:
              </span>
            </li>
            <li>
              <b>Show full details</b> — All details revealed including quantity
              and ingredients that you don't need. <br />
              <span className="text-muted-foreground text-sm">
                Why? In case you need 5 eggs while only have 4 eggs. The normal
                list couldn't possibly know. *A bit hastle? Sure, but just in
                case.
              </span>
            </li>
          </ul>
          <p>
            You will also be able to <i>copy</i> the list to your note app or{" "}
            <b>save</b> into the app grocery list.
          </p>
          <blockquote>
            <b>Where's the app list you might ask?</b>
            <br />
            <p className="italic">
              It will be on the <u>Home page</u> alongside a quick access on
              what you have recently planned so you won't need to look it up
              again :)
            </p>
          </blockquote>
        </div>
      </section>

      <div className="w-full flex justify-between mt-12">
        <Link to="/docs/fridge">
          <Button>
            <ArrowLeft /> Fridge
          </Button>
        </Link>
        <Link to="/home">
          <Button>
            Got it all? <ArrowRight />
          </Button>
        </Link>
      </div>
    </>
  );
  return <DocsPage headings={headings} content={contents} />;
}
