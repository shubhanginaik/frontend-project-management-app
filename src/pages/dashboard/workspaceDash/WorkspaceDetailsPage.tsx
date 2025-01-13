import React, { useEffect, useState } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { WorkspaceDetails } from "@/api/Workspace"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useProjects } from "@/hooks/projectHook"

export function WorkspaceDetailsPage() {
  const { workspaceId: urlWorkspaceId } = useParams<{ workspaceId: string }>()
  const { workspaces } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { workspace: initialWorkspace } = location.state || {}
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | undefined>(
    urlWorkspaceId || undefined
  )

  const { data: projectsResponse, isLoading, error, refetch } = useProjects()

  useEffect(() => {
    if (currentWorkspaceId) {
      sessionStorage.setItem("currentWorkspaceId", currentWorkspaceId)
    } else if (initialWorkspace) {
      setCurrentWorkspaceId(initialWorkspace.id)
      sessionStorage.setItem("currentWorkspaceId", initialWorkspace.id)
    }
  }, [currentWorkspaceId, initialWorkspace])

  const workspace: WorkspaceDetails =
    initialWorkspace || workspaces.find((ws) => ws.data.id === currentWorkspaceId)

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
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{workspace.name}</CardTitle>
          <span className="text-sm text-gray-500">Type: {workspace.type.toLowerCase()}</span>
          <span>Id:{workspace.id}</span>
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
          <Button className="mt-4" onClick={() => navigate(`/workspaces/${workspace.id}/edit`)}>
            Edit Workspace
          </Button>
        </CardContent>
      </Card>

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
