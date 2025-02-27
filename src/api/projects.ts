import { Project } from "@/hooks/projectHook"
import api from "."

export interface UpdateProjectResponse {
  data: Project
  status: string
  code: number
  errors: []
}
export interface ProjectAddRepsonse {
  data: Project
  status: string
  code: number
  errors: null | unknown
}
export interface ProjectResponse {
  data: Project[]
  status: string
  code: number
  errors: null | unknown
}

export const fetchProjects = async (): Promise<ProjectResponse> => {
  try {
    const response = await api.get<ProjectResponse>(`/projects`)
    return response.data
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 403) {
      throw new Error(
        "You don't have permission to access these projects. Check your authentication."
      )
    }
    throw error
  }
}

//add new project
// API function to add a new project
export const addProject = async (project: Omit<Project, "id">): Promise<ProjectAddRepsonse> => {
  try {
    const response = await api.post<ProjectAddRepsonse>("/projects", project)
    return response.data
  } catch (error) {
    console.error("Error adding project:", error)
    throw error
  }
}

export const updateProject = async (
  projectId: string,
  updateData: Partial<Project>
): Promise<UpdateProjectResponse> => {
  const response = await api.put<UpdateProjectResponse>(`/projects/${projectId}`, updateData)
  return response.data
}

export const deleteProject = async (projectId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}`)
}
