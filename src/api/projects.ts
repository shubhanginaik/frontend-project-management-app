import { Project } from "@/hooks/projectHook"
import api from "."

interface UpdateProjectResponse {
  data: Project
  status: string
  code: number
  errors: []
}

export const updateProject = async (
  projectId: string,
  updateData: Partial<Project>
): Promise<UpdateProjectResponse> => {
  const response = await api.put<UpdateProjectResponse>(`/projects/${projectId}`, updateData)
  return response.data
}

export const deleteProject = async (projectId: string) => {
  const response = await api.delete(`/projects/${projectId}`)
  return response.data
}
