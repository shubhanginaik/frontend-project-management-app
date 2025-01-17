import React, { useEffect, useState, useRef } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { WorkspaceDetails, WorkspaceUserWithDetails } from "@/api/WorkspaceUsers"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Pen, Plus } from "lucide-react"
import { Project, useProjects, useAddProject, NewProject } from "@/hooks/projectHook"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useUpdateWorkspace, Workspace, WorkspaceUpdateScema } from "@/hooks/useWorkspaces"
import { fetchUserDetails, useWorkspaceMembersByWorkspace } from "@/api/WorkspaceUsers"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import "./workspaceDetailsPage.css"
import { fetchRoleDetails } from "@/hooks/useRole"

export function WorkspaceDetailsPage() {
  const { workspaceId: urlWorkspaceId } = useParams<{ workspaceId: string }>()
  const { workspaces, userId } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { workspace: initialWorkspace } = location.state || {}
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | undefined>(
    urlWorkspaceId || undefined
  )
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<WorkspaceUpdateScema>({})
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState<NewProject>({
    name: "",
    description: "",
    createdDate: "",
    startDate: "",
    endDate: "",
    createdByUserId: userId || "",
    workspaceId: currentWorkspaceId || initialWorkspace?.id || "",
    status: true
  })
  const { data: projectsResponse, isLoading, error, refetch } = useProjects()
  const updateWorkspaceMutation = useUpdateWorkspace()
  const addProjectMutation = useAddProject()

  const workspaceIdDd = currentWorkspaceId || sessionStorage.getItem("currentWorkspaceId")
  interface Props {
    workspace: Workspace
  }
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers
  } = useWorkspaceMembersByWorkspace(workspaceIdDd!)

  const [detailedMembers, setDetailedMembers] = useState<WorkspaceUserWithDetails[]>([])
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)

  const membersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentWorkspaceId) {
      sessionStorage.setItem("currentWorkspaceId", currentWorkspaceId)
    } else if (initialWorkspace) {
      setCurrentWorkspaceId(initialWorkspace.id)
      sessionStorage.setItem("currentWorkspaceId", initialWorkspace.id)
    }
  }, [currentWorkspaceId, initialWorkspace])

  useEffect(() => {
    const fetchDetails = async () => {
      if (membersData) {
        const membersWithDetails: WorkspaceUserWithDetails[] = await Promise.all(
          membersData.map(async (member) => {
            const userDetails = await fetchUserDetails(member.userId)
            const roleDetails = await fetchRoleDetails(member.roleId)
            return {
              ...member,
              ...userDetails.data,
              roleName: roleDetails.data.name
            }
          })
        )
        setDetailedMembers(membersWithDetails)
        console.log("membersWithDetails", membersWithDetails)
        setIsLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [membersData])

  const workspace: WorkspaceDetails =
    initialWorkspace || workspaces.find((ws) => ws.data.id === currentWorkspaceId)

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!workspace) return

    if (Object.keys(editForm).length === 0) {
      toast({
        title: "Error",
        description: "At least one field must be provided for update.",
        variant: "destructive"
      })
      return
    }

    updateWorkspaceMutation.mutate(
      { workspaceId: workspace.id, updateData: editForm },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false)
          toast({
            title: "Success",
            description: "Workspace updated successfully."
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to update workspace. Please try again.",
            variant: "destructive"
          })
          console.error("Failed to update workspace:", error)
        }
      }
    )
  }

  const handleAddProject = () => {
    if (workspace.createdBy !== userId) {
      toast({
        title: "Error",
        description: "Only the owner of the workspace can add a project.",
        variant: "destructive"
      })
      return
    }
    setIsAddProjectDialogOpen(true)
  }

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!workspace) return
    const sixMonthsLater = new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString()
    const newProjectData: Omit<Project, "id"> = {
      ...newProject,
      name: newProject?.name || "",
      description: newProject?.description || "",
      createdDate: "",
      startDate: sixMonthsLater,
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 8)).toISOString(),
      createdByUserId: workspace.createdBy,
      workspaceId: workspace.id,
      status: true
    }

    addProjectMutation.mutate(newProjectData, {
      onSuccess: (addedProject) => {
        setIsAddProjectDialogOpen(false)
        setNewProject({
          name: "",
          description: "",
          createdDate: new Date(new Date().setFullYear(new Date().getFullYear() + 8)).toISOString(),
          startDate: sixMonthsLater,
          endDate: "",
          createdByUserId: userId || "",
          workspaceId: currentWorkspaceId || initialWorkspace?.id || "",
          status: true
        })
        toast({
          title: "Success",
          description: "Project added successfully."
        })
        console.log("Project added successfully console:", addedProject)
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to add project. Please try again.",
          variant: "destructive"
        })
        console.error("Failed to add project:", error)
      }
    })
  }

  if (!workspace) return <div>Workspace not found</div>
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        <span>Loading workspace details...</span>
      </div>
    )

  if (error)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error).message}
          <Button onClick={() => refetch()} className="mt-2">
            Retry
          </Button>
          <Button onClick={() => navigate(-1)} className="mt-2 ml-2">
            Go Back
          </Button>
        </AlertDescription>
      </Alert>
    )

  const projects =
    projectsResponse?.data.filter((project) => project.workspaceId === workspace.id) || []

  const renderMembersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {detailedMembers.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.roleName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className={`container mx-auto p-4 ${isEditDialogOpen ? "overflow-hidden h-screen" : ""}`}>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{workspace.name}</CardTitle>
            <span className="text-sm text-gray-500">Type: {workspace.type.toLowerCase()}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pen className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{workspace.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Created:</strong> {new Date(workspace.createdDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date(workspace.createdDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Owner:</strong> {workspace.createdBy}
            </div>
            <div>
              <strong>Status:</strong> {workspace.type ? "Active" : "Inactive"}
            </div>
          </div>
        </CardContent>
      </Card>

      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">
            <div className="flex items-center">
              Projects
              <Button
                onClick={handleAddProject}
                className="ml-2 p-1 rounded-full bg-blue-100 dark:bg-orange-700 hover:bg-gray-200 "
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
                    <p>Status: {project.status ? "Active" : "Inactive"}</p>
                  </div>
                  <Button
                    className="mt-2 w-full"
                    variant="outline"
                    onClick={() => navigate(`/projects/${project.id}/board`)}
                  >
                    View Project Board
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <>
        <Button onClick={() => setIsAddProjectDialogOpen(true)}>Add Project</Button>
        <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
          <DialogOverlay className="bg-blue-100/80 backdrop-blur-sm" />
          <DialogContent className="bg-white dark:bg-gray-800">
            <DialogDescription>
              Please fill in the details below to add a new project.
            </DialogDescription>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProjectSubmit} className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <Label htmlFor="projectStartDate">Start Date</Label>
                <Input
                  id="projectStartDate"
                  name="startDate"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                {" "}
                <Label htmlFor="projectstatus"> Status</Label>
                <Input
                  id="projectstatus"
                  value={newProject.status ? "Active" : "Inactive"}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value === "Active" })
                  }
                  placeholder="Active/Inactive"
                />
              </div>
              <Button type="submit" disabled={addProjectMutation.isPending}>
                {addProjectMutation.isPending ? "Adding..." : "Add Project"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>

      <div ref={membersRef} className="mb-6">
        <h1>
          <Button onClick={() => navigate(`/workspaces/${workspace.id}/members`)} className="mt-4">
            Workspace Member Management
          </Button>
        </h1>
        <h2 className="text-2xl font-bold mb-4">Members</h2>
        {isLoadingMembers || isLoadingDetails ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <span>Loading members...</span>
          </div>
        ) : membersError ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(membersError as Error).message}
              <Button onClick={() => refetchMembers()} className="mt-2">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          renderMembersTable()
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogOverlay className="bg-blue-100/80 backdrop-blur-sm" />
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder={workspace.name}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description || ""}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder={workspace.description}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value) =>
                  setEditForm({ ...editForm, type: value as WorkspaceUpdateScema["type"] })
                }
                defaultValue={workspace.type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workspace type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="SHARED">Shared</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={updateWorkspaceMutation.isPending}>
              {updateWorkspaceMutation.isPending ? "Updating..." : "Update Workspace"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
