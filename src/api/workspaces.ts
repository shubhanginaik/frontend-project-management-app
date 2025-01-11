import api from "@/api"
import { Workspace } from "@/types/workspace"

export const fetchWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get<Workspace[]>("/workspaces")
  return response.data
}

export const fetchWorkspaceById = async (id: string): Promise<Workspace> => {
  const response = await api.get<Workspace>(`/workspaces/${id}`)
  return response.data
}

export const createWorkspace = async (
  workspaceData: Omit<Workspace, "id" | "createdAt">
): Promise<Workspace> => {
  const response = await api.post<Workspace>("/workspaces", workspaceData)
  return response.data
}

export const updateWorkspace = async (
  id: string,
  workspaceData: Partial<Workspace>
): Promise<Workspace> => {
  const response = await api.put<Workspace>(`/workspaces/${id}`, workspaceData)
  return response.data
}

export const deleteWorkspace = async (id: string): Promise<void> => {
  await api.delete(`/workspaces/${id}`)
}
