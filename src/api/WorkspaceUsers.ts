import api from "@/api"
import { fetchRoleDetails } from "@/hooks/useRole"
import { useQuery } from "@tanstack/react-query"

export interface WorkspaceUserWithDetails extends WorkspaceUsersByWorkspaceId, Users {
  roleName: string
}

export interface Workspaceuser {
  id: string
  roleId: string
  userId: string
  workspaceId: string
}
export interface WorkspaceUsersResponse {
  data: Workspaceuser[]
  status: string
  code: number
  errors: null | any
}

export interface WorkspaceDetails {
  id: string
  name: string
  description: string
  type: string
  createdDate: string
  createdBy: string
  companyId: string
}
export interface WorkspaceDetailsResponse {
  data: WorkspaceDetails
  status: string
  code: number
  errors: null | any
}

export interface DefaultWorkspaceInfo {
  name: string
  description: string
  taskCount: number
  memberCount: number
}
export async function fetchDefaultWorkspaceInfo(): Promise<DefaultWorkspaceInfo> {
  // Simulating an API call with a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return {
    name: "Personal Workspace",
    description: "Your default personal workspace for managing tasks and projects",
    taskCount: 5,
    memberCount: 1
  }
}

export const fetchWorkspaceUsers = async (): Promise<WorkspaceUsersResponse> => {
  const response = await api.get<WorkspaceUsersResponse>("/workspace-users")
  return response.data
}

export const fetchWorkspaceDetails = async (
  workspaceId: string
): Promise<WorkspaceDetailsResponse> => {
  const response = await api.get<WorkspaceDetailsResponse>(`/workspaces/${workspaceId}`)
  return response.data
}

export interface WorkspaceMemberToShow {
  id: string
  name: string
  email: string
  role: string
}

export interface WorkspaceUsersByWorkspaceId {
  id: string
  roleId: string
  userId: string
  workspaceId: string
}
export interface WorkspaceUsersByWorkspaceIdResponse {
  data: WorkspaceUsersByWorkspaceId[]
  status: string
  code: number
  errors: null | unknown
}

export interface Users {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  Phone: string
  createdDate: string
  profileImage: string
}

export interface UsersResponse {
  data: Users
  status: string
  code: number
  errors: []
}

export interface DefaultWorkspaceInfo {
  name: string
  description: string
  taskCount: number
  memberCount: number
}

export const fetchWorkspaceMembersByWorkspace = async (
  workspaceId: string
): Promise<WorkspaceUsersByWorkspaceIdResponse> => {
  const response = await api.get<WorkspaceUsersByWorkspaceIdResponse>(
    `/workspace-users/${workspaceId}`
  )
  return response.data
}

export const fetchUserDetails = async (userId: string): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>(`/users/${userId}`)
  return response.data
}

export const useWorkspaceMembersByWorkspace = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-users", workspaceId],
    queryFn: async () => {
      const workspaceMembersResponse = await fetchWorkspaceMembersByWorkspace(workspaceId)
      const membersWithDetails: WorkspaceUserWithDetails[] = await Promise.all(
        workspaceMembersResponse.data.map(async (member) => {
          const userDetails = await fetchUserDetails(member.userId)
          const roleDetails = await fetchRoleDetails(member.roleId)
          return {
            ...member,
            ...userDetails.data,
            roleName: roleDetails.data.name
          }
        })
      )
      return membersWithDetails
    }
  })
}
