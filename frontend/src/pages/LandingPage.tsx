import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { BookMarked, Search, Zap } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col p-6 md:p-8 lg:px-10 min-h-[calc(100svh-3rem)]">
      <div
        id="hero-section"
        className="mt-10 lg:flex lg:items-center justify-between"
      >
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A simple* way to
          </motion.p>

          <motion.h1
            className="!text-4xl !md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Organize your <br /> Cooking & <br /> Planning grocery
          </motion.h1>

          <motion.div
            className="flex mt-6 space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/register">
              <Button size="lg">Get started</Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="secondary">
                See how it works?
              </Button>
            </Link>
          </motion.div>

          <motion.p
            className="mt-4 text-sm md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Your own digital{" "}
            <span className="text-chart-5 underline">cookbook</span>, with a
            grocery planner.
            <br />
            Better than Excel sheets
          </motion.p>
          <div className="grid grid-cols-3 mt-6 lg:mt-10 text-xs md:text-sm text-muted-foreground">
            <motion.div
              className="flex flex-col justify-center items-center text-center space-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              <BookMarked />
              <span className="w-2/3">All recipes, in one place</span>
            </motion.div>
            <motion.div
              className="flex flex-col justify-center items-center text-center space-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.3 }}
            >
              <Search />
              <span className="w-2/3">Smart recipe search</span>
            </motion.div>
            <motion.div
              className="flex flex-col justify-center items-center text-center space-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.4 }}
            >
              <Zap />
              <span className="w-2/3">Instant* grocery list</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-4 lg:mt-0 lg:w-3/5"
          initial={{ opacity: 0, x: 50 }} // start off to the right
          animate={{ opacity: 1, x: 0 }} // slide in smoothly
          transition={{ duration: 1, delay: 1 }}
        >
          <img
            src="/devices-mockup.png"
            alt="recipe-view-desktop-and-mobile"
            className="dark:hidden"
          />
          <img
            src="/devices-mockup-dark.png"
            alt="recipe-view-desktop-and-mobile"
            className="hidden dark:block"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
