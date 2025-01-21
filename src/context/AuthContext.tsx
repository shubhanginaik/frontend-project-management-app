import React, { createContext, useContext, useState, useCallback } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import jwtDecode from "jwt-decode"
import api from "@/api"
import {
  fetchWorkspaceUsers,
  fetchWorkspaceDetails,
  WorkspaceDetailsResponse
} from "@/api/WorkspaceUsers"

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
  errors: null | unknown
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
  updateWorkspaceDetails: (
    workspaceId: string,
    updatedDetails: { name: string; description: string; type: string }
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"))
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
      const workspaceUsersResponse: WorkspaceUsersResponse = data

      if (workspaceUsersResponse.data && Array.isArray(workspaceUsersResponse.data)) {
        const userWorkspaces = workspaceUsersResponse.data.filter((wu) => wu.userId === userId)
        const workspaceDetailsResponse: WorkspaceDetailsResponse[] = await Promise.all(
          userWorkspaces.map(async (workspaceUser) => {
            return await fetchWorkspaceDetails(workspaceUser.workspaceId)
          })
        )

        setWorkspaces(workspaceDetailsResponse)
        sessionStorage.setItem("workspaces", JSON.stringify(workspaceDetailsResponse))
      } else {
        setWorkspaces([])
        sessionStorage.removeItem("workspaces")
      }
    } catch (error) {
      setWorkspaces([])
      sessionStorage.removeItem("workspaces")
    }
  }, [])

  const updateWorkspaceDetailsMutation = useMutation({
    mutationFn: async (updatedDetails: {
      workspaceId: string
      name: string
      description: string
    }) => {
      return api.put(`/workspaces/${updatedDetails.workspaceId}`, updatedDetails)
    },
    onSuccess: (_, updatedDetails) => {
      queryClient.invalidateQueries({ queryKey: ["workspace-details", updatedDetails.workspaceId] })
    },
    onError: (error) => {
      console.error("Error updating workspace details:", error)
    }
  })

  const updateWorkspaceDetails = async (
    workspaceId: string,
    updatedDetails: { name: string; description: string; type: string }
  ) => {
    try {
      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws.data.id === workspaceId ? { ...ws, data: { ...ws.data, ...updatedDetails } } : ws
        )
      )
      await updateWorkspaceDetailsMutation.mutateAsync({ workspaceId, ...updatedDetails })
      await fetchWorkspaceData(userId!)
    } catch (error) {
      console.error("Error updating workspace details:", error)
    }
  }

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post("/auth/login", credentials)
      if (response.data && response.data.data && response.data.data.accessToken) {
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
      sessionStorage.setItem("token", newToken)
      setUserId(userData.id)
      setUserEmail(userData.email)
      setFirstName(userData.firstName)

      await fetchWorkspaceData(userData.id)
    },
    onError: (error) => {
      setIsAuthenticated(false)
      throw error
    }
  })

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password })
  }

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return Promise.resolve()
    },
    onSuccess: () => {
      setToken(null)
      setIsAuthenticated(false)
      setUserId(null)
      setUserEmail(null)
      setFirstName(null)
      setWorkspaces([])
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("workspaces")
      sessionStorage.removeItem("currentWorkspaceId")
      sessionStorage.removeItem("currentWorkspaceIdDd")
      sessionStorage.removeItem("membersVisible")
      queryClient.clear()
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
        workspaces,
        updateWorkspaceDetails
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
