import DocsPage from "@/components/DocsPage";

export default function RecipeDocs() {
  const headings = [
    { id: "data", label: "Data" },
    { id: "view", label: "Views" },
    { id: "add", label: "Input" },
  ];
  const contents = (
    <>
      <section>
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
                <span className="text-muted-foreground text-xs">
                  maybe someday if requested, but currently i made this a bit
                  selfishly
                </span>
              </p>
            </blockquote>
          </p>
          <p>
            <code>note</code> — your own personal notes, including instructions.
          </p>
          <p>
            <code>status</code> — an indicator if this recipe has been planned
            before. Help people like me who don't want to eat repeated meals.
          </p>
        </div>
      </section>

      <section id="view">
        <h2>Views</h2>
        <div></div>
      </section>

      {/* <div className="w-full flex items-center">
        <p>Now if you are in, let's get started</p>
        <Button className="ml-auto">
          Recipe <ArrowRight />
        </Button>
      </div> */}
    </>
  );
  return <DocsPage headings={headings} content={contents} />;
}
