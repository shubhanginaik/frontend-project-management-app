import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import api from "@/api"
import {
  fetchWorkspaceUsers,
  fetchWorkspaceDetails,
  WorkspaceDetailsResponse
} from "@/api/WorkspaceUsers"
import { updateUserProfile as updateUserProfileApi } from "@/api/memberProfile"
interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
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
  lastName: string | null
  phone: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchWorkspaceData: (userId: string) => Promise<void>
  workspaces: WorkspaceDetailsResponse[]
  updateWorkspaceDetails: (
    workspaceId: string,
    workspaceDetails: { name: string; description: string; type: string }
  ) => Promise<void>
  updateUserProfile: (profileDetails: {
    userId: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string | null>(null)
  const [lastName, setLastName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<WorkspaceDetailsResponse[]>([])

  const queryClient = useQueryClient()

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
        queryClient.invalidateQueries({ queryKey: ["workspaces"] })
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
    mutationFn: async (workspaceDetails: {
      workspaceId: string
      name: string
      description: string
    }) => {
      return api.put(`/workspaces/${workspaceDetails.workspaceId}`, workspaceDetails)
    },
    onSuccess: (_, workspaceDetails) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-details", workspaceDetails.workspaceId]
      })
    },
    onError: (error) => {
      console.error("Error updating workspace details:", error)
    }
  })

  const updateWorkspaceDetails = async (
    workspaceId: string,
    workspaceDetails: { name: string; description: string; type: string }
  ) => {
    try {
      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws.data.id === workspaceId ? { ...ws, data: { ...ws.data, ...workspaceDetails } } : ws
        )
      )
      await updateWorkspaceDetailsMutation.mutateAsync({ workspaceId, ...workspaceDetails })
      await fetchWorkspaceData(userId!)
    } catch (error) {
      console.error("Error updating workspace details:", error)
    }
  }

  const updateUserProfile = async (profileDetails: {
    userId: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }) => {
    try {
      const response = await updateUserProfileApi(profileDetails)
      const updatedUser = response
      setFirstName(updatedUser.firstName)
      setLastName(updatedUser.lastName)
      setUserEmail(updatedUser.email)
      setPhone(updatedUser.phone)
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
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
      setLastName(userData.lastName)
      setPhone(userData.phone)

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
      setLastName(null)
      setPhone(null)
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

  useEffect(() => {
    if (userId) {
      fetchWorkspaceData(userId)
    }
  }, [userId, fetchWorkspaceData])

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated,
        userId,
        userEmail,
        firstName,
        lastName,
        phone,
        login,
        logout,
        fetchWorkspaceData,
        workspaces,
        updateWorkspaceDetails,
        updateUserProfile
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
