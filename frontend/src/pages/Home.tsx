import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { 
  type LucideIcon, 
  Soup, 
  Utensils,
  NotebookPen,
  Hamburger,
} 
from "lucide-react"
import { Link } from "react-router-dom"

interface quickButtonDataType {
  title: string,
  description: string,
  logo: LucideIcon,
  url: string,
}

const quickButtonData: quickButtonDataType[] = [
  {
    title: "Hungry?",
    description: "Find something to cook",
    logo: Soup,
    url: "/recipes"
  },
  {
    title: "Found a new recipes?",
    description: "Add recipe manually or with Gemini",
    logo: Utensils,
    url: "/recipes/add-a-recipe"
  },
  {
    title: "Planning grocery?",
    description: "Plan what meals to cook next week",
    logo: NotebookPen,
    url: "/grocery"
  },
  {
    title: "Too busy to buy grocery?",
    description: "Find something to cook with your current fridge",
    logo: Hamburger,
    url: "/fridge"
  }
]

const quickButton = (data: quickButtonDataType) => {
  const Icon = data.logo
  return (
    <Link to={data.url} key={data.title}>
      <Card className="w-70 h-20 p-4 flex flex-row items-center">
        <Icon className="min-h-6 min-w-6"></Icon>
        <div className="w-max">
          <div className="text-base font-semibold">{data.title}</div>
          <div className="text-xs">{data.description}</div>
        </div>
      </Card>
    </Link>
  )
}

const Home = () => {
    const user = localStorage.getItem('name')
    return (
      <div className="flex flex-col items-center justify-center h-[80%]">
        <h1 className="text-2xl font-bold">Hi {user}, how are we feeling?</h1>
        <div className="grid grid-cols-2 gap-2 mt-4">
        {quickButtonData.map((data) => quickButton(data))}
        </div>
      </div>
    )
}

export default Home