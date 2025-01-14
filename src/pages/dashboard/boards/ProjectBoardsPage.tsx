import React, { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTasks, Task, useUpdateTask, useAddTask, useUploadAttachment } from "@/hooks/taskHook"
import { useQueryClient } from "@tanstack/react-query"
import { TaskColumn } from "@/components/task/TaskColumn"
import { TaskDetailsDialog } from "@/components/task/TaskDetailsDialog"
import { useAuth } from "@/context/AuthContext"

interface Column {
  id: string
  title: string
  tasks: Task[]
}

export function ProjectBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const queryClient = useQueryClient()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [columns, setColumns] = useState<Column[]>([]) // Added local state for columns
  const { userId } = useAuth()
  const { data: tasksResponse, isLoading, error } = useTasks()

  const memoizedColumns = useMemo(() => {
    // Updated useMemo to set local state
    const columnDefinitions: Column[] = [
      { id: "todo", title: "To Do", tasks: [] },
      { id: "in-progress", title: "In Progress", tasks: [] },
      { id: "done", title: "Done", tasks: [] }
    ]

    if (!tasksResponse) return columnDefinitions

    const projectTasks = tasksResponse.data.filter((task: Task) => task.projectId === projectId)

    const updatedColumns = columnDefinitions.map((column) => ({
      ...column,
      tasks: projectTasks.filter((task: Task) => task.taskStatus.toLowerCase() === column.id)
    }))

    setColumns(updatedColumns)
    return updatedColumns
  }, [tasksResponse, projectId])

  const updateTaskMutation = useUpdateTask()
  const addTaskMutation = useAddTask()
  const uploadAttachmentMutation = useUploadAttachment()

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
      updateTaskMutation.mutate({
        taskId: task.id,
        updatedTask: { taskStatus: destination.droppableId }
      })
    }
  }

  const handleAddTask = (columnId: string, taskName: string) => {
    if (!projectId) {
      console.error("Project ID is missing")
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
      createdUserId: userId ?? "", // TODO: Add current user ID
      assignedUserId: userId ?? "", // TODO: Add current user ID
      priority: "LOW_PRIORITY"
    }

    addTaskMutation.mutate(newTask, {
      onSuccess: (addedTask) => {
        // Manually update the local state to immediately show the new task
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
        // Optionally, show an error message to the user
      }
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedTask) {
      uploadAttachmentMutation.mutate(
        { taskId: selectedTask.id, file },
        {
          onSuccess: (attachmentUrl) => {
            updateTaskMutation.mutate({
              taskId: selectedTask.id,
              updatedTask: {
                attachment: [...(selectedTask?.attachment || []), attachmentUrl]
              }
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
          {columns.map(
            (
              column // Updated to use local columns state
            ) => (
              <TaskColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                onAddTask={handleAddTask}
                onTaskClick={setSelectedTask}
              />
            )
          )}
        </div>
      </DragDropContext>

      <TaskDetailsDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(taskId, updatedTask) => updateTaskMutation.mutate({ taskId, updatedTask })}
        onFileUpload={handleFileUpload}
      />
    </div>
  )
}
