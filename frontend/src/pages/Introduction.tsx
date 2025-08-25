import { OnThisPage } from "@/components/OnThisPage";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Introduction() {
  const headings = [
    { id: "intro", label: "Ocipe" },
    { id: "cookbook", label: "Cookbook" },
    { id: "groceryplanner", label: "Planner" },
  ];
  return (
    <div className="flex @container">
      <div className="mx-6 @md:mx-10 @lg:ml-24 @lg:w-3/5 mt-6 mb-12 space-y-8">
        {/* Intro */}
        <section id="intro" className="space-y-4">
          <h1 className="scroll-m-20 !text-4xl !font-extrabold !tracking-tight !text-balance">
            Introduction
          </h1>
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Ocipe is basically a digital personal cookbook with a built-in
              grocery planner targets in making the whole process{" "}
              <i>"easier"</i>
            </p>
            <p>
              <strong className="font-medium">
                I love cooking, but deciding what to eat and buy from 50+ saved
                recipes across apps, bookmarks, screenshots? Yeah… when life
                gets busy, that’s quite a nightmare.
              </strong>
            </p>
            <p>
              So hey, let make an actual software with cool feature to organise
              and make the process better.
            </p>
          </div>
        </section>

        <section id="cookbook" className="space-y-4">
          {/* Cookbook */}
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-6">
            Cookbook
          </h2>
          <div className="space-y-6">
            <p>The idea are quite simple innit?</p>
            <p>
              Cookbook are where all the recipes, instructions are written down
              to help you when cooking. Here's the catch: someone's gotta write
              them down first. And in this app, <b>you</b> are the manager, the
              writer.
            </p>
            <blockquote className="border-l-2 px-4 whitespace-pre-wrap">
              <b className="text-chart-5">What if I'm lazy?</b>
              <br />
              <p className="italic">
                Prepared once, then you will thank yourself later :) <br />
                <span className="text-muted-foreground text-xs">
                  Or have someone do it and import their data ;)
                </span>
              </p>
            </blockquote>
            <ul className="list-disc list-inside">
              Unlike physical cookbook, here you can search it by many means:
              <li>
                <b className="text-chart-5">Can't remember its name?</b> Search
                by meat types or even ingredients.
              </li>
              <li>
                <b className="text-chart-5">Can't bother buying new grocery?</b>{" "}
                Find what you can cook with what you have.{" "}
              </li>
            </ul>
          </div>
        </section>

        <section id="groceryplanner" className="space-y-4">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-6">
            Grocery Planner
          </h2>
          <div className="space-y-6">
            <p>
              Thinking what to buy for one specific recipe might be easily done
              in our head. However, when it comes to recipes for the whole week,
              it can be a lot.
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
          <Button className="ml-auto">
            Recipe <ArrowRight />
          </Button>
        </div>
      </div>
      <OnThisPage headings={headings} />
    </div>
  );
}
