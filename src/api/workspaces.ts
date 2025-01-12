import api from "@/api"
import { WorkspaceResponseDTO } from "@/types/workspace"

export const fetchWorkspaces = async (): Promise<WorkspaceResponseDTO[]> => {
  const response = await api.get<WorkspaceResponseDTO[]>("/workspaces")
  return response.data
}

export const fetchWorkspaceById = async (workspaceId: string): Promise<WorkspaceResponseDTO> => {
  const response = await api.get(`/workspaces/${workspaceId}`)
  return response.data
}

export const fetchWorkspaceUsers = async () => {
  const response = await fetch("http://localhost:8080/api/v1/workspace-users")
  const data = await response.json()
  return data.data // Access the data field
}

export const createWorkspace = async (
  workspaceData: Omit<WorkspaceResponseDTO, "id" | "createdAt">
): Promise<WorkspaceResponseDTO> => {
  const response = await api.post<WorkspaceResponseDTO>("/workspaces", workspaceData)
  return response.data
}

export const updateWorkspace = async (
  id: string,
  workspaceData: Partial<WorkspaceResponseDTO>
): Promise<WorkspaceResponseDTO> => {
  const response = await api.put<WorkspaceResponseDTO>(`/workspaces/${id}`, workspaceData)
  return response.data
}

export const deleteWorkspace = async (id: string): Promise<void> => {
  await api.delete(`/workspaces/${id}`)
}
