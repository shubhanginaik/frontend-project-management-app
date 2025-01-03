import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import API from "../api/index"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const { setToken } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  interface LoginResponse {
    token: string
  }

  interface LoginCredentials {
    username: string
    password: string
  }

  const loginMutation = useMutation<LoginResponse, unknown, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await API.post<LoginResponse>("/api/v1/auth/login", credentials)
      return response.data
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await loginMutation.mutateAsync({ username, password })
      setToken(data.token)
      alert("Login successful!")
    } catch (error) {
      alert("Login failed!")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {loginMutation.status == "pending" ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Login
