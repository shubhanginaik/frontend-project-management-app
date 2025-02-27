import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/api"
import {
  addProject,
  fetchProjects,
  ProjectAddRepsonse,
  deleteProject,
  updateProject,
  UpdateProjectResponse
} from "@/api/projects"

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

export const convertDateFormat = (dateString: string) => {
  if (!dateString) return ""
  const [year, month, day] = dateString.split("-").map(Number)
  if (!year || !month || !day) {
    return ""
  }
  const date = new Date(year, month - 1, day)
  // Set a specific time if needed, here we set it to 20:22:53.802
  date.setHours(20, 22, 53, 802)
  return date.toISOString()
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

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation<UpdateProjectResponse, Error, { id: string; updateData: Partial<Project> }>({
    mutationFn: ({ id, updateData }) => updateProject(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    }
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    }
  })
}
