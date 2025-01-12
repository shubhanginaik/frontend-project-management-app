import api from "@/api"

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
