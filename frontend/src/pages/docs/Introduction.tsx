import DocsPage from "@/components/DocsPage";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Introduction() {
  const headings = [
    { id: "intro", label: "Ocipe" },
    { id: "cookbook", label: "Cookbook" },
    { id: "groceryplanner", label: "Planner" },
  ];
  const contents = (
    <>
      <section id="intro">
        <h1>Introduction</h1>
        <div>
          <p className="text-muted-foreground">
            Ocipe is basically a digital personal cookbook with a built-in
            grocery planner targets in making the whole process <i>"easier"</i>
          </p>
          <p>
            <strong className="font-medium">
              I love cooking, but deciding what to eat and buy from 50+ saved
              recipes across apps, bookmarks, screenshots? Yeah… when life gets
              busy, that’s quite a nightmare.
            </strong>
          </p>
          <p>
            So hey, let make an actual software with cool feature to organise
            and make the process better.
          </p>
        </div>
      </section>

      <section id="cookbook">
        {/* Cookbook */}
        <h2>Cookbook</h2>
        <div>
          <p>The idea are quite simple innit?</p>
          <p>
            Cookbook are where all the recipes, instructions are written down to
            help you when cooking. Here's the catch: someone's gotta write them
            down first. And in this app, <b>you</b> are the manager, the writer.
          </p>
          <blockquote>
            <b>What if I'm lazy?</b>
            <br />
            <p className="italic">
              Prepared once, then you will thank yourself later :) <br />
              <span className="text-muted-foreground text-xs">
                Or have someone do it and import their data ;)
              </span>
            </p>
          </blockquote>
          <ul>
            Unlike physical cookbook, here you can search it by many means:
            <li>
              <b>Can't remember its name?</b> Search by meat types or even
              ingredients.
            </li>
            <li>
              <b>Can't bother buying new grocery?</b> Find what you can cook
              with what you have.{" "}
            </li>
          </ul>
        </div>
      </section>

      <section id="groceryplanner">
        <h2>Grocery Planner</h2>
        <div>
          <p>
            Thinking what to buy for one specific recipe might be easily done in
            our head. However, when it comes to recipes for the whole week, it
            can be a lot.
          </p>
          <p className="text-muted-foreground italic">
            I understand most people don't do this (especially if they have a
            shop in walking distance)
          </p>
          <ul className="list-disc list-inside">
            Some very simple feature include
            <li>
              A fridge components to organised what ingredients you have -{" "}
              <span className="text-chart-5">for accurate grocery list</span>
            </li>
            <li>A modified random to help in indecisive moments</li>
            <li>
              A view of what you have planned -{" "}
              <span className="text-chart-5">
                if repetiveness is not your cup of tea
              </span>
            </li>
          </ul>
        </div>
      </section>

      <div className="w-full flex items-center">
        <p>Now if you are in, let's get started</p>
        <Link to="/docs/recipe" className="ml-auto">
          <Button className="ml-auto">
            Recipe <ArrowRight />
          </Button>
        </Link>
      </div>
    </>
  );
  return <DocsPage headings={headings} content={contents} />;
}
