import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api"
import { useQuery } from "@tanstack/react-query"
import {
  getWorkspaceUserByWorkspaceIdAndUserId,
  WorkspaceUsersByWorkspaceIdUserIdResponse
} from "@/api/WorkspaceUsers"

// ... (keep existing code)

export interface Workspace {
  id: string
  name: string
  description: string
  type: string
  createdDate: string
  createdBy: string
  companyId: string
}

export interface WorkspaceResponse {
  data: Workspace
  status: string
  code: number
  errors: []
}

interface CreateWorkspaceSchema {
  name: string
  description: string
  type: "PRIVATE" | "SHARED" | "PUBLIC"
  createdBy: string
  companyId: string
}

const createWorkspace = async (
  workspaceData: CreateWorkspaceSchema
): Promise<WorkspaceResponse> => {
  const response = await api.post<WorkspaceResponse>("/workspaces", workspaceData)
  return response.data
}

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    }
  })
}

export interface WorkspaceUpdateScema {
  name?: string
  description?: string
  type?: "PRIVATE" | "PUBLIC" | "SHARED"
  companyId?: string
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      workspaceId,
      updateData
    }: {
      workspaceId: string
      updateData: WorkspaceUpdateScema
    }) => {
      const response = await api.put(`/workspaces/${workspaceId}`, updateData)
      return response.data
    },
    onSuccess: (data, variables) => {
      console.log("Workspace updated successfully", data)
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      queryClient.invalidateQueries({ queryKey: ["workspace", variables.workspaceId] })
    }
  })
}

export const useGetWorkspaceUser = (userId: string, workspaceId: string) => {
  return useQuery<WorkspaceUsersByWorkspaceIdUserIdResponse, Error>({
    queryKey: ["workspaceUser", workspaceId, userId],
    queryFn: () => getWorkspaceUserByWorkspaceIdAndUserId(workspaceId, userId)
  })
}
