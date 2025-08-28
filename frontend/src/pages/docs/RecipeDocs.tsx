import DocsPage from "@/components/DocsPage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecipeDocs() {
  const headings = [
    { id: "data", label: "Data" },
    { id: "view", label: "Views" },
    { id: "add", label: "Adding" },
  ];
  const contents = (
    <>
      <section id="intro">
        <h1>Recipe</h1>
        <div>
          <p className="text-muted-foreground">
            The core data of the app, only essential.
          </p>
          <p>
            Usually whenever we went to a recipe page, we receive more stuff
            than we want: stories, description,.. blah blah blah. Let's clean
            that up.
          </p>
        </div>
      </section>

      <section id="data">
        {/* Cookbook */}
        <h2>Data</h2>
        <div>
          <p>
            Since I made this app based on what I use, there's a bit of bias. It
            may lacks a few attributes, but provide enough.
          </p>
          <p>
            <code>recipe-name</code> — self-explanatory
          </p>
          <p>
            <code>meat-type</code> — type of meat the dish contains, it can be
            none.
          </p>
          <p>
            <code>longevity</code> — how long this recipe gonna last. It can be
            portion or days, depend on what you define.
          </p>
          <p className="space-y-3">
            <code>frequency</code> — this has 3 options
          </p>
          <table className="w-full mt-3">
            <thead>
              <tr>
                <th>Frequency</th>
                <th>What it means</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Weekday</td>
                <td>Recipe that you can feel to cook everyday</td>
              </tr>
              <tr>
                <td>Weekend</td>
                <td>
                  Recipe that may take too much time & effort during weekday.
                </td>
              </tr>
              <tr>
                <td>Rarely</td>
                <td>
                  Recipe you probably cook once in a while, to treat yourself,
                  ...
                </td>
              </tr>
            </tbody>
          </table>
          <blockquote>
            <b>Why not just use cooking time instead?</b>
            <br />
            <p className="italic">
              I personally don't think we need precise time. Often we use that
              to decide if we have enough effort left to cook right? :) <br />
            </p>
          </blockquote>

          <p>
            <code>note</code>(optional) — your own personal notes, including
            instructions.
          </p>
          <p>
            <code>status</code> — an indicator if this recipe has been planned
            before. Help people like me who don't want to eat repeated meals.
          </p>
          <p>
            <code>ingredients</code> — the main part of the recipe. Each has a{" "}
            <u>name</u> and an optional* <u>quantity</u>, define as freely as
            you can or not at all. <br />
            <span className="text-muted-foreground text-sm">
              *If you are Asian, you might understand why.
            </span>
          </p>
          <blockquote>
            <b>
              Where are picture? Aren't that like one of the most important
              thing?
            </b>
            <br />
            <p className="italic">
              Uhmm, I can explain ✋😐🤚. Pictures are nice, sure, but we
              usually saved recipes that we might have cooked many times, and
              know how good it taste. <br />
              <span className="text-muted-foreground text-sm">
                "Like personality, taste overweighs the look."
              </span>{" "}
              <br />
              and it saved me dev times lol.
            </p>
          </blockquote>
        </div>
      </section>

      <section id="view">
        <h2>Views</h2>
        <div>
          <p>
            A table, the best view when having a lot of attributes, some
            sorting. Mobile devices just have to accept this :(
          </p>
          <img
            src="/recipe-mockup.png"
            alt="recipe-view-desktop-and-mobile"
            className="dark:hidden"
          />
          <img
            src="/recipe-mockup-dark.png"
            alt="recipe-view-desktop-and-mobile"
            className="hidden dark:block"
          />
          <div className="!space-y-2">
            <h3>Quick view</h3>
            <p>
              One thing that table couldn't do is display the ingredients. So
              where can we view them?
            </p>
            <p>
              A different page? Nah, <b>just click on the recipe name</b>, a
              "drawer" will slides out and display all the essential. Simple,
              quick and convenient.
            </p>
          </div>
          <h3>Search & Sort</h3>
          <ul className="space-y-2">
            There're 3 kinds of search can help you find <b>the one</b>:
            <li>
              Global search — the default. Great for broad lookups, but not
              entirely accurate with ingredients, hence...{" "}
            </li>
            <li>
              Ingredients — find the closest recipe you can cook with the
              specified ingredients (each follow by comma when listing).
            </li>
            <li>
              Your Fridge — instead typing all out like above, instantly see the
              closest match. Just remember to update your {""}
              <Link to="/docs/fridge">
                <b className="underline">Fridge</b>
              </Link>{" "}
              content.
            </li>
          </ul>
          <p>
            With table, sorting is simple. Located on the each column header,
            click once for Ascending, twice for Descending. The default table
            are presorted with newest added recipe.
          </p>
          <h3>Edit & Delete</h3>
          <p>
            Just look for the 3 dot icon at the far right of the recipe you want
            to make change on :)
          </p>
        </div>
      </section>

      <section id="add">
        <h2>Adding a recipe</h2>
        <div>
          <p>
            Other than manually filling the form, there are some quicker ways:
          </p>
          <h3>Autofill with Gemini</h3>
          <p>
            Thanks to the free cost of Google, you can fill the form quickly
            just by pasting a recipe link*.
            <br />
            <span className="text-muted-foreground text-sm">
              *One tough thing about this is I wont let you input any video
              links, i.e Youtube, Tiktok, Reels,... I would like to keep it free
              so sorry :(
            </span>
          </p>
          <div className="!space-y-2">
            <h3>Export & Import</h3>
            <p>Feeling lazy to input all in?</p>
            <p>
              I add an option to export and import <u>in recipe view</u> so you
              can ask others to export all their recipes for you. <br />
              <span className="text-muted-foreground text-sm">
                And to be honest, I add this so my friend might use it.
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="w-full flex justify-between mt-12">
        <Link to="/docs/introduction">
          <Button>
            <ArrowLeft /> Introduction
          </Button>
        </Link>
        <Link to="/docs/fridge">
          <Button>
            Fridge <ArrowRight />
          </Button>
        </Link>
      </div>
    </>
  );
  return <DocsPage headings={headings} content={contents} />;
}
