import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api"

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
} // 👈 This function is used to create a new workspace, add error handling here

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
