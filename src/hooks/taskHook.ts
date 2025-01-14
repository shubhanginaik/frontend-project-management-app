import api from "@/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

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

export type Priority = "LOW_PRIORITY" | "MEDIUM_PRIORITY" | "HIGH_PRIORITY"

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

// API function to update task
export const updateTask = async (taskId: string, updatedTask: Partial<Task>): Promise<Task> => {
  const response = await api.patch<Task>(`/tasks/${taskId}`, updatedTask)
  return response.data
}

// API function to add a new task
export const addTask = async (task: Omit<Task, "id">): Promise<Task> => {
  try {
    const response = await api.post<Task>("/tasks", task)
    return response.data
  } catch (error) {
    console.error("Error adding task:", error)
    throw error
  }
}

// API function to upload attachment
export const uploadAttachment = async (taskId: string, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await api.post<{ url: string }>(`/tasks/${taskId}/attachments`, formData)
  return response.data.url
}

// Custom hooks for mutations
export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  return useMutation<Task, Error, { taskId: string; updatedTask: Partial<Task> }>({
    mutationFn: ({ taskId, updatedTask }) => updateTask(taskId, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    }
  })
}

export const useAddTask = () => {
  const queryClient = useQueryClient()
  return useMutation<Task, Error, Omit<Task, "id">>({
    mutationFn: (newTask) => addTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: (error) => {
      console.error("Error adding task:", error)
    }
  })
}

export const useUploadAttachment = () => {
  const queryClient = useQueryClient()
  return useMutation<string, Error, { taskId: string; file: File }>({
    mutationFn: ({ taskId, file }) => uploadAttachment(taskId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    }
  })
}
