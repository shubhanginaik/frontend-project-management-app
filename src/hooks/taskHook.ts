import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { addTask, fetchTasks, Task, updateTask, uploadAttachment } from "@/api/tasks"

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
