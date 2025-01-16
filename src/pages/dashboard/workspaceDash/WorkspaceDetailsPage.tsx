import React, { useEffect, useState } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { fetchWorkspaceMembersByWorkspace, WorkspaceDetails } from "@/api/WorkspaceUsers"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Pen } from "lucide-react"
import { useProjects } from "@/hooks/projectHook"
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
import { useUpdateWorkspace, WorkspaceUpdateScema } from "@/hooks/useWorkspaces"
import {
  fetchUserDetails,
  Users,
  useWorkspaceMembersByWorkspace,
  WorkspaceUsersByWorkspaceId
} from "@/api/WorkspaceUsers"
import "./workspaceDetailsPage.css"

export function WorkspaceDetailsPage() {
  const { workspaceId: urlWorkspaceId } = useParams<{ workspaceId: string }>()
  const { workspaces } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { workspace: initialWorkspace } = location.state || {}
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | undefined>(
    urlWorkspaceId || undefined
  )
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<WorkspaceUpdateScema>({})

  const { data: projectsResponse, isLoading, error, refetch } = useProjects()
  const updateWorkspaceMutation = useUpdateWorkspace()
  const [members, setMembers] = useState<WorkspaceUsersByWorkspaceId[]>([])
  const [detailedMembers, setDetailedMembers] = useState<(WorkspaceUsersByWorkspaceId & Users)[]>(
    []
  )
  const [isLoadingMembersState, setIsLoadingMembersState] = useState(true)
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)

  useEffect(() => {
    if (currentWorkspaceId) {
      sessionStorage.setItem("currentWorkspaceId", currentWorkspaceId)
    } else if (initialWorkspace) {
      setCurrentWorkspaceId(initialWorkspace.id)
      sessionStorage.setItem("currentWorkspaceId", initialWorkspace.id)
    }
  }, [currentWorkspaceId, initialWorkspace])

  let workspaceIdDd = sessionStorage.getItem("currentWorkspaceIdDd")
  if (sessionStorage.getItem("membersVisible") === "false") {
    workspaceIdDd = sessionStorage.getItem("currentWorkspaceId")
  } else {
    workspaceIdDd = sessionStorage.getItem("currentWorkspaceIdDd")
  }

  const {
    data: membersData,
    isLoading: isLoadingMembersData,
    error: membersError,
    refetch: refetchMembers
  } = useWorkspaceMembersByWorkspace(workspaceIdDd!)

  useEffect(() => {
    const fetchDetails = async () => {
      if (membersData) {
        const membersWithDetails = await Promise.all(
          membersData.map(async (member) => {
            const userDetails = await fetchUserDetails(member.userId)
            return {
              ...member,
              ...userDetails.data
            }
          })
        )
        setDetailedMembers(membersWithDetails)
        setIsLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [membersData])

  useEffect(() => {
    const fetchMembers = async () => {
      if (currentWorkspaceId) {
        try {
          const response = await fetchWorkspaceMembersByWorkspace(currentWorkspaceId)
          setMembers(response.data)
        } catch (error) {
          console.error("Error fetching workspace members:", error)
        } finally {
          setIsLoadingMembersState(false)
        }
      }
    }

    fetchMembers()
  }, [currentWorkspaceId])

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
        }
      }
    )
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

      {isLoadingMembersState || isLoadingDetails ? (
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailedMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle>{`${member.firstName} ${member.lastName}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{member.email}</p>
                  <div className="text-xs text-gray-500">
                    <p>Role ID: {member.roleId}</p>
                    <p>Workspace ID: {member.workspaceId}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

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

      {projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
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
    </div>
  )
}
