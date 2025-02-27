import api from "."

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
  errors: null | unknown
}

export interface UpdatedTaskResponse {
  data: Task
  status: string
  code: number
  errors: null | unknown
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

export const updateTask = async (taskId: string, updatedTask: Partial<Task>): Promise<Task> => {
  try {
    const response = await api.put<UpdatedTaskResponse>(`/tasks/${taskId}`, updatedTask)
    return response.data.data
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
