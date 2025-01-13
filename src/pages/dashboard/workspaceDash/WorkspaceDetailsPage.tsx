import React from "react"
import { useLocation, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { WorkspaceDetails } from "@/api/Workspace"

interface Project {
  id: string
  name: string
  description: string
}
export function WorkspaceDetailsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { workspaces } = useAuth()
  const location = useLocation()
  const { workspace: initialWorkspace, projects: initialProjects } = location.state || {}

  const workspace: WorkspaceDetails =
    initialWorkspace || workspaces.find((ws) => ws.data.id === workspaceId)?.data
  const projects: Project[] = initialProjects || []

  if (!workspace) return <div>Workspace not found</div>

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{workspace.name}</CardTitle>
          <span className="text-sm text-gray-500">type: {workspace.type.toLowerCase()}</span>
          <button className="text-sm text-white-600">Edit</button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>{workspace.description}</p>
            <h3>Boards</h3>
            <div>
              <h3>Projects</h3>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id}>
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                  </div>
                ))
              ) : (
                <p>No projects found</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
