import React from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowRight } from "lucide-react"
import { fetchDefaultWorkspaceInfo } from "@/api/Workspace"

interface DefaultWorkspaceInfo {
  name: string
  description: string
  taskCount: number
  memberCount: number
}

export function DefaultWorkspacePage() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery<DefaultWorkspaceInfo, Error>({
    queryKey: ["defaultWorkspace"],
    queryFn: fetchDefaultWorkspaceInfo
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[250px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[150px] mb-2" />
            <Skeleton className="h-10 w-[180px] mt-4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load default workspace information"}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{data?.name || "Default Workspace"}</CardTitle>
          <CardDescription>
            {data?.description || "Welcome to your default workspace"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Tasks: {data?.taskCount || 0}</p>
          <p className="mb-4">Members: {data?.memberCount || 1}</p>
          <Button onClick={() => navigate("/create-workspace")}>
            Create New Workspace
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
