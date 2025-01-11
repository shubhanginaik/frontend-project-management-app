import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import api from "@/api"
import jwtDecode from "jwt-decode"

interface DecodedToken {
  sub: string
  permission: string[]
  iat: number
  exp: number
}

interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
  isAuthenticated: boolean
  userId: string | null
  workspaceIds: string[] | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)
  const [userId, setUserId] = useState<string | null>(null)
  const [workspaceIds, setWorkspaceIds] = useState<string[] | null>(null)
  const queryClient = useQueryClient()

  const decodeToken = useCallback((token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      setUserId(decoded.sub)
      setWorkspaceIds(decoded.permission)
      return { userId: decoded.sub, workspaceIds: decoded.permission }
    } catch (error) {
      console.error("Error decoding token:", error)
      return { userId: null, workspaceIds: null }
    }
  }, [])

  useEffect(() => {
    if (token) {
      const { userId, workspaceIds } = decodeToken(token)
      console.log("Decoded token, userId:", userId)
      console.log("Decoded token, workspaceIds:", workspaceIds)
    } else {
      setUserId(null)
      setWorkspaceIds(null)
      setIsAuthenticated(false)
    }
  }, [token, decodeToken])

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post("/auth/login", credentials)
      if (response.data && response.data.data && response.data.data.accessToken) {
        return response.data.data.accessToken
      }
      throw new Error("Unexpected response structure")
    },
    onSuccess: (newToken) => {
      setToken(newToken)
      setIsAuthenticated(true)
      localStorage.setItem("token", newToken)
      const { userId, workspaceIds } = decodeToken(newToken)
      console.log("Login successful, token set")
      console.log("UserId:", userId)
      console.log("WorkspaceIds:", workspaceIds)
    },
    onError: (error) => {
      console.error("Login error:", error)
      throw error
    }
  })

  const login = async (email: string, password: string) => {
    console.log("Attempting login...", { email })
    await loginMutation.mutateAsync({ email, password })
  }

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Perform any logout API calls here if needed
      return Promise.resolve()
    },
    onSuccess: () => {
      setToken(null)
      setIsAuthenticated(false)
      setUserId(null)
      setWorkspaceIds(null)
      localStorage.removeItem("token")
      queryClient.clear()
      console.log("Logged out")
    },
    onError: (error) => {
      console.error("Logout error:", error)
    }
  })

  const logout = () => {
    logoutMutation.mutate()
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated,
        userId,
        workspaceIds,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
