import { getFridge } from "@/api/recipes";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Fridge() {
  const { data } = useQuery({
    queryKey: ["fridge"],
    queryFn: getFridge,
  });

  console.log(data);

  return <div className="ml-auto">Fridge</div>;
}
