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
  const { isAuthenticated, workspaceIds } = useAuth()

  const handleWorkspaceSelect = (workspaceId: string) => {
    navigate(`/workspace/${workspaceId}`)
  }

  const handleDefaultWorkspace = () => {
    navigate("/default-workspace")
  }

  const hasWorkspaces = isAuthenticated && Array.isArray(workspaceIds) && workspaceIds.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-primary">
          Workspaces
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-blue-300" style={{ zIndex: 1000 }}>
        <DropdownMenuLabel>Your Workspaces</DropdownMenuLabel>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
          onSelect={handleDefaultWorkspace}
        >
          Default Workspace
        </DropdownMenuItem>

        {hasWorkspaces && (
          <>
            <DropdownMenuSeparator />
            {workspaceIds.map((workspaceId) => (
              <DropdownMenuItem
                key={workspaceId}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onSelect={() => handleWorkspaceSelect(workspaceId)}
              >
                Workspace {workspaceId.slice(0, 8)}...
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuItem
          className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
          onSelect={() => navigate("/create-workspace")}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Create New Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
