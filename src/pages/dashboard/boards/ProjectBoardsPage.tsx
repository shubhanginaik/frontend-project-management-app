import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTasks, Task, useUpdateTask, useAddTask, useUploadAttachment } from "@/hooks/taskHook"
import { TaskColumn } from "@/components/task/TaskColumn"
import { TaskDetailsDialog } from "@/components/task/TaskDetailsDialog"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"

interface Column {
  id: string
  title: string
  tasks: Task[]
}

export function ProjectBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [columns, setColumns] = useState<Column[]>([])
  const { userId, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const { data: tasksResponse, isLoading, error } = useTasks(projectId!)

  const updateTaskMutation = useUpdateTask()
  const addTaskMutation = useAddTask()
  const uploadAttachmentMutation = useUploadAttachment()

  useMemo(() => {
    if (!tasksResponse) return

    const columnDefinitions: Column[] = [
      { id: "TODO", title: "To Do", tasks: [] },
      { id: "IN_PROGRESS", title: "In Progress", tasks: [] },
      { id: "DONE", title: "Done", tasks: [] }
    ]

    const updatedColumns = columnDefinitions.map((column) => ({
      ...column,
      tasks: tasksResponse.data.filter((task: Task) => task.taskStatus.toUpperCase() === column.id)
    }))

    setColumns(updatedColumns)
  }, [tasksResponse])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)
    const task = sourceColumn?.tasks.find((t) => t.id === draggableId)

    if (task && sourceColumn && destColumn) {
      const newStatus = destination.droppableId
      updateTaskMutation.mutate(
        {
          taskId: task.id,
          updatedTask: { ...task, taskStatus: newStatus, projectId: projectId! }
        },
        {
          onSuccess: (response) => {
            if (response !== null) {
              const updatedTask = response
              const updatedColumns = columns.map((column) => {
                if (column.id === sourceColumn.id) {
                  return {
                    ...column,
                    tasks: column.tasks.filter((t) => t.id !== task.id)
                  }
                }
                if (column.id === destColumn.id) {
                  const newTasks = Array.from(column.tasks)
                  newTasks.splice(destination.index, 0, updatedTask)
                  return {
                    ...column,
                    tasks: newTasks
                  }
                }
                return column
              })
              setColumns(updatedColumns)
            } else {
              console.error("Failed to update task:")
              toast({
                title: "Error",
                description: "Failed to update task. Please try again.",
                variant: "destructive"
              })
            }
          },
          onError: (error) => {
            console.error("Error updating task:", error)
            toast({
              title: "Error",
              description: error.message || "Failed to update task. Please try again.",
              variant: "destructive"
            })
          }
        }
      )
    }
  }

  const handleAddTask = (columnId: string, taskName: string) => {
    if (!projectId) {
      console.error("Project ID is missing")
      return
    }

    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "You must be logged in to add tasks.",
        variant: "destructive"
      })
      return
    }

    const newTask: Omit<Task, "id"> = {
      name: taskName,
      description: "",
      createdDate: new Date().toISOString(),
      resolvedDate: "",
      dueDate: "",
      attachment: [],
      taskStatus: columnId,
      projectId: projectId,
      createdUserId: userId ?? "",
      assignedUserId: userId ?? "",
      priority: "LOW_PRIORITY"
    }

    addTaskMutation.mutate(newTask, {
      onSuccess: (addedTask) => {
        const updatedColumns = columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              tasks: [...column.tasks, addedTask]
            }
          }
          return column
        })
        setColumns(updatedColumns)
      },
      onError: (error) => {
        console.error("Failed to add task:", error)
        toast({
          title: "Error",
          description: "Failed to add task. Please try again.",
          variant: "destructive"
        })
      }
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedTask && projectId) {
      uploadAttachmentMutation.mutate(
        { taskId: selectedTask.id, file, projectId },
        {
          onSuccess: (attachmentUrl) => {
            updateTaskMutation.mutate({
              taskId: selectedTask.id,
              updatedTask: {
                ...selectedTask,
                attachment: [...(selectedTask?.attachment || []), attachmentUrl],
                projectId
              }
            })
          },
          onError: (error) => {
            console.error("Error uploading attachment:", error)
            toast({
              title: "Error",
              description: "Failed to upload attachment. Please try again.",
              variant: "destructive"
            })
          }
        }
      )
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
            <TaskColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={column.tasks}
              onAddTask={handleAddTask}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskDetailsDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(taskId, updatedTask) =>
          updateTaskMutation.mutate(
            { taskId, updatedTask: { ...updatedTask, projectId: projectId! } as Task },
            {
              onSuccess: (response) => {
                if (response !== null) {
                  setSelectedTask(response)
                  // Update the task in the columns state
                  const updatedColumns = columns.map((column) => ({
                    ...column,
                    tasks: column.tasks.map((task) => (task.id === response.id ? response : task))
                  }))
                  setColumns(updatedColumns)
                } else {
                  console.error("Failed to update task:")
                  toast({
                    title: "Error",
                    description: "Failed to update task. Please try again.",
                    variant: "destructive"
                  })
                }
              },
              onError: (error) => {
                console.error("Error updating task:", error)
                toast({
                  title: "Error",
                  description: error.message || "Failed to update task. Please try again.",
                  variant: "destructive"
                })
              }
            }
          )
        }
        onFileUpload={handleFileUpload}
      />
    </div>
  )
}
