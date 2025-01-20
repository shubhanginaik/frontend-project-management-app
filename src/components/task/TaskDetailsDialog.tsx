import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
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
import { useUpdateTask } from "@/hooks/taskHook"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useAddComment, useComments } from "@/hooks/useComment"
import { Comment } from "@/api/comments"
import { useAuth } from "@/context/AuthContext"

interface TaskDetailsDialogProps {
  task: Task | null
  membersData: { userId: string; firstName: string; lastName: string }[]
  onClose: () => void
  onUpdate: (taskId: string, updatedTask: Partial<Task>) => void
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  showFileUpload?: boolean // Add this flag to control file upload visibility
}

export function TaskDetailsDialog({
  task,
  membersData,
  onClose,
  onUpdate,
  onFileUpload,
  showFileUpload = false // Default to false if not provided
}: TaskDetailsDialogProps) {
  const { toast } = useToast()
  const updateTaskMutation = useUpdateTask()
  const addCommentMutation = useAddComment()
  const { data: comments = [], refetch } = useComments(task?.id || "")
  const [assignedUserId, setAssignedUserId] = useState<string | null>(task?.assignedUserId || null)
  const [taskDetails, setTaskDetails] = useState<Partial<Task>>({})
  const [newComment, setNewComment] = useState<string>("")
  const { userId } = useAuth()

  useEffect(() => {
    if (task) {
      setAssignedUserId(task.assignedUserId)
      setTaskDetails(task)
      refetch()
    }
  }, [task, refetch])

  const handleInputChange = (field: keyof Task, value: any) => {
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value
    }))
  }

  const handleAssignUser = (userId: string) => {
    setAssignedUserId(userId)
    handleInputChange("assignedUserId", userId)
  }

  const handleSaveChanges = () => {
    if (task) {
      const updatedTaskDetails = { ...taskDetails }
      if (updatedTaskDetails.dueDate) {
        updatedTaskDetails.dueDate = new Date(updatedTaskDetails.dueDate).toISOString()
      }
      updateTaskMutation.mutate(
        {
          taskId: task.id,
          updatedTask: updatedTaskDetails
        },
        {
          onSuccess: (updatedTask) => {
            setAssignedUserId(updatedTask.assignedUserId)
            toast({
              title: "Success",
              description: "Task updated successfully.",
              variant: "success"
            })
            onUpdate(task.id, updatedTask)
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

  const handleAddComment = () => {
    if (task && newComment.trim()) {
      const comment: Omit<Comment, "id"> = {
        taskId: task.id,
        content: newComment,
        createdBy: userId || "" // Replace with actual user ID
      }
      addCommentMutation.mutate(comment, {
        onSuccess: () => {
          setNewComment("")
          refetch() // Fetch all comments again after adding a new comment
        },
        onError: (error) => {
          console.error("Error adding comment:", error)
          toast({
            title: "Error",
            description: error.message || "Failed to add comment. Please try again.",
            variant: "destructive"
          })
        }
      })
    }
  }

  const getUserName = (userId: string) => {
    const user = membersData.find((member) => member.userId === userId)
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User"
  }

  if (!task) return null

  return (
    <Dialog open={!!task} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[800px] bg-[#f3e8ff]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>Details about the selected task.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={taskDetails.name || ""}
              className="col-span-3"
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={taskDetails.description || ""}
              className="col-span-3"
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={taskDetails.dueDate ? taskDetails.dueDate.split("T")[0] : ""}
              className="col-span-3"
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              value={taskDetails.priority || "MEDIUM_PRIORITY"}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger className="col-span-3 bg-[#f3e8ff]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#f3e8ff]">
                <SelectItem value="LOW_PRIORITY">Low</SelectItem>
                <SelectItem value="MEDIUM_PRIORITY">Medium</SelectItem>
                <SelectItem value="HIGH_PRIORITY">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showFileUpload && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attachment" className="text-right">
                Attachment
              </Label>
              <div className="col-span-3">
                <Input id="attachment" type="file" accept=".pdf,.png" onChange={onFileUpload} />
                {task.attachment && task.attachment.length > 0 ? (
                  task.attachment.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-blue-500 hover:underline"
                      download
                    >
                      Attachment {index + 1}
                    </a>
                  ))
                ) : (
                  <p>No attachments available</p>
                )}
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedUser" className="text-right">
              Assign User
            </Label>
            <Select value={assignedUserId || ""} onValueChange={(value) => handleAssignUser(value)}>
              <SelectTrigger className="col-span-3 bg-[#f3e8ff]">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent className="bg-[#f3e8ff]">
                {membersData && membersData.length > 0 ? (
                  membersData.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-members" disabled>
                    No members available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </DialogFooter>
          <div className="mt-6">
            <Label htmlFor="comments" className="text-lg font-semibold">
              Comments
            </Label>
            <div className="mt-2">
              <Textarea
                id="newComment"
                value={newComment}
                placeholder="Add a comment"
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleAddComment} className="mt-2">
                Add Comment
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      {getUserName(comment.createdBy).charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {getUserName(comment.createdBy)}
                    </div>
                    <div className="mt-1 text-sm text-gray-700">{comment.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
