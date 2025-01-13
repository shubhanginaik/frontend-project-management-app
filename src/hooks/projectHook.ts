import { useQuery } from "@tanstack/react-query"
import api from "@/api"

interface Project {
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

interface ProjectResponse {
  data: Project[]
  status: string
  code: number
  errors: null | any
}

const fetchProjects = async (): Promise<ProjectResponse> => {
  try {
    const response = await api.get<ProjectResponse>(`/projects`)
    return response.data
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 403) {
      throw new Error(
        "You don't have permission to access these projects. Please check your authentication."
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
