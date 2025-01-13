"use client"

import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTasks, Task } from "@/hooks/taskHook"
import api from "@/api"

interface Column {
  id: string
  title: string
  tasks: Task[]
}

// API function to update task status
const updateTaskStatus = async (taskId: string, newStatus: string): Promise<Task> => {
  const response = await api.patch<Task>(`/tasks/${taskId}`, { taskStatus: newStatus })
  return response.data
}

// API function to add a new task
const addTask = async (projectId: string, name: string, status: string): Promise<Task> => {
  const response = await api.post<Task>("/tasks", { projectId, name, taskStatus: status })
  return response.data
}

export function ProjectBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const queryClient = useQueryClient()
  const [newTaskName, setNewTaskName] = React.useState<string>("")

  const { data: tasksResponse, isLoading, error } = useTasks()

  const columns = useMemo(() => {
    if (!tasksResponse) return []

    const projectTasks = tasksResponse.data.filter((task: Task) => task.projectId === projectId)

    const columnDefinitions: Column[] = [
      { id: "todo", title: "To Do", tasks: [] },
      { id: "in-progress", title: "In Progress", tasks: [] },
      { id: "done", title: "Done", tasks: [] }
    ]

    return columnDefinitions.map((column) => ({
      ...column,
      tasks: projectTasks.filter((task: Task) => task.taskStatus.toLowerCase() === column.id)
    }))
  }, [tasksResponse, projectId])

  const updateTaskStatusMutation = useMutation<Task, Error, { taskId: string; newStatus: string }>({
    mutationFn: ({ taskId, newStatus }) => updateTaskStatus(taskId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    }
  })

  const addTaskMutation = useMutation<Task, Error, { name: string; status: string }>({
    mutationFn: ({ name, status }) => addTask(projectId!, name, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      setNewTaskName("")
    }
  })

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const task = columns
      .find((col) => col.id === source.droppableId)
      ?.tasks.find((t) => t.id === draggableId)

    if (task) {
      updateTaskStatusMutation.mutate({
        taskId: task.id,
        newStatus: destination.droppableId
      })
    }
  }

  const handleAddTask = (columnId: string) => {
    if (newTaskName.trim()) {
      addTaskMutation.mutate({ name: newTaskName, status: columnId })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span>Loading project board...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Project Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="w-80 flex-shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle>{column.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px]"
                      >
                        {column.tasks.map((task: Task, index: number) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-secondary p-2 mb-2 rounded"
                              >
                                {task.name}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <div className="mt-2 space-y-2">
                    <Input
                      placeholder="Add a task..."
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddTask(column.id)
                        }
                      }}
                    />
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => handleAddTask(column.id)}
                      disabled={addTaskMutation.isPending}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
