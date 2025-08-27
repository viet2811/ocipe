import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-3rem)]">
      <Button>Welcome to Ocipe</Button>
      <Link to="/login">Log-in</Link>
    </div>
  );
};

export default LandingPage;
