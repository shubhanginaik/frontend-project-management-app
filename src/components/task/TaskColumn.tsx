import React from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { Task } from "@/hooks/taskHook"
import { TaskCard } from "./TaskCard"

interface TaskColumnProps {
  id: string
  title: string
  tasks: Task[]
  onAddTask: (columnId: string, taskName: string) => void
  onTaskClick: (task: Task) => void
}

export function TaskColumn({ id, title, tasks, onAddTask, onTaskClick }: TaskColumnProps) {
  const [newTaskName, setNewTaskName] = React.useState("")

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      onAddTask(id, newTaskName)
      setNewTaskName("")
    }
  }

  return (
    <div className="w-80 flex-shrink-0">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Droppable droppableId={id}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px]">
                {tasks.map((task: Task, index: number) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <TaskCard task={task} provided={provided} onClick={() => onTaskClick(task)} />
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
                  handleAddTask()
                }
              }}
            />
            <Button className="w-full" size="sm" onClick={handleAddTask}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
