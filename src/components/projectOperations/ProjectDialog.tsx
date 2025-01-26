import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateProject, type Project, convertDateFormat } from "@/hooks/projectHook"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface ProjectDialogProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  onProjectUpdated: () => void
  type: "update" | "delete"
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({
  project,
  isOpen,
  onClose,
  onProjectUpdated,
  type
}) => {
  const [editedProject, setEditedProject] = useState<Partial<Project>>({
    name: project.name || "",
    description: project.description || "",
    startDate: project.startDate || "",
    endDate: project.endDate || "",
    status: project.status || false
  })

  const updateProjectMutation = useUpdateProject()
  const { toast } = useToast()
  const initialFocusRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setEditedProject({
        name: project.name || "",
        description: project.description || "",
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        status: project.status || false
      })
      setTimeout(() => initialFocusRef.current?.focus(), 0)
    }
  }, [isOpen, project])

  const handleUpdate = async () => {
    try {
      const updatedProjectData: Partial<Project> = {
        ...editedProject,
        startDate: convertDateFormat(editedProject.startDate || ""),
        endDate: convertDateFormat(editedProject.endDate || "")
      }

      await updateProjectMutation.mutateAsync({ id: project.id, updateData: updatedProjectData })
      toast({ title: "Success", description: "Project updated successfully" })
      onProjectUpdated()
      onClose()
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    try {
      const updatedProjectData: Partial<Project> = {
        ...project,
        status: false // Mark the project as inactive
      }

      await updateProjectMutation.mutateAsync({ id: project.id, updateData: updatedProjectData })
      toast({ title: "Success", description: "Project marked as inactive successfully" })
      onProjectUpdated()
      onClose()
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#f3e8ff] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{type === "update" ? "Update Project" : "Delete Project"}</DialogTitle>
          <DialogDescription>Project operations</DialogDescription>
        </DialogHeader>
        {type === "update" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUpdate()
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={editedProject.name || ""} disabled ref={initialFocusRef} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedProject.description || ""}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editedProject.startDate ? editedProject.startDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editedProject.endDate ? editedProject.endDate.split("T")[0] : ""}
                  onChange={(e) => setEditedProject({ ...editedProject, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedProject.status ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setEditedProject({ ...editedProject, status: value === "active" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="ghost" type="submit" className="mt-4">
              Update Project
            </Button>
          </form>
        ) : (
          <div>
            <p>Are you sure you want to delete this project?</p>
            <Button variant="ghost" onClick={handleDelete} className="mt-4">
              Delete Project
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
