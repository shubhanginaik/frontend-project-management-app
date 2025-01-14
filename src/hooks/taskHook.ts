import api from "@/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"

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

export interface UpdatedTaskResponse {
  data: Task
  status: string
  code: number
  errors: null | any
}

export const fetchTasks = async (projectId: string): Promise<TaskResponse> => {
  try {
    const response = await api.get<TaskResponse>(`/tasks?projectId=${projectId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => fetchTasks(projectId),
    retry: (failureCount, error) => {
      if ((error as Error).message.includes("403")) return false
      return failureCount < 3
    }
  })
}

export const updateTask = async (taskId: string, updatedTask: Partial<Task>): Promise<Task> => {
  try {
    const response = await api.put<UpdatedTaskResponse>(`/tasks/${taskId}`, updatedTask)
    return response.data.data // Extract the Task object from the response
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export const addTask = async (task: Omit<Task, "id">): Promise<Task> => {
  try {
    const response = await api.post<Task>("/tasks", task)
    return response.data
  } catch (error) {
    console.error("Error adding task:", error)
    throw error
  }
}

export const uploadAttachment = async (taskId: string, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await api.post<{ url: string }>(`/tasks/${taskId}/attachments`, formData)
  return response.data.url
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  return useMutation<Task, Error, { taskId: string; updatedTask: Partial<Task> }>({
    mutationFn: ({ taskId, updatedTask }) => {
      if (!isAuthenticated) {
        throw new Error("You must be logged in to update tasks.")
      }
      return updateTask(taskId, updatedTask)
    },
    onSuccess: (updatedTask, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", updatedTask.projectId] })
      return updatedTask
    },
    onError: (error) => {
      console.error("Error updating task:", error)
      // You can add additional error handling here, such as showing a toast notification
    }
  })
}

export const useAddTask = () => {
  const queryClient = useQueryClient()
  return useMutation<Task, Error, Omit<Task, "id">>({
    mutationFn: addTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", newTask.projectId] })
    },
    onError: (error) => {
      console.error("Error adding task:", error)
    }
  })
}

export const useUploadAttachment = () => {
  const queryClient = useQueryClient()
  return useMutation<string, Error, { taskId: string; file: File; projectId: string }>({
    mutationFn: ({ taskId, file }) => uploadAttachment(taskId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] })
    }
  })
}
