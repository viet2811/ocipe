import { Button } from "@/components/ui/button"
import { Link} from "react-router-dom"


const WelcomePage = () => {
    return (
    <div className="flex flex-col items-center justify-center min-h-svh">
        <Button>Welcome to Ocipe</Button>
        <Link to='/login'>Log-in</Link>
    </div>
    )
}

export default WelcomePage