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

  console.log("From dropdown: workspaces", workspaces)

  const handleWorkspaceSelect = (workspaceId: string) => {
    const selectedWorkspace = workspaces.find((workspace) => workspace.data.id === workspaceId)
    if (selectedWorkspace) {
      sessionStorage.setItem("currentWorkspaceId", workspaceId)
      navigate(`/workspaces/${workspaceId}`, { state: { workspace: selectedWorkspace.data } })
    }
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
        <Button variant="default">Workspaces</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Your Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.data.id}
              onSelect={() => handleWorkspaceSelect(workspace.data.id)}
            >
              {workspace.data.name}
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
