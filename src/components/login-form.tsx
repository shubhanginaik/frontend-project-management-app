import { ChangeEvent, FormEvent, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import api from "@/api" // Import the api instance

export function LoginForm() {
  const [state, setState] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState<string | null>(null)
  const { setToken } = useAuth()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setState((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      console.log("before post", state)
      console.log("before api", api)
      const response = await api.post("/auth/login", state) // Corrected API call
      console.log("after api", response)

      if (response && response.data && response.data.data && response.data.data.accessToken) {
        const token = response.data.data.accessToken
        setToken(token)
        localStorage.setItem("token", token)
        setError(null)
      } else {
        setError("Unexpected response structure")
      }
    } catch (err: any) {
      console.error("API call error", err)
      if (err.response) {
        console.error("Response data:", err.response.data)
        console.error("Response status:", err.response.status)
        console.error("Response headers:", err.response.headers)
      }
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("An unexpected error occurred")
      }
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email and password to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              onChange={handleChange}
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input onChange={handleChange} id="password" name="password" type="password" required />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
