import React from "react"
import { useLocation, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { WorkspaceDetails } from "@/api/Workspace"

export function WorkspaceDetailsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { workspaces } = useAuth()
  const location = useLocation()
  const { workspace: initialWorkspace } = location.state || {}

  const workspace: WorkspaceDetails =
    initialWorkspace || workspaces.find((ws) => ws.data.id === workspaceId)?.data

  if (!workspace) return <div>Workspace not found</div>

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{workspace.name}</CardTitle>
          <span className="text-sm text-gray-500">type: {workspace.type.toLowerCase()}</span>
          {/* add a edit icon or button there */}
          {/* add small button */}
          <button className="text-sm text-white-600">Edit</button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <h3>Boards</h3>
            </p>
          </div>
          {/* Add more workspace details and management features here */}
        </CardContent>
      </Card>
    </div>
  )
}
