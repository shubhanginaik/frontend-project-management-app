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
  errors: null | any
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
