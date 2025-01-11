import { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export function LoginForm() {
  const [state, setState] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setState((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await login(state.email, state.password)
      // No navigation here, as workspaces are fetched in the background
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || "An unexpected error occurred")
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
          <div className="flex justify-center">
            <Button type="submit" className="px-8" variant="blue">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
