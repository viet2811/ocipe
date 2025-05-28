import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"


const Home = () => {
    const {logout} = useAuth()
    return (
      <div className="flex flex-col items-center justify-center min-h-svh">
          <Button>Home Page</Button>
          <Button onClick={logout}>Log out</Button>
      </div>
    )
}

export default Home