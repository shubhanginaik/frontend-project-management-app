import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/api"

export interface Project {
  id: string
  name: string
  description: string
  createdDate: string
  startDate: string
  endDate: string
  createdByUserId: string
  workspaceId: string
  status: boolean
}
export interface NewProject {
  name: string
  description: string
  createdDate: string
  startDate: string
  endDate: string
  createdByUserId: string
  workspaceId: string
  status: boolean
}
export interface ProjectResponse {
  data: Project[]
  status: string
  code: number
  errors: null | unknown
}

export interface ProjectAddRepsonse {
  data: Project
  status: string
  code: number
  errors: null | unknown
}

const fetchProjects = async (): Promise<ProjectResponse> => {
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

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    retry: (failureCount, error) => {
      if (error.message.includes("403")) return false
      return failureCount < 3
    }
  })
}

//add new project
// API function to add a new project
const addProject = async (project: Omit<Project, "id">): Promise<ProjectAddRepsonse> => {
  try {
    const response = await api.post<ProjectAddRepsonse>("/projects", project)
    return response.data
  } catch (error) {
    console.error("Error adding project:", error)
    throw error
  }
}

// Custom hook for adding a new project
export const useAddProject = () => {
  const queryClient = useQueryClient()
  return useMutation<ProjectAddRepsonse, Error, Omit<Project, "id">>({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
    onError: (error) => {
      console.error("Error adding project:", error)
    }
  })
}
