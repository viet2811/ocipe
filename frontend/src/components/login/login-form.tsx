import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "@/contexts/AuthContext"
import { axiosInstance } from "@/lib/axios"
import { toast } from 'sonner'


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.post(
        "/user/token/",
        {username, password},
        {withCredentials: true}
      )
      login(response.data?.access)
      localStorage.setItem('name', username)
      toast.success("Log in successfully")
      navigate("/home")
    }
    catch(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          toast.error("Cannot connect to server. Please check if the backend is running.")
        } else if (error.response?.status === 401) {
          toast.warning("Username or password is not correct. Please retry")
        }
      } else {
          console.log(error)
          toast.error("An error occurred. Please try again.")
      } 
    }
  }  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
