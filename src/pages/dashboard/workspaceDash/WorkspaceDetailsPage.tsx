import React from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchWorkspaceDetails, WorkspaceDetails } from "@/api/NewWorkspace"
import { useAuth } from "@/context/AuthContext"

export function WorkspaceDetailsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { isAuthenticated } = useAuth()

  const {
    data: workspace,
    isLoading,
    error
  } = useQuery<WorkspaceDetails, Error>({
    queryKey: ["workspace", workspaceId],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => fetchWorkspaceDetails(workspaceId!),
    enabled: isAuthenticated && !!workspaceId
  })

  if (isLoading) return <div>Loading workspace details...</div>
  if (error) return <div>Error loading workspace: {error.message}</div>
  if (!workspace) return <div>Workspace not found</div>

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{workspace.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{workspace.description}</p>
          {/* Add more workspace details and management features here */}
        </CardContent>
      </Card>
    </div>
  )
}
