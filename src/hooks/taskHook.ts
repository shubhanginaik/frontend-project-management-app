import api from "@/api"
import { useQuery } from "@tanstack/react-query"

export interface Task {
  id: string
  name: string
  description: string
  createdDate: string
  resolvedDate: string
  dueDate: string
  attachment: string[]
  taskStatus: string
  projectId: string
  createdUserId: string
  assignedUserId: string
  priority: string
}

export interface TaskResponse {
  data: Task[]
  status: string
  code: number
  errors: null | any
}

export const fetchTasks = async (): Promise<TaskResponse> => {
  try {
    const response = await api.get<TaskResponse>(`/tasks`)
    return response.data
  } catch (error) {
    if ((error as any).response && (error as any).response.status === 403) {
      throw new Error(
        "You don't have permission to access these tasks. Please check your authentication."
      )
    }
    throw error
  }
}

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    retry: (failureCount, error) => {
      if (error.message.includes("403")) return false
      return failureCount < 3
    }
  })
}
