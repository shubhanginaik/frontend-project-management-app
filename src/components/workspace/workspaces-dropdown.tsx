import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Plus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function WorkspacesDropdown() {
  const navigate = useNavigate()
  const { isAuthenticated, workspaces } = useAuth()

  const handleWorkspaceSelect = (workspaceId: string) => {
    // setCurrentWorkspaceId(workspaceId)
    navigate(`/workspace/${workspaceId}`)
  }

  if (!isAuthenticated) {
    return (
      <Button onClick={() => navigate("/login")} variant="outline">
        Login to view workspaces
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Workspaces</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Your Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onSelect={() => handleWorkspaceSelect(workspace.id)}
            >
              {workspace.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No workspaces found</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/create-workspace")}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Create New Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
