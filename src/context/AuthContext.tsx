import React, { createContext, useContext, useState, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import jwtDecode from "jwt-decode"
import api from "@/api"
import {
  fetchWorkspaceUsers,
  fetchWorkspaceDetails,
  WorkspaceDetails,
  WorkspaceDetailsResponse
} from "@/api/Workspace"

interface DecodedToken {
  sub: string // This is the email
  iat: number
  exp: number
}

interface UserData {
  id: string
  email: string
  firstName: string
}

interface WorkspaceUser {
  id: string
  roleId: string
  userId: string
  workspaceId: string
}

interface WorkspaceUsersResponse {
  data: WorkspaceUser[]
  status: string
  code: number
  errors: null | any
}

interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
  isAuthenticated: boolean
  userId: string | null
  userEmail: string | null
  firstName: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  workspaces: WorkspaceDetailsResponse[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<WorkspaceDetailsResponse[]>([])

  const queryClient = useQueryClient()

  const decodeToken = useCallback((token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      setUserEmail(decoded.sub)
      return { userEmail: decoded.sub }
    } catch (error) {
      console.error("Error decoding token:", error)
      return { userEmail: null }
    }
  }, [])

  const fetchWorkspaceData = useCallback(async (userId: string) => {
    try {
      const data = await fetchWorkspaceUsers()
      console.log("fetchWorkspaceUsers", data)
      const workspaceUsersResponse: WorkspaceUsersResponse = data

      if (workspaceUsersResponse.data && Array.isArray(workspaceUsersResponse.data)) {
        const userWorkspaces = workspaceUsersResponse.data.filter((wu) => wu.userId === userId)
        const workspaceDetailsResponse: WorkspaceDetailsResponse[] = await Promise.all(
          userWorkspaces.map(async (workspaceUser) => {
            return await fetchWorkspaceDetails(workspaceUser.workspaceId)
          })
        )

        setWorkspaces(workspaceDetailsResponse)
        localStorage.setItem("workspaces", JSON.stringify(workspaceDetailsResponse))
        console.log("Workspaces:", workspaceDetailsResponse)
      } else {
        console.error("Unexpected workspaceUsers response structure:", workspaceUsersResponse)
        setWorkspaces([])
        localStorage.removeItem("workspaces")
      }
    } catch (error) {
      console.error("Error fetching workspace data:", error)
      setWorkspaces([])
      localStorage.removeItem("workspaces")
    }
  }, [])

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post("/auth/login", credentials)
      if (response.data && response.data.data && response.data.data.accessToken) {
        console.log("Login response:", response.data)
        return {
          token: response.data.data.accessToken,
          userData: response.data.data as UserData
        }
      }
      throw new Error("Unexpected response structure")
    },
    onSuccess: async (data) => {
      const { token: newToken, userData } = data
      setToken(newToken)
      setIsAuthenticated(true)
      localStorage.setItem("token", newToken)

      const decodedToken = decodeToken(newToken)
      setUserId(userData.id)
      setUserEmail(userData.email)
      setFirstName(userData.firstName)

      console.log("Login successful, token set")
      console.log("UserId:", userData.id)
      console.log("UserEmail:", userData.email)
      console.log("FirstName:", userData.firstName)

      await fetchWorkspaceData(userData.id)
    },
    onError: (error) => {
      console.error("Login error:", error)
      setIsAuthenticated(false)
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
      setUserEmail(null)
      setFirstName(null)
      setWorkspaces([])
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
        userEmail,
        firstName,
        login,
        logout,
        workspaces
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
