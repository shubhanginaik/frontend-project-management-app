import React from "react"
import { DraggableProvided } from "@hello-pangea/dnd"
import { Paperclip } from "lucide-react"
import { Task } from "@/hooks/taskHook"

interface TaskCardProps {
  task: Task
  provided: DraggableProvided
  onClick: () => void
}

export function TaskCard({ task, provided, onClick }: TaskCardProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="bg-secondary p-2 mb-2 rounded"
      onClick={onClick}
    >
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
    </div>
  )
}
