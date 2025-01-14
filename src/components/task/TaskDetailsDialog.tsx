import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Task } from "@/hooks/taskHook"

interface TaskDetailsDialogProps {
  task: Task | null
  onClose: () => void
  onUpdate: (taskId: string, updatedTask: Partial<Task>) => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function TaskDetailsDialog({
  task,
  onClose,
  onUpdate,
  onFileUpload
}: TaskDetailsDialogProps) {
  if (!task) return null

  return (
    <Dialog open={!!task} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={task.name}
              className="col-span-3"
              onChange={(e) => onUpdate(task.id, { name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={task.description}
              className="col-span-3"
              onChange={(e) => onUpdate(task.id, { description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={task.dueDate.split("T")[0]}
              className="col-span-3"
              onChange={(e) => onUpdate(task.id, { dueDate: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              value={task.priority}
              onValueChange={(value) => onUpdate(task.id, { priority: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attachment" className="text-right">
              Attachment
            </Label>
            <div className="col-span-3">
              <Input id="attachment" type="file" accept=".pdf,.png" onChange={onFileUpload} />
              {task.attachment.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-500 hover:underline"
                >
                  Attachment {index + 1}
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
