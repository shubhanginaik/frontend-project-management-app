import React from "react"
import { Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Paperclip } from "lucide-react"
import { Task } from "@/hooks/taskHook"

interface TaskCardProps {
  task: Task
  index: number
  onClick: () => void
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Card className="mb-2 cursor-pointer" onClick={onClick}>
            <CardContent className="p-2">
              <div className="font-bold">{task.name}</div>
              <div className="text-sm text-gray-500">
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
              </div>
              <div className="text-sm text-gray-500">Priority: {task.priority}</div>
              {task.attachment?.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <Paperclip className="w-4 h-4 mr-1" />
                  {task.attachment.length}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}
